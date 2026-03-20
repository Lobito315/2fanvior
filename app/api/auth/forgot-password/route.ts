import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SECURITY",
        title: "Password reset requested",
        body: "A password recovery request was initiated for your account."
      }
    });
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
