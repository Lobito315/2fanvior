import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

// Temporary debug endpoint — DELETE after diagnosis
export async function POST(req: Request) {
  const steps: string[] = [];
  try {
    steps.push("1. Parsing body");
    const body = await req.json() as any;
    const { email, password } = body;

    steps.push("2. Looking up user: " + email);
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found", steps }, { status: 404 });
    }

    steps.push("3. User found, id=" + user.id);
    steps.push("4. Hash format: " + (user.passwordHash?.substring(0, 20) || "null") + "...");
    steps.push("5. Hash contains colon: " + (user.passwordHash?.includes(':') || false));
    
    if (!user.passwordHash) {
      return NextResponse.json({ error: "No password hash stored", steps }, { status: 400 });
    }

    steps.push("6. Starting verifyPassword...");
    const isValid = await verifyPassword(password, user.passwordHash);
    steps.push("7. verifyPassword returned: " + isValid);

    return NextResponse.json({ 
      success: true, 
      isValid,
      steps,
      userId: user.id,
      email: user.email
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error?.message || "Unknown error",
      stack: error?.stack?.substring(0, 500),
      steps 
    }, { status: 500 });
  }
}
