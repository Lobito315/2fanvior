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

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
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
            image: user.avatar,
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
    const response = await NextAuth({
      ...authOptions,
      secret: process.env.NEXTAUTH_SECRET || "fallback_secret_that_is_at_least_32_characters_long_for_jwt_123",
      debug: true,
    })(req, ctx);

    // Si NextAuth devuelve 500 (crash interno), interceptamos la respuesta
    if (response.status === 500) {
      const text = await response.clone().text().catch(() => "No text body");
      return NextResponse.json({
        error: "NextAuth Internal 500",
        originalBody: text,
        secretWasPresent: !!process.env.NEXTAUTH_SECRET,
        reqMethod: req.method,
        reqUrl: req.url,
        nextAuthUrl: process.env.NEXTAUTH_URL || "MISSING"
      }, { status: 500 });
    }

    return response;
  } catch (e: any) {
    return NextResponse.json({
      error: "NextAuth Exception",
      message: e.message,
      stack: e.stack?.substring(0, 500),
      reqMethod: req.method,
      reqUrl: req.url,
      nextAuthUrl: process.env.NEXTAUTH_URL || "MISSING"
    }, { status: 500 });
  }
};

export { handler as GET, handler as POST };
