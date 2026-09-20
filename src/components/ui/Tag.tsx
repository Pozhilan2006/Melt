import React from "react";
import { cn } from "@/lib/utils";

export interface TagProps {
  label: string;
  emoji?: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "yellow" | "pink" | "purple" | "cyan" | "green";
}

export const Tag: React.FC<TagProps> = ({
  label,
  emoji,
  isSelected = false,
  onClick,
  className,
  variant = "default",
}) => {
  const getVariantStyles = () => {
    if (isSelected) {
      return "bg-black text-neo-yellow border-black brutal-shadow font-extrabold translate-y-[-2px]";
    }
    switch (variant) {
      case "yellow":
        return "bg-neo-yellow/20 hover:bg-neo-yellow text-black border-black";
      case "pink":
        return "bg-neo-pink/20 hover:bg-neo-pink hover:text-white text-black border-black";
      case "purple":
        return "bg-neo-purple/20 hover:bg-neo-purple hover:text-white text-black border-black";
      case "cyan":
        return "bg-neo-cyan/20 hover:bg-neo-cyan text-black border-black";
      case "green":
        return "bg-neo-green/20 hover:bg-neo-green text-black border-black";
      default:
        return "bg-white hover:bg-slate-100 text-black border-black";
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase font-extrabold tracking-wide border-2 transition-all select-none brutal-shadow-sm active:translate-x-0.5 active:translate-y-0.5",
        getVariantStyles(),
        className
      )}
    >
      {emoji && <span className="text-sm">{emoji}</span>}
      <span>{label}</span>
    </button>
  );
};
