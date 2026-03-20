import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, signToken, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken({ sub: user.id, role: user.role, email: user.email });
  await setSessionCookie(token);

  return NextResponse.redirect(new URL(user.role === "ADMIN" ? "/admin/users" : "/creator/dashboard", request.url));
}
