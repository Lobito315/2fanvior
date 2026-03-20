import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  return (
    <DashboardShell>
      <Card className="max-w-2xl">
        <h1 className="text-3xl font-bold">Complete checkout</h1>
        <form action="/api/checkout/paypal" method="post" className="mt-6 grid gap-4">
          <Input name="amount" type="number" step="0.01" min="1" placeholder="Amount" required />
          <Input name="description" placeholder="Payment description" required />
          <select name="type" defaultValue="tip" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white">
            <option value="tip">Tip</option>
            <option value="unlock">Unlock post</option>
            <option value="subscription">Subscribe to creator</option>
          </select>
          <Button type="submit">Continue with PayPal</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
