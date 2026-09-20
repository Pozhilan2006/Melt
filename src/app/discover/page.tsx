"use client";

import React, { useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { ActivityCard } from "@/components/product/ActivityCard";
import { CommunityCard } from "@/components/product/CommunityCard";
import { UserCard } from "@/components/product/UserCard";
import { MapView } from "@/components/product/MapView";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_ACTIVITIES, MOCK_COMMUNITIES, MOCK_USERS, MOCK_INTERESTS } from "@/data/mockData";
import { Compass, MapPin, Sliders, Layers, Map as MapIcon, ListFilter, Sparkles } from "lucide-react";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRadius, setSelectedRadius] = useState(10);
  const [selectedInterest, setSelectedInterest] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL");

  const exampleSearches = [
    "Find football players near me",
    "Weekend badminton",
    "Photography walks",
    "Coffee & Code Madhapur",
  ];

  // Filters logic
  const filteredActivities = MOCK_ACTIVITIES.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.location.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRadius = act.location.distanceKm <= selectedRadius;
    const matchesInterest =
      selectedInterest === "ALL" || act.interest.name === selectedInterest;
    return matchesSearch && matchesRadius && matchesInterest;
  });

  const filteredCommunities = MOCK_COMMUNITIES.filter((comm) => {
    const matchesSearch =
      comm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredUsers = MOCK_USERS.filter((usr) => {
    const matchesSearch =
      usr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usr.handle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Title & View Toggle */}
      <div className="bg-neo-cyan border-4 border-black p-6 brutal-shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-black text-neo-yellow px-2.5 py-0.5 text-xs font-black uppercase mb-1">
            <Compass className="w-4 h-4" />
            <span>PRIMARY DISCOVERY HUB</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">
            EXPLORE ACTIVITIES & TRIBES NEARBY
          </h1>
          <p className="text-xs font-bold text-black/80">
            Search naturally or view exact location pinpoints on our mock radar map.
          </p>
        </div>

        {/* View Mode Toggle: LIST vs MAP */}
        <div className="flex items-center gap-2 bg-white border-3 border-black p-1.5 brutal-shadow-sm self-start md:self-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 text-xs font-black uppercase flex items-center gap-1.5 border-2 ${
              viewMode === "list"
                ? "bg-black text-neo-yellow border-black brutal-shadow-sm"
                : "bg-white text-black border-transparent hover:bg-slate-100"
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>LIST VIEW</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-3 py-1.5 text-xs font-black uppercase flex items-center gap-1.5 border-2 ${
              viewMode === "map"
                ? "bg-neo-pink text-white border-black brutal-shadow-sm"
                : "bg-white text-black border-transparent hover:bg-slate-100"
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>MAP RADAR</span>
          </button>
        </div>
      </div>

      {/* Prominent Search Bar & Example Chips */}
      <div className="space-y-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Try searching 'Find football players near me' or 'Weekend badminton'..."
        />

        {/* Example Chip suggestions */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-black uppercase text-black/60 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-neo-pink" /> TRY SEARCHING:
          </span>
          {exampleSearches.map((chip) => (
            <button
              key={chip}
              onClick={() => setSearchQuery(chip)}
              className="text-xs font-extrabold bg-white border border-black px-2.5 py-1 brutal-shadow-sm hover:bg-neo-yellow transition-all"
            >
              "{chip}"
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar: Distance + Time Filter */}
      <div className="bg-slate-50 border-3 border-black p-4 brutal-shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Distance Selector */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-neo-pink" />
          <span className="text-xs font-black uppercase text-black">RADIUS:</span>
          <div className="flex gap-1">
            {[2, 5, 10, 20].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRadius(r)}
                className={`px-2.5 py-1 text-xs font-black border-2 ${
                  selectedRadius === r
                    ? "bg-black text-neo-yellow border-black"
                    : "bg-white text-black border-black hover:bg-slate-100"
                }`}
              >
                {r}KM
              </button>
            ))}
          </div>
        </div>

        {/* Time / Day Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-black">WHEN:</span>
          <div className="flex gap-1">
            {["ALL", "TODAY", "THIS WEEKEND"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-2.5 py-1 text-xs font-black border-2 ${
                  timeFilter === t
                    ? "bg-neo-yellow text-black border-black"
                    : "bg-white text-black border-black hover:bg-slate-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tag Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Tag
          label="⚡ ALL CATEGORIES"
          isSelected={selectedInterest === "ALL"}
          onClick={() => setSelectedInterest("ALL")}
        />
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

      {/* MAP VIEW vs LIST VIEW RENDER */}
      {viewMode === "map" ? (
        <MapView
          activities={filteredActivities}
          communities={filteredCommunities}
          selectedRadiusKm={selectedRadius}
        />
      ) : (
        /* LIST VIEW */
        <div className="space-y-6">
          <Tabs
            tabs={[
              { id: "all", label: "ALL RESULTS", badge: filteredActivities.length + filteredCommunities.length },
              { id: "activities", label: "ACTIVITIES", badge: filteredActivities.length },
              { id: "communities", label: "TRIBES", badge: filteredCommunities.length },
              { id: "people", label: "PEOPLE NEARBY", badge: filteredUsers.length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="yellow"
          />

          {activeTab === "all" && (
            <div className="space-y-8">
              {/* Activities */}
              <div className="space-y-3">
                <h2 className="text-lg font-black uppercase tracking-tight text-black border-b-2 border-black pb-1">
                  ⚡ NEARBY ACTIVITIES ({filteredActivities.length})
                </h2>
                {filteredActivities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredActivities.map((act) => (
                      <ActivityCard key={act.id} activity={act} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="NO ACTIVITIES FOUND"
                    description="Nothing matching your query yet. Be the first to host one!"
                    actionLabel="HOST AN ACTIVITY"
                    onAction={() => (window.location.href = "/create")}
                  />
                )}
              </div>

              {/* Communities */}
              <div className="space-y-3 pt-4">
                <h2 className="text-lg font-black uppercase tracking-tight text-black border-b-2 border-black pb-1">
                  ⛩️ COMMUNITY TRIBES ({filteredCommunities.length})
                </h2>
                {filteredCommunities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCommunities.map((comm) => (
                      <CommunityCard key={comm.id} community={comm} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="NO TRIBES FOUND"
                    description="Your tribe might be the first one in this category!"
                    actionLabel="CREATE A TRIBE"
                    onAction={() => (window.location.href = "/create?tab=community")}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "activities" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((act) => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          )}

          {activeTab === "communities" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCommunities.map((comm) => (
                <CommunityCard key={comm.id} community={comm} />
              ))}
            </div>
          )}

          {activeTab === "people" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((usr) => (
                <UserCard key={usr.id} user={usr} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
