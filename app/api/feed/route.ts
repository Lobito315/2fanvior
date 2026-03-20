import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const feed = await prisma.post.findMany({
    where: { isPublished: true },
    include: { author: { include: { profile: true } } },
    orderBy: { createdAt: "desc" },
    take: 24
  });

  return NextResponse.json({ feed });
}
