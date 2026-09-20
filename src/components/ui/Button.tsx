import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "pink" | "cyan" | "green" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-150 border-3 border-black disabled:opacity-50 disabled:pointer-events-none select-none active:translate-x-0.5 active:translate-y-0.5";

    const variantStyles = {
      primary: "bg-neo-yellow text-black hover:bg-yellow-300 brutal-shadow brutal-btn",
      secondary: "bg-neo-purple text-white hover:bg-purple-700 brutal-shadow brutal-btn",
      pink: "bg-neo-pink text-white hover:bg-pink-600 brutal-shadow brutal-btn",
      cyan: "bg-neo-cyan text-black hover:bg-cyan-300 brutal-shadow brutal-btn",
      green: "bg-neo-green text-black hover:bg-green-400 brutal-shadow brutal-btn",
      danger: "bg-neo-red text-white hover:bg-red-600 brutal-shadow brutal-btn",
      outline: "bg-white text-black hover:bg-slate-100 brutal-shadow brutal-btn",
      ghost: "bg-transparent text-black border-transparent shadow-none hover:bg-black/5 hover:border-black",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
