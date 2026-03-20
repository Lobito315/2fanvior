import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CreatorDashboardPage() {
  const user = await getCurrentUser();
  const [postCount, subscriberCount, earnings] = await Promise.all([
    prisma.post.count({ where: { authorId: user?.id } }),
    prisma.subscription.count({ where: { creatorId: user?.id, status: "COMPLETED" } }),
    prisma.purchase.aggregate({
      where: { post: { authorId: user?.id }, status: "COMPLETED" },
      _sum: { amount: true }
    })
  ]);

  return (
    <DashboardShell>
      <div>
        <h1 className="text-4xl font-black">Creator dashboard</h1>
        <p className="mt-2 text-slate-400">Track earnings, upload exclusive content, and manage subscriptions.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-400">Posts published</p>
          <p className="mt-3 text-3xl font-bold">{postCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Active subscribers</p>
          <p className="mt-3 text-3xl font-bold">{subscriberCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Revenue</p>
          <p className="mt-3 text-3xl font-bold">{currency(earnings._sum.amount?.toString() || 0)}</p>
        </Card>
      </div>
    </DashboardShell>
  );
}
