import React from "react";
import { Button } from "./Button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "SOMETHING WENT BOOM! 💥",
  message = "We ran into an unexpected glitch while pulling the latest data.",
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-red-50 border-4 border-black p-6 brutal-shadow-lg text-center flex flex-col items-center justify-center my-6",
        className
      )}
    >
      <div className="w-14 h-14 bg-neo-red text-white border-3 border-black flex items-center justify-center brutal-shadow mb-3">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-black uppercase text-black tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs font-bold text-black/80 max-w-sm mb-4">{message}</p>

      {onRetry && (
        <Button variant="danger" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
          RETRY NOW
        </Button>
      )}
    </div>
  );
};
