import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user });
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const profile = await prisma.profile.update({
    where: { userId: user.id },
    data: {
      displayName: body.displayName,
      bio: body.bio,
      avatarUrl: body.avatarUrl,
      subscriptionPrice: body.subscriptionPrice
    }
  });

  return NextResponse.json({ profile });
}
