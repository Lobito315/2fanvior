import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return new NextResponse("Conversation ID required", { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        // @ts-ignore
        conversationId: conversationId,
        conversation: {
          participants: {
            some: { id: (session.user as any).id }
          }
        }
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            handle: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Messages GET Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
