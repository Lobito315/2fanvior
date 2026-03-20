import Link from "next/link";
import { PropsWithChildren } from "react";

const navItems = [
  { href: "/creator/dashboard", label: "Dashboard" },
  { href: "/creator/upload", label: "Upload" },
  { href: "/creator/tiers", label: "Tiers" },
  { href: "/activity", label: "Activity" },
  { href: "/live", label: "Live chat" },
  { href: "/settings/notifications", label: "Settings" },
  { href: "/admin/users", label: "Admin users" },
  { href: "/admin/moderation", label: "Moderation" }
];

export function DashboardShell({ children }: PropsWithChildren) {
  return (
    <div className="shell py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="panel sticky top-6 h-fit p-6">
          <Link href="/" className="text-2xl font-black tracking-tight text-white">
            Fanvior
          </Link>
          <p className="mt-2 text-sm text-slate-400">Premium creator platform with subscriptions, direct messaging, and paid unlocks.</p>
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
