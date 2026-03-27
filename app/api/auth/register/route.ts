import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  handle: z.string().min(3, "Handle must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["CREATOR", "SUBSCRIBER"]).optional().default("SUBSCRIBER")
});

export async function POST(req: Request) {

  try {
    const body = await req.json();
    
    // Validate with Zod
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, handle, password, role } = result.data;
    const email = result.data.email.toLowerCase().trim();

    // Comprobar si existe un usuario con ese email o handle
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { handle }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email or username already taken" }, { status: 409 });
    }

    // Hashear contraseña con Web Crypto API (compatible con Cloudflare)
    const passwordHash = await hashPassword(password);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        handle,
        email,
        passwordHash,
        role: role || "SUBSCRIBER",
      },
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to register" }, { status: 500 });
  }
}
