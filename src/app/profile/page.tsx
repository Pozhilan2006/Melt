"use client";

import React, { useState } from "react";
import { MOCK_USERS, MOCK_ACTIVITIES, MOCK_COMMUNITIES } from "@/data/mockData";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { ActivityCard } from "@/components/product/ActivityCard";
import { CommunityCard } from "@/components/product/CommunityCard";
import { User, Zap, Flame, Award, MapPin, Settings, Edit3, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const user = MOCK_USERS[0]; // Pozhilan

  const upcomingActivities = MOCK_ACTIVITIES.slice(0, 3);
  const pastActivities = [MOCK_ACTIVITIES[3], MOCK_ACTIVITIES[4]];
  const userCommunities = MOCK_COMMUNITIES.slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white border-4 border-black brutal-shadow-xl overflow-hidden">
        {/* Banner Top */}
        <div className="h-32 bg-neo-yellow border-b-4 border-black relative p-4 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Badge variant="dark" size="sm">
              LEVEL {user.hypeLevel} HYPER PARTICIPANT
            </Badge>
            <span className="text-xs font-black bg-black text-neo-yellow px-2 py-0.5 border border-black uppercase">
              NO FOLLOWER COUNTS • 100% REAL PARTICIPATION
            </span>
          </div>

          <button className="bg-white border-2 border-black p-1.5 text-xs font-black uppercase flex items-center gap-1 brutal-shadow-sm hover:bg-slate-100">
            <Edit3 className="w-3.5 h-3.5" /> EDIT PROFILE
          </button>
        </div>

        {/* User Details Box */}
        <div className="p-6 -mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar
                src={user.avatar}
                fallback={user.name.slice(0, 2)}
                animeSticker={user.animeAvatar}
                size="xl"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                  {user.name}
                </h1>
                <span className="text-xs font-bold text-black/60">{user.handle}</span>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="pink" size="sm">
                    {user.badge}
                  </Badge>
                  <span className="text-xs font-bold text-black/70 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neo-pink" />
                    {user.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Hype Level & Karma Score */}
            <div className="flex gap-3 bg-slate-50 border-3 border-black p-3 brutal-shadow-sm self-start sm:self-auto">
              <div className="text-center px-2">
                <span className="text-xl font-black text-neo-pink flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 fill-neo-pink" /> {user.hypeLevel}
                </span>
                <span className="text-[9px] font-black uppercase text-black/60">HYPE SCORE</span>
              </div>
              <div className="text-center px-2 border-l-2 border-black/20">
                <span className="text-xl font-black text-neo-purple">{user.karma}</span>
                <span className="text-[9px] font-black uppercase text-black/60">KARMA PTS</span>
              </div>
            </div>
          </div>

          <p className="text-sm font-semibold text-black/80">{user.bio}</p>

          {/* INTERESTS SECTION - EMPHASIZED */}
          <div className="space-y-2 pt-3 border-t-2 border-dashed border-black/20">
            <h4 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-1">
              <span>MY INTERESTS & HOBBIES:</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-xs font-black uppercase bg-neo-cyan text-black border-2 border-black px-3 py-1 brutal-shadow-sm transform -rotate-1"
                >
                  ⚡ {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "upcoming", label: "UPCOMING ACTIVITIES", badge: upcomingActivities.length },
          { id: "communities", label: "JOINED COMMUNITIES", badge: userCommunities.length },
          { id: "past", label: "PAST PARTICIPATION", badge: pastActivities.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="cyan"
      />

      {/* Content */}
      {activeTab === "upcoming" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingActivities.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      )}

      {activeTab === "communities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCommunities.map((comm) => (
            <CommunityCard key={comm.id} community={comm} />
          ))}
        </div>
      )}

      {activeTab === "past" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastActivities.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      )}
    </div>
  );
}
