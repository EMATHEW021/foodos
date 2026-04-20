"use client";

import { useState } from "react";

/* ──────────────────── DATA ──────────────────── */

const monthlyRevenue = [
  { month: "Jan", mrr: 650, arr: 7800, net: 614 },
  { month: "Feb", mrr: 670, arr: 8040, net: 633 },
  { month: "Mar", mrr: 690, arr: 8280, net: 652 },
  { month: "Apr", mrr: 720, arr: 8640, net: 680 },
  { month: "May", mrr: 758, arr: 9096, net: 716 },
  { month: "Jun", mrr: 795, arr: 9540, net: 751 },
  { month: "Jul", mrr: 830, arr: 9960, net: 784 },
  { month: "Aug", mrr: 870, arr: 10440, net: 822 },
  { month: "Sep", mrr: 915, arr: 10980, net: 864 },
  { month: "Oct", mrr: 950, arr: 11400, net: 897 },
  { month: "Nov", mrr: 988, arr: 11856, net: 933 },
  { month: "Dec", mrr: 1028, arr: 12336, net: 971 },
];

const planTiers = [
  { name: "Bure (Free)", amount: 0, color: "#9CA3AF", pct: 0 },
  { name: "Mwanzo (Starter)", amount: 435000, color: "#2D7A3A", pct: 42 },
  { name: "Kitaalamu (Professional)", amount: 295000, color: "#3B82F6", pct: 29 },
  { name: "Biashara (Business)", amount: 298000, color: "#7C3AED", pct: 29 },
];

const regions = [
  { name: "Dar es Salaam", amount: 680000, pct: 66 },
  { name: "Arusha", amount: 148000, pct: 14 },
  { name: "Mwanza", amount: 87000, pct: 8 },
  { name: "Zanzibar", amount: 58000, pct: 6 },
  { name: "Nyinginezo (Other)", amount: 55000, pct: 5 },
];

const paymentCollection = [
  { restaurant: "Mama Lishe Kitchen", due: 45000, status: "Paid" as const, method: "M-Pesa", date: "2026-04-18" },
  { restaurant: "Dar Biriyani House", due: 65000, status: "Paid" as const, method: "Tigo Pesa", date: "2026-04-17" },
  { restaurant: "Chapati House", due: 35000, status: "Overdue" as const, method: "-", date: "2026-04-10" },
  { restaurant: "Zanzibar Spice", due: 45000, status: "Paid" as const, method: "M-Pesa", date: "2026-04-16" },
  { restaurant: "Kilimanjaro Bites", due: 65000, status: "Pending" as const, method: "-", date: "2026-04-19" },
  { restaurant: "Arusha Grills", due: 45000, status: "Paid" as const, method: "Benki", date: "2026-04-15" },
  { restaurant: "Mwanza Fish Point", due: 35000, status: "Overdue" as const, method: "-", date: "2026-04-05" },
  { restaurant: "Dodoma Meals", due: 45000, status: "Paid" as const, method: "M-Pesa", date: "2026-04-14" },
  { restaurant: "Pwani Delights", due: 65000, status: "Pending" as const, method: "-", date: "2026-04-20" },
  { restaurant: "Tanga Flavours", due: 35000, status: "Paid" as const, method: "Airtel Money", date: "2026-04-13" },
];

const transactions = [
  { date: "2026-04-19 14:22", restaurant: "Mama Lishe Kitchen", amount: 45000, type: "Subscription" as const, method: "M-Pesa", status: "Success" as const },
  { date: "2026-04-19 11:05", restaurant: "Kilimanjaro Bites", amount: 65000, type: "Upgrade" as const, method: "Tigo Pesa", status: "Pending" as const },
  { date: "2026-04-18 16:30", restaurant: "Dar Biriyani House", amount: 65000, type: "Subscription" as const, method: "Tigo Pesa", status: "Success" as const },
  { date: "2026-04-18 09:45", restaurant: "Zanzibar Spice", amount: 45000, type: "Subscription" as const, method: "M-Pesa", status: "Success" as const },
  { date: "2026-04-17 15:20", restaurant: "Arusha Grills", amount: 45000, type: "Subscription" as const, method: "Benki", status: "Success" as const },
  { date: "2026-04-17 10:12", restaurant: "Tanga Flavours", amount: 35000, type: "Subscription" as const, method: "Airtel Money", status: "Success" as const },
  { date: "2026-04-16 14:55", restaurant: "Dodoma Meals", amount: 45000, type: "Subscription" as const, method: "M-Pesa", status: "Success" as const },
  { date: "2026-04-16 08:30", restaurant: "Pwani Delights", amount: 20000, type: "Refund" as const, method: "M-Pesa", status: "Success" as const },
  { date: "2026-04-15 17:40", restaurant: "Mama Lishe Kitchen", amount: 20000, type: "Upgrade" as const, method: "M-Pesa", status: "Success" as const },
  { date: "2026-04-15 12:10", restaurant: "Dar Biriyani House", amount: 65000, type: "Subscription" as const, method: "Tigo Pesa", status: "Failed" as const },
  { date: "2026-04-14 16:22", restaurant: "Zanzibar Spice", amount: 45000, type: "Subscription" as const, method: "M-Pesa", status: "Success" as const },
  { date: "2026-04-14 10:08", restaurant: "Kilimanjaro Bites", amount: 30000, type: "Upgrade" as const, method: "M-Pesa", status: "Success" as const },
  { date: "2026-04-13 15:30", restaurant: "Mwanza Fish Point", amount: 35000, type: "Subscription" as const, method: "M-Pesa", status: "Failed" as const },
  { date: "2026-04-13 09:15", restaurant: "Arusha Grills", amount: 45000, type: "Subscription" as const, method: "Benki", status: "Success" as const },
  { date: "2026-04-12 14:50", restaurant: "Chapati House", amount: 35000, type: "Subscription" as const, method: "M-Pesa", status: "Failed" as const },
  { date: "2026-04-12 08:20", restaurant: "Tanga Flavours", amount: 35000, type: "Subscription" as const, method: "Airtel Money", status: "Success" as const },
  { date: "2026-04-11 16:40", restaurant: "Dodoma Meals", amount: 45000, type: "Subscription" as const, method: "M-Pesa", status: "Success" as const },
  { date: "2026-04-11 11:05", restaurant: "Pwani Delights", amount: 65000, type: "Subscription" as const, method: "Tigo Pesa", status: "Success" as const },
  { date: "2026-04-10 15:30", restaurant: "Mama Lishe Kitchen", amount: 15000, type: "Refund" as const, method: "M-Pesa", status: "Success" as const },
  { date: "2026-04-10 09:45", restaurant: "Dar Biriyani House", amount: 65000, type: "Subscription" as const, method: "Tigo Pesa", status: "Success" as const },
];

/* ──────────────────── HELPERS ──────────────────── */

function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Paid: "bg-green-100 text-green-700",
    Overdue: "bg-red-100 text-red-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Success: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}

function typeBadge(type: string) {
  const map: Record<string, string> = {
    Subscription: "bg-blue-100 text-blue-700",
    Upgrade: "bg-purple-100 text-purple-700",
    Refund: "bg-orange-100 text-orange-700",
  };
  return map[type] || "bg-gray-100 text-gray-700";
}

/* ──────────────────── COMPONENT ──────────────────── */

export default function PlatformRevenuePage() {
  const [chartMode, setChartMode] = useState<"mrr" | "arr" | "net">("mrr");
  const [collectionFilter, setCollectionFilter] = useState<"All" | "Paid" | "Overdue" | "Pending">("All");

  const filteredPayments = collectionFilter === "All"
    ? paymentCollection
    : paymentCollection.filter((p) => p.status === collectionFilter);

  /* chart scaling */
  const chartKey = chartMode;
  const maxVal = Math.max(...monthlyRevenue.map((m) => m[chartKey]));

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mapato ya Jukwaa</h1>
        <p className="text-sm text-muted-foreground">Platform Revenue — SaaS subscription income overview</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* MRR */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">MRR — Mapato ya Mwezi</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-sm">
              <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">TZS {fmt(1028000)}</p>
          <p className="mt-1 text-xs text-green-600 font-medium">+18% kuliko mwezi uliopita</p>
        </div>

        {/* ARR */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">ARR — Mapato ya Mwaka</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-sm">
              <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" /></svg>
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">TZS {fmt(12336000)}</p>
          <p className="mt-1 text-xs text-green-600 font-medium">Annual Recurring Revenue</p>
        </div>

        {/* ARPU */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">ARPU — Wastani kwa Mgahawa</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">TZS {fmt(46727)}</p>
          <p className="mt-1 text-xs text-blue-500 font-medium">Average Revenue Per Restaurant</p>
        </div>

        {/* Collection Rate */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-yellow-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Kiwango cha Ukusanyaji</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-sm">
              <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-yellow-600">94.5%</p>
          <p className="mt-1 text-xs text-yellow-600 font-medium">Collection Rate</p>
        </div>
      </div>

      {/* ── Revenue Over Time (Bar Chart) ── */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground">Mapato kwa Wakati</h2>
            <p className="text-xs text-muted-foreground">Revenue Over Time — Last 12 months (TZS &apos;000)</p>
          </div>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(["mrr", "arr", "net"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setChartMode(mode)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  chartMode === mode
                    ? "bg-[#2D7A3A] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "mrr" ? "MRR" : mode === "arr" ? "ARR" : "Net Revenue"}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="mt-6 flex items-end gap-2" style={{ height: 220 }}>
          {monthlyRevenue.map((m, i) => {
            const val = m[chartKey];
            const heightPct = (val / maxVal) * 100;
            const isLast = i === monthlyRevenue.length - 1;
            return (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                <p className="text-[10px] font-medium text-foreground">{fmt(val)}K</p>
                <div className="relative w-full flex justify-center">
                  <div
                    className="w-full max-w-[32px] rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${heightPct * 1.8}px`,
                      backgroundColor: isLast ? "#E8712B" : "#2D7A3A",
                      opacity: 0.6 + i * 0.035,
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">{m.month}</p>
              </div>
            );
          })}
        </div>

        {/* Trend line indicator */}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-0.5 w-6 bg-[#E8712B] rounded" />
          <span>Mwenendo wa kupanda (Upward trend) — +66% growth YTD</span>
        </div>
      </div>

      {/* ── Revenue by Plan Tier & Region ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Plan Tiers - Horizontal Stacked Bar */}
        <div className="rounded-xl bg-card p-6 shadow-sm">
          <h2 className="text-sm font-bold text-foreground">Mapato kwa Mpango</h2>
          <p className="text-xs text-muted-foreground mb-5">Revenue by Plan Tier</p>

          {/* Stacked bar */}
          <div className="mb-5">
            <div className="flex h-10 w-full overflow-hidden rounded-lg">
              {planTiers.filter(t => t.pct > 0).map((tier) => (
                <div
                  key={tier.name}
                  className="flex items-center justify-center text-[10px] font-bold text-white transition-all"
                  style={{ width: `${tier.pct}%`, backgroundColor: tier.color }}
                  title={`${tier.name}: TZS ${fmt(tier.amount)}`}
                >
                  {tier.pct}%
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {planTiers.map((tier) => (
              <div key={tier.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: tier.color }} />
                  <span className="text-sm text-foreground">{tier.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">TZS {fmt(tier.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Region */}
        <div className="rounded-xl bg-card p-6 shadow-sm">
          <h2 className="text-sm font-bold text-foreground">Mapato kwa Mkoa</h2>
          <p className="text-xs text-muted-foreground mb-5">Revenue by Region</p>

          <div className="space-y-4">
            {regions.map((r, i) => (
              <div key={r.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-foreground">{r.name}</span>
                  <span className="font-semibold text-foreground">TZS {fmt(r.amount)}</span>
                </div>
                <div className="h-7 w-full rounded-lg bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-lg flex items-center justify-end pr-2 text-[10px] font-bold text-white transition-all duration-500"
                    style={{
                      width: `${r.pct}%`,
                      backgroundColor: i === 0 ? "#2D7A3A" : i === 1 ? "#3A9D4A" : i === 2 ? "#E8712B" : i === 3 ? "#3B82F6" : "#9CA3AF",
                    }}
                  >
                    {r.pct}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Payment Collection Table ── */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h2 className="text-sm font-bold text-foreground">Ukusanyaji wa Malipo</h2>
            <p className="text-xs text-muted-foreground">Payment Collection — Track subscription payments</p>
          </div>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(["All", "Paid", "Overdue", "Pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setCollectionFilter(f)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  collectionFilter === f
                    ? "bg-[#2D7A3A] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "All" ? "Zote" : f === "Paid" ? "Limelipwa" : f === "Overdue" ? "Limechelewa" : "Linasubiri"}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Mgahawa</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Kiasi (TZS)</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Hali</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Njia</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Tarehe</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground">Vitendo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments.map((p, i) => (
                <tr key={i} className={`${p.status === "Overdue" ? "bg-red-50/50" : ""} hover:bg-muted/30 transition`}>
                  <td className="py-3 pr-4 font-medium text-foreground">{p.restaurant}</td>
                  <td className="py-3 pr-4 text-foreground font-semibold">TZS {fmt(p.due)}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(p.status)}`}>
                      {p.status === "Paid" ? "Limelipwa" : p.status === "Overdue" ? "Limechelewa" : "Linasubiri"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.method}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.date}</td>
                  <td className="py-3">
                    <div className="flex gap-1.5">
                      {p.status === "Overdue" && (
                        <button className="rounded-md bg-[#E8712B] px-2.5 py-1 text-[10px] font-medium text-white hover:bg-[#d4641f] transition">
                          Kumbuka
                        </button>
                      )}
                      {p.status !== "Paid" && (
                        <button className="rounded-md bg-[#2D7A3A] px-2.5 py-1 text-[10px] font-medium text-white hover:bg-[#1B5227] transition">
                          Lipwa
                        </button>
                      )}
                      {p.status === "Overdue" && (
                        <button className="rounded-md bg-gray-200 px-2.5 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-300 transition">
                          Futa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Hakuna malipo yenye hali hii
          </div>
        )}
      </div>

      {/* ── Transaction Log ── */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-foreground">Kumbukumbu za Miamala</h2>
          <p className="text-xs text-muted-foreground">Transaction Log — Recent 20 transactions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Tarehe</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Mgahawa</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Kiasi (TZS)</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Aina</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Njia</th>
                <th className="pb-3 text-xs font-semibold text-muted-foreground">Hali</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((t, i) => (
                <tr key={i} className="hover:bg-muted/30 transition">
                  <td className="py-3 pr-4 text-muted-foreground text-xs whitespace-nowrap">{t.date}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{t.restaurant}</td>
                  <td className="py-3 pr-4 font-semibold text-foreground">
                    {t.type === "Refund" ? (
                      <span className="text-red-600">-TZS {fmt(t.amount)}</span>
                    ) : (
                      <>TZS {fmt(t.amount)}</>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${typeBadge(t.type)}`}>
                      {t.type === "Subscription" ? "Usajili" : t.type === "Upgrade" ? "Kupandisha" : "Kurudisha"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{t.method}</td>
                  <td className="py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusBadge(t.status)}`}>
                      {t.status === "Success" ? "Imefanikiwa" : t.status === "Pending" ? "Inasubiri" : "Imeshindwa"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
