import React, { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, error, containerClassName, id, ...props }, ref) => {
    
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn("space-y-2 w-full", containerClassName)}>
        {label && (
          <div className="flex justify-between items-end mb-1">
            <label htmlFor={inputId} className="font-label text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted ml-0.5">
              {label}
            </label>
          </div>
        )}
        
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted group-focus-within:text-brand-primary transition-all duration-300">
                {icon}
              </span>
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-14 bg-bg-main border border-border-subtle/50 rounded-xl text-text-primary placeholder:text-text-muted/40 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-bg-main/80 transition-all duration-300 font-medium",
              icon ? "pl-12 pr-4" : "px-5",
              error && "border-status-error focus:ring-status-error/20 focus:border-status-error",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[10px] uppercase tracking-wider font-bold text-status-error mt-1.5 ml-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
