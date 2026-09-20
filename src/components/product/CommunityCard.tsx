import React from "react";
import Link from "next/link";
import { Community } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Users, Calendar, MapPin, CheckCircle } from "lucide-react";

export interface CommunityCardProps {
  community: Community;
  className?: string;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community, className }) => {
  return (
    <Link href={`/communities/${community.id}`}>
      <Card
        variant="white"
        shadow="md"
        hoverable
        className={`flex flex-col justify-between h-full p-0 overflow-hidden border-3 border-black ${className}`}
      >
        {/* Banner */}
        <div className={`h-24 ${community.bannerBg} border-b-3 border-black relative p-3 flex items-start justify-between`}>
          <div className="absolute right-3 bottom-2 text-4xl opacity-30 select-none">
            {community.animeMascot}
          </div>
          <Badge variant="dark" size="sm">
            {community.category}
          </Badge>
          {community.isVerified && (
            <Badge variant="cyan" size="sm">
              <CheckCircle className="w-3 h-3 text-black" /> VERIFIED TRIBE
            </Badge>
          )}
        </div>

        {/* Lead Avatar Floating Header */}
        <div className="px-4 -mt-6 flex justify-between items-end z-10">
          <Avatar
            src={community.leadUser.avatar}
            fallback={community.leadUser.name.slice(0, 2)}
            animeSticker={community.animeMascot}
            size="lg"
          />
          <div className="bg-white border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-wider brutal-shadow-sm flex items-center gap-1">
            <Users className="w-3 h-3 text-neo-pink" />
            <span>{community.memberCount} MEMBERS</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex-1 space-y-2">
          <h3 className="text-lg font-black uppercase tracking-tight text-black line-clamp-1 hover:text-neo-pink transition-colors">
            {community.name}
          </h3>
          <p className="text-xs font-semibold text-black/70 line-clamp-2">
            {community.tagline}
          </p>

          <div className="flex flex-wrap gap-1 pt-1">
            {community.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-extrabold uppercase bg-slate-100 border border-black px-1.5 py-0.5 text-black"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t-3 border-black flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-extrabold text-black/80">
            <MapPin className="w-3.5 h-3.5 text-neo-pink shrink-0" />
            <span className="truncate max-w-[130px]">{community.location}</span>
          </div>
          <Button variant="primary" size="sm">
            JOIN TRIBE
          </Button>
        </div>
      </Card>
    </Link>
  );
};
