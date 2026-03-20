import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const authSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(24).optional(),
  password: z.string().min(8),
  role: z.enum(["CREATOR", "SUBSCRIBER"]).optional()
});

const JWT_SECRET = process.env.JWT_SECRET || "fanvior-dev-secret";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { sub: string; role: string; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { sub: string; role: string; email: string };
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("fanvior_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("fanvior_token")?.value;
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    return prisma.user.findUnique({
      where: { id: payload.sub },
      include: { profile: true }
    });
  } catch {
    return null;
  }
}

export async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get("fanvior_token")?.value;
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    return prisma.user.findUnique({
      where: { id: payload.sub },
      include: { profile: true }
    });
  } catch {
    return null;
  }
}

export async function registerUser(input: unknown) {
  const parsed = authSchema.parse(input);
  const passwordHash = await hashPassword(parsed.password);

  return prisma.user.create({
    data: {
      email: parsed.email,
      username: parsed.username || parsed.email.split("@")[0],
      passwordHash,
      role: parsed.role || "SUBSCRIBER",
      profile: {
        create: {
          displayName: parsed.username || parsed.email.split("@")[0],
          bio: "",
          subscriptionPrice: 9.99
        }
      }
    },
    include: { profile: true }
  });
}
