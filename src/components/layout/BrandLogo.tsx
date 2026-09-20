import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className, size = "md" }) => {
  const sizeMap = {
    sm: "text-lg px-2 py-0.5",
    md: "text-2xl px-3 py-1",
    lg: "text-4xl px-4 py-2",
  };

  return (
    <Link href="/" className={cn("inline-flex items-center gap-1.5 select-none group", className)}>
      <div
        className={cn(
          "bg-neo-yellow text-black border-3 border-black font-black uppercase tracking-tighter brutal-shadow transform -rotate-2 group-hover:rotate-2 group-hover:scale-105 transition-all flex items-center gap-1",
          sizeMap[size]
        )}
      >
        <span className="bg-black text-neo-yellow p-1 border border-black transform rotate-6">
          <Zap className="w-5 h-5 fill-neo-yellow" />
        </span>
        <span>MEELT!</span>
        <span className="text-xs bg-neo-pink text-white px-1 font-black transform rotate-12 -mt-2">
          HYD
        </span>
      </div>
    </Link>
  );
};
