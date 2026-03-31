"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';


export function SideNavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const isCreator = (session?.user as any)?.role === 'CREATOR';

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-bg-secondary border-r border-border-subtle/30 flex flex-col py-10 gap-8 z-50 overflow-y-auto">
      <div className="px-8 mb-4">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div className="w-11 h-11 rounded-xl brand-gradient flex items-center justify-center text-white shadow-glow-primary group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <h1 className="font-headline font-black italic text-xl text-text-primary tracking-tighter leading-none group-hover:text-brand-secondary transition-colors">Fanvior</h1>
            <p className="font-headline text-[9px] font-bold uppercase tracking-[0.25em] text-text-muted mt-1.5 opacity-70">
              {isAdmin ? "Editorial Admin" : isCreator ? "Creator Studio" : "User Portal"}
            </p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1.5 px-3">
        <NavItem icon="dashboard" label="Overview" href="/dashboard" active={pathname === '/dashboard'} />
        <NavItem icon="dynamic_feed" label="Feed" href="/feed" active={pathname === '/feed'} />
        <NavItem icon="chat" label="Messages" href="/chat" active={pathname === '/chat'} />
        
        {/* Creator / Admin Section */}
        {(isCreator || isAdmin) && (
          <div className="pt-6">
            <div className="px-5 py-3 ml-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-40">Content Hub</p>
            </div>
            <NavItem icon="add_box" label="Create Post" href="/content/create" active={pathname === '/content/create'} />
            <NavItem icon="folder_shared" label="My Library" href="/content" active={pathname === '/content'} />
          </div>
        )}
        
        {/* Admin Section */}
        {isAdmin && (
          <div className="pt-6">
            <div className="px-5 py-3 ml-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-40">Administration</p>
            </div>
            <NavItem icon="group" label="Users" href="/users" active={pathname === '/users'} />
            <NavItem icon="verified_user" label="Identity" href="/moderation" active={pathname === '/moderation'} />
            <NavItem icon="analytics" label="Reports" href="/analytics" active={pathname === '/analytics'} />
          </div>
        )}
        
        <div className="pt-6">
          <div className="px-5 py-3 ml-1">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-40">Account</p>
          </div>
          <NavItem icon="settings" label="Settings" href="/settings" active={pathname === '/settings'} />
        </div>
      </nav>

      <div className="px-6 mt-auto">
        {!isAdmin && !isCreator && (
          <div className="bg-surface border border-brand-primary/20 p-5 rounded-2xl mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 brand-gradient opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
            <p className="text-[10px] font-black text-brand-secondary mb-2 tracking-[0.2em]">PREMIUM ACCESS</p>
            <p className="text-[11px] text-text-secondary leading-relaxed mb-4 font-medium">Unlock curator artifacts and global analytics.</p>
            <button className="w-full py-2.5 brand-gradient rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-premium hover:scale-[1.03] active:scale-95 transition-all">
              Upgrade Now
            </button>
          </div>
        )}
        
        <div className="space-y-1 pb-6">
          <NavItem icon="support_agent" label="Support" href="/support" isSmall active={pathname === '/support'} />
          <NavItem 
            icon="logout" 
            label="Logout" 
            isSmall 
            onClick={() => signOut({ callbackUrl: '/login' })} 
          />
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, href, active, isSmall, onClick }: { icon: string, label: string, href?: string, active?: boolean, isSmall?: boolean, onClick?: () => void }) {
  const content = (
    <>
      <span className={cn("material-symbols-outlined transition-all", isSmall ? "text-lg" : "text-xl", active ? "text-brand-secondary" : "text-text-muted group-hover:text-brand-secondary")} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
      <span className={cn("transition-colors duration-300", isSmall ? "text-[10px] font-bold uppercase tracking-widest" : "font-headline text-xs font-bold uppercase tracking-[0.15em]")}>{label}</span>
      {active && <div className="absolute right-0 top-2 bottom-2 w-1 brand-gradient rounded-l-full shadow-glow-secondary"></div>}
    </>
  );

  const className = cn(
    "flex items-center gap-4 transition-all duration-300 group w-full text-left relative overflow-hidden",
    isSmall ? "py-2.5 px-5 text-text-muted hover:text-text-primary rounded-xl" : "py-3.5 px-5 rounded-2xl",
    active ? "bg-surface text-text-primary shadow-premium" : (!isSmall && "text-text-muted hover:text-text-primary hover:bg-surface/40 px-5")
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href || "#"} className={className}>
      {content}
    </Link>
  );
}
