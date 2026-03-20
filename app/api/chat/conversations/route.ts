import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let conversation = await prisma.conversation.findFirst({
    where: {
      participants: {
        some: { userId: user.id }
      }
    },
    include: {
      messages: {
        include: {
          sender: {
            include: { profile: true }
          }
        },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId: user.id }]
        }
      },
      include: {
        messages: {
          include: { sender: { include: { profile: true } } }
        }
      }
    });
  }

  return NextResponse.json({ conversation });
}
