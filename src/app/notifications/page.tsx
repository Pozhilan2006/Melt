"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_NOTIFICATIONS } from "@/data/mockData";
import { Notification } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, CheckCheck, ArrowRight } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-neo-cyan border-4 border-black p-6 brutal-shadow-lg flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 bg-black text-neo-yellow px-2 py-0.5 text-xs font-black uppercase mb-1">
            <Bell className="w-3.5 h-3.5" />
            <span>ACTIONABLE NOTIFICATIONS FEED</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">
            ACTIVITY ALERTS & SQUAD INVITES
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          leftIcon={<CheckCheck className="w-4 h-4" />}
        >
          MARK ALL READ
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <Card
            key={n.id}
            variant={n.read ? "white" : "yellow"}
            shadow="sm"
            hoverable
            className="p-4 border-3 border-black flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 bg-white border-2 border-black flex items-center justify-center text-xl shrink-0 brutal-shadow-sm">
                {n.avatar || "⚡"}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm uppercase text-black">{n.title}</h4>
                  {!n.read && (
                    <span className="bg-neo-pink text-white text-[9px] px-1 font-black animate-pulse">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-black/80">{n.message}</p>
                <span className="text-[10px] font-bold text-black/50 block">{n.timestamp}</span>
              </div>
            </div>

            {/* Actionable Button Link */}
            {n.actionUrl && (
              <Link href={n.actionUrl} className="shrink-0 self-end sm:self-auto">
                <Button variant="pink" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  {n.actionLabel || "VIEW"}
                </Button>
              </Link>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
