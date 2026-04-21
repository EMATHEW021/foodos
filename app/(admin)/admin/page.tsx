"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  totalRestaurants: number;
  pendingApprovals: number;
  approvedRestaurants: number;
  rejectedRestaurants: number;
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  newTenantsThisWeek: number;
  newTenantsThisMonth: number;
  pendingKyc: number;
  mrr: number;
  arr: number;
  revenueThisMonth: number;
  netProfitThisMonth: number;
  ordersThisWeek: number;
  activeRestaurants: number;
  roleCounts: Record<string, number>;
  recentTenants: RecentTenant[];
  recentUsers: RecentUser[];
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

interface RecentUser {
  id: string;
  name: string;
  email: string | null;
  role: string;
  tenantName: string;
  createdAt: string;
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

interface AlertItem {
  type: string;
  message: string;
  link: string;
  id?: string;
  count?: number;
}

interface Alerts {
  critical: AlertItem[];
  warning: AlertItem[];
  info: AlertItem[];
}

function fmt(n: number) { return n.toLocaleString("en-TZ"); }

function planBadgeStyle(plan: string) {
  switch (plan) {
    case "free": return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    case "starter": return "bg-[#2D7A3A]/10 text-[#2D7A3A]";
    case "professional": return "bg-[#E8712B]/10 text-[#E8712B]";
    case "business": return "bg-purple-100 text-purple-700";
    case "enterprise": return "bg-blue-100 text-blue-700";
    default: return "bg-gray-100 text-gray-600";
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

function roleLabelSw(role: string) {
  switch (role) {
    case "owner": return "Mmiliki";
    case "manager": return "Msimamizi";
    case "cashier": return "Mkusanyaji";
    default: return role;
  }
}

function roleBadgeStyle(role: string) {
  switch (role) {
    case "owner": return "bg-[#E8712B]/10 text-[#E8712B]";
    case "manager": return "bg-[#2D7A3A]/10 text-[#2D7A3A]";
    case "cashier": return "bg-[#E9C46A]/20 text-[#2B2D42]";
    default: return "bg-gray-100 text-gray-600";
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

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<PendingApp[]>([]);
  const [alerts, setAlerts] = useState<Alerts | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, pendingRes, alertsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/applications?status=pending"),
          fetch("/api/admin/alerts"),
        ]);
        const statsData = await statsRes.json();
        const pendingData = await pendingRes.json();
        const alertsData = await alertsRes.json();
        setStats(statsData);
        setPending(pendingData.applications || []);
        setAlerts(alertsData);
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

  const revenueGrowth = stats?.revenueThisMonth && stats.revenueThisMonth > 0 ? "+mwezi huu" : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashibodi</h1>
        <p className="text-sm text-muted-foreground">Muhtasari wa jukwaa la FoodOS</p>
      </div>

      {/* KPI Row - Clickable Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Mapato (Revenue) */}
        <Link href="/admin/revenue" className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md hover:border-[#2D7A3A]/30 group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Mapato</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2D7A3A]/10">
              <svg className="h-4.5 w-4.5 text-[#2D7A3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">TZS {fmt(stats?.revenueThisMonth || 0)}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">MRR: TZS {fmt(stats?.mrr || 0)}</p>
          <p className="text-[10px] text-[#2D7A3A] font-medium opacity-0 group-hover:opacity-100 transition mt-1">Tazama zaidi &rarr;</p>
        </Link>

        {/* Migahawa (Restaurants) */}
        <Link href="/admin/restaurants" className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md hover:border-[#2D7A3A]/30 group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Migahawa</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <svg className="h-4.5 w-4.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{stats?.totalRestaurants || 0}</p>
          <div className="mt-1 flex items-center gap-2">
            {(stats?.newTenantsThisWeek || 0) > 0 && (
              <span className="text-[10px] font-medium text-green-600">+{stats?.newTenantsThisWeek} wiki hii</span>
            )}
            <span className="text-[10px] text-muted-foreground">{stats?.approvedRestaurants || 0} hai</span>
          </div>
          <p className="text-[10px] text-[#2D7A3A] font-medium opacity-0 group-hover:opacity-100 transition mt-1">Tazama zaidi &rarr;</p>
        </Link>

        {/* Watumiaji (Users) */}
        <Link href="/admin/users" className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md hover:border-[#2D7A3A]/30 group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Watumiaji</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
              <svg className="h-4.5 w-4.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-500">{stats?.totalUsers || 0}</p>
          <div className="mt-1 flex items-center gap-2">
            {(stats?.newUsersThisWeek || 0) > 0 && (
              <span className="text-[10px] font-medium text-green-600">+{stats?.newUsersThisWeek} wiki hii</span>
            )}
            <span className="text-[10px] text-muted-foreground">{stats?.activeUsers || 0} walio hai</span>
          </div>
          <p className="text-[10px] text-[#2D7A3A] font-medium opacity-0 group-hover:opacity-100 transition mt-1">Tazama zaidi &rarr;</p>
        </Link>

        {/* Uchambuzi (Analytics) */}
        <Link href="/admin/analytics" className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md hover:border-[#2D7A3A]/30 group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Uchambuzi</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
              <svg className="h-4.5 w-4.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-purple-600">{fmt(stats?.ordersThisWeek || 0)} <span className="text-sm font-normal text-muted-foreground">oda</span></p>
          <p className="mt-1 text-[10px] text-muted-foreground">{stats?.activeRestaurants || 0} migahawa hai — Wiki hii</p>
          <p className="text-[10px] text-[#2D7A3A] font-medium opacity-0 group-hover:opacity-100 transition mt-1">Tazama zaidi &rarr;</p>
        </Link>
      </div>

      {/* Alert Tiers */}
      {alerts && (alerts.critical.length > 0 || alerts.warning.length > 0 || alerts.info.length > 0) && (
        <div className="space-y-3">
          {/* Critical */}
          {alerts.critical.length > 0 && (
            <div className="rounded-xl border-2 border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">!</span>
                <h3 className="text-sm font-bold text-red-700 dark:text-red-400">Muhimu (Critical)</h3>
              </div>
              <div className="space-y-2">
                {alerts.critical.map((a, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-card border border-red-200 dark:border-red-800 px-4 py-2.5">
                    <p className="text-xs text-foreground">{a.message}</p>
                    <Link href={a.link} className="shrink-0 rounded-lg bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-[10px] font-medium text-red-700 dark:text-red-400 hover:bg-red-200 transition">
                      Tazama
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning */}
          {alerts.warning.length > 0 && (
            <div className="rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">!</span>
                <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400">Onyo (Warning)</h3>
              </div>
              <div className="space-y-2">
                {alerts.warning.map((a, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-card border border-amber-200 dark:border-amber-800 px-4 py-2.5">
                    <p className="text-xs text-foreground">{a.message}</p>
                    <Link href={a.link} className="shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 text-[10px] font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-200 transition">
                      {a.type === "pending_approvals" ? "Kagua" : "Tazama"}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          {alerts.info.length > 0 && (
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">i</span>
                <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400">Taarifa (Info)</h3>
              </div>
              <div className="space-y-2">
                {alerts.info.map((a, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-card border border-blue-200 dark:border-blue-800 px-4 py-2.5">
                    <p className="text-xs text-foreground">{a.message}</p>
                    <Link href={a.link} className="shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 text-[10px] font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-200 transition">
                      Tazama
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Insights Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <p className="text-[10px] font-medium text-muted-foreground">Mpya Wiki Hii</p>
          <p className="text-lg font-bold text-foreground">{stats?.newTenantsThisWeek || 0} <span className="text-xs font-normal text-muted-foreground">migahawa</span></p>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <p className="text-[10px] font-medium text-muted-foreground">Mpya Mwezi Huu</p>
          <p className="text-lg font-bold text-foreground">{stats?.newTenantsThisMonth || 0} <span className="text-xs font-normal text-muted-foreground">migahawa</span></p>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <p className="text-[10px] font-medium text-muted-foreground">KYC Inasubiri</p>
          <p className="text-lg font-bold text-foreground">{stats?.pendingKyc || 0} <span className="text-xs font-normal text-muted-foreground">inasubiri</span></p>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
          <p className="text-[10px] font-medium text-muted-foreground">Watumiaji Hai</p>
          <p className="text-lg font-bold text-foreground">{stats?.activeUsers || 0} <span className="text-xs font-normal text-muted-foreground">wanafanya kazi</span></p>
        </div>
      </div>

      {/* Pending Approvals Section */}
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
            <Link href="/admin/applications" className="text-xs font-medium text-[#2D7A3A] hover:underline">
              Tazama Yote &rarr;
            </Link>
          </div>

          <div className="divide-y divide-border">
            {pending.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between px-5 py-4 transition hover:bg-muted/10">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2D7A3A]/10 text-xs font-bold text-[#2D7A3A]">
                    {getInitials(app.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{app.name}</p>
                    <div className="flex items-center gap-3">
                      {app.owner && <span className="text-xs text-muted-foreground">{app.owner.name}</span>}
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

      {/* Two-column: Recent Restaurants + Recent Users */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Restaurants */}
        <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-foreground">Migahawa ya Hivi Karibuni</h2>
              <p className="text-[10px] text-muted-foreground">Recent registrations</p>
            </div>
            <Link href="/admin/restaurants" className="text-xs font-medium text-[#2D7A3A] hover:underline">
              Tazama Zote &rarr;
            </Link>
          </div>

          {(stats?.recentTenants || []).length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12">
              <svg className="h-10 w-10 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-sm text-muted-foreground">Hakuna migahawa bado</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {stats?.recentTenants.map((r) => (
                <Link key={r.id} href={`/admin/restaurants/${r.id}`} className="flex items-center justify-between px-5 py-3 transition hover:bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2D7A3A]/10 text-[10px] font-bold text-[#2D7A3A]">
                      {getInitials(r.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                      <div className="flex items-center gap-2">
                        {r.owner && <p className="text-[10px] text-muted-foreground">{r.owner.name}</p>}
                        <p className="text-[10px] text-muted-foreground">{r.city}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${planBadgeStyle(r.subscriptionPlan)}`}>
                      {planLabel(r.subscriptionPlan)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${statusDot(r.approvalStatus)}`} />
                      <span className="text-[10px] text-muted-foreground">{statusLabel(r.approvalStatus)}</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-foreground">Watumiaji Wapya</h2>
              <p className="text-[10px] text-muted-foreground">Recently added users</p>
            </div>
            <Link href="/admin/users" className="text-xs font-medium text-[#2D7A3A] hover:underline">
              Tazama Wote &rarr;
            </Link>
          </div>

          {(stats?.recentUsers || []).length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12">
              <svg className="h-10 w-10 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-muted-foreground">Hakuna watumiaji bado</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {stats?.recentUsers.map((u) => (
                <Link key={u.id} href={`/admin/users/${u.id}`} className="flex items-center justify-between px-5 py-3 transition hover:bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                      u.role === "owner" ? "bg-[#E8712B]" : u.role === "manager" ? "bg-[#2D7A3A]" : "bg-[#E9C46A] text-[#2B2D42]"
                    }`}>
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-[10px] text-muted-foreground">{u.tenantName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleBadgeStyle(u.role)}`}>
                      {roleLabelSw(u.role)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(u.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Link href="/admin/applications" className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md hover:border-[#2D7A3A]/30 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 mb-3">
            <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-[#2D7A3A]">Maombi</p>
          <p className="text-[10px] text-muted-foreground">Kagua maombi mapya</p>
        </Link>

        <Link href="/admin/kyc" className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md hover:border-[#2D7A3A]/30 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 mb-3">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-[#2D7A3A]">KYC</p>
          <p className="text-[10px] text-muted-foreground">Kagua hati</p>
        </Link>

        <Link href="/admin/restaurants" className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md hover:border-[#2D7A3A]/30 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2D7A3A]/10 mb-3">
            <svg className="h-5 w-5 text-[#2D7A3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-[#2D7A3A]">Migahawa</p>
          <p className="text-[10px] text-muted-foreground">Simamia migahawa</p>
        </Link>

        <Link href="/admin/users" className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md hover:border-[#2D7A3A]/30 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 mb-3">
            <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-[#2D7A3A]">Watumiaji</p>
          <p className="text-[10px] text-muted-foreground">Simamia watumiaji</p>
        </Link>

        <Link href="/admin/analytics" className="rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md hover:border-[#2D7A3A]/30 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 mb-3">
            <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-[#2D7A3A]">Uchambuzi</p>
          <p className="text-[10px] text-muted-foreground">Tazama uchambuzi</p>
        </Link>
      </div>
    </div>
  );
}
