import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/types";

export interface ParticipantCountProps {
  currentParticipants: User[];
  maxParticipants: number;
  showAvatars?: boolean;
  className?: string;
}

export const ParticipantCount: React.FC<ParticipantCountProps> = ({
  currentParticipants,
  maxParticipants,
  showAvatars = true,
  className,
}) => {
  const currentCount = currentParticipants.length;
  const isFull = currentCount >= maxParticipants;
  const spotsLeft = maxParticipants - currentCount;

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <div className="flex items-center gap-1.5">
        <div className="p-1 bg-neo-yellow border-2 border-black text-black brutal-shadow-sm">
          <Users className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-black uppercase tracking-wide text-black">
          {currentCount} / {maxParticipants} PLAYERS
        </span>
      </div>

      {showAvatars && (
        <div className="flex items-center -space-x-2">
          {currentParticipants.slice(0, 3).map((user, idx) => (
            <div
              key={user.id || idx}
              className="w-7 h-7 rounded-none bg-neo-pink text-white border-2 border-black text-[10px] font-extrabold flex items-center justify-center brutal-shadow-sm uppercase"
              title={user.name}
            >
              {user.animeAvatar || user.name.slice(0, 2)}
            </div>
          ))}
          {currentParticipants.length > 3 && (
            <div className="w-7 h-7 bg-black text-white border-2 border-black text-[10px] font-black flex items-center justify-center brutal-shadow-sm">
              +{currentParticipants.length - 3}
            </div>
          )}
        </div>
      )}

      {spotsLeft > 0 && !isFull && (
        <span className="text-[10px] font-black uppercase text-neo-pink bg-pink-50 border border-black px-1.5 py-0.5">
          {spotsLeft} SPOTS LEFT
        </span>
      )}
    </div>
  );
};
