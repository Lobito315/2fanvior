import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const handler = async (req: Request, ctx: any) => {
  try {
    return await NextAuth(authOptions)(req, ctx);
  } catch (err: any) {
    console.error("NextAuth 500 Error:", err);
    return NextResponse.json({ 
      error: "Callback 500 Crash", 
      message: err.message,
      stack: err.stack 
    }, { status: 500 });
  }
};

export { handler as GET, handler as POST };
