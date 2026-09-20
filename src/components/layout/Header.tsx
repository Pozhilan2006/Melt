"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "./BrandLogo";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Compass, Users, Flame, Bot, Plus, Bell, MapPin, LogIn, LogOut, UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const authedNavItems = [
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/communities", label: "Communities", icon: Users },
    { href: "/activities", label: "Activities", icon: Flame },
    { href: "/ai", label: "AI Match", icon: Bot, isNew: true },
  ];

  const publicNavItems = [
    { href: "/discover", label: "Discover", icon: Compass },
  ];

  const navItems = isAuthenticated ? authedNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-black px-4 lg:px-8 py-3 brutal-shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Location Pill */}
        <div className="flex items-center gap-4">
          <BrandLogo size="md" />

          {isAuthenticated && currentUser?.location_name && (
            <div className="hidden md:flex items-center gap-1.5 bg-neo-yellow/30 border-2 border-black px-2.5 py-1 text-xs font-black uppercase brutal-shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-neo-pink" />
              <span>{currentUser.location_name}</span>
            </div>
          )}
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-1.5 select-none",
                  isActive
                    ? "bg-black text-neo-yellow border-black brutal-shadow translate-y-[-2px]"
                    : "bg-white text-black border-black hover:bg-neo-yellow/40"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {"isNew" in item && Boolean(item.isNew) && (
                  <span className="bg-neo-pink text-white text-[9px] px-1 font-black animate-pulse">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Auth-Reactive Actions */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            // While checking auth, show a placeholder
            <div className="w-8 h-8 bg-slate-100 border-2 border-black animate-pulse" />
          ) : isAuthenticated ? (
            // ── AUTHENTICATED ────────────────────────────────
            <>
              {/* Create Button */}
              <Link href="/create" className="hidden sm:block">
                <Button
                  variant="pink"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4 stroke-[3]" />}
                >
                  CREATE
                </Button>
              </Link>

              {/* Notifications */}
              <Link
                href="/notifications"
                className="relative p-2 bg-white border-2 border-black brutal-shadow-sm hover:bg-slate-100 transition-all active:translate-x-0.5 active:translate-y-0.5"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5 text-black" />
                {/* Notification badge — can be wired to real data later */}
              </Link>

              {/* Profile Avatar + Logout */}
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Avatar
                    src={currentUser?.profile_image ?? undefined}
                    fallback={(currentUser?.name ?? "?").slice(0, 2)}
                    animeSticker="⚡"
                    size="sm"
                    className="hover:scale-105 transition-transform"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  aria-label="Logout"
                  className="hidden sm:flex items-center gap-1 px-2 py-1.5 border-2 border-black text-[10px] font-black uppercase hover:bg-black hover:text-neo-yellow transition-colors brutal-shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" /> OUT
                </button>
              </div>
            </>
          ) : (
            // ── UNAUTHENTICATED ──────────────────────────────
            <>
              <Link href="/login" className="hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  LOGIN
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="pink"
                  size="sm"
                  leftIcon={<UserPlus className="w-4 h-4 stroke-[2.5]" />}
                >
                  JOIN MEELT!
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
