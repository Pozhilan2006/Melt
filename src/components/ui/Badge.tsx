import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "yellow" | "pink" | "purple" | "cyan" | "green" | "orange" | "dark" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  children,
  variant = "yellow",
  size = "md",
  ...props
}) => {
  const variantStyles = {
    yellow: "bg-neo-yellow text-black border-black",
    pink: "bg-neo-pink text-white border-black",
    purple: "bg-neo-purple text-white border-black",
    cyan: "bg-neo-cyan text-black border-black",
    green: "bg-neo-green text-black border-black",
    orange: "bg-neo-orange text-white border-black",
    dark: "bg-black text-white border-black",
    outline: "bg-white text-black border-black",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 font-extrabold uppercase tracking-wider border-2 brutal-shadow-sm",
    md: "text-xs px-2.5 py-1 font-extrabold uppercase tracking-wider border-2 brutal-shadow-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 leading-none select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
