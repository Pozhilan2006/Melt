import React from "react";
import Link from "next/link";
import { Community } from "@/types";
import { ApiCommunity } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Users, Calendar, MapPin, CheckCircle } from "lucide-react";

export interface CommunityCardProps {
  community: Community | ApiCommunity;
  className?: string;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community, className }) => {
  const isApiCommunity = "member_count" in community;
  const leadUser = isApiCommunity ? community.lead_user : community.leadUser;
  const memberCount = isApiCommunity ? community.member_count : community.memberCount;
  const mascot = isApiCommunity ? community.anime_mascot : community.animeMascot;
  const banner = isApiCommunity ? community.banner_bg : community.bannerBg;
  const isVerified = isApiCommunity ? community.is_verified : community.isVerified;
  const leadImage = isApiCommunity ? community.lead_user?.profile_image : community.leadUser.avatar;
  const tagline = community.tagline ?? community.description ?? "Find your people and make it real.";
  const tags = isApiCommunity ? [] : community.tags;

  return (
    <Link href={`/communities/${community.id}`}>
      <Card
        variant="white"
        shadow="md"
        hoverable
        className={`flex flex-col justify-between h-full p-0 overflow-hidden border-3 border-black ${className}`}
      >
        {/* Banner */}
        <div className={`h-24 ${banner ?? "bg-neo-yellow"} border-b-3 border-black relative p-3 flex items-start justify-between`}>
          <div className="absolute right-3 bottom-2 text-4xl opacity-30 select-none">
            {mascot}
          </div>
          <Badge variant="dark" size="sm">
            {community.category}
          </Badge>
          {isVerified && (
            <Badge variant="cyan" size="sm">
              <CheckCircle className="w-3 h-3 text-black" /> VERIFIED TRIBE
            </Badge>
          )}
        </div>

        {/* Lead Avatar Floating Header */}
        <div className="px-4 -mt-6 flex justify-between items-end z-10">
          <Avatar
            src={leadImage ?? undefined}
            fallback={(leadUser?.name ?? "?").slice(0, 2)}
            animeSticker={mascot ?? "⚡"}
            size="lg"
          />
          <div className="bg-white border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-wider brutal-shadow-sm flex items-center gap-1">
            <Users className="w-3 h-3 text-neo-pink" />
            <span>{memberCount} MEMBERS</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex-1 space-y-2">
          <h3 className="text-lg font-black uppercase tracking-tight text-black line-clamp-1 hover:text-neo-pink transition-colors">
            {community.name}
          </h3>
          <p className="text-xs font-semibold text-black/70 line-clamp-2">
            {tagline}
          </p>

          <div className="flex flex-wrap gap-1 pt-1">
            {tags.slice(0, 3).map((tag) => (
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
          <span className="bg-neo-yellow text-black border-2 border-black px-2 py-1 text-xs font-black uppercase brutal-shadow-sm">
            {isApiCommunity && community.membership?.is_member ? "VIEW TRIBE" : "JOIN TRIBE"}
          </span>
        </div>
      </Card>
    </Link>
  );
};
