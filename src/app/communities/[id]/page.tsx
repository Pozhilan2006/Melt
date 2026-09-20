"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_COMMUNITIES, MOCK_ACTIVITIES } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs } from "@/components/ui/Tabs";
import { ActivityCard } from "@/components/product/ActivityCard";
import { UserCard } from "@/components/product/UserCard";
import { Users, Calendar, MapPin, CheckCircle, Shield, ArrowLeft, Plus, Activity as ActivityIcon, MessageSquare } from "lucide-react";

export default function CommunityDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMember, setIsMember] = useState(false);

  const community = MOCK_COMMUNITIES.find((c) => c.id === params.id) || MOCK_COMMUNITIES[0];
  const communityActivities = MOCK_ACTIVITIES.filter((a) => a.communityId === community.id);

  // Status Badge helper
  const getStatusBadge = () => {
    switch (community.activityStatus) {
      case "VERY ACTIVE":
        return <Badge variant="pink" size="md">⚡ VERY ACTIVE TRIBE</Badge>;
      case "ACTIVE":
        return <Badge variant="yellow" size="md">🔥 ACTIVE TRIBE</Badge>;
      case "NEW":
        return <Badge variant="green" size="md">🌟 NEW TRIBE</Badge>;
      case "LOOKING FOR MEMBERS":
        return <Badge variant="purple" size="md">👥 LOOKING FOR MEMBERS</Badge>;
      default:
        return <Badge variant="dark" size="md">ACTIVE</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/communities"
          className="inline-flex items-center gap-1 text-xs font-black uppercase text-black hover:text-neo-pink"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO TRIBES
        </Link>
        <span className="text-xs font-black uppercase bg-white border-2 border-black px-2 py-1">
          📍 REAL-WORLD COMMUNITY HUB
        </span>
      </div>

      {/* Header Banner */}
      <div className="border-4 border-black bg-white brutal-shadow-xl overflow-hidden">
        <div className={`h-40 ${community.bannerBg} border-b-4 border-black relative p-4 flex items-start justify-between`}>
          <div className="flex items-center gap-2">
            <Badge variant="dark" size="md">
              {community.category}
            </Badge>
            {getStatusBadge()}
            {community.isVerified && (
              <Badge variant="cyan" size="md">
                <CheckCircle className="w-3.5 h-3.5 text-black" /> VERIFIED
              </Badge>
            )}
          </div>
          <span className="text-7xl select-none font-black opacity-30 transform rotate-12">
            {community.animeMascot}
          </span>
        </div>

        {/* Lead Avatar Floating Header */}
        <div className="px-6 -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10 relative pb-6 border-b-3 border-black">
          <div className="flex items-end gap-4">
            <Avatar
              src={community.leadUser.avatar}
              fallback={community.leadUser.name.slice(0, 2)}
              animeSticker={community.animeMascot}
              size="xl"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                {community.name}
              </h1>
              <p className="text-xs sm:text-sm font-bold text-black/80">{community.tagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={isMember ? "green" : "pink"}
              size="lg"
              onClick={() => setIsMember(!isMember)}
            >
              {isMember ? "MEMBER OF TRIBE ⚡" : "JOIN COMMUNITY TRIBE"}
            </Button>
            <Link href="/create?tab=activity">
              <Button variant="primary" size="lg" leftIcon={<Plus className="w-4 h-4 stroke-[3]" />}>
                CREATE ACTIVITY
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-slate-50 p-4 grid grid-cols-3 gap-2 text-center border-b-3 border-black">
          <div>
            <span className="block text-xl font-black text-black">{community.memberCount}</span>
            <span className="text-[10px] font-black uppercase text-black/60">TOTAL MEMBERS</span>
          </div>
          <div className="border-x-2 border-black/20">
            <span className="block text-xl font-black text-neo-pink">{communityActivities.length}</span>
            <span className="text-[10px] font-black uppercase text-black/60">UPCOMING EVENTS</span>
          </div>
          <div>
            <span className="block text-xl font-black text-black">{community.location}</span>
            <span className="text-[10px] font-black uppercase text-black/60">HOME BASE</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "overview", label: "TRIBE OVERVIEW" },
          { id: "activities", label: "UPCOMING ACTIVITIES", badge: communityActivities.length },
          { id: "activity_log", label: "COMMUNITY STREAM", badge: community.recentActivityLog?.length || 3 },
          { id: "members", label: "MEMBER SQUAD", badge: community.members.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="purple"
      />

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white border-3 border-black p-6 brutal-shadow space-y-3">
              <h3 className="text-lg font-black uppercase text-black border-b-2 border-black pb-1">
                ABOUT THIS TRIBE
              </h3>
              <p className="text-sm font-semibold text-black/80 leading-relaxed">
                {community.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {community.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-black uppercase bg-neo-yellow text-black border-2 border-black px-2.5 py-1 brutal-shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Upcoming Activities inside overview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase text-black">
                  TRIBE ACTIVITIES ({communityActivities.length})
                </h3>
                <Link href="/create?tab=activity">
                  <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    HOST ACTIVITY
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communityActivities.map((act) => (
                  <ActivityCard key={act.id} activity={act} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-neo-cyan/20 border-3 border-black p-5 brutal-shadow space-y-3">
              <h4 className="font-black text-sm uppercase text-black flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-neo-purple" /> TRIBE LEAD
              </h4>
              <UserCard user={community.leadUser} />
            </div>

            {/* Recent Stream Log */}
            <div className="bg-white border-3 border-black p-5 brutal-shadow space-y-3">
              <h4 className="font-black text-sm uppercase text-black flex items-center gap-1.5 border-b-2 border-black pb-1">
                <ActivityIcon className="w-4 h-4 text-neo-pink" /> RECENT TRIBE LOG
              </h4>
              <div className="space-y-2">
                {community.recentActivityLog?.map((log) => (
                  <div key={log.id} className="text-xs font-bold border-l-2 border-neo-yellow pl-2 py-0.5">
                    <p className="text-black">{log.text}</p>
                    <span className="text-[10px] text-black/50">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "activities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityActivities.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      )}

      {activeTab === "activity_log" && (
        <div className="bg-white border-4 border-black p-6 brutal-shadow-lg space-y-4">
          <h3 className="text-xl font-black uppercase border-b-3 border-black pb-2 text-black flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-neo-pink" /> LIVE COMMUNITY ACTIVITY STREAM
          </h3>
          <div className="space-y-3">
            {community.recentActivityLog?.map((log) => (
              <div key={log.id} className="bg-slate-50 border-2 border-black p-3 brutal-shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span className="text-xs font-black uppercase text-black">{log.text}</span>
                </div>
                <span className="text-[10px] font-bold text-black/60">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "members" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {community.members.map((usr) => (
            <UserCard key={usr.id} user={usr} />
          ))}
        </div>
      )}
    </div>
  );
}
