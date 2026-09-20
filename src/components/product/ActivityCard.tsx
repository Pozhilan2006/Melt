import React from "react";
import Link from "next/link";
import { Activity } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ActivityStatus } from "./ActivityStatus";
import { LocationBadge, DistanceBadge } from "./LocationBadge";
import { ParticipantCount } from "./ParticipantCount";
import { JoinButton } from "./JoinButton";
import { formatDate } from "@/lib/utils";
import { Flame, Calendar, ShieldCheck } from "lucide-react";

export interface ActivityCardProps {
  activity: Activity;
  className?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, className }) => {
  return (
    <Link href={`/activities/${activity.id}`}>
      <Card
        variant="white"
        shadow="md"
        hoverable
        className={`flex flex-col justify-between h-full p-0 overflow-hidden border-3 border-black ${className}`}
      >
        {/* Top Header Banner */}
        <div className={`p-3 border-b-3 border-black ${activity.bannerBg} flex items-center justify-between relative overflow-hidden`}>
          <div className="absolute right-2 top-2 opacity-20 text-4xl select-none font-black">
            {activity.animeSticker}
          </div>
          <div className="flex items-center gap-2 z-10">
            <ActivityStatus status={activity.status} />
            <DistanceBadge distanceKm={activity.location.distanceKm} />
          </div>
          <span className="text-xl z-10 transform rotate-6 hover:scale-125 transition-transform select-none">
            {activity.animeSticker}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {activity.communityName && (
              <div className="flex items-center gap-1 text-[11px] font-black uppercase text-neo-purple mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="truncate">{activity.communityName}</span>
              </div>
            )}
            <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-black leading-snug line-clamp-2 hover:text-neo-pink transition-colors">
              {activity.title}
            </h3>
            <p className="text-xs font-semibold text-black/70 line-clamp-2 mt-1">
              {activity.description}
            </p>
          </div>

          {/* Date & Location Badges */}
          <div className="space-y-2 pt-1 border-t-2 border-dashed border-black/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-black/80">
              <Calendar className="w-3.5 h-3.5 text-neo-purple shrink-0" />
              <span>{formatDate(activity.dateTime)}</span>
            </div>
            <LocationBadge
              locationName={activity.location.name}
              area={activity.location.area}
            />
          </div>

          {/* Participants */}
          <ParticipantCount
            currentParticipants={activity.currentParticipants}
            maxParticipants={activity.maxParticipants}
          />
        </div>

        {/* Card Footer Actions */}
        <div className="p-3 bg-slate-50 border-t-3 border-black flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs font-black text-black">
            <Flame className="w-4 h-4 text-neo-pink fill-neo-pink" />
            <span>{activity.hypeCount} HYPES</span>
          </div>

          <JoinButton
            activityId={activity.id}
            isFull={activity.status === "SPOTS_FULL"}
            size="sm"
          />
        </div>
      </Card>
    </Link>
  );
};
