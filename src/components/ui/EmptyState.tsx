import React from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  sticker?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  sticker = "🔍",
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white border-4 border-black p-8 brutal-shadow-lg text-center flex flex-col items-center justify-center my-6 relative overflow-hidden",
        className
      )}
    >
      {/* Background speed lines */}
      <div className="absolute inset-0 bg-speed-lines opacity-30 pointer-events-none" />

      {/* Anime Mascot Circle */}
      <div className="w-20 h-20 bg-neo-yellow border-3 border-black text-4xl flex items-center justify-center brutal-shadow mb-4 transform -rotate-3 hover:rotate-6 transition-transform">
        {sticker}
      </div>

      <h3 className="text-xl font-black uppercase tracking-tight text-black mb-1">
        {title}
      </h3>
      <p className="text-sm font-bold text-black/70 max-w-md mb-6">{description}</p>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
