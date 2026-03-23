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
    <div className={cn("flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high/50 transition-colors group border border-transparent hover:border-outline-variant/10", className)}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden relative">
            <Image 
              src={avatarUrl} 
              alt={`${name}'s avatar`}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-surface-container-low rounded-full"></div>
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
              {name}
            </h3>
            {statusBadge}
          </div>
          <p className="text-xs text-outline">{handle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-4">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest",
            isCreator ? "text-primary" : "text-secondary"
          )}>
            {role}
          </span>
        </div>
        
        {actionButton}
      </div>
    </div>
  );
}
