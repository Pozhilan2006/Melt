"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Compass, Plus, Users, User, LogIn, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Authenticated nav
  const authedLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/communities", label: "Communities", icon: Users },
    { href: "/create", label: "Create", icon: Plus, isFab: true },
    { href: "/activities", label: "Events", icon: Flame },
    { href: "/profile", label: "Profile", icon: User },
  ];

  // Unauthenticated nav — replace Profile/Create with Login
  const publicLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/communities", label: "Communities", icon: Users },
    { href: "/register", label: "Join", icon: Plus, isFab: true },
    { href: "/activities", label: "Events", icon: Flame },
    { href: "/login", label: "Login", icon: LogIn },
  ];

  const mobileLinks = isAuthenticated ? authedLinks : publicLinks;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-black px-2 py-1.5 brutal-shadow-lg">
      <div className="flex items-center justify-around">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/" && pathname?.startsWith(link.href));

          if (link.isFab) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative -top-4 p-3 bg-neo-pink text-white border-3 border-black brutal-shadow hover:bg-pink-600 active:translate-x-0.5 active:translate-y-0.5 transition-all transform hover:scale-105"
                aria-label={isAuthenticated ? "Create new activity or community" : "Join MEELT!"}
              >
                <Plus className="w-6 h-6 stroke-[3]" />
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2.5 transition-all",
                isActive ? "text-black font-black" : "text-black/60 font-bold hover:text-black"
              )}
            >
              <div
                className={cn(
                  "p-1 border-2 transition-all",
                  isActive
                    ? "bg-neo-yellow border-black brutal-shadow-sm -translate-y-1"
                    : "border-transparent"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-wider mt-0.5">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
