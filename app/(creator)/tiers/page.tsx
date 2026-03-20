import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TiersPage() {
  const user = await getCurrentUser();
  const tiers = await prisma.subscriptionTier.findMany({
    where: { creatorId: user?.id },
    orderBy: { price: "asc" }
  });

  return (
    <DashboardShell>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h1 className="text-3xl font-bold">Subscription tiers</h1>
          <div className="mt-6 grid gap-4">
            {tiers.map((tier) => (
              <div key={tier.id} className="rounded-2xl border border-white/10 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-semibold">{tier.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{tier.description}</p>
                  </div>
                  <p className="text-lg font-bold">{currency(tier.price.toString())}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-bold">Create new tier</h2>
          <form action="/api/creator/tiers" method="post" className="mt-6 grid gap-4">
            <Input name="name" placeholder="Tier name" required />
            <Textarea name="description" placeholder="What is included?" />
            <Input name="price" type="number" step="0.01" min="1" placeholder="Price" required />
            <Input name="perks" placeholder="Comma separated perks" required />
            <Button type="submit">Save tier</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}
