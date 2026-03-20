import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  const flags = await prisma.moderationFlag.findMany({
    include: {
      post: {
        include: {
          author: {
            include: { profile: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <DashboardShell>
      <Card>
        <h1 className="text-3xl font-bold">Moderation queue</h1>
        <div className="mt-6 grid gap-4">
          {flags.map((flag) => (
            <div key={flag.id} className="rounded-2xl border border-white/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{flag.post.title}</p>
                  <p className="text-sm text-slate-400">{flag.reason}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{flag.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
