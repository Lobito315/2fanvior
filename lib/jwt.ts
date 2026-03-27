/**
 * Native JWT implementation using Web Crypto API.
 * This file is ultra-lightweight and has NO dependencies,
 * making it safety-optimal for Middleware and Edge Runtime.
 */

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback_secret_32_chars_at_least_12345";

async function getCryptoKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export const jwtEncode = async ({ token }: { token?: any }) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=/g, "");
  const payload = btoa(JSON.stringify({ ...token, iat: Math.floor(Date.now() / 1000) })).replace(/=/g, "");
  const data = `${header}.${payload}`;
  
  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
    
  return `${data}.${signatureBase64}`;
};

export const jwtDecode = async ({ token }: { token?: string }) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  
  const [header, payload, signature] = parts;
  const data = `${header}.${payload}`;
  
  try {
    const key = await getCryptoKey();
    const sigArray = new Uint8Array(
      atob(signature.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => c.charCodeAt(0))
    );
    
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigArray,
      new TextEncoder().encode(data)
    );
    
    if (!isValid) return null;
    return JSON.parse(atob(payload));
  } catch (err) {
    console.error("JWT Decode Error:", err);
    return null;
  }
};
