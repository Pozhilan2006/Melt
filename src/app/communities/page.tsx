"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";
import { Tag } from "@/components/ui/Tag";
import { CommunityCard } from "@/components/product/CommunityCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ApiError, ApiCommunity, communitiesApi } from "@/lib/api";
import { MOCK_INTERESTS } from "@/data/mockData";
import { Users, Plus } from "lucide-react";

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [communities, setCommunities] = useState<ApiCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    communitiesApi
      .list({ search, category: selectedCat })
      .then((data) => {
        if (!cancelled) setCommunities(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Unable to load communities right now.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [search, selectedCat, retryKey]);

  const categories = Array.from(new Set(MOCK_INTERESTS.map((interest) => interest.category)));

  return (
    <div className="space-y-6">
      <div className="bg-neo-purple text-white border-4 border-black p-6 brutal-shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 bg-black text-neo-yellow px-2 py-0.5 text-xs font-black uppercase mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>COMMUNITY TRIBES</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">JOIN LOCAL COMMUNITY TRIBES</h1>
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

      <div className="space-y-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search community tribes..." />
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Tag label="ALL CATEGORIES" isSelected={selectedCat === "ALL"} onClick={() => setSelectedCat("ALL")} />
          {categories.map((category) => (
            <Tag key={category} label={category} isSelected={selectedCat === category} onClick={() => setSelectedCat(category)} />
          ))}
        </div>
      </div>

      {isLoading && <LoadingState type="card" count={4} />}
      {!isLoading && error && <ErrorState message={error} onRetry={() => setRetryKey((value) => value + 1)} />}
      {!isLoading && !error && communities.length === 0 && (
        <EmptyState
          title={search ? "NO COMMUNITIES FOUND" : "NO COMMUNITIES YET"}
          description={search ? "Try another search." : "Be the first to create a community tribe."}
          actionLabel="CREATE COMMUNITY"
          onAction={() => { window.location.href = "/create?tab=community"; }}
        />
      )}
      {!isLoading && !error && communities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}
    </div>
  );
}
