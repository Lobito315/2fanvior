import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const user = await getCurrentUser();
  const notifications = await prisma.notification.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <DashboardShell>
      <Card>
        <h1 className="text-3xl font-bold">Activity</h1>
        <div className="mt-6 grid gap-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-2xl border border-white/10 p-5">
              <p className="font-semibold">{notification.title}</p>
              <p className="mt-1 text-sm text-slate-400">{notification.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
