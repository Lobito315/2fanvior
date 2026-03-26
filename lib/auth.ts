import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { verifyPassword } from "./password";

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
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_32_chars_at_least_12345",
  useSecureCookies: process.env.NODE_ENV === "production",
  // @ts-ignore - trustHost is supported in v4.24.13 but might missing in some type definitions
  trustHost: true,
};
