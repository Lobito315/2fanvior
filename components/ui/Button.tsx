import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-headline font-bold rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20 hover:bg-primary-container/90",
      secondary: "bg-surface-container-high text-on-surface hover:bg-surface-bright",
      outline: "border-2 border-primary text-primary hover:bg-primary/10",
      ghost: "text-outline hover:text-on-surface hover:bg-surface-container-high",
      gradient: "brand-gradient text-on-primary-container shadow-lg shadow-primary-container/20 hover:scale-[1.02]",
    };

    const sizes = {
      sm: "px-5 py-2 text-xs",
      md: "px-6 py-3 text-sm gap-2",
      lg: "px-8 py-4 text-base gap-3",
      icon: "w-10 h-10 p-0",
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
