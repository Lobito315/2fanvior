import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function LiveMainPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { handle: true }
    });

    if (user?.handle) {
      redirect(`/live/${user.handle}`);
    }
  }

  // If not logged in or no handle, show a general discovery page or login redirect
  redirect("/login");
}
