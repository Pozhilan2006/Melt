import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs uppercase font-black tracking-wider text-black">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-black/70 pointer-events-none z-10">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-white border-3 border-black text-black px-3 py-2.5 font-medium placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-neo-yellow focus:ring-offset-2 brutal-shadow-sm transition-all duration-150",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              error ? "border-neo-red bg-red-50" : "",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-black/70 z-10">{rightIcon}</div>
          )}
        </div>
        {error && (
          <p className="text-xs font-bold text-neo-red uppercase tracking-wide">
            ⚠️ {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
