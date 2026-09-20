"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ApiCommunity, ApiCommunityMember, ApiError, communitiesApi } from "@/lib/api";
import { ArrowLeft, CheckCircle, MapPin, Shield, Users } from "lucide-react";

export default function CommunityDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [community, setCommunity] = useState<ApiCommunity | null>(null);
  const [members, setMembers] = useState<ApiCommunityMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCommunity = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await communitiesApi.get(params.id);
      setCommunity(data);
      setMembers(data.members);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to load this community.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCommunity();
  }, [params.id]);

  const handleMembership = async () => {
    if (!community) return;
    setIsMutating(true);
    setError(null);
    try {
      const updated = community.membership?.is_member
        ? await communitiesApi.leave(community.id)
        : await communitiesApi.join(community.id);
      setCommunity(updated);
      setMembers(updated.members);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push(`/login?from=/communities/${community.id}`);
      } else {
        setError(err instanceof ApiError ? err.message : "Unable to update membership.");
      }
    } finally {
      setIsMutating(false);
    }
  };

  if (isLoading) {
    return <LoadingState type="detail" message="LOADING YOUR TRIBE..." />;
  }

  if (error && !community) {
    return <ErrorState message={error} onRetry={loadCommunity} />;
  }

  if (!community) return null;

  const isAdmin = community.membership?.role === "ADMIN";
  const isMember = community.membership?.is_member === true;
  const lead = community.lead_user;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/communities" className="inline-flex items-center gap-1 text-xs font-black uppercase text-black hover:text-neo-pink">
          <ArrowLeft className="w-4 h-4" /> BACK TO TRIBES
        </Link>
        <span className="text-xs font-black uppercase bg-white border-2 border-black px-2 py-1">
          {community.visibility} COMMUNITY
        </span>
      </div>

      <div className="border-4 border-black bg-white brutal-shadow-xl overflow-hidden">
        <div className={`h-40 ${community.banner_bg ?? "bg-neo-yellow"} border-b-4 border-black relative p-4 flex items-start justify-between`}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="dark" size="md">{community.category}</Badge>
            <Badge variant="pink" size="md">{community.activity_status}</Badge>
            {community.is_verified && <Badge variant="cyan" size="md"><CheckCircle className="w-3.5 h-3.5" /> VERIFIED</Badge>}
          </div>
          <span className="text-7xl select-none font-black opacity-30 transform rotate-12">{community.anime_mascot}</span>
        </div>

        <div className="px-6 -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10 relative pb-6 border-b-3 border-black">
          <div className="flex items-end gap-4">
            <Avatar
              src={lead?.profile_image ?? undefined}
              fallback={(lead?.name ?? community.name).slice(0, 2)}
              animeSticker={community.anime_mascot ?? "⚡"}
              size="xl"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">{community.name}</h1>
              <p className="text-xs sm:text-sm font-bold text-black/80">{community.tagline ?? community.description}</p>
            </div>
          </div>

          <Button
            variant={isAdmin ? "primary" : isMember ? "green" : "pink"}
            size="lg"
            onClick={handleMembership}
            disabled={isAdmin || isMutating}
          >
            {isAdmin ? "ADMIN OF TRIBE ⚡" : isMember ? "LEAVE COMMUNITY" : "JOIN COMMUNITY TRIBE"}
          </Button>
        </div>

        <div className="bg-slate-50 p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-center border-b-3 border-black">
          <div>
            <span className="block text-xl font-black text-black">{community.member_count}</span>
            <span className="text-[10px] font-black uppercase text-black/60">TOTAL MEMBERS</span>
          </div>
          <div className="border-l-2 sm:border-x-2 border-black/20">
            <span className="block text-xl font-black text-neo-pink">{community.membership?.role ?? "VISITOR"}</span>
            <span className="text-[10px] font-black uppercase text-black/60">YOUR ROLE</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block text-xl font-black text-black truncate">{community.location}</span>
            <span className="text-[10px] font-black uppercase text-black/60">HOME BASE</span>
          </div>
        </div>
      </div>

      {error && <ErrorState message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border-3 border-black p-6 brutal-shadow space-y-4">
          <h3 className="text-lg font-black uppercase text-black border-b-2 border-black pb-1">ABOUT THIS TRIBE</h3>
          <p className="text-sm font-semibold text-black/80 leading-relaxed">{community.description ?? "A new community ready to meet in the real world."}</p>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-black/70">
            <MapPin className="w-4 h-4 text-neo-pink" /> {community.location}
          </div>
        </div>

        <div className="bg-neo-cyan/20 border-3 border-black p-5 brutal-shadow space-y-3">
          <h4 className="font-black text-sm uppercase text-black flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-neo-purple" /> TRIBE ADMIN
          </h4>
          {lead ? (
            <div className="bg-white border-2 border-black p-3 flex items-center gap-3 brutal-shadow-sm">
              <Avatar src={lead.profile_image ?? undefined} fallback={lead.name.slice(0, 2)} size="md" />
              <div>
                <p className="text-sm font-black uppercase">{lead.name}</p>
                <p className="text-xs font-bold text-black/60">@{lead.username}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs font-bold">Admin profile unavailable.</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between border-b-2 border-black pb-1">
          <h3 className="text-lg font-black uppercase text-black flex items-center gap-2"><Users className="w-5 h-5 text-neo-pink" /> MEMBER SQUAD</h3>
          <span className="text-xs font-black uppercase bg-neo-yellow text-black border border-black px-2 py-0.5">{community.member_count} MEMBERS</span>
        </div>
        {members.length === 0 ? (
          <div className="bg-white border-3 border-dashed border-black p-6 text-center text-sm font-bold">No members yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div key={member.id} className="bg-white border-3 border-black p-4 brutal-shadow-sm flex items-center gap-3">
                <Avatar src={member.profile_image ?? undefined} fallback={member.name.slice(0, 2)} size="md" />
                <div className="min-w-0">
                  <p className="font-black text-sm uppercase truncate">{member.name}</p>
                  <p className="text-xs font-bold text-black/60 truncate">@{member.username}</p>
                  <Badge variant={member.role === "ADMIN" ? "pink" : "yellow"} size="sm">{member.role}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
