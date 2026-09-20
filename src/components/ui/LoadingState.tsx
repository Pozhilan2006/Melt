import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  type?: "card" | "list" | "detail" | "avatar";
  count?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = "card",
  count = 3,
  className,
}) => {
  const items = Array.from({ length: count });

  if (type === "card") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-white border-3 border-black p-4 brutal-shadow animate-pulse space-y-3"
          >
            <div className="h-28 bg-neo-yellow/30 border-2 border-black/20 w-full" />
            <div className="h-6 bg-black/10 w-3/4" />
            <div className="h-4 bg-black/10 w-1/2" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-neo-pink/30 border border-black/20" />
              <div className="h-6 w-20 bg-neo-cyan/30 border border-black/20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-white border-3 border-black p-3.5 brutal-shadow animate-pulse flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-neo-yellow/40 border-2 border-black" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-black/15 w-1/3" />
            <div className="h-3 bg-black/10 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};
