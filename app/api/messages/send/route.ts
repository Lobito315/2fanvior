import { NextResponse } from 'next/server';
import { pusherTrigger } from '@/lib/pusher';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const messageSchema = z.object({
  conversationId: z.string().min(1, "conversationId is required"),
  content: z.string().min(1, "message cannot be empty").max(2000, "message too long"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: result.error.format() }, 
        { status: 400 }
      );
    }
    
    const { conversationId, content } = result.data;
    const currentUserId = (session.user as any).id;

    // Verify user is part of the conversation
    // @ts-ignore
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            participants: {
                some: { id: currentUserId }
            }
        }
    });

    if (!conversation) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    // Save message to database
    // @ts-ignore
    const newMessage = await prisma.message.create({
        data: {
            content,
            senderId: currentUserId,
            conversationId: conversationId,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    handle: true
                }
            }
        }
    });

    // Update lastMessageAt for the conversation
    // @ts-ignore
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() }
    });

    // Trigger Pusher event on private channel
    await pusherTrigger(`private-chat-${conversationId}`, 'receive_message', {
      id: newMessage.id,
      content: newMessage.content,
      senderId: newMessage.senderId,
      sender: newMessage.sender as any,
      conversationId: conversationId,
      timestamp: newMessage.createdAt.toISOString(),
    });

    return NextResponse.json(newMessage);
  } catch (err: any) {
    console.error('Message Send Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
