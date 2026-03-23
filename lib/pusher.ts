import Pusher from 'pusher';

// Use server-only env vars (without NEXT_PUBLIC_ prefix) so the Pusher
// appId and secret are never exposed to the client bundle.
// Add PUSHER_APP_ID and PUSHER_KEY to your .env / Cloudflare dashboard.
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

