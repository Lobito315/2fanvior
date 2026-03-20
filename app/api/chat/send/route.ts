import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  const message = await prisma.message.create({
    data: {
      conversationId: body.conversationId,
      content: body.content,
      senderId: user.id
    }
  });

  return NextResponse.json({ message });
}
