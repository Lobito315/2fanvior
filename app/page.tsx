import Link from "next/link";
import { Hero } from "@/components/marketing/hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  "Creator subscriptions with recurring billing",
  "Locked posts, one-time unlocks, and direct tips",
  "Real-time chat over WebSockets",
  "Admin moderation and creator analytics"
];

export default function HomePage() {
  return (
    <main className="shell py-16">
      <section className="grid items-center gap-12 lg:grid-cols-2">
        <Hero />
        <Card className="grid gap-4">
          {features.map((feature) => (
            <div key={feature} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-slate-200">{feature}</p>
            </div>
          ))}
        </Card>
      </section>
    </main>
  );
}
