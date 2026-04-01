import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const room = searchParams.get("room");
    const username = session.user.name || "Anonymous";
    const userId = (session.user as any).id;

    if (!room) {
      return new NextResponse("Missing room parameter", { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return new NextResponse("Server misconfigured", { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      name: username,
    });

    // Check if the user is the owner of the room (for streaming)
    // Format: 'room-{creatorId}'
    if (room === `room-${userId}`) {
        at.addGrant({
            roomJoin: true,
            room: room,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        });
    } else {
        // Standard viewer/participant
        at.addGrant({
            roomJoin: true,
            room: room,
            canPublish: false, // Default to subscribed only
            canSubscribe: true,
        });
    }

    const token = await at.toJwt();
    return NextResponse.json({ token });
  } catch (error) {
    console.error("LiveKit Token Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
