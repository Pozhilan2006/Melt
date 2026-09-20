import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LocationBadgeProps {
  locationName: string;
  area: string;
  className?: string;
}

export const LocationBadge: React.FC<LocationBadgeProps> = ({
  locationName,
  area,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-xs font-bold text-black/80 bg-slate-100 border-2 border-black px-2 py-0.5 brutal-shadow-sm",
        className
      )}
    >
      <MapPin className="w-3.5 h-3.5 text-neo-pink shrink-0" />
      <span className="truncate max-w-[160px]">
        {locationName}, {area}
      </span>
    </div>
  );
};

export interface DistanceBadgeProps {
  distanceKm: number;
  className?: string;
}

export const DistanceBadge: React.FC<DistanceBadgeProps> = ({
  distanceKm,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-extrabold uppercase bg-neo-cyan text-black border-2 border-black px-2 py-0.5 brutal-shadow-sm",
        className
      )}
    >
      <Navigation className="w-3 h-3 text-black shrink-0" />
      <span>{distanceKm} KM AWAY</span>
    </div>
  );
};
