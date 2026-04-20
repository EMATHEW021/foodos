"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ── Types ── */
interface Stats {
  totalRestaurants: number;
  pendingApprovals: number;
  approvedRestaurants: number;
  rejectedRestaurants: number;
  totalUsers: number;
  recentTenants: RecentTenant[];
}

interface RecentTenant {
  id: string;
  name: string;
  city: string;
  approvalStatus: string;
  subscriptionPlan: string;
  createdAt: string;
  owner: { name: string; email: string | null; phone: string } | null;
}

interface PendingApp {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  createdAt: string;
  owner: { name: string; email: string | null; phone: string } | null;
}

/* ── Helpers ── */
function planBadgeStyle(plan: string) {
  switch (plan) {
    case "free":
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    case "starter":
      return "bg-[#2D7A3A]/10 text-[#2D7A3A]";
    case "professional":
      return "bg-[#E8712B]/10 text-[#E8712B]";
    case "business":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "enterprise":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function planLabel(plan: string) {
  switch (plan) {
    case "free": return "Bure";
    case "starter": return "Mwanzo";
    case "professional": return "Kitaalamu";
    case "business": return "Biashara";
    case "enterprise": return "Kampuni";
    default: return plan;
  }
}

function statusDot(status: string) {
  switch (status) {
    case "approved": return "bg-green-500";
    case "pending": return "bg-amber-500";
    case "rejected": return "bg-red-500";
    default: return "bg-gray-400";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "approved": return "Imeidhinishwa";
    case "pending": return "Inasubiri";
    case "rejected": return "Imekataliwa";
    default: return status;
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

/* ── Main Component ── */
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<PendingApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, pendingRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/applications?status=pending"),
        ]);
        const statsData = await statsRes.json();
        const pendingData = await pendingRes.json();
        setStats(statsData);
        setPending(pendingData.applications || []);
      } catch {
        // Silent fail
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  async function quickApprove(id: string) {
    setApproving(id);
    try {
      await fetch(`/api/admin/applications/${id}/approve`, { method: "POST" });
      setPending((prev) => prev.filter((p) => p.id !== id));
      setStats((prev) =>
        prev
          ? {
              ...prev,
              pendingApprovals: prev.pendingApprovals - 1,
              approvedRestaurants: prev.approvedRestaurants + 1,
            }
          : prev
      );
    } catch {
      // Silent
    }
    setApproving(null);
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashibodi</h1>
        <p className="text-sm text-muted-foreground">Muhtasari wa jukwaa la FoodOS</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Restaurants */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Migahawa Yote</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2D7A3A]/10">
              <svg className="h-4.5 w-4.5 text-[#2D7A3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-[#2D7A3A]">{stats?.totalRestaurants || 0}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Total Restaurants</p>
        </div>

        {/* Pending Approvals */}
        <div className={`rounded-xl bg-card p-5 shadow-sm border transition hover:shadow-md ${
          (stats?.pendingApprovals || 0) > 0
            ? "border-amber-300 dark:border-amber-700"
            : "border-border"
        }`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Maombi Yanayosubiri</p>
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                <svg className="h-4.5 w-4.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {(stats?.pendingApprovals || 0) > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
                </span>
              )}
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-amber-500">{stats?.pendingApprovals || 0}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Pending Approvals</p>
        </div>

        {/* Approved */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Imeidhinishwa</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <svg className="h-4.5 w-4.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-500">{stats?.approvedRestaurants || 0}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Approved</p>
        </div>

        {/* Total Users */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Watumiaji Wote</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
              <svg className="h-4.5 w-4.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-500">{stats?.totalUsers || 0}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Total Users</p>
        </div>
      </div>

      {/* Pending Approvals Section (prominent) */}
      {pending.length > 0 && (
        <div className="rounded-xl bg-card shadow-sm border-2 border-amber-300 dark:border-amber-700 overflow-hidden">
          <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-foreground">Maombi Yanayosubiri Idhini</h2>
                <p className="text-[10px] text-muted-foreground">Applications waiting for your approval</p>
              </div>
            </div>
            <Link
              href="/admin/applications"
              className="text-xs font-medium text-[#2D7A3A] hover:underline"
            >
              Tazama Yote &rarr;
            </Link>
          </div>

          <div className="divide-y divide-border">
            {pending.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between px-5 py-4 transition hover:bg-muted/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2D7A3A]/10 text-xs font-bold text-[#2D7A3A]">
                    {app.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{app.name}</p>
                    <div className="flex items-center gap-3">
                      {app.owner && (
                        <span className="text-xs text-muted-foreground">{app.owner.name}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{app.city}</span>
                      <span className="text-[10px] text-muted-foreground">{formatDate(app.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => quickApprove(app.id)}
                    disabled={approving === app.id}
                    className="flex items-center gap-1.5 rounded-lg bg-[#2D7A3A] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#1B5227] disabled:opacity-50"
                  >
                    {approving === app.id ? (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Idhinisha
                  </button>
                  <Link
                    href="/admin/applications"
                    className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    Kagua
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Restaurants Table */}
      <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-foreground">Migahawa ya Hivi Karibuni</h2>
            <p className="text-[10px] text-muted-foreground">Usajili wa hivi karibuni</p>
          </div>
          <Link
            href="/admin/restaurants"
            className="text-xs font-medium text-[#2D7A3A] hover:underline"
          >
            Tazama Zote &rarr;
          </Link>
        </div>

        {/* Header row */}
        <div className="hidden border-b border-border bg-muted/20 px-5 py-2.5 sm:grid sm:grid-cols-12 sm:gap-3">
          <p className="col-span-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Jina</p>
          <p className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Mji</p>
          <p className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Mpango</p>
          <p className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Hali</p>
          <p className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Tarehe</p>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {(stats?.recentTenants || []).length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12">
              <svg className="h-10 w-10 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-sm text-muted-foreground">Hakuna migahawa bado</p>
              <p className="text-xs text-muted-foreground">No restaurants registered yet</p>
            </div>
          ) : (
            stats?.recentTenants.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-1.5 px-5 py-3 transition hover:bg-muted/10 sm:grid sm:grid-cols-12 sm:items-center sm:gap-3"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2D7A3A]/10 text-[10px] font-bold text-[#2D7A3A]">
                    {r.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                    {r.owner && <p className="text-[10px] text-muted-foreground">{r.owner.name}</p>}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">{r.city}</p>
                </div>
                <div className="col-span-2">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${planBadgeStyle(r.subscriptionPlan)}`}>
                    {planLabel(r.subscriptionPlan)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${statusDot(r.approvalStatus)}`} />
                    <span className="text-[11px] text-muted-foreground">
                      {statusLabel(r.approvalStatus)}
                    </span>
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-[11px] text-muted-foreground">{formatDate(r.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
