import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const handler = async (req: Request, ctx: any) => {
  const origin = "https://2fanvior.pages.dev";
  
  // CRITICAL: NextAuth v4 on Edge fails if req.url is relative.
  // We must proxy the request and force an absolute URL.
  const absoluteUrl = req.url.startsWith('http') 
    ? req.url 
    : `${origin}${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  
  console.log("NextAuth Edge Proxying:", { original: req.url, absolute: absoluteUrl });

  // Clone the request with the absolute URL
  const modifiedReq = new Request(absoluteUrl, {
    method: req.method,
    headers: req.headers,
    body: req.body,
    duplex: 'half'
  } as any);

  try {
    // We use the authOptions from lib/auth.ts
    const response = await NextAuth(authOptions)(modifiedReq, ctx);
    return response;
  } catch (err: any) {
    console.error("NextAuth Handler Error:", err);
    return NextResponse.json({ 
      error: "Edge Proxy Crash", 
      message: err.message,
      absoluteUrl 
    }, { status: 500 });
  }
};

export { handler as GET, handler as POST };
