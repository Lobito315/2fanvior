import { NextResponse } from "next/server";
import { registerUser, setSessionCookie, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = {
    username: String(formData.get("username") || ""),
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
    role: String(formData.get("role") || "SUBSCRIBER")
  };

  const user = await registerUser(payload);
  const token = signToken({ sub: user.id, role: user.role, email: user.email });
  await setSessionCookie(token);

  return NextResponse.redirect(new URL("/creator/dashboard", request.url));
}
