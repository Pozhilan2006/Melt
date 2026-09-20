import React from "react";
import { User } from "@/types";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MapPin, Zap, Award } from "lucide-react";

export interface UserCardProps {
  user: User;
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({ user, className }) => {
  return (
    <Card
      variant="white"
      shadow="md"
      hoverable
      className={`p-4 border-3 border-black space-y-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={user.avatar}
            fallback={user.name.slice(0, 2)}
            animeSticker={user.animeAvatar}
            size="lg"
          />
          <div>
            <h4 className="font-black text-sm uppercase tracking-tight text-black leading-tight flex items-center gap-1">
              {user.name}
            </h4>
            <span className="text-xs font-bold text-black/60">{user.handle}</span>
            <div className="mt-1">
              <Badge variant="yellow" size="sm">
                {user.badge}
              </Badge>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="bg-neo-pink text-white border-2 border-black text-xs font-black px-2 py-0.5 brutal-shadow-sm flex items-center gap-1">
            <Zap className="w-3 h-3 fill-yellow-300 text-yellow-300" />
            <span>{user.hypeLevel} LVL</span>
          </div>
        </div>
      </div>

      <p className="text-xs font-semibold text-black/80 line-clamp-2">{user.bio}</p>

      <div className="flex flex-wrap gap-1">
        {user.interests.map((interest) => (
          <span
            key={interest}
            className="text-[10px] font-extrabold uppercase bg-neo-cyan/30 text-black border border-black px-1.5 py-0.5"
          >
            {interest}
          </span>
        ))}
      </div>

      <div className="pt-2 border-t-2 border-dashed border-black/20 flex items-center justify-between text-xs font-bold">
        <span className="flex items-center gap-1 text-black/70">
          <MapPin className="w-3.5 h-3.5 text-neo-pink" />
          {user.location}
        </span>
        <Button variant="outline" size="sm">
          CONNECT
        </Button>
      </div>
    </Card>
  );
};
