"use client";

import { useState, useEffect } from "react";

interface RevenueData {
  period: string;
  totals: { revenue: number; cogs: number; expenses: number; netProfit: number };
  growthPct: number;
  dailyTimeSeries: { date: string; revenue: number; cogs: number; expenses: number; profit: number }[];
  byPaymentMethod: { method: string; amount: number; count: number }[];
  byCity: { city: string; amount: number }[];
  recentTransactions: {
    id: string;
    orderNumber: number;
    restaurant: string;
    cashier: string;
    amount: number;
    paymentMethod: string | null;
    paymentStatus: string;
    status: string;
    createdAt: string;
  }[];
}

interface Stats {
  mrr: number;
  arr: number;
  revenueThisMonth: number;
  netProfitThisMonth: number;
  approvedRestaurants: number;
}

function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("sw-TZ", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function shortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("sw-TZ", { day: "2-digit", month: "short" });
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Taslimu",
  mpesa: "M-Pesa",
  tigopesa: "Tigo Pesa",
  airtelmoney: "Airtel Money",
  halopesa: "Halo Pesa",
  card: "Kadi",
  split: "Mchanganyiko",
};

const PAYMENT_COLORS: Record<string, string> = {
  cash: "#2D7A3A",
  mpesa: "#E8712B",
  tigopesa: "#3B82F6",
  airtelmoney: "#EF4444",
  halopesa: "#7C3AED",
  card: "#F59E0B",
  split: "#6B7280",
};

const STATUS_BADGE: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

const STATUS_LABEL: Record<string, string> = {
  paid: "Limelipwa",
  pending: "Linasubiri",
  failed: "Limeshindwa",
  refunded: "Limerudishwa",
};

type Period = "week" | "month" | "quarter" | "year";

export default function RevenuePage() {
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<RevenueData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/revenue?period=${period}`).then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ])
      .then(([revenueData, statsData]) => {
        setData(revenueData);
        setStats(statsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  function exportCSV() {
    if (!data) return;
    const rows = [["Tarehe", "Mgahawa", "Kiasi (TZS)", "Njia ya Malipo", "Hali"]];
    for (const t of data.recentTransactions) {
      rows.push([
        new Date(t.createdAt).toISOString(),
        t.restaurant,
        String(t.amount),
        t.paymentMethod || "-",
        t.paymentStatus,
      ]);
    }
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mapato-${period}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  const totalRevenue = data?.totals.revenue || 0;
  const maxCityAmount = Math.max(...(data?.byCity || []).map((c) => c.amount), 1);
  const maxBarVal = Math.max(...(data?.dailyTimeSeries || []).map((d) => d.revenue), 1);
  const activeTenantCount = stats?.approvedRestaurants || 1;
  const profitMargin = totalRevenue > 0 ? Math.round((data?.totals.netProfit || 0) / totalRevenue * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header + Period Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mapato ya Jukwaa</h1>
          <p className="text-sm text-muted-foreground">Platform Revenue — Real-time financial overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {([
              { value: "week" as Period, label: "Wiki Hii" },
              { value: "month" as Period, label: "Mwezi Huu" },
              { value: "quarter" as Period, label: "Robo Mwaka" },
              { value: "year" as Period, label: "Mwaka" },
            ]).map((p) => (
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
          <button
            onClick={exportCSV}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </span>
          </button>
        </div>
      </div>

      {/* KPI Cards with comparative context */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">MRR — Mapato ya Mwezi</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D7A3A]/10">
              <svg className="h-4 w-4 text-[#2D7A3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">TZS {fmt(stats?.mrr || 0)}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{activeTenantCount} migahawa hai</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">ARR — Mapato ya Mwaka</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">TZS {fmt(stats?.arr || 0)}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Annual projection</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Mapato Halisi</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">TZS {fmt(totalRevenue)}</p>
          <p className="mt-1 text-xs font-medium">
            {data?.growthPct !== undefined && data.growthPct !== 0 ? (
              <span className={`flex items-center gap-1 ${data.growthPct > 0 ? "text-green-600" : "text-red-600"}`}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={data.growthPct > 0 ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
                {data.growthPct > 0 ? "+" : ""}{data.growthPct}% vs kipindi kilichopita
              </span>
            ) : (
              <span className="text-muted-foreground">Net Revenue</span>
            )}
          </p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-yellow-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Kiwango cha Ukusanyaji</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10">
              <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-yellow-600">{profitMargin}%</p>
          <p className="mt-1 text-[10px] text-muted-foreground">Profit Margin</p>
        </div>
      </div>

      {/* Revenue Bar Chart */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <div>
          <h2 className="text-sm font-bold text-foreground">Mapato kwa Wakati</h2>
          <p className="text-xs text-muted-foreground">Revenue Over Time (TZS)</p>
        </div>

        {(data?.dailyTimeSeries || []).length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <svg className="h-12 w-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm font-medium text-muted-foreground">Hakuna data ya mapato kwa kipindi hiki</p>
            <button
              onClick={() => setPeriod("month")}
              className="rounded-lg bg-[#2D7A3A] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1B5227]"
            >
              Tazama Mwezi Uliopita
            </button>
          </div>
        ) : (
          <div className="mt-6 flex items-end gap-1 overflow-x-auto" style={{ height: 220, minWidth: 0 }}>
            {data?.dailyTimeSeries.map((d, i) => {
              const heightPct = (d.revenue / maxBarVal) * 100;
              const isLast = i === (data?.dailyTimeSeries.length || 0) - 1;
              return (
                <div key={d.date} className="flex flex-1 min-w-[20px] flex-col items-center gap-1" title={`${d.date}: TZS ${fmt(d.revenue)}`}>
                  <p className="text-[8px] font-medium text-foreground whitespace-nowrap">
                    {d.revenue >= 1000000 ? `${(d.revenue / 1000000).toFixed(1)}M` : d.revenue >= 1000 ? `${Math.round(d.revenue / 1000)}K` : fmt(d.revenue)}
                  </p>
                  <div className="relative w-full flex justify-center">
                    <div
                      className="w-full max-w-[28px] rounded-t-md transition-all duration-500"
                      style={{
                        height: `${Math.max(heightPct * 1.6, 4)}px`,
                        backgroundColor: isLast ? "#E8712B" : "#2D7A3A",
                        opacity: 0.6 + i * (0.4 / Math.max((data?.dailyTimeSeries.length || 1), 1)),
                      }}
                    />
                  </div>
                  <p className="text-[7px] text-muted-foreground whitespace-nowrap">{shortDate(d.date)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Revenue by City + Payment Methods */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* By City */}
        <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
          <h2 className="text-sm font-bold text-foreground">Mapato kwa Mkoa</h2>
          <p className="text-xs text-muted-foreground mb-5">Revenue by Region</p>
          {(data?.byCity || []).length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Hakuna data</p>
          ) : (
            <div className="space-y-4">
              {data?.byCity.map((c, i) => {
                const pct = Math.round((c.amount / maxCityAmount) * 100);
                const colors = ["#2D7A3A", "#3A9D4A", "#E8712B", "#3B82F6", "#9CA3AF"];
                return (
                  <div key={c.city}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-foreground">{c.city}</span>
                      <span className="font-semibold text-foreground">TZS {fmt(c.amount)}</span>
                    </div>
                    <div className="h-7 w-full rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-lg flex items-center justify-end pr-2 text-[10px] font-bold text-white transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }}
                      >
                        {Math.round((c.amount / totalRevenue) * 100)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* By Payment Method */}
        <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
          <h2 className="text-sm font-bold text-foreground">Mapato kwa Njia ya Malipo</h2>
          <p className="text-xs text-muted-foreground mb-5">Revenue by Payment Method</p>
          {(data?.byPaymentMethod || []).length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Hakuna data</p>
          ) : (
            <div className="space-y-3">
              {data?.byPaymentMethod.sort((a, b) => b.amount - a.amount).map((p) => {
                const pct = totalRevenue > 0 ? Math.round((p.amount / totalRevenue) * 100) : 0;
                return (
                  <div key={p.method} className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-sm shrink-0"
                      style={{ backgroundColor: PAYMENT_COLORS[p.method || ""] || "#6B7280" }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">
                          {PAYMENT_LABELS[p.method || ""] || p.method}
                        </span>
                        <span className="text-sm font-semibold text-foreground">TZS {fmt(p.amount)}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/50">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: PAYMENT_COLORS[p.method || ""] || "#6B7280",
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{p.count} oda</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-foreground">Kumbukumbu za Miamala</h2>
          <p className="text-xs text-muted-foreground">Recent Transactions</p>
        </div>

        {(data?.recentTransactions || []).length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Hakuna miamala kwa kipindi hiki</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Tarehe</th>
                  <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Mgahawa</th>
                  <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Kiasi (TZS)</th>
                  <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Njia</th>
                  <th className="pb-3 text-xs font-semibold text-muted-foreground">Hali</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.recentTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition">
                    <td className="py-3 pr-4 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                    <td className="py-3 pr-4 font-medium text-foreground">{t.restaurant}</td>
                    <td className="py-3 pr-4 font-semibold text-foreground">TZS {fmt(t.amount)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {PAYMENT_LABELS[t.paymentMethod || ""] || t.paymentMethod || "-"}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[t.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABEL[t.paymentStatus] || t.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
