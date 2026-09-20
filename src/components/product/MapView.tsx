"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, Community } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LocationBadge, DistanceBadge } from "./LocationBadge";
import { MapPin, Navigation, Compass, Flame, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MapViewProps {
  activities: Activity[];
  communities: Community[];
  selectedRadiusKm?: number;
}

export const MapView: React.FC<MapViewProps> = ({
  activities,
  communities,
  selectedRadiusKm = 10,
}) => {
  const [selectedPin, setSelectedPin] = useState<Activity | Community | null>(activities[0] || null);

  // Helper to map coordinates into percentage positions on visual map board
  const pins = [
    { item: activities[0], x: 30, y: 35, type: "activity" }, // Kompally Football
    { item: activities[1], x: 70, y: 65, type: "activity" }, // Gachibowli Badminton
    { item: activities[2], x: 62, y: 55, type: "activity" }, // Madhapur Code
    { item: activities[3], x: 20, y: 80, type: "activity" }, // Vikarabad Trek
    { item: activities[4], x: 38, y: 30, type: "activity" }, // Kompally Run
    { item: communities[0], x: 34, y: 40, type: "community" }, // Football Tribe
    { item: communities[1], x: 66, y: 60, type: "community" }, // Dev Tribe
  ];

  return (
    <div className="border-4 border-black bg-white brutal-shadow-xl relative overflow-hidden h-[520px] flex flex-col justify-between">
      {/* Top Map Toolbar */}
      <div className="bg-neo-yellow border-b-4 border-black p-3.5 flex items-center justify-between z-20 brutal-shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-black text-neo-yellow border border-black font-black">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-black tracking-wide leading-tight">
              HYDERABAD REAL-TIME RADAR MAP
            </h3>
            <span className="text-[10px] font-bold text-black/70">
              Showing pins within {selectedRadiusKm}KM radius around Kompally
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="pink" size="sm">
            ⚡ {activities.length} ACTIVITIES
          </Badge>
          <Badge variant="cyan" size="sm">
            ⛩️ {communities.length} TRIBES
          </Badge>
        </div>
      </div>

      {/* Visual Map Canvas Grid */}
      <div className="relative flex-1 bg-slate-100 bg-brutal-grid overflow-hidden select-none">
        {/* Distance Radius Rings around Center User (Kompally) */}
        <div className="absolute left-[32%] top-[35%] w-72 h-72 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-neo-pink/60 rounded-full pointer-events-none flex items-center justify-center">
          <span className="text-[9px] font-black text-neo-pink uppercase bg-white/90 border border-black px-1 -top-3 absolute">
            5 KM RADAR
          </span>
        </div>
        <div className="absolute left-[32%] top-[35%] w-[480px] h-[480px] -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-neo-purple/40 rounded-full pointer-events-none flex items-center justify-center">
          <span className="text-[9px] font-black text-neo-purple uppercase bg-white/90 border border-black px-1 -top-3 absolute">
            15 KM RADAR
          </span>
        </div>

        {/* User Location Radar Core */}
        <div className="absolute left-[32%] top-[35%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-8 h-8 bg-neo-pink text-white border-3 border-black font-black text-xs flex items-center justify-center brutal-shadow-sm animate-pulse">
            📍 YOU
          </div>
          <span className="text-[10px] font-black uppercase bg-black text-neo-yellow px-1.5 py-0.5 border border-black mt-1">
            Kompally Hub
          </span>
        </div>

        {/* Map Landmark Labels */}
        <div className="absolute left-[70%] top-[65%] text-[10px] font-black uppercase bg-white/80 border border-black px-1.5 py-0.5 text-black/70 pointer-events-none">
          🏙️ Gachibowli Belt
        </div>
        <div className="absolute left-[62%] top-[50%] text-[10px] font-black uppercase bg-white/80 border border-black px-1.5 py-0.5 text-black/70 pointer-events-none">
          ☕ Madhapur Hub
        </div>
        <div className="absolute left-[15%] top-[82%] text-[10px] font-black uppercase bg-white/80 border border-black px-1.5 py-0.5 text-black/70 pointer-events-none">
          🌲 Vikarabad Trails
        </div>

        {/* Interactive Pin Markers */}
        {pins.map((pin, idx) => {
          const item = pin.item;
          if (!item) return null;
          const isSelected = selectedPin?.id === item.id;
          const isActivity = pin.type === "activity";
          const act = item as Activity;
          const comm = item as Community;

          return (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => setSelectedPin(item)}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-200 group focus:outline-none",
                isSelected ? "scale-125 z-30" : "hover:scale-110"
              )}
            >
              <div
                className={cn(
                  "p-1.5 border-3 border-black text-base font-black flex items-center justify-center brutal-shadow-sm select-none",
                  isActivity
                    ? "bg-neo-yellow text-black rotate-[-3deg]"
                    : "bg-neo-cyan text-black rotate-[3deg]",
                  isSelected ? "ring-4 ring-neo-pink bg-neo-pink text-white" : ""
                )}
              >
                {isActivity ? act.animeSticker || "⚽" : comm.animeMascot || "⛩️"}
              </div>

              {/* Pin Label Tooltip */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black text-white text-[9px] font-black uppercase px-1.5 py-0.5 whitespace-nowrap border border-black pointer-events-none">
                {isActivity ? act.title : comm.name}
              </span>
            </button>
          );
        })}

        {/* Selected Pin Details Overlay Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-30 bg-white border-4 border-black p-4 brutal-shadow-xl animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between border-b-2 border-black pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                {"dateTime" in selectedPin ? (
                  <Badge variant="pink" size="sm">
                    ⚡ ACTIVITY
                  </Badge>
                ) : (
                  <Badge variant="cyan" size="sm">
                    ⛩️ TRIBE
                  </Badge>
                )}
                <span className="text-xl">{ "animeSticker" in selectedPin ? selectedPin.animeSticker : selectedPin.animeMascot }</span>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="p-1 hover:bg-slate-100 text-black border border-black"
                aria-label="Close pin preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="font-black text-base uppercase text-black leading-tight line-clamp-1">
              {"title" in selectedPin ? selectedPin.title : selectedPin.name}
            </h4>

            <p className="text-xs font-semibold text-black/70 line-clamp-2 mt-1">
              {"description" in selectedPin ? selectedPin.description : selectedPin.tagline}
            </p>

            <div className="flex items-center justify-between mt-3 pt-2 border-t-2 border-dashed border-black/20">
              <span className="text-xs font-bold text-black flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neo-pink" />
                {"location" in selectedPin && typeof selectedPin.location === "object"
                  ? `${selectedPin.location.name}, ${selectedPin.location.area}`
                  : (selectedPin.location as string)}
              </span>

              <Link
                href={
                  "dateTime" in selectedPin
                    ? `/activities/${selectedPin.id}`
                    : `/communities/${selectedPin.id}`
                }
              >
                <Button variant="primary" size="sm">
                  VIEW DETAILS
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Bar */}
      <div className="bg-slate-50 border-t-3 border-black p-2.5 flex items-center justify-between text-xs font-bold text-black/80 z-20">
        <span className="flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5 text-neo-pink" />
          Click any pin on the radar map to view match details & join squad.
        </span>
        <span className="text-[10px] uppercase font-black bg-neo-yellow text-black px-2 py-0.5 border border-black">
          MOCK RADAR SYSTEM
        </span>
      </div>
    </div>
  );
};
