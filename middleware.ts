import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const sessionToken = 
    request.cookies.get("next-auth.session-token")?.value || 
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  try {
    const decoded = await jwtDecode({ token: sessionToken });
    if (!decoded) {
      throw new Error("Invalid session");
    }
    return NextResponse.next();
  } catch (error) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/content/:path*",
    "/analytics/:path*",
    "/chat/:path*",
    "/feed/:path*",
    "/live/:path*",
    "/moderation/:path*",
    "/notifications/:path*",
    "/subscriptions/:path*",
    "/checkout/:path*",
  ]
};
