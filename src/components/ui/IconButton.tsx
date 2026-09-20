import React from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "pink" | "cyan" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  ariaLabel: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, variant = "outline", size = "md", ariaLabel, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all duration-150 border-3 border-black disabled:opacity-50 disabled:pointer-events-none select-none active:translate-x-0.5 active:translate-y-0.5";

    const variantStyles = {
      primary: "bg-neo-yellow text-black hover:bg-yellow-300 brutal-shadow brutal-btn",
      secondary: "bg-neo-purple text-white hover:bg-purple-700 brutal-shadow brutal-btn",
      pink: "bg-neo-pink text-white hover:bg-pink-600 brutal-shadow brutal-btn",
      cyan: "bg-neo-cyan text-black hover:bg-cyan-300 brutal-shadow brutal-btn",
      outline: "bg-white text-black hover:bg-slate-100 brutal-shadow brutal-btn",
      ghost: "bg-transparent text-black border-transparent shadow-none hover:bg-black/5 hover:border-black",
    };

    const sizeStyles = {
      sm: "w-8 h-8 text-xs p-1",
      md: "w-10 h-10 text-sm p-2",
      lg: "w-12 h-12 text-base p-2.5",
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
