import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

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
