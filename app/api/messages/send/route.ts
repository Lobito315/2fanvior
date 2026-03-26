import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';
import { z } from "zod";

const messageSchema = z.object({
  chatId: z.string().min(1, "chatId is required"),
  message: z.string().min(1, "message cannot be empty").max(2000, "message too long"),
  senderId: z.string().min(1, "senderId is required")
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: result.error.format() }, 
        { status: 400 }
      );
    }
    
    const { chatId, message, senderId } = result.data;

    // Trigger Pusher event
    await pusherServer.trigger(chatId, 'receive_message', {
      message,
      senderId,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Pusher error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
