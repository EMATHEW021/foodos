"use client";

import { useState, useEffect } from "react";

interface Notification {
  id: string;
  type: "application" | "kyc" | "user" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

function typeIcon(type: string) {
  switch (type) {
    case "application": return { bg: "bg-amber-500/10", color: "text-amber-500" };
    case "kyc": return { bg: "bg-blue-500/10", color: "text-blue-500" };
    case "user": return { bg: "bg-purple-500/10", color: "text-purple-500" };
    default: return { bg: "bg-gray-500/10", color: "text-gray-500" };
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return "Sasa hivi";
  if (hours < 24) return `Saa ${hours} zilizopita`;
  if (days < 7) return `Siku ${days} zilizopita`;
  return d.toLocaleDateString("sw-TZ", { day: "2-digit", month: "short" });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        // Build notifications from real events
        const [appsRes, statsRes] = await Promise.all([
          fetch("/api/admin/applications?status=pending"),
          fetch("/api/admin/stats"),
        ]);
        const appsData = await appsRes.json();
        const statsData = await statsRes.json();

        const notifs: Notification[] = [];

        // Pending applications -> notifications
        for (const app of (appsData.applications || [])) {
          notifs.push({
            id: `app-${app.id}`,
            type: "application",
            title: `Ombi Jipya: ${app.name}`,
            message: `${app.owner?.name || "Mmiliki"} amewasilisha ombi la mgahawa kutoka ${app.city}`,
            time: app.createdAt,
            read: false,
          });
        }

        // KYC pending
        if (statsData.pendingKyc > 0) {
          notifs.push({
            id: "kyc-pending",
            type: "kyc",
            title: `KYC Inasubiri Ukaguzi`,
            message: `Kuna hati ${statsData.pendingKyc} za KYC zinazosubiri ukaguzi wako`,
            time: new Date().toISOString(),
            read: false,
          });
        }

        // Recent users -> notifications
        for (const user of (statsData.recentUsers || []).slice(0, 3)) {
          notifs.push({
            id: `user-${user.id}`,
            type: "user",
            title: `Mtumiaji Mpya: ${user.name}`,
            message: `Ameongezwa kama ${user.role} katika ${user.tenantName}`,
            time: user.createdAt,
            read: true,
          });
        }

        // System notification
        notifs.push({
          id: "system-welcome",
          type: "system",
          title: "Karibu FoodOS Admin",
          message: "Jukwaa la usimamizi limekamilika. Kagua maombi na KYC.",
          time: new Date().toISOString(),
          read: true,
        });

        setNotifications(notifs);
      } catch {
        // Silent
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = filter === "all"
    ? notifications
    : filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2D7A3A] border-t-transparent" />
          <p className="text-sm text-muted-foreground">Inapakia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Arifa</h1>
          <p className="text-xs text-muted-foreground">
            Notifications — {unreadCount > 0 ? `${unreadCount} hazijasomwa` : "Zote zimesomwa"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Soma Zote
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "Zote", count: notifications.length },
          { value: "unread", label: "Hazijasomwa", count: unreadCount },
          { value: "application", label: "Maombi", count: notifications.filter((n) => n.type === "application").length },
          { value: "kyc", label: "KYC", count: notifications.filter((n) => n.type === "kyc").length },
          { value: "user", label: "Watumiaji", count: notifications.filter((n) => n.type === "user").length },
        ].map((pill) => (
          <button
            key={pill.value}
            onClick={() => setFilter(pill.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === pill.value
                ? "bg-[#2D7A3A] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {pill.label}
            {pill.count > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                filter === pill.value ? "bg-white/20 text-white" : "bg-background text-muted-foreground"
              }`}>
                {pill.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">Hakuna arifa</p>
            <p className="text-xs text-muted-foreground">No notifications to show</p>
          </div>
        ) : (
          filtered.map((n) => {
            const icon = typeIcon(n.type);
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-5 py-4 transition hover:bg-muted/10 ${
                  !n.read ? "bg-[#2D7A3A]/5" : ""
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${icon.bg}`}>
                  {n.type === "application" && (
                    <svg className={`h-5 w-5 ${icon.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  )}
                  {n.type === "kyc" && (
                    <svg className={`h-5 w-5 ${icon.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {n.type === "user" && (
                    <svg className={`h-5 w-5 ${icon.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {n.type === "system" && (
                    <svg className={`h-5 w-5 ${icon.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {n.title}
                    </p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-[#2D7A3A]" />}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{formatDate(n.time)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
