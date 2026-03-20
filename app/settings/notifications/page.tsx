import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotificationSettingsPage() {
  return (
    <DashboardShell>
      <Card className="max-w-2xl">
        <h1 className="text-3xl font-bold">Notification preferences</h1>
        <form action="/api/notifications" method="post" className="mt-6 space-y-4">
          {["Direct messages", "Subscriptions", "Payments", "Security alerts"].map((label) => (
            <label key={label} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-4">
              <span>{label}</span>
              <input type="checkbox" name={label.toLowerCase().replace(/\s+/g, "_")} defaultChecked className="h-5 w-5" />
            </label>
          ))}
          <Button type="submit">Save preferences</Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
