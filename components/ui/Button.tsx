import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-headline font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none duration-300";
    
    const variants = {
      primary: "bg-brand-primary text-text-primary shadow-glow-primary hover:bg-brand-primary/90 hover:shadow-premium",
      secondary: "bg-surface-light text-text-secondary hover:bg-surface-light/80 hover:text-text-primary",
      outline: "border border-border-subtle text-text-secondary hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5",
      ghost: "text-text-muted hover:text-text-primary hover:bg-surface/50",
      gradient: "brand-gradient text-white shadow-premium hover:shadow-glow-secondary hover:scale-[1.02]",
    };

    const sizes = {
      sm: "px-5 py-2 text-xs",
      md: "px-6 py-3 text-sm gap-2",
      lg: "px-8 py-4 text-base gap-3",
      icon: "w-11 h-11 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
