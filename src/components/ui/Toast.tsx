import React from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  type?: "success" | "warning" | "error" | "info";
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  type = "info",
  title,
  message,
  onClose,
  className,
}) => {
  const typeConfig = {
    success: {
      bg: "bg-neo-green text-black",
      icon: <CheckCircle2 className="w-5 h-5" />,
      sticker: "⚡",
    },
    warning: {
      bg: "bg-neo-yellow text-black",
      icon: <AlertTriangle className="w-5 h-5" />,
      sticker: "⚠️",
    },
    error: {
      bg: "bg-neo-red text-white",
      icon: <AlertTriangle className="w-5 h-5" />,
      sticker: "💥",
    },
    info: {
      bg: "bg-neo-cyan text-black",
      icon: <Info className="w-5 h-5" />,
      sticker: "💡",
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={cn(
        "border-3 border-black p-3.5 brutal-shadow-lg flex items-start justify-between gap-3 max-w-sm w-full animate-in slide-in-from-top-4 duration-200",
        config.bg,
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-lg leading-none">{config.sticker}</span>
        <div>
          <h4 className="font-black text-sm uppercase tracking-tight leading-tight">
            {title}
          </h4>
          {message && <p className="text-xs font-semibold opacity-90 mt-0.5">{message}</p>}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/10 rounded transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
