"use client";

import { useState } from "react";
import Link from "next/link";

/* ══════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════ */

/* ── KPI Cards ── */
interface KpiCard {
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
  color: string;
  sparkline: number[];
  pulse?: boolean;
}

const kpiCards: KpiCard[] = [
  {
    label: "Migahawa Hai",
    value: "47",
    change: "+8",
    changePositive: true,
    color: "#2D7A3A",
    sparkline: [28, 31, 33, 36, 38, 42, 47],
  },
  {
    label: "MRR",
    value: "TZS 1,028,000",
    change: "+18%",
    changePositive: true,
    color: "#2D7A3A",
    sparkline: [620, 710, 750, 830, 880, 960, 1028],
  },
  {
    label: "Oda za Leo",
    value: "1,247",
    change: "+124",
    changePositive: true,
    color: "#3b82f6",
    sparkline: [980, 1050, 1120, 1080, 1190, 1210, 1247],
  },
  {
    label: "Watumiaji Hai",
    value: "186",
    change: "+12",
    changePositive: true,
    color: "#14b8a6",
    sparkline: [140, 148, 155, 162, 170, 178, 186],
  },
  {
    label: "Churn",
    value: "2.1%",
    change: "-0.4%",
    changePositive: true,
    color: "#2D7A3A",
    sparkline: [3.8, 3.5, 3.2, 2.9, 2.7, 2.5, 2.1],
  },
  {
    label: "KYC Pending",
    value: "3",
    change: "Inasubiri",
    changePositive: false,
    color: "#E8712B",
    sparkline: [8, 6, 5, 4, 5, 4, 3],
    pulse: true,
  },
];

/* ── Revenue Chart Data (30 days) ── */
function generateRevenueDays(): { date: string; amount: number }[] {
  const days = [];
  const base = 800000;
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = `${d.getDate()}/${d.getMonth() + 1}`;
    const variation = Math.floor(Math.random() * 400000) + base + (29 - i) * 8000;
    days.push({ date: dayStr, amount: variation });
  }
  return days;
}

const revenueWeekly = generateRevenueDays().slice(-7);
const revenueMonthly = generateRevenueDays();
const revenueQuarterly = (() => {
  const weeks = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    weeks.push({
      date: `W${12 - i}`,
      amount: Math.floor(Math.random() * 600000) + 700000 + (12 - i) * 30000,
    });
  }
  return weeks;
})();

/* ── Recent Signups (Migahawa Mapya) ── */
interface RecentRestaurant {
  name: string;
  city: string;
  plan: "Bure" | "Mwanzo" | "Kitaalamu" | "Biashara";
  status: "active" | "pending" | "trial";
  date: string;
}

const recentRestaurants: RecentRestaurant[] = [
  { name: "Mama Ntilie Kitchen", city: "Dar es Salaam", plan: "Mwanzo", status: "active", date: "Leo 14:32" },
  { name: "Chips Mayai Corner", city: "Arusha", plan: "Bure", status: "trial", date: "Leo 11:05" },
  { name: "Pilau House Dodoma", city: "Dodoma", plan: "Kitaalamu", status: "active", date: "Jana 18:20" },
  { name: "Ugali na Nyama Palace", city: "Mwanza", plan: "Mwanzo", status: "active", date: "Jana 15:44" },
  { name: "Biryani ya Baba", city: "Dar es Salaam", plan: "Biashara", status: "active", date: "Jana 09:12" },
  { name: "Mishkaki Express", city: "Dar es Salaam", plan: "Bure", status: "pending", date: "Apr 18" },
  { name: "Ndizi Nyama Spot", city: "Arusha", plan: "Mwanzo", status: "active", date: "Apr 18" },
  { name: "Samaki Freshi Hub", city: "Dar es Salaam", plan: "Kitaalamu", status: "active", date: "Apr 17" },
  { name: "Chapati Zone", city: "Mwanza", plan: "Bure", status: "trial", date: "Apr 17" },
  { name: "Nyama Choma Brothers", city: "Dar es Salaam", plan: "Mwanzo", status: "active", date: "Apr 16" },
];

/* ── Activity Feed ── */
interface ActivityEvent {
  icon: "restaurant" | "payment" | "user" | "kyc" | "subscription" | "order" | "alert" | "system";
  text: string;
  time: string;
}

const activityFeed: ActivityEvent[] = [
  { icon: "restaurant", text: "Mama Ntilie Kitchen imejisajili", time: "Dakika 3 zilizopita" },
  { icon: "payment", text: "M-Pesa: TZS 45,000 kutoka Biryani ya Baba", time: "Dakika 8 zilizopita" },
  { icon: "user", text: "Fatma Bakari ameingia kama Mkusanyaji", time: "Dakika 12 zilizopita" },
  { icon: "kyc", text: "KYC ya Pilau House Dodoma imethibitishwa", time: "Dakika 25 zilizopita" },
  { icon: "order", text: "Oda #4521 imekamilika - Chips Mayai Corner", time: "Dakika 30 zilizopita" },
  { icon: "subscription", text: "Samaki Freshi Hub imepanda Kitaalamu", time: "Saa 1 iliyopita" },
  { icon: "payment", text: "Tigo Pesa: TZS 30,000 kutoka Chapati Zone", time: "Saa 1 iliyopita" },
  { icon: "alert", text: "Stoku ya mchele imepungua - Ugali na Nyama Palace", time: "Saa 2 zilizopita" },
  { icon: "user", text: "Joseph Mwanga amebadilisha PIN yake", time: "Saa 2 zilizopita" },
  { icon: "system", text: "Backup ya database imekamilika", time: "Saa 3 zilizopita" },
  { icon: "restaurant", text: "Chips Mayai Corner imeanza kipindi cha majaribio", time: "Saa 4 zilizopita" },
  { icon: "order", text: "Oda 200 zimekamilika leo - Dar es Salaam", time: "Saa 5 zilizopita" },
];

/* ── Plan Distribution ── */
const planData = [
  { name: "Bure", count: 25, color: "#9ca3af" },
  { name: "Mwanzo", count: 15, color: "#2D7A3A" },
  { name: "Kitaalamu", count: 5, color: "#E8712B" },
  { name: "Biashara", count: 2, color: "#7c3aed" },
];
const totalPlans = planData.reduce((sum, p) => sum + p.count, 0);

/* ── City Distribution ── */
const cityData = [
  { name: "Dar", count: 28 },
  { name: "Arusha", count: 8 },
  { name: "Mwanza", count: 5 },
  { name: "Dodoma", count: 3 },
  { name: "Nyingine", count: 3 },
];
const maxCity = Math.max(...cityData.map((c) => c.count));

/* ── Payment Methods ── */
const paymentData = [
  { name: "M-Pesa", pct: 45, color: "#2D7A3A" },
  { name: "Cash", pct: 30, color: "#6b7280" },
  { name: "Tigo Pesa", pct: 15, color: "#3b82f6" },
  { name: "Airtel", pct: 7, color: "#ef4444" },
  { name: "Nyingine", pct: 3, color: "#9ca3af" },
];

/* ══════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════ */

function planBadgeStyle(plan: string) {
  switch (plan) {
    case "Bure":
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    case "Mwanzo":
      return "bg-[#2D7A3A]/10 text-[#2D7A3A]";
    case "Kitaalamu":
      return "bg-[#E8712B]/10 text-[#E8712B]";
    case "Biashara":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function statusDot(status: string) {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "trial":
      return "bg-blue-500";
    default:
      return "bg-gray-400";
  }
}

function activityIcon(icon: string) {
  switch (icon) {
    case "restaurant":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2D7A3A]/10">
          <svg className="h-4 w-4 text-[#2D7A3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      );
    case "payment":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      );
    case "user":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    case "kyc":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8712B]/10">
          <svg className="h-4 w-4 text-[#E8712B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    case "order":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
          <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      );
    case "subscription":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
          <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      );
    case "alert":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
    case "system":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

/* ══════════════════════════════════════════
   SPARKLINE COMPONENT
   ══════════════════════════════════════════ */

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 28 }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-[2px] transition-all"
          style={{
            height: `${Math.max(((v - min) / range) * 100, 12)}%`,
            backgroundColor: color,
            opacity: 0.4 + (i / data.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */

export default function AdminDashboard() {
  const [revenuePeriod, setRevenuePeriod] = useState<"wiki" | "mwezi" | "miezi3">("mwezi");

  const revenueData =
    revenuePeriod === "wiki"
      ? revenueWeekly
      : revenuePeriod === "mwezi"
      ? revenueMonthly
      : revenueQuarterly;

  const maxRevenue = Math.max(...revenueData.map((d) => d.amount));

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashibodi</h1>
        <p className="text-sm text-muted-foreground">
          Muhtasari wa jukwaa la FoodOS
        </p>
      </div>

      {/* ══════════════════════════════════════════
          KPI CARDS (3x2 grid)
         ══════════════════════════════════════════ */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className={`rounded-xl bg-card p-5 shadow-sm border border-border transition hover:shadow-md ${
              kpi.pulse ? "relative overflow-hidden" : ""
            }`}
          >
            {/* Pulse glow for KYC */}
            {kpi.pulse && (
              <div className="absolute top-3 right-3">
                <span className="relative flex h-3 w-3">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: kpi.color }}
                  />
                  <span
                    className="relative inline-flex h-3 w-3 rounded-full"
                    style={{ backgroundColor: kpi.color }}
                  />
                </span>
              </div>
            )}

            <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>

            <div className="mt-2 flex items-end justify-between gap-2">
              <p className="text-2xl font-bold" style={{ color: kpi.color }}>
                {kpi.value}
              </p>
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  kpi.changePositive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                }`}
              >
                {kpi.changePositive && kpi.label !== "Churn" && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                )}
                {kpi.label === "Churn" && kpi.changePositive && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {kpi.change}
              </span>
            </div>

            {/* Sparkline */}
            <div className="mt-3 pt-3 border-t border-border">
              <Sparkline data={kpi.sparkline} color={kpi.color} />
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          REVENUE CHART (full width)
         ══════════════════════════════════════════ */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground">Mapato</h2>
            <p className="text-xs text-muted-foreground">Mwenendo wa mapato kwa TZS</p>
          </div>
          <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
            {(["wiki", "mwezi", "miezi3"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setRevenuePeriod(p)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  revenuePeriod === p
                    ? "bg-[#2D7A3A] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "wiki" ? "Wiki" : p === "mwezi" ? "Mwezi" : "Miezi 3"}
              </button>
            ))}
          </div>
        </div>

        {/* Y-axis + Bars */}
        <div className="mt-6 flex gap-2">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between text-right pr-1" style={{ height: 200 }}>
            <span className="text-[9px] text-muted-foreground">
              {(maxRevenue / 1000).toFixed(0)}k
            </span>
            <span className="text-[9px] text-muted-foreground">
              {(maxRevenue / 2000).toFixed(0)}k
            </span>
            <span className="text-[9px] text-muted-foreground">0</span>
          </div>

          {/* Bars */}
          <div className="flex flex-1 items-end gap-[2px]" style={{ height: 200 }}>
            {revenueData.map((d, i) => {
              const h = (d.amount / maxRevenue) * 180;
              return (
                <div key={i} className="group relative flex flex-1 flex-col items-center">
                  <div
                    className="w-full rounded-t-[3px] bg-[#2D7A3A] transition-all group-hover:bg-[#3A9D4A]"
                    style={{ height: `${h}px` }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden rounded-md bg-foreground px-2 py-1 text-[9px] text-background shadow-lg whitespace-nowrap group-hover:block z-10">
                    TZS {d.amount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis dates */}
        <div className="mt-1 flex gap-[2px] pl-8">
          {revenueData.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              {(i % Math.ceil(revenueData.length / 8) === 0 || i === revenueData.length - 1) && (
                <span className="text-[8px] text-muted-foreground">{d.date}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          TWO COLUMNS: Table + Activity Feed
         ══════════════════════════════════════════ */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* ── Left: Migahawa Mapya Table (60%) ── */}
        <div className="lg:col-span-3 rounded-xl bg-card shadow-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-foreground">Migahawa Mapya</h2>
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
            <p className="col-span-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Jina
            </p>
            <p className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mji
            </p>
            <p className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mpango
            </p>
            <p className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Hali
            </p>
            <p className="col-span-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right">
              Tarehe
            </p>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {recentRestaurants.map((r, i) => (
              <div
                key={i}
                className="flex flex-col gap-1.5 px-5 py-3 transition hover:bg-muted/10 sm:grid sm:grid-cols-12 sm:items-center sm:gap-3"
              >
                <div className="col-span-4">
                  <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">{r.city}</p>
                </div>
                <div className="col-span-2">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${planBadgeStyle(r.plan)}`}>
                    {r.plan}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${statusDot(r.status)}`} />
                    <span className="text-[11px] text-muted-foreground capitalize">
                      {r.status === "active" ? "Hai" : r.status === "pending" ? "Inasubiri" : "Majaribio"}
                    </span>
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-[11px] text-muted-foreground">{r.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Activity Feed (40%) ── */}
        <div className="lg:col-span-2 rounded-xl bg-card shadow-sm border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-foreground">Mtiririko wa Shughuli</h2>
              <p className="text-[10px] text-muted-foreground">Matukio ya hivi karibuni</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Moja kwa moja
            </span>
          </div>

          <div className="divide-y divide-border max-h-[520px] overflow-y-auto">
            {activityFeed.map((event, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-muted/10">
                {activityIcon(event.icon)}
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-foreground leading-relaxed">{event.text}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM ROW: 3 equal cards
         ══════════════════════════════════════════ */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Plans Distribution ── */}
        <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
          <h2 className="text-sm font-bold text-foreground">Usambazaji wa Mipango</h2>
          <p className="text-[10px] text-muted-foreground mb-5">Plans Distribution</p>

          {/* Stacked horizontal bar */}
          <div className="h-8 w-full rounded-lg overflow-hidden flex">
            {planData.map((p) => (
              <div
                key={p.name}
                className="h-full transition-all relative group"
                style={{
                  width: `${(p.count / totalPlans) * 100}%`,
                  backgroundColor: p.color,
                }}
              >
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden rounded bg-foreground px-2 py-0.5 text-[9px] text-background shadow whitespace-nowrap group-hover:block z-10">
                  {p.name}: {p.count}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-5 space-y-2.5">
            {planData.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: p.color }} />
                  <span className="text-xs text-foreground">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{p.count}</span>
                  <span className="text-[10px] text-muted-foreground">
                    ({((p.count / totalPlans) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cities Distribution ── */}
        <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
          <h2 className="text-sm font-bold text-foreground">Migahawa kwa Miji</h2>
          <p className="text-[10px] text-muted-foreground mb-5">Restaurants by City</p>

          <div className="flex items-end gap-3 justify-between" style={{ height: 150 }}>
            {cityData.map((c) => {
              const h = (c.count / maxCity) * 130;
              return (
                <div key={c.name} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-foreground">{c.count}</span>
                  <div
                    className="w-full max-w-[40px] rounded-t-md bg-[#2D7A3A] transition-all hover:bg-[#3A9D4A]"
                    style={{ height: `${h}px` }}
                  />
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">
                    {c.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Payment Methods ── */}
        <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
          <h2 className="text-sm font-bold text-foreground">Njia za Malipo</h2>
          <p className="text-[10px] text-muted-foreground mb-5">Payment Methods</p>

          <div className="space-y-3.5">
            {paymentData.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground">{p.name}</span>
                  <span className="text-xs font-bold text-foreground">{p.pct}%</span>
                </div>
                <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${p.pct}%`,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
