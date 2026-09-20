import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  badgeText?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  badgeText,
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={cn(
          "relative w-full max-w-lg bg-white border-4 border-black brutal-shadow-xl p-6 transition-all duration-200 animate-in zoom-in-95",
          className
        )}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            {badgeText && (
              <span className="bg-neo-yellow text-black border-2 border-black text-xs font-black px-2 py-0.5 uppercase tracking-wider brutal-shadow-sm">
                {badgeText}
              </span>
            )}
            {title && (
              <h3 className="text-xl font-black uppercase tracking-tight text-black">
                {title}
              </h3>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neo-pink text-white border-2 border-black brutal-shadow-sm hover:bg-pink-600 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="max-h-[75vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};
