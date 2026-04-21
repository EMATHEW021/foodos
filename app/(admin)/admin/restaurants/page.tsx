"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email: string | null;
  city: string;
  approvalStatus: string;
  kycStatus: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  createdAt: string;
  staffCount: number;
  menuItems: number;
  totalOrders: number;
  owner: { name: string; email: string | null; phone: string } | null;
}

function statusBadge(status: string) {
  switch (status) {
    case "approved": return { label: "Hai", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" };
    case "pending": return { label: "Inasubiri", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
    case "rejected": return { label: "Imekataliwa", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" };
    case "suspended": return { label: "Imesimamishwa", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" };
    default: return { label: status, bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
  }
}

function planBadge(plan: string) {
  switch (plan) {
    case "free": return { label: "Bure", bg: "bg-gray-100", text: "text-gray-700" };
    case "starter": return { label: "Mwanzo", bg: "bg-blue-50", text: "text-blue-700" };
    case "professional": return { label: "Kitaalamu", bg: "bg-purple-50", text: "text-purple-700" };
    case "business": return { label: "Biashara", bg: "bg-amber-50", text: "text-amber-700" };
    case "enterprise": return { label: "Kampuni", bg: "bg-indigo-50", text: "text-indigo-700" };
    default: return { label: plan, bg: "bg-gray-100", text: "text-gray-700" };
  }
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sw-TZ", { day: "2-digit", month: "short", year: "numeric" });
}

const COLORS = ["bg-emerald-600", "bg-sky-600", "bg-red-600", "bg-amber-700", "bg-purple-600", "bg-teal-600", "bg-blue-600", "bg-orange-600", "bg-indigo-600", "bg-lime-700"];

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function fetchRestaurants() {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/restaurants?${params}`);
      const data = await res.json();
      setRestaurants(data.restaurants || []);
    } catch {
      // Silent
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchRestaurants(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const [newThisWeek, setNewThisWeek] = useState(0);
  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { if (d.newTenantsThisWeek !== undefined) setNewThisWeek(d.newTenantsThisWeek); })
      .catch(() => {});
  }, []);

  const stats = {
    total: restaurants.length,
    approved: restaurants.filter((r) => r.approvalStatus === "approved").length,
    pending: restaurants.filter((r) => r.approvalStatus === "pending").length,
    rejected: restaurants.filter((r) => r.approvalStatus === "rejected").length,
  };

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
        <h1 className="text-2xl font-bold text-foreground">Usimamizi wa Migahawa</h1>
        <p className="text-sm text-muted-foreground">Simamia migahawa yote kwenye jukwaa la FoodOS</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Jumla</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.total}</p>
          <p className="text-[10px] text-muted-foreground">
            Total restaurants
            {newThisWeek > 0 && <span className="ml-1 font-semibold text-green-600">+{newThisWeek} wiki hii</span>}
          </p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
          <p className="text-xs font-medium text-green-700">Hai (Active)</p>
          <p className="mt-2 text-3xl font-bold text-green-700">{stats.approved}</p>
          <p className="text-[10px] text-green-600/70">Approved</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-amber-200">
          <p className="text-xs font-medium text-amber-700">Inasubiri</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">{stats.pending}</p>
          <p className="text-[10px] text-amber-600/70">Pending</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-red-200">
          <p className="text-xs font-medium text-red-700">Imekataliwa</p>
          <p className="mt-2 text-3xl font-bold text-red-700">{stats.rejected}</p>
          <p className="text-[10px] text-red-600/70">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tafuta mgahawa... (jina, jiji)"
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Wote", count: stats.total },
            { value: "approved", label: "Hai", count: stats.approved },
            { value: "pending", label: "Inasubiri", count: stats.pending },
            { value: "rejected", label: "Imekataliwa", count: stats.rejected },
          ].map((pill) => (
            <button
              key={pill.value}
              onClick={() => setStatusFilter(pill.value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === pill.value
                  ? "bg-[#2D7A3A] text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {pill.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                statusFilter === pill.value ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              }`}>
                {pill.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mgahawa</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mmiliki</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Jiji</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mpango</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Hali</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Watu</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tarehe</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tazama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {restaurants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-12 w-12 text-muted-foreground/30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-sm font-medium text-muted-foreground">Hakuna mgahawa uliopatikana</p>
                      <p className="text-xs text-muted-foreground">No restaurants found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                restaurants.map((r, idx) => {
                  const sb = statusBadge(r.approvalStatus);
                  const pb = planBadge(r.subscriptionPlan);
                  const bgColor = COLORS[idx % COLORS.length];
                  return (
                    <tr key={r.id} className="transition hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <Link href={`/admin/restaurants/${r.id}`} className="flex items-center gap-3 group">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bgColor} text-xs font-bold text-white shadow-sm`}>
                            {getInitials(r.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground group-hover:text-[#2D7A3A] transition">{r.name}</p>
                            <p className="text-[10px] text-muted-foreground">{r.slug}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">{r.owner?.name || "—"}</p>
                        <p className="text-[10px] text-muted-foreground">{r.owner?.phone || ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">{r.city}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${pb.bg} ${pb.text}`}>{pb.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${sb.bg} ${sb.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${sb.dot}`} />
                          {sb.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <p className="text-sm font-semibold text-foreground">{r.staffCount}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/restaurants/${r.id}`}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#2D7A3A] transition hover:bg-[#2D7A3A]/10"
                        >
                          Tazama
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Inaonyesha {restaurants.length} migahawa
          </p>
        </div>
      </div>
    </div>
  );
}
