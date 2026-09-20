import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Check, Flame } from "lucide-react";

export interface JoinButtonProps {
  activityId: string;
  isJoinedDefault?: boolean;
  isFull?: boolean;
  onJoinToggle?: (joined: boolean) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const JoinButton: React.FC<JoinButtonProps> = ({
  activityId,
  isJoinedDefault = false,
  isFull = false,
  onJoinToggle,
  size = "md",
  className,
}) => {
  const [isJoined, setIsJoined] = useState(isJoinedDefault);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isJoined;
    setIsJoined(nextState);
    if (onJoinToggle) onJoinToggle(nextState);
  };

  if (isFull && !isJoined) {
    return (
      <Button
        variant="ghost"
        size={size}
        disabled
        className="bg-gray-200 border-2 border-black text-black/50 cursor-not-allowed"
      >
        FULL HOUSE ⛔
      </Button>
    );
  }

  if (isJoined) {
    return (
      <Button
        variant="green"
        size={size}
        onClick={handleClick}
        leftIcon={<Check className="w-4 h-4" />}
        className={className}
      >
        SPOT LOCKED! ⚡
      </Button>
    );
  }

  return (
    <Button
      variant="pink"
      size={size}
      onClick={handleClick}
      leftIcon={<Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />}
      className={className}
    >
      JOIN ACTIVITY
    </Button>
  );
};
