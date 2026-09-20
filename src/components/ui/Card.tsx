import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "yellow" | "pink" | "cyan" | "green" | "purple" | "outline";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  variant = "white",
  shadow = "md",
  hoverable = true,
  ...props
}) => {
  const variantStyles = {
    white: "bg-white text-black border-black",
    yellow: "bg-neo-yellow text-black border-black",
    pink: "bg-neo-pink text-white border-black",
    cyan: "bg-neo-cyan text-black border-black",
    green: "bg-neo-green text-black border-black",
    purple: "bg-neo-purple text-white border-black",
    outline: "bg-transparent text-black border-black",
  };

  const shadowStyles = {
    none: "box-shadow-none",
    sm: "brutal-shadow-sm",
    md: "brutal-shadow",
    lg: "brutal-shadow-lg",
    xl: "brutal-shadow-xl",
  };

  return (
    <div
      className={cn(
        "border-3 p-4 relative overflow-hidden transition-all duration-200",
        variantStyles[variant],
        shadowStyles[shadow],
        hoverable ? "brutal-card-hover" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
