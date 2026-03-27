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
    <aside className="fixed left-4 top-4 bottom-4 w-60 rounded-3xl bg-surface-container-low shadow-inner shadow-primary/5 flex flex-col py-8 gap-6 z-50 overflow-y-auto">
      <div className="px-6 mb-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-on-primary-fixed-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <h1 className="font-headline font-black italic text-primary tracking-tight leading-none">Fanvior</h1>
            <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-outline mt-1">
              {isAdmin ? "Editorial Admin" : isCreator ? "Creator Studio" : "User Portal"}
            </p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-2">
        <NavItem icon="dashboard" label="Overview" href="/dashboard" active={pathname === '/dashboard'} />
        <NavItem icon="dynamic_feed" label="Feed" href="/feed" active={pathname === '/feed'} />
        <NavItem icon="chat" label="Messages" href="/chat" active={pathname === '/chat'} />
        
        {/* Creator / Admin Section */}
        {(isCreator || isAdmin) && (
          <>
            <div className="px-6 py-2">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Content</p>
            </div>
            <NavItem icon="add_box" label="Create Post" href="/content/create" active={pathname === '/content/create'} />
            <NavItem icon="folder_shared" label="My Library" href="/content" active={pathname === '/content'} />
          </>
        )}
        
        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="px-6 py-2">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Administration</p>
            </div>
            <NavItem icon="group" label="Users" href="/users" active={pathname === '/users'} />
            <NavItem icon="verified_user" label="Identity" href="/moderation" active={pathname === '/moderation'} />
            <NavItem icon="analytics" label="Reports" href="/analytics" active={pathname === '/analytics'} />
          </>
        )}
        
        <div className="px-6 py-2">
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Account</p>
        </div>
        <NavItem icon="settings" label="Settings" href="/settings" active={pathname === '/settings'} />
      </nav>

      <div className="px-4 mt-auto">
        {!isAdmin && !isCreator && (
          <div className="bg-surface-container-high p-4 rounded-2xl mb-6">
            <p className="text-[10px] font-bold text-tertiary mb-2 tracking-widest">PREMIUM ACCESS</p>
            <button className="w-full py-2 bg-gradient-to-r from-tertiary-container to-on-tertiary-fixed-variant rounded-xl text-xs font-bold text-on-tertiary-container hover:opacity-90 transition-opacity">
              Upgrade to Creator
            </button>
          </div>
        )}
        
        <div className="space-y-1">
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
      <span className={cn("material-symbols-outlined", isSmall ? "text-lg" : "")} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
      <span className={cn(isSmall ? "text-xs uppercase tracking-widest" : "font-headline text-sm font-medium uppercase tracking-widest")}>{label}</span>
    </>
  );

  const className = cn(
    "flex items-center gap-4 transition-all group w-full text-left",
    isSmall ? "py-2 text-outline pl-5 hover:text-on-surface" : "py-3",
    active ? "border-l-4 border-primary text-primary pl-4 bg-primary/5" : (!isSmall && "text-outline pl-5 hover:text-on-surface hover:bg-surface-container-high/40")
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
