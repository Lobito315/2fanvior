import React from 'react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

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
    primary: "bg-primary/10",
    tertiary: "bg-tertiary/10",
    error: "bg-error/10",
  };

  return (
    <div className={cn("bg-surface-container-low p-6 rounded-lg relative overflow-hidden group border border-outline-variant/10", className)}>
      <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full transition-colors", glowVariants[glowColor])}></div>
      <p className={cn(
        "text-[10px] font-bold uppercase tracking-widest mb-1", 
        glowColor === 'error' ? 'text-error' : glowColor === 'tertiary' ? 'text-tertiary' : 'text-outline'
      )}>
        {title}
      </p>
      <div className="flex items-end gap-2 relative z-10">
        <h3 className="text-3xl font-headline font-bold text-on-surface">{value}</h3>
        
        {trend && (
          <span className={cn("text-xs font-bold mb-1", trendUp ? "text-emerald-400" : "text-error")}>
            {trend}
          </span>
        )}
        
        {icon && (
          <span className={cn("material-symbols-outlined mb-1", glowColor === 'error' ? 'text-error animate-pulse' : 'text-tertiary')}>
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}
