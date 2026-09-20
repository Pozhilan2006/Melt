import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  animeSticker?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User Avatar",
  fallback = "⚡",
  animeSticker,
  size = "md",
  className,
}) => {
  const sizeMap = {
    sm: "w-8 h-8 text-xs border-2",
    md: "w-10 h-10 text-sm border-3",
    lg: "w-14 h-14 text-base border-3",
    xl: "w-20 h-20 text-xl border-4",
  };

  const stickerSizeMap = {
    sm: "text-[10px] -bottom-1 -right-1",
    md: "text-xs -bottom-1 -right-1",
    lg: "text-sm -bottom-1.5 -right-1.5",
    xl: "text-lg -bottom-2 -right-2",
  };

  return (
    <div className="relative inline-block select-none">
      <div
        className={cn(
          "rounded-none bg-neo-yellow border-black font-extrabold flex items-center justify-center overflow-hidden brutal-shadow-sm",
          sizeMap[size],
          className
        )}
      >
        {src ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span className="text-black uppercase">{fallback}</span>
        )}
      </div>
      {animeSticker && (
        <span
          className={cn(
            "absolute z-10 bg-white border-2 border-black rounded-none p-0.5 leading-none brutal-shadow-sm transform rotate-12",
            stickerSizeMap[size]
          )}
        >
          {animeSticker}
        </span>
      )}
    </div>
  );
};
