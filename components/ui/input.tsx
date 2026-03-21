import React, { InputHTMLAttributes } from 'react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

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
            <label htmlFor={inputId} className="font-label text-xs font-bold uppercase tracking-widest text-outline ml-1">
              {label}
            </label>
          </div>
        )}
        
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                {icon}
              </span>
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-14 bg-surface-container-lowest/50 border-none rounded-lg text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/50 focus:bg-surface-container-lowest transition-all font-medium",
              icon ? "pl-12 pr-4" : "px-5",
              error && "ring-1 ring-error focus:ring-error",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-error mt-1 ml-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
