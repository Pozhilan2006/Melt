import React from "react";
import { Badge } from "@/components/ui/Badge";

export interface ActivityStatusProps {
  status: "UPCOMING" | "LIVE_NOW" | "SPOTS_FULL" | "COMPLETED";
}

export const ActivityStatus: React.FC<ActivityStatusProps> = ({ status }) => {
  switch (status) {
    case "LIVE_NOW":
      return (
        <Badge variant="pink" size="sm" className="animate-pulse">
          🔥 LIVE NOW
        </Badge>
      );
    case "UPCOMING":
      return (
        <Badge variant="yellow" size="sm">
          ⚡ UPCOMING
        </Badge>
      );
    case "SPOTS_FULL":
      return (
        <Badge variant="purple" size="sm">
          ⛔ SPOTS FULL
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="dark" size="sm">
          🏁 COMPLETED
        </Badge>
      );
    default:
      return null;
  }
};
