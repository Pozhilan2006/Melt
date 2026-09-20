"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { MOCK_ACTIVITIES, MOCK_COMMUNITIES } from "@/data/mockData";
import { ActivityCard } from "@/components/product/ActivityCard";
import { CommunityCard } from "@/components/product/CommunityCard";
import { Zap, MapPin, Edit3 } from "lucide-react";
import Link from "next/link";

function ProfileContent() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { currentUser } = useAuth();

  // TODO Phase 5: fetch real user activities & communities
  const upcomingActivities = MOCK_ACTIVITIES.slice(0, 3);
  const pastActivities = [MOCK_ACTIVITIES[3], MOCK_ACTIVITIES[4]];
  const userCommunities = MOCK_COMMUNITIES.slice(0, 2);

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white border-4 border-black brutal-shadow-xl overflow-hidden">
        {/* Banner Top */}
        <div className="h-32 bg-neo-yellow border-b-4 border-black relative p-4 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Badge variant="dark" size="sm">
              LEVEL {currentUser.hype_level} HYPER PARTICIPANT
            </Badge>
            <span className="text-xs font-black bg-black text-neo-yellow px-2 py-0.5 border border-black uppercase">
              NO FOLLOWER COUNTS • 100% REAL PARTICIPATION
            </span>
          </div>

          <Link href="/settings/profile">
            <button className="bg-white border-2 border-black p-1.5 text-xs font-black uppercase flex items-center gap-1 brutal-shadow-sm hover:bg-slate-100">
              <Edit3 className="w-3.5 h-3.5" /> EDIT PROFILE
            </button>
          </Link>
        </div>

        {/* User Details Box */}
        <div className="p-6 -mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar
                src={currentUser.profile_image ?? undefined}
                fallback={(currentUser.name ?? "?").slice(0, 2)}
                animeSticker="⚡"
                size="xl"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                  {currentUser.name}
                </h1>
                <span className="text-xs font-bold text-black/60">@{currentUser.username}</span>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="pink" size="sm">
                    {currentUser.badge}
                  </Badge>
                  {currentUser.location_name && (
                    <span className="text-xs font-bold text-black/70 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neo-pink" />
                      {currentUser.location_name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Hype Level & Karma Score */}
            <div className="flex gap-3 bg-slate-50 border-3 border-black p-3 brutal-shadow-sm self-start sm:self-auto">
              <div className="text-center px-2">
                <span className="text-xl font-black text-neo-pink flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 fill-neo-pink" /> {currentUser.hype_level}
                </span>
                <span className="text-[9px] font-black uppercase text-black/60">HYPE SCORE</span>
              </div>
              <div className="text-center px-2 border-l-2 border-black/20">
                <span className="text-xl font-black text-neo-purple">{currentUser.karma}</span>
                <span className="text-[9px] font-black uppercase text-black/60">KARMA PTS</span>
              </div>
            </div>
          </div>

          {currentUser.bio && (
            <p className="text-sm font-semibold text-black/80">{currentUser.bio}</p>
          )}

          {/* INTERESTS SECTION */}
          {currentUser.interests && currentUser.interests.length > 0 && (
            <div className="space-y-2 pt-3 border-t-2 border-dashed border-black/20">
              <h4 className="text-xs font-black uppercase text-black tracking-wider">
                MY INTERESTS & HOBBIES:
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((interest) => (
                  <span
                    key={interest.id}
                    className="text-xs font-black uppercase bg-neo-cyan text-black border-2 border-black px-3 py-1 brutal-shadow-sm transform -rotate-1"
                  >
                    {interest.emoji} {interest.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {currentUser.interests?.length === 0 && (
            <div className="pt-3 border-t-2 border-dashed border-black/20">
              <Link href="/onboarding">
                <button className="text-xs font-black uppercase text-neo-pink hover:underline">
                  + ADD YOUR INTERESTS
                </button>
              </Link>
            </div>
          )}
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

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
