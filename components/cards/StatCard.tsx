import React from 'react';
import { cn } from '@/lib/utils';


interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  glowColor?: 'primary' | 'tertiary' | 'error';
  icon?: string;
  className?: string;
}

export function StatCard({ title, value, trend, trendUp = true, glowColor = 'primary', icon, className }: StatCardProps) {
  
  const glowVariants = {
    primary: "bg-brand-primary/10",
    tertiary: "bg-brand-secondary/10",
    error: "bg-status-error/10",
  };

  return (
    <div className={cn("bg-surface p-8 rounded-2xl relative overflow-hidden group border border-border-subtle/30 shadow-premium hover:border-brand-primary/40 transition-all duration-500", className)}>
      <div className={cn("absolute -top-10 -right-10 w-32 h-32 blur-[80px] rounded-full opacity-50 transition-all group-hover:opacity-80", glowVariants[glowColor])}></div>
      <p className={cn(
        "text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60", 
        glowColor === 'error' ? 'text-status-error' : glowColor === 'tertiary' ? 'text-brand-secondary' : 'text-text-muted'
      )}>
        {title}
      </p>
      <div className="flex items-end gap-3 relative z-10">
        <h3 className="text-4xl font-headline font-black text-text-primary tracking-tight">{value}</h3>
        
        {trend && (
          <span className={cn("text-[10px] font-black mb-1.5 px-2 py-0.5 rounded-full bg-status-success/10", trendUp ? "text-status-success" : "text-status-error bg-status-error/10")}>
            {trend}
          </span>
        )}
        
        {icon && (
          <span className={cn("material-symbols-outlined mb-1.5", glowColor === 'error' ? 'text-status-error animate-pulse' : 'text-brand-primary')}>
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}
