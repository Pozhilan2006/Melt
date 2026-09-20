"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { ActivityCard } from "@/components/product/ActivityCard";
import { Button } from "@/components/ui/Button";
import { MOCK_ACTIVITIES, MOCK_INTERESTS } from "@/data/mockData";
import { Flame, Plus, MapPin } from "lucide-react";

export default function ActivitiesPage() {
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("ALL");
  const [selectedInterest, setSelectedInterest] = useState("ALL");

  const filtered = MOCK_ACTIVITIES.filter((act) => {
    const matchSearch =
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      act.location.name.toLowerCase().includes(search.toLowerCase()) ||
      act.location.area.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusTab === "ALL" ||
      (statusTab === "UPCOMING" && act.status === "UPCOMING") ||
      (statusTab === "LIVE_NOW" && act.status === "LIVE_NOW") ||
      (statusTab === "SPOTS_FULL" && act.status === "SPOTS_FULL");

    const matchInterest =
      selectedInterest === "ALL" || act.interest.name === selectedInterest;

    return matchSearch && matchStatus && matchInterest;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-neo-yellow border-4 border-black p-6 brutal-shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 bg-black text-neo-yellow px-2 py-0.5 text-xs font-black uppercase mb-1">
            <Flame className="w-3.5 h-3.5 text-neo-pink fill-neo-pink" />
            <span>REAL WORLD ACTIVITIES</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">
            UPCOMING REAL-WORLD ACTIVITIES
          </h1>
          <p className="text-xs font-bold text-black/80">
            Book your spot, meet people, and participate in local activities happening today & this weekend.
          </p>
        </div>

        <Link href="/create?tab=activity">
          <Button variant="pink" size="md" leftIcon={<Plus className="w-4 h-4 stroke-[3]" />}>
            HOST ACTIVITY
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search activities by title, location, or area..." />

        {/* Interest tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Tag label="⚡ ALL INTERESTS" isSelected={selectedInterest === "ALL"} onClick={() => setSelectedInterest("ALL")} />
          {MOCK_INTERESTS.map((interest) => (
            <Tag
              key={interest.id}
              label={interest.name}
              emoji={interest.emoji}
              isSelected={selectedInterest === interest.name}
              onClick={() => setSelectedInterest(interest.name)}
            />
          ))}
        </div>

        {/* Status Tabs */}
        <Tabs
          tabs={[
            { id: "ALL", label: "ALL EVENTS", badge: MOCK_ACTIVITIES.length },
            { id: "UPCOMING", label: "UPCOMING ⚡", badge: MOCK_ACTIVITIES.filter((a) => a.status === "UPCOMING").length },
            { id: "LIVE_NOW", label: "LIVE NOW 🔥", badge: MOCK_ACTIVITIES.filter((a) => a.status === "LIVE_NOW").length },
            { id: "SPOTS_FULL", label: "SPOTS FULL ⛔", badge: MOCK_ACTIVITIES.filter((a) => a.status === "SPOTS_FULL").length },
          ]}
          activeTab={statusTab}
          onChange={setStatusTab}
          variant="pink"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((act) => (
          <ActivityCard key={act.id} activity={act} />
        ))}
      </div>
    </div>
  );
}
