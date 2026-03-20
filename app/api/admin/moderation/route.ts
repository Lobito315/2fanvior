import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const queue = await prisma.moderationFlag.findMany({
    include: { post: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ queue });
}

export async function POST(request: Request) {
  const body = await request.json();
  const updated = await prisma.moderationFlag.update({
    where: { id: body.id },
    data: { status: body.status }
  });
  return NextResponse.json({ updated });
}
