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
  const reqUrl = req.url || "";
  let nextAuthUrl = process.env.NEXTAUTH_URL;

  try {
    // 1. Detect and fix missing NEXTAUTH_URL
    if (!nextAuthUrl || nextAuthUrl === "undefined" || nextAuthUrl === "") {
      try {
        const urlObj = new URL(reqUrl);
        nextAuthUrl = urlObj.origin;
      } catch (e) {
        nextAuthUrl = "https://2fanvior.pages.dev"; // Hardcoded fallback for this specific deployment
      }
    }

    // 2. Protocol enforcement
    if (nextAuthUrl && !nextAuthUrl.startsWith("http")) {
      nextAuthUrl = `https://${nextAuthUrl}`;
    }

    // 3. Inject back to env (NextAuth reads from here)
    process.env.NEXTAUTH_URL = nextAuthUrl;

    const options: NextAuthOptions = {
      ...authOptions,
      secret: process.env.NEXTAUTH_SECRET || "fallback_secret_that_is_at_least_32_characters_long_for_jwt_123",
    };

    const response = await NextAuth(options)(req, ctx);

    // Si NextAuth devuelve 500 (crash interno), interceptamos la respuesta
    if (response.status === 500) {
      const cloned = response.clone();
      const text = await cloned.text().catch(() => "No text body");
      return NextResponse.json({
        error: "NextAuth Internal 500",
        diagnostics: {
          reqUrl: reqUrl,
          derivedNextAuthUrl: nextAuthUrl,
          envNextAuthUrl: process.env.NEXTAUTH_URL,
          hasSecret: !!process.env.NEXTAUTH_SECRET,
          rawBody: text.substring(0, 500)
        }
      }, { status: 500 });
    }

    return response;
  } catch (e: any) {
    return NextResponse.json({
      error: "NextAuth Exception",
      message: e.message,
      diagnostics: {
        reqUrl: reqUrl,
        derivedNextAuthUrl: nextAuthUrl,
        stack: e.stack?.substring(0, 300)
      }
    }, { status: 500 });
  }
};

export { handler as GET, handler as POST };
