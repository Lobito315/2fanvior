/**
 * Lightweight Pusher Trigger for Edge Runtime
 * Replaces the heavy 'pusher' package to save bundle size and ensure compatibility.
 */

async function hmacSha256(key: string, data: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const msgData = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function md5(data: string) {
  const encoder = new TextEncoder();
  const msgData = encoder.encode(data);
  const hash = await crypto.subtle.digest("MD5", msgData);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function pusherTrigger(channel: string, event: string, data: any) {
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;

  if (!appId || !key || !secret || !cluster) {
    console.error("Pusher credentials missing");
    return;
  }

  const path = `/apps/${appId}/events`;
  const body = JSON.stringify({
    name: event,
    channels: [channel],
    data: JSON.stringify(data),
  });

  const bodyMd5 = await md5(body);
  const timestamp = Math.floor(Date.now() / 1000);
  const params = `auth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0&body_md5=${bodyMd5}`;
  
  const authString = `POST\n${path}\n${params}`;
  const signature = await hmacSha256(secret, authString);

  const url = `https://api-${cluster}.pusher.com${path}?${params}&auth_signature=${signature}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Pusher trigger failed: ${response.status} ${errorDetails}`);
  }

  return await response.json();
}
