"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";
import { Tag } from "@/components/ui/Tag";
import { CommunityCard } from "@/components/product/CommunityCard";
import { Button } from "@/components/ui/Button";
import { MOCK_COMMUNITIES, MOCK_INTERESTS } from "@/data/mockData";
import { Users, Plus, ShieldCheck } from "lucide-react";

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");

  const filtered = MOCK_COMMUNITIES.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tagline.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === "ALL" || c.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-neo-purple text-white border-4 border-black p-6 brutal-shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 bg-black text-neo-yellow px-2 py-0.5 text-xs font-black uppercase mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>COMMUNITY TRIBES</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            JOIN LOCAL COMMUNITY TRIBES
          </h1>
          <p className="text-xs font-bold text-white/90">
            Find your tribe for sports, gaming, tech, trekking, and music in Hyderabad.
          </p>
        </div>

        <Link href="/create?tab=community">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4 stroke-[3]" />}>
            START A TRIBE
          </Button>
        </Link>
      </div>

      {/* Filter controls */}
      <div className="space-y-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search community tribes..." />
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Tag label="ALL CATEGORIES" isSelected={selectedCat === "ALL"} onClick={() => setSelectedCat("ALL")} />
          {Array.from(new Set(MOCK_INTERESTS.map((i) => i.category))).map((cat) => (
            <Tag key={cat} label={cat} isSelected={selectedCat === cat} onClick={() => setSelectedCat(cat)} />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((comm) => (
          <CommunityCard key={comm.id} community={comm} />
        ))}
      </div>
    </div>
  );
}
