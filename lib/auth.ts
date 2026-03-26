import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { verifyPassword } from "./password";

// Web Crypto based JWT functions for Cloudflare compatibility
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

const jwtEncode = async ({ token }: { token?: any }) => {
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

const jwtDecode = async ({ token }: { token?: string }) => {
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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email or password missing');
          }

          const email = credentials.email.toLowerCase().trim();

          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user || !user.passwordHash) {
            throw new Error('No user found');
          }

          const isValid = await verifyPassword(credentials.password, user.passwordHash);

          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user as any).role || 'USER',
          };
        } catch (error: any) {
          console.error('Authorize error:', error?.message || error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  jwt: {
    encode: jwtEncode as any,
    decode: jwtDecode as any,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        const adminEmails = ['valormasivo@gmail.com', 'bidvbisroward@gmail.com'];
        token.role = adminEmails.includes(user.email || "") ? 'ADMIN' : (user as any).role;
      }
      if (trigger === "update" && session) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: JWT_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
  //@ts-ignore
  trustHost: true,
};
