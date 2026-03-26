import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

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

          // Use Web Crypto API for password verification (Cloudflare compatible)
          const isValid = await verifyPassword(credentials.password, user.passwordHash);

          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar && user.avatar.length < 2000 ? user.avatar : null,
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
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        // Determinamos el rol una sola vez al loguear
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
};

import { NextResponse } from "next/server";

const handler = async (req: Request, ctx: any) => {
  try {
    // Edge-Safe URL Reconstruction with Trimming for accidental spaces in Cloudflare UI
    const envUrl = process.env.NEXTAUTH_URL?.trim();
    const rawUrl = req.url || "/api/auth/callback/credentials";
    let sanitizedUrl = rawUrl;
    
    // Always ensure absolute URL for the URL constructor
    if (!sanitizedUrl.startsWith('http')) {
      const host = req.headers.get('host') || '2fanvior.pages.dev';
      const protocol = req.headers.get('x-forwarded-proto') || 'https';
      sanitizedUrl = `${protocol}://${host}${sanitizedUrl}`;
    }

    // Double check sanity before constructor
    if (!sanitizedUrl || sanitizedUrl === "" || sanitizedUrl === "undefined") {
       sanitizedUrl = envUrl || "https://2fanvior.pages.dev";
    }

    const origin = new URL(sanitizedUrl).origin;
    
    // Reset global env to cleaned version
    process.env.NEXTAUTH_URL = origin.trim();

    try {
      return await NextAuth({
        ...authOptions,
        secret: (process.env.NEXTAUTH_SECRET || "fallback_secret_32_chars_long_1234567890").trim(),
      })(req, ctx);
    } catch (innerErr: any) {
      return NextResponse.json({ 
        error: "NextAuth Internal Crash", 
        message: innerErr.message,
        origin: origin 
      }, { status: 500 });
    }
  } catch (outerErr: any) {
    return NextResponse.json({ 
      error: "Edge Runtime Crash", 
      message: outerErr.message 
    }, { status: 500 });
  }
};

export { handler as GET, handler as POST };
