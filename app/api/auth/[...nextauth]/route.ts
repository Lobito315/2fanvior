import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const handler = async (req: Request, ctx: any) => {
  const origin = "https://2fanvior.pages.dev";
  const absoluteUrl = new URL(req.url, origin).toString();

  // JavaScript Proxy to override URL property dynamically
  // This is safer than cloning as it preserves native methods and the request body
  const proxiedReq = new Proxy(req, {
    get(target: any, prop) {
      if (prop === 'url') return absoluteUrl;
      // Handle NextRequest style access
      if (prop === 'nextUrl') return new URL(absoluteUrl);
      const value = Reflect.get(target, prop);
      if (typeof value === 'function') return value.bind(target);
      return value;
    }
  }) as any;

  try {
    return await NextAuth(authOptions)(proxiedReq, ctx);
  } catch (err: any) {
    console.error("NextAuth Proxy Crash:", err);
    return NextResponse.json({ 
      error: "Edge Proxy Crash", 
      message: err.message,
      absoluteUrl 
    }, { status: 500 });
  }
};

export { handler as GET, handler as POST };
