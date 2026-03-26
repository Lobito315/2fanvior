import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const handler = async (req: Request, ctx: any) => {
  // Hardcore reset for Cloudflare Edge
  const origin = "https://2fanvior.pages.dev";
  process.env.NEXTAUTH_URL = origin;

  try {
    return await NextAuth({
      ...authOptions,
      secret: (process.env.NEXTAUTH_SECRET || "fallback_secret_32_chars_long_1234567890").trim(),
    })(req, ctx);
  } catch (err: any) {
    console.error("NextAuth Handler Error:", err);
    return NextResponse.json({ 
      error: "Hardcore Handler Crash", 
      message: err.message,
      origin 
    }, { status: 500 });
  }
};

export { handler as GET, handler as POST };
