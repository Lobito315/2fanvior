import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherAuthenticate } from "@/lib/pusher";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const socketId = formData.get("socket_id") as string;
    const channel = formData.get("channel_name") as string;

    if (!socketId || !channel) {
      return new NextResponse("Missing socket_id or channel_name", { status: 400 });
    }

    // Check if channel is a private chat channel
    if (channel.startsWith("private-chat-")) {
      const conversationId = channel.replace("private-chat-", "");
      
      // Verify user is a participant in the conversation
      // @ts-ignore
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participants: {
            some: {
              id: (session.user as any).id
            }
          }
        }
      });

      if (!conversation) {
        return new NextResponse("Forbidden", { status: 403 });
      }

      const authResponse = await pusherAuthenticate(socketId, channel);
      return NextResponse.json(authResponse);
    }

    // For presence channels (optional for now, but good to have)
    if (channel.startsWith("presence-")) {
      const authResponse = await pusherAuthenticate(socketId, channel, {
        user_id: (session.user as any).id,
        user_info: {
          name: session.user.name,
          email: session.user.email,
        }
      });
      return NextResponse.json(authResponse);
    }

    return new NextResponse("Invalid channel type", { status: 400 });
  } catch (error: any) {
    console.error("Pusher Auth Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
