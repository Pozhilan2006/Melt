"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, userApi } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

function EditProfileContent() {
  const router = useRouter();
  const { currentUser, loadCurrentUser } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [locationName, setLocationName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setName(currentUser.name);
    setBio(currentUser.bio ?? "");
    setProfileImage(currentUser.profile_image ?? "");
    setLocationName(currentUser.location_name ?? "");
  }, [currentUser]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await userApi.updateProfile({
        name: name.trim(),
        bio: bio.trim() || undefined,
        profile_image: profileImage.trim() || undefined,
        location_name: locationName.trim() || undefined,
      });
      await loadCurrentUser();
      router.push("/profile");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to save your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link href="/profile" className="inline-flex items-center gap-2 text-xs font-black uppercase mb-5 hover:text-neo-pink">
        <ArrowLeft className="w-4 h-4" /> Back to profile
      </Link>

      <div className="bg-white border-4 border-black brutal-shadow-xl p-6 sm:p-8">
        <div className="mb-6">
          <span className="inline-block bg-neo-yellow border-3 border-black px-3 py-1 text-xs font-black uppercase brutal-shadow-sm transform -rotate-1">
            Your identity, your vibe
          </span>
          <h1 className="mt-4 text-3xl font-black uppercase tracking-tight">Edit profile</h1>
        </div>

        {error && (
          <div className="mb-5 bg-neo-pink/10 border-3 border-neo-pink p-3 text-sm font-black text-neo-pink uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <label className="block">
            <span className="block text-xs font-black uppercase mb-1.5">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              className="w-full border-3 border-black px-4 py-3 font-semibold focus:outline-none focus:bg-neo-yellow/20"
            />
          </label>

          <label className="block">
            <span className="block text-xs font-black uppercase mb-1.5">Bio</span>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={500}
              rows={4}
              className="w-full border-3 border-black px-4 py-3 font-semibold resize-none focus:outline-none focus:bg-neo-cyan/20"
            />
          </label>

          <label className="block">
            <span className="block text-xs font-black uppercase mb-1.5">Profile image URL</span>
            <input
              type="url"
              value={profileImage}
              onChange={(event) => setProfileImage(event.target.value)}
              placeholder="https://..."
              className="w-full border-3 border-black px-4 py-3 font-semibold focus:outline-none focus:bg-neo-cyan/20"
            />
          </label>

          <label className="block">
            <span className="block text-xs font-black uppercase mb-1.5">Area / neighbourhood</span>
            <input
              value={locationName}
              onChange={(event) => setLocationName(event.target.value)}
              maxLength={150}
              placeholder="e.g. Kompally, Hyderabad"
              className="w-full border-3 border-black px-4 py-3 font-semibold focus:outline-none focus:bg-neo-yellow/20"
            />
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-neo-pink text-white border-4 border-black py-3 font-black uppercase brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfileContent />
    </ProtectedRoute>
  );
}
