import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;

    // @ts-ignore
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            avatar: true,
            handle: true,
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Conversations GET Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { recipientId } = await req.json() as any;
    const currentUserId = (session.user as any).id;

    if (!recipientId) {
      return new NextResponse("Recipient ID required", { status: 400 });
    }

    if (recipientId === currentUserId) {
        return new NextResponse("Cannot chat with yourself", { status: 400 });
    }

    // Check if a 1-to-1 conversation already exists
    // @ts-ignore
    const existing = await prisma.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { id: currentUserId } } },
                { participants: { some: { id: recipientId } } }
            ]
        },
        include: {
            participants: true
        }
    });

    // Filtering logic to ensure it's exactly these two (not part of a larger group)
    const exactMatch = existing?.participants.length === 2 ? existing : null;

    if (exactMatch) {
      return NextResponse.json(exactMatch);
    }

    // Create new conversation
    // @ts-ignore
    const newConversation = await prisma.conversation.create({
        data: {
            participants: {
                connect: [
                    { id: currentUserId },
                    { id: recipientId }
                ]
            }
        },
        include: {
            participants: true
        }
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    console.error("Conversations POST Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
