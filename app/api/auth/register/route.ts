import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = 'edge';


export async function POST(req: Request) {
  try {
    const body = await req.json() as any;
    const { name, handle, email, password, role } = body;

    if (!name || !handle || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Comprobar si existe un usuario con ese email o handle
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { handle }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email or username already taken" }, { status: 409 });
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);

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
