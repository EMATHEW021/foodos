"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TopProduct {
  menuItemId: string;
  name: string;
  price: number;
  qtySold: number;
  revenue: number;
  orderCount: number;
  restaurantCount: number;
}

interface LeaderboardEntry {
  rank: number;
  tenantId: string;
  name: string;
  city: string;
  revenue: number;
  orders: number;
}

interface AnalyticsData {
  period: string;
  topProducts: TopProduct[];
  leaderboard: LeaderboardEntry[];
}

interface Stats {
  totalRestaurants: number;
  activeRestaurants: number;
  ordersThisWeek: number;
  pendingApprovals: number;
  approvedRestaurants: number;
  rejectedRestaurants: number;
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  newTenantsThisWeek: number;
  newTenantsThisMonth: number;
  pendingKyc: number;
}

function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

type Period = "week" | "month" | "quarter" | "year";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/analytics?period=${period}`).then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ])
      .then(([analyticsData, statsData]) => {
        setData(analyticsData);
        setStats(statsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

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

  const topProducts = data?.topProducts || [];
  const leaderboard = data?.leaderboard || [];

  const totalQtySold = topProducts.reduce((sum, p) => sum + p.qtySold, 0);
  const totalRevenue = topProducts.reduce((sum, p) => sum + p.revenue, 0);
  const maxProductRevenue = Math.max(...topProducts.map((p) => p.revenue), 1);
  const avgProductRevenue =
    topProducts.length > 0
      ? Math.round(totalRevenue / topProducts.length)
      : 0;

  const topRestaurant = leaderboard.length > 0 ? leaderboard[0] : null;
  const maxLeaderboardRevenue = Math.max(
    ...leaderboard.map((r) => r.revenue),
    1
  );
  const avgLeaderboardRevenue =
    leaderboard.length > 0
      ? Math.round(
          leaderboard.reduce((sum, r) => sum + r.revenue, 0) /
            leaderboard.length
        )
      : 0;

  const hasData = topProducts.length > 0 || leaderboard.length > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        {/* Header + Period Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Uchambuzi</h1>
            <p className="text-sm text-muted-foreground">
              Analytics — Global product & restaurant intelligence
            </p>
          </div>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(
              [
                { value: "week" as Period, label: "Wiki Hii" },
                { value: "month" as Period, label: "Mwezi Huu" },
                { value: "quarter" as Period, label: "Robo Mwaka" },
                { value: "year" as Period, label: "Mwaka" },
              ] as const
            ).map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  period === p.value
                    ? "bg-[#2D7A3A] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        <div className="rounded-xl bg-card p-16 shadow-sm border border-border">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="h-16 w-16 text-muted-foreground/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-sm font-medium text-muted-foreground">
              Hakuna data ya uchambuzi kwa kipindi hiki
            </p>
            <button
              onClick={() => setPeriod("month")}
              className="rounded-lg bg-[#2D7A3A] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1B5227]"
            >
              Badilisha Kipindi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Period Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Uchambuzi</h1>
          <p className="text-sm text-muted-foreground">
            Analytics — Global product & restaurant intelligence
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(
            [
              { value: "week" as Period, label: "Wiki Hii" },
              { value: "month" as Period, label: "Mwezi Huu" },
              { value: "quarter" as Period, label: "Robo Mwaka" },
              { value: "year" as Period, label: "Mwaka" },
            ] as const
          ).map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                period === p.value
                  ? "bg-[#2D7A3A] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Products Sold */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Bidhaa Zilizouzwa
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D7A3A]/10">
              <svg
                className="h-4 w-4 text-[#2D7A3A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">
            {fmt(totalQtySold)}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            bidhaa tofauti {topProducts.length}
          </p>
        </div>

        {/* Total Revenue */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Mapato Jumla
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8712B]/10">
              <svg
                className="h-4 w-4 text-[#E8712B]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#E8712B]">
            TZS {fmt(totalRevenue)}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Total Product Revenue
          </p>
        </div>

        {/* Top Restaurant */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Mgahawa Bora
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <svg
                className="h-4 w-4 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600 truncate">
            {topRestaurant?.name || "-"}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            TZS {fmt(topRestaurant?.revenue || 0)} &middot; kati ya{" "}
            {leaderboard.length}
          </p>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-foreground">
            Bidhaa Bora Zaidi
          </h2>
          <p className="text-xs text-muted-foreground">
            Top Products — Ranked by revenue
          </p>
        </div>

        {topProducts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Hakuna data
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground w-10">
                      #
                    </th>
                    <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">
                      Bidhaa
                    </th>
                    <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground text-right">
                      Idadi
                    </th>
                    <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">
                      Mapato
                    </th>
                    <th className="pb-3 text-xs font-semibold text-muted-foreground text-right">
                      Migahawa
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topProducts.map((product, index) => {
                    const revenuePct = Math.round(
                      (product.revenue / maxProductRevenue) * 100
                    );
                    return (
                      <tr
                        key={product.menuItemId}
                        className="hover:bg-muted/30 transition"
                      >
                        <td className="py-3 pr-4 text-xs text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="py-3 pr-4">
                          <Link
                            href={`/admin/analytics/products/${product.menuItemId}`}
                            className="text-sm font-medium text-foreground hover:text-[#2D7A3A] transition"
                          >
                            {product.name}
                          </Link>
                          <p className="text-[10px] text-muted-foreground">
                            TZS {fmt(product.price)} kwa moja
                          </p>
                        </td>
                        <td className="py-3 pr-4 text-sm font-semibold text-foreground text-right">
                          {fmt(product.qtySold)}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                              TZS {fmt(product.revenue)}
                            </span>
                            <div className="hidden sm:block h-2 w-24 rounded-full bg-muted/50">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${revenuePct}%`,
                                  backgroundColor:
                                    index === 0 ? "#E8712B" : "#2D7A3A",
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground text-right">
                          {product.restaurantCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Benchmark */}
            <div className="mt-4 flex items-center gap-2 border-t border-dashed border-border pt-4">
              <svg
                className="h-3.5 w-3.5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs text-muted-foreground">
                Wastani: TZS {fmt(avgProductRevenue)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Restaurant Leaderboard */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-foreground">
            Orodha ya Migahawa Bora
          </h2>
          <p className="text-xs text-muted-foreground">
            Restaurant Leaderboard — Ranked by revenue
          </p>
        </div>

        {leaderboard.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Hakuna data
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {leaderboard.map((entry) => {
                const revenuePct = Math.round(
                  (entry.revenue / maxLeaderboardRevenue) * 100
                );
                return (
                  <div
                    key={entry.tenantId}
                    className="flex items-center gap-4 rounded-lg p-3 transition hover:bg-muted/30"
                  >
                    {/* Rank Badge */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        entry.rank === 1
                          ? "bg-[#E8712B]/10 text-[#E8712B]"
                          : entry.rank === 2
                          ? "bg-[#2D7A3A]/10 text-[#2D7A3A]"
                          : entry.rank === 3
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      #{entry.rank}
                    </div>

                    {/* Restaurant Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="min-w-0">
                          <Link
                            href={`/admin/restaurants/${entry.tenantId}`}
                            className="text-sm font-semibold text-foreground hover:text-[#2D7A3A] transition truncate block"
                          >
                            {entry.name}
                          </Link>
                          <p className="text-[10px] text-muted-foreground">
                            {entry.city}
                          </p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-sm font-semibold text-foreground">
                            TZS {fmt(entry.revenue)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {fmt(entry.orders)} oda
                          </p>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/50">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${revenuePct}%`,
                            backgroundColor:
                              entry.rank === 1 ? "#E8712B" : "#2D7A3A",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Benchmark */}
            <div className="mt-4 flex items-center gap-2 border-t border-dashed border-border pt-4">
              <svg
                className="h-3.5 w-3.5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs text-muted-foreground">
                Wastani wa mapato: TZS {fmt(avgLeaderboardRevenue)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
