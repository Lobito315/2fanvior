import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UserCardProps {
  name: string;
  handle: string;
  avatarUrl: string;
  role: 'CREATOR' | 'SUBSCRIBER';
  isOnline?: boolean;
  statusBadge?: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
}

export function UserCard({ name, handle, avatarUrl, role, isOnline, statusBadge, actionButton, className }: UserCardProps) {
  const isCreator = role === 'CREATOR';

  return (
    <div className={cn("flex items-center justify-between p-5 rounded-2xl bg-surface hover:bg-surface/80 transition-all duration-300 group border border-border-subtle/30 shadow-premium hover:border-brand-primary/20", className)}>
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl overflow-hidden relative border border-border-subtle group-hover:border-brand-primary/40 transition-all duration-500">
            <Image 
              src={avatarUrl} 
              alt={`${name}'s avatar`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="56px"
            />
          </div>
          {isOnline && (
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-status-success border-[3px] border-bg-main rounded-full shadow-premium ring-2 ring-status-success/20 animate-pulse"></div>
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-text-primary tracking-tight group-hover:text-brand-secondary transition-colors uppercase">
              {name}
            </h3>
            {statusBadge}
          </div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mt-1 opacity-70">{handle}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex flex-col items-end">
          <span className={cn(
            "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border border-border-subtle/50",
            isCreator ? "text-brand-primary bg-brand-primary/5" : "text-brand-secondary bg-brand-secondary/5"
          )}>
            {role}
          </span>
        </div>
        
        {actionButton}
      </div>
    </div>
  );
}
