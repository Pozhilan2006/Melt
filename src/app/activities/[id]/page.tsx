"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_ACTIVITIES, MOCK_USERS } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { ActivityStatus } from "@/components/product/ActivityStatus";
import { LocationBadge, DistanceBadge } from "@/components/product/LocationBadge";
import { JoinButton } from "@/components/product/JoinButton";
import { ParticipantCount } from "@/components/product/ParticipantCount";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, ShieldCheck, Flame, ArrowLeft, Share2, CheckCircle2, DollarSign, UserPlus, Users } from "lucide-react";

export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const activity = MOCK_ACTIVITIES.find((a) => a.id === params.id) || MOCK_ACTIVITIES[0];
  const spotsLeft = activity.maxParticipants - activity.currentParticipants.length;

  // Build full slots array (joined users + open empty slots)
  const openSlotsCount = Math.max(0, activity.maxParticipants - activity.currentParticipants.length - (isJoined ? 1 : 0));
  const openSlotsArray = Array.from({ length: openSlotsCount });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button & header bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/activities"
          className="inline-flex items-center gap-1 text-xs font-black uppercase text-black hover:text-neo-pink"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO ACTIVITIES
        </Link>
        <button
          onClick={() => alert("Activity link copied to clipboard!")}
          className="bg-white border-2 border-black p-1.5 brutal-shadow-sm text-xs font-black uppercase flex items-center gap-1 hover:bg-slate-100"
        >
          <Share2 className="w-3.5 h-3.5" /> SHARE ACTIVITY
        </button>
      </div>

      {/* Main Activity Header Card */}
      <div className="border-4 border-black bg-white brutal-shadow-xl overflow-hidden">
        {/* Banner Top */}
        <div className={`p-6 ${activity.bannerBg} border-b-4 border-black relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
          <div className="space-y-2 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <ActivityStatus status={activity.status} />
              <Badge variant="dark" size="sm">
                {activity.interest.name}
              </Badge>
              <DistanceBadge distanceKm={activity.location.distanceKm} />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black leading-tight">
              {activity.title}
            </h1>
          </div>

          <div className="text-6xl font-black select-none transform rotate-12 bg-white border-3 border-black p-2 brutal-shadow shrink-0">
            {activity.animeSticker}
          </div>
        </div>

        {/* Content & Action Bar */}
        <div className="p-6 space-y-6">
          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 border-3 border-black p-4 brutal-shadow-sm text-center">
            <div>
              <span className="text-[10px] font-black uppercase text-black/60 block">WHEN</span>
              <span className="text-xs font-black text-black block mt-0.5">{formatDate(activity.dateTime)}</span>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l-2 border-black/20 pt-2 sm:pt-0">
              <span className="text-[10px] font-black uppercase text-black/60 block">WHERE</span>
              <span className="text-xs font-black text-black block mt-0.5">{activity.location.name}, {activity.location.area}</span>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l-2 border-black/20 pt-2 sm:pt-0">
              <span className="text-[10px] font-black uppercase text-black/60 block">SLOTS LOCKED</span>
              <span className="text-sm font-black text-neo-pink block mt-0.5">
                {activity.currentParticipants.length + (isJoined ? 1 : 0)} / {activity.maxParticipants} PLAYERS
              </span>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l-2 border-black/20 pt-2 sm:pt-0">
              <span className="text-[10px] font-black uppercase text-black/60 block">ENTRY / FEE</span>
              <span className="text-xs font-black text-black block mt-0.5">{activity.entryFee || "FREE"}</span>
            </div>
          </div>

          {/* Activity Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-black uppercase text-black border-b-2 border-black pb-1">
              ABOUT THIS ACTIVITY
            </h3>
            <p className="text-sm font-semibold text-black/80 leading-relaxed">
              {activity.description}
            </p>
          </div>

          {/* Rules */}
          {activity.rules && (
            <div className="bg-neo-cyan/15 border-3 border-black p-4 brutal-shadow-sm space-y-2">
              <h4 className="font-black text-sm uppercase text-black flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-neo-purple" /> GROUND RULES & CODE OF CONDUCT
              </h4>
              <ul className="text-xs font-bold space-y-1 list-disc pl-4 text-black/80">
                {activity.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {/* PROMINENT PARTICIPANT SECTION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b-2 border-black pb-1">
              <h3 className="text-lg font-black uppercase text-black flex items-center gap-2">
                <Users className="w-5 h-5 text-neo-pink" />
                <span>PLAYER ROSTER & OPEN SLOTS</span>
              </h3>
              <span className="text-xs font-black uppercase bg-neo-yellow text-black border border-black px-2 py-0.5">
                {spotsLeft} SPOTS OPEN
              </span>
            </div>

            {/* Visual Roster Grid with Filled slots + Open slot buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {/* Confirmed Joined Users */}
              {activity.currentParticipants.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border-3 border-black p-3 brutal-shadow-sm flex flex-col items-center text-center space-y-1"
                >
                  <Avatar src={user.avatar} fallback={user.name.slice(0, 2)} animeSticker={user.animeAvatar} size="md" />
                  <span className="text-xs font-black uppercase block truncate max-w-full">{user.name}</span>
                  <Badge variant="dark" size="sm">{user.badge}</Badge>
                </div>
              ))}

              {/* Current user if joined */}
              {isJoined && (
                <div className="bg-neo-green/30 border-3 border-black p-3 brutal-shadow-sm flex flex-col items-center text-center space-y-1">
                  <Avatar fallback="⚡" animeSticker="⚡" size="md" />
                  <span className="text-xs font-black uppercase block text-black">POZHILAN (YOU)</span>
                  <Badge variant="green" size="sm">LOCKED ⚡</Badge>
                </div>
              )}

              {/* Open Slots Waiting for Join */}
              {openSlotsArray.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsJoined(true);
                    setIsConfirmModalOpen(true);
                  }}
                  className="bg-slate-50 border-3 border-dashed border-black/40 p-3 flex flex-col items-center justify-center text-center space-y-1.5 hover:bg-neo-yellow/30 hover:border-black transition-all group"
                >
                  <div className="w-9 h-9 rounded-full border-2 border-dashed border-black/50 text-black/40 flex items-center justify-center font-black group-hover:bg-black group-hover:text-neo-yellow group-hover:border-black">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-black/60 group-hover:text-black">
                    OPEN SLOT #{activity.currentParticipants.length + (isJoined ? 1 : 0) + idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Strong Primary Join CTA Footer */}
          <div className="bg-neo-yellow border-4 border-black p-5 flex flex-col sm:flex-row items-center justify-between gap-4 brutal-shadow-lg mt-6">
            <div>
              <span className="text-xs font-black uppercase block text-black">READY TO PARTICIPATE?</span>
              <span className="text-sm font-extrabold text-black/80">
                {spotsLeft} out of {activity.maxParticipants} spots remaining! Reserve your place now.
              </span>
            </div>

            <JoinButton
              activityId={activity.id}
              isJoinedDefault={isJoined}
              isFull={activity.status === "SPOTS_FULL"}
              onJoinToggle={(joined) => {
                setIsJoined(joined);
                if (joined) setIsConfirmModalOpen(true);
              }}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Host Information Card */}
      <div className="bg-white border-3 border-black p-5 brutal-shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={activity.host.avatar}
            fallback={activity.host.name.slice(0, 2)}
            animeSticker={activity.host.animeAvatar}
            size="lg"
          />
          <div>
            <span className="text-[10px] font-black uppercase text-neo-pink block">ORGANIZED BY</span>
            <h4 className="font-black text-base uppercase text-black">{activity.host.name}</h4>
            <span className="text-xs font-bold text-black/60">{activity.host.bio}</span>
          </div>
        </div>
        <Button variant="outline" size="sm">
          MESSAGE ORGANIZER
        </Button>
      </div>

      {/* Spot Reservation Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="SPOT LOCKED IN! ⚡"
        badgeText="CONFIRMED"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-16 h-16 bg-neo-green border-3 border-black text-black text-3xl font-black flex items-center justify-center mx-auto brutal-shadow">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-black uppercase">YOU ARE ON THE SQUAD ROSTER!</h3>
          <p className="text-xs font-bold text-black/80">
            We reserved your slot for <strong>{activity.title}</strong> at {activity.location.name}. Please arrive 10 minutes prior to match time!
          </p>
          <Button variant="primary" size="md" onClick={() => setIsConfirmModalOpen(false)}>
            GOT IT, SENSEI!
          </Button>
        </div>
      </Modal>
    </div>
  );
}
