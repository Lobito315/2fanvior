import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", children, ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-gradient-to-r from-glow to-accent text-white shadow-glow",
        variant === "secondary" && "bg-white/10 text-white",
        variant === "ghost" && "bg-transparent text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
