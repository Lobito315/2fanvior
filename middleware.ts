import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/creator", "/admin", "/activity", "/live", "/checkout", "/settings"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("fanvior_token")?.value;
  const path = request.nextUrl.pathname;
  const needsAuth = protectedPrefixes.some((prefix) => path.startsWith(prefix));

  if (needsAuth && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/creator/:path*", "/admin/:path*", "/activity/:path*", "/live/:path*", "/checkout/:path*", "/settings/:path*"]
};
