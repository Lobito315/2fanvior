import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: Request) {
  try {
    const { chatId, message, senderId } = await req.json();

    if (!chatId || !message || !senderId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

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
