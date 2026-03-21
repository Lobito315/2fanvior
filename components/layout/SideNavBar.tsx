import React from 'react';
import Link from 'next/link';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function SideNavBar() {
  return (
    <aside className="fixed left-4 top-4 bottom-4 w-60 rounded-3xl bg-surface-container-low shadow-inner shadow-primary/5 flex flex-col py-8 gap-6 z-50 overflow-y-auto">
      <div className="px-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-on-primary-fixed-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <h1 className="font-headline font-black italic text-primary tracking-tight leading-none">Fanvior</h1>
            <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-outline mt-1">Editorial Admin</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2">
        <NavItem icon="dashboard" label="Overview" href="/dashboard" />
        <NavItem icon="group" label="User Management" href="/users" active />
        <NavItem icon="fact_check" label="Content Moderation" href="/content" />
        <NavItem icon="analytics" label="Reports" href="/analytics" />
        <NavItem icon="settings" label="Settings" href="/settings" />
      </nav>

      <div className="px-4 mt-auto">
        <div className="bg-surface-container-high p-4 rounded-2xl mb-6">
          <p className="text-[10px] font-bold text-tertiary mb-2 tracking-widest">PREMIUM ACCESS</p>
          <button className="w-full py-2 bg-gradient-to-r from-tertiary-container to-on-tertiary-fixed-variant rounded-xl text-xs font-bold text-on-tertiary-container hover:opacity-90 transition-opacity">
            Upgrade to Enterprise
          </button>
        </div>
        
        <div className="space-y-1">
          <NavItem icon="support_agent" label="Support" href="/support" isSmall />
          <NavItem icon="logout" label="Logout" href="/api/auth/signout" isSmall />
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, href, active, isSmall }: { icon: string, label: string, href: string, active?: boolean, isSmall?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 transition-all group",
        isSmall ? "py-2 text-outline pl-5 hover:text-on-surface" : "py-3",
        active ? "border-l-4 border-primary text-primary pl-4 bg-primary/5" : (!isSmall && "text-outline pl-5 hover:text-on-surface hover:bg-surface-container-high/40")
      )}
    >
      <span className={cn("material-symbols-outlined", isSmall ? "text-lg" : "")} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
      <span className={cn(isSmall ? "text-xs uppercase tracking-widest" : "font-headline text-sm font-medium uppercase tracking-widest")}>{label}</span>
    </Link>
  );
}
