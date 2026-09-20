"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Toast } from "@/components/ui/Toast";
import { ApiError, communitiesApi } from "@/lib/api";
import { Sparkles, CheckCircle2, Edit3, MapPin, Calendar, Users, Flame, ArrowRight, Wand2 } from "lucide-react";

export default function CreatePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("activity");
  const [showToast, setShowToast] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [communityCategory, setCommunityCategory] = useState("Sports");
  const [communityLocation, setCommunityLocation] = useState("Hyderabad");
  const [communityVisibility, setCommunityVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [communityError, setCommunityError] = useState<string | null>(null);
  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") === "community") {
      setActiveTab("community");
    }
  }, []);

  // Natural Language AI Prompt
  const [naturalPrompt, setNaturalPrompt] = useState(
    "I want to play football this Sunday morning near Kompally with around 10 people."
  );

  // Mock AI Interpreted State
  const [parsedData, setParsedData] = useState({
    type: "Activity",
    category: "Football",
    date: "Sunday (Sep 27)",
    time: "Morning (7:00 AM)",
    location: "Kompally (Striker Turf)",
    players: "10 Players (7v7)",
    fee: "₹150 / player",
  });

  const [isEditingParsed, setIsEditingParsed] = useState(false);

  const handleSimulateAI = () => {
    if (!naturalPrompt.trim()) return;

    if (naturalPrompt.toLowerCase().includes("badminton")) {
      setParsedData({
        type: "Activity",
        category: "Badminton",
        date: "Saturday",
        time: "Evening (5:00 PM)",
        location: "Gachibowli Academy",
        players: "8 Players (Doubles)",
        fee: "₹200 / player",
      });
    } else if (naturalPrompt.toLowerCase().includes("code") || naturalPrompt.toLowerCase().includes("dev")) {
      setParsedData({
        type: "Activity",
        category: "Coding & Dev",
        date: "Saturday",
        time: "Afternoon (4:00 PM)",
        location: "Third Wave Coffee Madhapur",
        players: "10 Developers",
        fee: "Free",
      });
    } else {
      setParsedData({
        type: "Activity",
        category: "Football",
        date: "Sunday (Sep 27)",
        time: "Morning (7:00 AM)",
        location: "Kompally (Striker Turf)",
        players: "~10 Players",
        fee: "₹150 / player",
      });
    }
  };

  const handleConfirmLaunch = () => {
    setShowToast(true);
    setTimeout(() => {
      router.push("/activities/act-1");
    }, 1500);
  };

  const handleCreateCommunity = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCommunityError(null);
    setIsCreatingCommunity(true);
    try {
      const community = await communitiesApi.create({
        name: communityName.trim(),
        description: communityDescription.trim(),
        category: communityCategory,
        location: communityLocation.trim(),
        visibility: communityVisibility,
      });
      router.push(`/communities/${community.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push("/login?from=/create?tab=community");
      } else {
        setCommunityError(err instanceof ApiError ? err.message : "Unable to create your community.");
      }
    } finally {
      setIsCreatingCommunity(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50">
          <Toast
            type="success"
            title="ACTIVITY CONFIRMED & PUBLISHED! ⚡"
            message="Your AI-parsed activity is now live for nearby Kompally players."
          />
        </div>
      )}

      {/* Header */}
      <div className="bg-neo-pink text-white border-4 border-black p-6 brutal-shadow-lg space-y-2">
        <div className="inline-flex items-center gap-1 bg-black text-neo-yellow px-2.5 py-0.5 text-xs font-black uppercase">
          <Wand2 className="w-4 h-4 text-neo-pink" />
          <span>AI-POWERED CREATION ENGINE</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          DESCRIBE WHAT YOU WANT TO DO NATURALLY!
        </h1>
        <p className="text-xs font-bold text-white/90">
          Type your idea in plain English. Melt AI Sensei extracts the time, venue, category, and squad size automatically.
        </p>
      </div>

      {/* Modes */}
      <Tabs
        tabs={[
          { id: "activity", label: "CREATE ACTIVITY ⚡", icon: <Flame className="w-4 h-4" /> },
          { id: "community", label: "CREATE COMMUNITY TRIBE ⛩️", icon: <Users className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="yellow"
      />

      {activeTab === "community" ? (
        <form onSubmit={handleCreateCommunity} className="bg-white border-4 border-black p-6 brutal-shadow-xl space-y-5">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">START YOUR COMMUNITY TRIBE</h2>
            <p className="text-xs font-bold text-black/60 mt-1">Create the place where your real-world people find each other.</p>
          </div>

          {communityError && <div className="bg-neo-pink/10 border-3 border-neo-pink p-3 text-xs font-black text-neo-pink uppercase">{communityError}</div>}

          <label className="block">
            <span className="block text-xs font-black uppercase mb-1.5">COMMUNITY NAME</span>
            <Input value={communityName} onChange={(event) => setCommunityName(event.target.value)} required minLength={2} maxLength={120} placeholder="e.g. Kompally Football Crew" />
          </label>
          <label className="block">
            <span className="block text-xs font-black uppercase mb-1.5">DESCRIPTION</span>
            <textarea value={communityDescription} onChange={(event) => setCommunityDescription(event.target.value)} required maxLength={2000} rows={4} placeholder="What brings this tribe together?" className="w-full border-3 border-black px-4 py-3 font-semibold resize-none focus:outline-none focus:bg-neo-yellow/20" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-black uppercase mb-1.5">CATEGORY</span>
              <select value={communityCategory} onChange={(event) => setCommunityCategory(event.target.value)} className="w-full border-3 border-black px-4 py-3 font-bold bg-white focus:outline-none focus:bg-neo-yellow/20">
                <option>Sports</option><option>Gaming</option><option>Tech</option><option>Outdoors</option><option>Creative</option><option>Social</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-black uppercase mb-1.5">AREA / LOCATION</span>
              <Input value={communityLocation} onChange={(event) => setCommunityLocation(event.target.value)} required maxLength={150} placeholder="e.g. Kompally, Hyderabad" />
            </label>
          </div>
          <label className="block">
            <span className="block text-xs font-black uppercase mb-1.5">VISIBILITY</span>
            <select value={communityVisibility} onChange={(event) => setCommunityVisibility(event.target.value as "PUBLIC" | "PRIVATE")} className="w-full border-3 border-black px-4 py-3 font-bold bg-white focus:outline-none focus:bg-neo-cyan/20">
              <option value="PUBLIC">PUBLIC - Anyone can discover and join</option>
              <option value="PRIVATE">PRIVATE - Membership is restricted</option>
            </select>
          </label>
          <Button type="submit" variant="pink" size="lg" disabled={isCreatingCommunity} leftIcon={<Users className="w-5 h-5" />}>
            {isCreatingCommunity ? "CREATING TRIBE..." : "CREATE COMMUNITY ⚡"}
          </Button>
        </form>
      ) : (
      /* Natural Language Prompt Input */
      <div className="bg-white border-4 border-black p-6 brutal-shadow-xl space-y-4">
        <label className="block text-xs uppercase font-black text-black flex items-center justify-between">
          <span>NATURAL LANGUAGE CREATION INPUT</span>
          <span className="text-neo-pink font-extrabold text-[10px]">MOCK AI PARSER ENABLED</span>
        </label>

        <div className="relative">
          <textarea
            rows={3}
            value={naturalPrompt}
            onChange={(e) => setNaturalPrompt(e.target.value)}
            placeholder="e.g. 'I want to play football this Sunday morning near Kompally with around 10 people.'"
            className="w-full bg-slate-50 border-3 border-black p-3.5 font-bold text-sm text-black focus:outline-none focus:ring-2 focus:ring-neo-yellow brutal-shadow-sm"
          />
          <button
            type="button"
            onClick={handleSimulateAI}
            className="absolute right-3 bottom-3 bg-neo-yellow text-black border-2 border-black px-3 py-1 text-xs font-black uppercase brutal-shadow-sm hover:bg-yellow-300 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-neo-pink" />
            <span>RE-PARSE WITH AI</span>
          </button>
        </div>

        {/* MOCK AI INTERPRETATION CARD */}
        <div className="bg-neo-cyan/15 border-3 border-black p-5 brutal-shadow-md space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <h3 className="font-black text-base uppercase text-black">
                I UNDERSTOOD YOUR REQUEST:
              </h3>
            </div>
            <button
              onClick={() => setIsEditingParsed(!isEditingParsed)}
              className="bg-white border border-black px-2 py-1 text-xs font-black uppercase flex items-center gap-1 hover:bg-slate-100"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isEditingParsed ? "DONE EDITING" : "[ EDIT ]"}</span>
            </button>
          </div>

          {/* Parsed Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white border-2 border-black p-2.5 brutal-shadow-sm">
              <span className="text-[9px] font-black uppercase text-black/50 block">TYPE</span>
              {isEditingParsed ? (
                <input
                  value={parsedData.type}
                  onChange={(e) => setParsedData({ ...parsedData, type: e.target.value })}
                  className="font-black text-xs uppercase border border-black px-1 w-full"
                />
              ) : (
                <span className="font-black text-xs uppercase text-black block">{parsedData.type}</span>
              )}
            </div>

            <div className="bg-white border-2 border-black p-2.5 brutal-shadow-sm">
              <span className="text-[9px] font-black uppercase text-black/50 block">CATEGORY</span>
              {isEditingParsed ? (
                <input
                  value={parsedData.category}
                  onChange={(e) => setParsedData({ ...parsedData, category: e.target.value })}
                  className="font-black text-xs uppercase border border-black px-1 w-full"
                />
              ) : (
                <span className="font-black text-xs uppercase text-black block">{parsedData.category}</span>
              )}
            </div>

            <div className="bg-white border-2 border-black p-2.5 brutal-shadow-sm">
              <span className="text-[9px] font-black uppercase text-black/50 block">DATE</span>
              {isEditingParsed ? (
                <input
                  value={parsedData.date}
                  onChange={(e) => setParsedData({ ...parsedData, date: e.target.value })}
                  className="font-black text-xs uppercase border border-black px-1 w-full"
                />
              ) : (
                <span className="font-black text-xs uppercase text-black block">{parsedData.date}</span>
              )}
            </div>

            <div className="bg-white border-2 border-black p-2.5 brutal-shadow-sm">
              <span className="text-[9px] font-black uppercase text-black/50 block">TIME</span>
              {isEditingParsed ? (
                <input
                  value={parsedData.time}
                  onChange={(e) => setParsedData({ ...parsedData, time: e.target.value })}
                  className="font-black text-xs uppercase border border-black px-1 w-full"
                />
              ) : (
                <span className="font-black text-xs uppercase text-black block">{parsedData.time}</span>
              )}
            </div>

            <div className="bg-white border-2 border-black p-2.5 brutal-shadow-sm">
              <span className="text-[9px] font-black uppercase text-black/50 block">LOCATION</span>
              {isEditingParsed ? (
                <input
                  value={parsedData.location}
                  onChange={(e) => setParsedData({ ...parsedData, location: e.target.value })}
                  className="font-black text-xs uppercase border border-black px-1 w-full"
                />
              ) : (
                <span className="font-black text-xs uppercase text-black block">{parsedData.location}</span>
              )}
            </div>

            <div className="bg-white border-2 border-black p-2.5 brutal-shadow-sm">
              <span className="text-[9px] font-black uppercase text-black/50 block">PLAYERS</span>
              {isEditingParsed ? (
                <input
                  value={parsedData.players}
                  onChange={(e) => setParsedData({ ...parsedData, players: e.target.value })}
                  className="font-black text-xs uppercase border border-black px-1 w-full"
                />
              ) : (
                <span className="font-black text-xs uppercase text-black block">{parsedData.players}</span>
              )}
            </div>
          </div>

          {/* Action Buttons: EDIT vs CONFIRM */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsEditingParsed(!isEditingParsed)}
            >
              {isEditingParsed ? "SAVE EDITS" : "[ EDIT FIELDS ]"}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleConfirmLaunch}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              [ CONFIRM & PUBLISH ]
            </Button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
