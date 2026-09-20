"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { ActivityCard } from "@/components/product/ActivityCard";
import { CommunityCard } from "@/components/product/CommunityCard";
import { Tag } from "@/components/ui/Tag";
import { Badge } from "@/components/ui/Badge";
import { MOCK_ACTIVITIES, MOCK_COMMUNITIES, MOCK_INTERESTS, MOCK_USERS } from "@/data/mockData";
import { Flame, Users, Sparkles, MapPin, ArrowRight, Zap, Users2, AlertTriangle, Compass } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("ALL");
  const currentUser = MOCK_USERS[0]; // Pozhilan

  // Filter urgent activities with open spots <= 3
  const urgentActivities = MOCK_ACTIVITIES.filter(
    (act) => act.maxParticipants - act.currentParticipants.length <= 4 && act.status !== "SPOTS_FULL"
  );

  const filteredActivities = MOCK_ACTIVITIES.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.location.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInterest =
      selectedInterest === "ALL" || act.interest.name === selectedInterest;
    return matchesSearch && matchesInterest;
  });

  return (
    <div className="space-y-10">
      {/* 1. PERSONALIZED HERO BANNER */}
      <section className="bg-neo-yellow border-4 border-black p-6 md:p-10 brutal-shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 pointer-events-none font-black select-none rotate-12">
          ⚡⚽
        </div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-black text-neo-yellow border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-wider brutal-shadow-sm">
              <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span>HEY POZHILAN, READY TO CONNECT?</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-white text-black border-2 border-black px-2.5 py-1 text-xs font-black uppercase brutal-shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-neo-pink" />
              <span>Kompally, Hyderabad</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black leading-none">
            WHAT CAN YOU DO <span className="bg-neo-pink text-white px-2 py-0.5 inline-block transform -rotate-1 brutal-shadow">AROUND YOU</span> RIGHT NOW?
          </h1>

          <p className="text-base sm:text-lg font-bold text-black/90 max-w-xl">
            Discover real people, Sunday turf football matches, coffee & code sessions, sunrise hill treks, and indoor badminton games nearby.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/discover">
              <Button variant="pink" size="lg" leftIcon={<Flame className="w-5 h-5 fill-yellow-300 text-yellow-300" />}>
                DISCOVER ACTIVITIES (1.8 KM)
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="cyan" size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
                HOST AN ACTIVITY
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & EXPLORE YOUR INTERESTS STRIP */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="What do you want to play or do today?" />
          <Link href="/discover?view=map" className="self-start md:self-auto">
            <Button variant="outline" size="md" leftIcon={<Compass className="w-4 h-4 text-neo-pink" />}>
              OPEN RADAR MAP 📍
            </Button>
          </Link>
        </div>

        {/* Interests Tag Carousel */}
        <div className="space-y-1.5">
          <span className="text-xs font-black uppercase text-black/70 block tracking-wider">
            EXPLORE YOUR INTERESTS:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Tag
              label="⚡ ALL INTERESTS"
              isSelected={selectedInterest === "ALL"}
              onClick={() => setSelectedInterest("ALL")}
            />
            {MOCK_INTERESTS.map((inst) => (
              <Tag
                key={inst.id}
                label={inst.name}
                emoji={inst.emoji}
                isSelected={selectedInterest === inst.name}
                onClick={() => setSelectedInterest(inst.name)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEED MORE PLAYERS? (URGENT SPOTS SECTION) */}
      {urgentActivities.length > 0 && (
        <section className="bg-neo-pink/15 border-4 border-black p-6 brutal-shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b-3 border-black pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-neo-pink text-white border-2 border-black brutal-shadow-sm">
                <AlertTriangle className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
                  NEED MORE PLAYERS! (SPOTS FILLING FAST)
                </h2>
                <span className="text-xs font-bold text-black/70">
                  These activities are happening soon and need players to complete the roster!
                </span>
              </div>
            </div>
            <Link
              href="/activities"
              className="text-xs font-black uppercase tracking-wider text-black hover:text-neo-pink hidden sm:flex items-center gap-1"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {urgentActivities.map((act) => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>
        </section>
      )}

      {/* 4. AROUND YOU RIGHT NOW ACTIVITIES SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-3 border-black pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-neo-yellow text-black border-2 border-black brutal-shadow-sm">
              <Flame className="w-5 h-5 fill-neo-pink text-neo-pink" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              AROUND YOU RIGHT NOW (KOMPALLY + 10KM)
            </h2>
          </div>
          <Link
            href="/activities"
            className="text-xs font-black uppercase tracking-wider text-black hover:text-neo-pink flex items-center gap-1"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.slice(0, 3).map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      </section>

      {/* 5. COMMUNITIES YOU MAY LIKE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-3 border-black pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-neo-cyan text-black border-2 border-black brutal-shadow-sm">
              <Users2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              COMMUNITIES YOU MAY LIKE
            </h2>
          </div>
          <Link
            href="/communities"
            className="text-xs font-black uppercase tracking-wider text-black hover:text-neo-pink flex items-center gap-1"
          >
            <span>EXPLORE TRIBES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_COMMUNITIES.map((comm) => (
            <CommunityCard key={comm.id} community={comm} />
          ))}
        </div>
      </section>

      {/* 6. AI ASSISTANT PROMPT CTA BANNER */}
      <section className="bg-neo-purple text-white border-4 border-black p-6 brutal-shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="bg-neo-yellow text-black border-2 border-black text-xs font-black px-2 py-0.5 uppercase tracking-wider brutal-shadow-sm inline-block">
            🤖 AI MATCHMAKER
          </span>
          <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">
            DESCRIBE WHAT YOU WANT TO DO IN PLAIN ENGLISH!
          </h3>
          <p className="text-xs sm:text-sm font-bold opacity-90">
            Tell Sensei *"Find football players near Kompally this Sunday"* and let AI match you with open slots!
          </p>
        </div>

        <Link href="/ai" className="shrink-0">
          <Button variant="primary" size="lg" rightIcon={<Sparkles className="w-5 h-5" />}>
            TRY AI SENSEI ⚡
          </Button>
        </Link>
      </section>
    </div>
  );
}
