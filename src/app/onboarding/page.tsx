"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { userApi, interestsApi, ApiInterest, ApiError } from "@/lib/api";
import {
  Zap, MapPin, Star, ArrowRight, ArrowLeft, CheckCircle2, Search, Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = ["WELCOME", "YOUR INTERESTS", "YOUR LOCATION", "COMPLETE PROFILE"] as const;
type Step = (typeof STEPS)[number];

// ── Interest selection ────────────────────────────────────────────────────────

function InterestGrid({
  interests,
  selected,
  onToggle,
}: {
  interests: ApiInterest[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = interests.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search interests..."
          className="w-full pl-10 pr-4 py-2.5 border-3 border-black text-sm font-semibold focus:outline-none focus:bg-neo-yellow/20"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
        {filtered.map((interest) => {
          const isSelected = selected.has(interest.id);
          return (
            <button
              key={interest.id}
              type="button"
              onClick={() => onToggle(interest.id)}
              className={cn(
                "flex items-center gap-2.5 p-3 border-3 border-black font-bold text-sm text-left transition-all brutal-shadow-sm",
                "hover:translate-x-[-1px] hover:translate-y-[-1px]",
                "active:translate-x-0 active:translate-y-0",
                isSelected
                  ? "bg-neo-yellow translate-x-[-2px] translate-y-[-2px] brutal-shadow"
                  : "bg-white"
              )}
            >
              <span className="text-xl flex-shrink-0">{interest.emoji ?? "⚡"}</span>
              <span className="leading-tight">{interest.name}</span>
              {isSelected && (
                <CheckCircle2 className="w-4 h-4 ml-auto flex-shrink-0 text-black" />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs font-bold text-black/50 text-center">
        {selected.size} selected — pick as many as you like
      </p>
    </div>
  );
}

// ── Main Onboarding Component ─────────────────────────────────────────────────

function OnboardingContent() {
  const router = useRouter();
  const { currentUser, loadCurrentUser } = useAuth();

  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Interests step
  const [interests, setInterests] = useState<ApiInterest[]>([]);
  const [selectedInterestIds, setSelectedInterestIds] = useState<Set<string>>(new Set());

  // Location step
  const [locationName, setLocationName] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Profile step
  const [bio, setBio] = useState("");

  useEffect(() => {
    interestsApi.list().then(setInterests).catch(() => {});
  }, []);

  const toggleInterest = (id: string) => {
    setSelectedInterestIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectedCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        if (!locationName) setLocationName("Near me (GPS detected)");
        setIsDetecting(false);
      },
      () => {
        setIsDetecting(false);
      }
    );
  };

  const handleNext = () => {
    setError(null);
    if (stepIndex < STEPS.length - 1) setStepIndex((s) => s + 1);
  };
  const handleBack = () => {
    setError(null);
    if (stepIndex > 0) setStepIndex((s) => s - 1);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // 1. Save interests
      await userApi.updateInterests({ interest_ids: Array.from(selectedInterestIds) });

      // 2. Save profile (location + bio)
      await userApi.updateProfile({
        bio: bio.trim() || undefined,
        location_name: locationName.trim() || "Kompally, Hyderabad",
        lat: detectedCoords?.lat,
        lng: detectedCoords?.lng,
      });

      // 3. Mark onboarding complete
      await userApi.completeOnboarding();

      // 4. Refresh AuthContext user
      await loadCurrentUser();

      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPct = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-black/50">
              STEP {stepIndex + 1} OF {STEPS.length}
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-neo-pink">
              {STEPS[stepIndex]}
            </span>
          </div>
          <div className="h-3 bg-white border-3 border-black">
            <div
              className="h-full bg-neo-yellow border-r-3 border-black transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            {STEPS.map((step, i) => (
              <div
                key={step}
                className={cn(
                  "w-3 h-3 border-2 border-black",
                  i <= stepIndex ? "bg-neo-yellow" : "bg-white"
                )}
              />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border-4 border-black brutal-shadow-xl overflow-hidden">
          {/* Step 0: Welcome */}
          {stepIndex === 0 && (
            <div className="p-8 space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">⚡</div>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-black">
                  HEY {currentUser?.name?.split(" ")[0].toUpperCase() ?? "THERE"}!
                </h2>
                <div className="inline-block bg-neo-yellow border-4 border-black px-4 py-1 mt-2 transform -rotate-1">
                  <span className="font-black text-sm uppercase">Welcome to MEELT!</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {[
                  { emoji: "👥", label: "Find people with same interests near you" },
                  { emoji: "⚽", label: "Join real activities & communities" },
                  { emoji: "🗺️", label: "Discover what's happening around you" },
                ].map((item) => (
                  <div
                    key={item.emoji}
                    className="flex flex-col items-center text-center p-4 bg-slate-50 border-3 border-black brutal-shadow-sm"
                  >
                    <span className="text-3xl mb-2">{item.emoji}</span>
                    <p className="text-xs font-bold leading-snug">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-neo-pink/10 border-3 border-neo-pink p-4 text-center">
                <p className="text-sm font-black text-black">
                  Let's set up your MEELT! profile in 3 quick steps so we can show you the right people, communities, and activities.
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Interests */}
          {stepIndex === 1 && (
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
                  WHAT ARE YOU <span className="text-neo-pink">INTO?</span>
                </h2>
                <p className="text-sm font-semibold text-black/60 mt-1">
                  Pick your interests so we can show you the right crowd.
                </p>
              </div>

              {interests.length > 0 ? (
                <InterestGrid
                  interests={interests}
                  selected={selectedInterestIds}
                  onToggle={toggleInterest}
                />
              ) : (
                <div className="text-center py-8 text-black/40 font-bold text-sm">
                  Loading interests... (make sure the backend is running)
                </div>
              )}
            </div>
          )}

          {/* Step 2: Location */}
          {stepIndex === 2 && (
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
                  WHERE ARE <span className="text-neo-cyan">YOU BASED?</span>
                </h2>
                <p className="text-sm font-semibold text-black/60 mt-1">
                  City/area level is enough. Your exact address is never shared.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    AREA / NEIGHBOURHOOD
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. Kompally, Hyderabad"
                      className="w-full pl-10 pr-4 py-3 border-3 border-black font-semibold text-sm focus:outline-none focus:bg-neo-cyan/20 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t-2 border-dashed border-black/20" />
                  <span className="text-xs font-black text-black/40 uppercase">OR</span>
                  <div className="flex-1 border-t-2 border-dashed border-black/20" />
                </div>

                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={isDetecting}
                  className={cn(
                    "w-full py-3 border-3 border-black font-black text-sm uppercase flex items-center justify-center gap-2",
                    "brutal-shadow-sm hover:bg-neo-cyan/20 transition-colors",
                    isDetecting && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {isDetecting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      DETECTING...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4" />
                      USE MY CURRENT LOCATION
                    </>
                  )}
                </button>

                {detectedCoords && (
                  <div className="flex items-center gap-2 bg-neo-green/20 border-2 border-neo-green p-3">
                    <CheckCircle2 className="w-4 h-4 text-neo-green" />
                    <p className="text-xs font-bold text-black">
                      GPS location detected! Coordinates saved for better nearby results.
                    </p>
                  </div>
                )}

                <div className="bg-slate-50 border-2 border-black/20 p-3">
                  <p className="text-xs font-bold text-black/50">
                    🔒 We only use your location to show relevant communities and activities.
                    Your exact coordinates are never shared publicly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Profile */}
          {stepIndex === 3 && (
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
                  TELL THEM <span className="text-neo-purple">WHO YOU ARE</span>
                </h2>
                <p className="text-sm font-semibold text-black/60 mt-1">
                  A quick intro helps people know who you are before they join your squad.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                    BIO (OPTIONAL)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="e.g. Weekend footballer 🏃, anime binge-watcher and chai enthusiast ☕"
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 border-3 border-black font-semibold text-sm resize-none focus:outline-none focus:bg-neo-purple/10 transition-colors"
                  />
                  <p className="text-right text-xs font-bold text-black/40">{bio.length}/200</p>
                </div>

                {/* Summary box */}
                <div className="bg-neo-yellow/20 border-3 border-black p-4 space-y-2">
                  <p className="text-xs font-black uppercase tracking-wider text-black">YOUR MEELT! PROFILE WILL SHOW:</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 text-neo-yellow fill-neo-yellow" />
                      <span>{currentUser?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-neo-pink" />
                      <span>{locationName || "Location not set"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Zap className="w-3.5 h-3.5 text-neo-cyan" />
                      <span>{selectedInterestIds.size} interest{selectedInterestIds.size !== 1 ? "s" : ""} selected</span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-neo-pink/10 border-3 border-neo-pink p-3">
                  <p className="text-xs font-black text-neo-pink uppercase">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Footer */}
          <div className="border-t-4 border-black p-6 flex items-center justify-between bg-slate-50">
            <button
              type="button"
              onClick={handleBack}
              disabled={stepIndex === 0}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-3 border-black font-black text-sm uppercase brutal-shadow-sm",
                "hover:bg-slate-100 transition-colors",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
            >
              <ArrowLeft className="w-4 h-4" /> BACK
            </button>

            {stepIndex < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 bg-neo-yellow border-3 border-black font-black text-sm uppercase brutal-shadow",
                  "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-xl transition-all",
                  "active:translate-x-0 active:translate-y-0 active:shadow-none"
                )}
              >
                {stepIndex === 0 ? "LET'S GO" : "NEXT"} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 bg-neo-pink text-white border-3 border-black font-black text-sm uppercase brutal-shadow",
                  "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-xl transition-all",
                  "active:translate-x-0 active:translate-y-0 active:shadow-none",
                  "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                )}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    SAVING...
                  </>
                ) : (
                  <>ENTER MEELT! ⚡</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute skipOnboardingCheck>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
