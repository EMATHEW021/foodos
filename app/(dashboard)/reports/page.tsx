"use client";

import { useState, useMemo } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type DateRange = "leo" | "wiki" | "mwezi" | "miezi3" | "custom";

interface DailyData {
  date: string;
  label: string;
  revenue: number;
  cogs: number;
  expenses: number;
}

interface MenuItem {
  rank: number;
  name: string;
  quantity: number;
  revenue: number;
  margin: number;
}

interface PaymentMethod {
  name: string;
  amount: number;
  color: string;
}

interface ExpenseCategory {
  name: string;
  nameEn: string;
  amount: number;
}

// ---------------------------------------------------------------------------
// Mock Data Generators
// ---------------------------------------------------------------------------
function generateDailyData(days: number): DailyData[] {
  const data: DailyData[] = [];
  const today = new Date(2026, 3, 19); // April 19, 2026

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const dayOfWeek = d.getDay();
    // Weekends and Fridays get higher revenue
    const baseFactor = dayOfWeek === 5 ? 1.3 : dayOfWeek === 6 ? 1.15 : dayOfWeek === 0 ? 0.85 : 1.0;
    const randomFactor = 0.8 + Math.random() * 0.4;
    const revenue = Math.round((3200000 + Math.random() * 1800000) * baseFactor * randomFactor);
    const cogs = Math.round(revenue * (0.36 + Math.random() * 0.08));
    const expenses = Math.round(600000 + Math.random() * 400000);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ago", "Sep", "Okt", "Nov", "Des"];
    const dayNames = ["Jpi", "Jtt", "Jnn", "Jtn", "Alh", "Iju", "Jms"];

    data.push({
      date: d.toISOString().slice(0, 10),
      label: days <= 7
        ? dayNames[d.getDay()]
        : `${d.getDate()} ${monthNames[d.getMonth()]}`,
      revenue,
      cogs,
      expenses,
    });
  }
  return data;
}

const topSellingItems: MenuItem[] = [
  { rank: 1, name: "Pilau ya Nyama", quantity: 187, revenue: 1870000, margin: 32 },
  { rank: 2, name: "Wali Maharage", quantity: 165, revenue: 825000, margin: 45 },
  { rank: 3, name: "Chips Kuku", quantity: 142, revenue: 1420000, margin: 28 },
  { rank: 4, name: "Ugali Nyama Choma", quantity: 128, revenue: 1792000, margin: 25 },
  { rank: 5, name: "Biriani ya Kuku", quantity: 115, revenue: 1380000, margin: 30 },
  { rank: 6, name: "Chips Mayai", quantity: 108, revenue: 540000, margin: 42 },
  { rank: 7, name: "Mishkaki", quantity: 96, revenue: 960000, margin: 35 },
  { rank: 8, name: "Samaki wa Kupaka", quantity: 82, revenue: 1230000, margin: 22 },
  { rank: 9, name: "Chapati Nyama", quantity: 78, revenue: 780000, margin: 38 },
  { rank: 10, name: "Juice ya Matunda", quantity: 210, revenue: 630000, margin: 55 },
];

const paymentMethods: PaymentMethod[] = [
  { name: "M-Pesa", amount: 12850000, color: "#2D7A3A" },
  { name: "Taslimu (Cash)", amount: 6420000, color: "#E8712B" },
  { name: "Tigo Pesa", amount: 2140000, color: "#E9C46A" },
  { name: "Airtel Money", amount: 1285000, color: "#3A9D4A" },
  { name: "Halopesa", amount: 855000, color: "#F4A261" },
];

const expenseCategories: ExpenseCategory[] = [
  { name: "Malighafi", nameEn: "Raw Materials", amount: 8400000 },
  { name: "Mishahara", nameEn: "Salaries", amount: 4200000 },
  { name: "Kodi", nameEn: "Rent", amount: 2500000 },
  { name: "Umeme", nameEn: "Electricity", amount: 850000 },
  { name: "Gesi", nameEn: "Gas", amount: 620000 },
  { name: "Usafiri", nameEn: "Transport", amount: 380000 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatTZS(amount: number): string {
  if (amount >= 1000000) {
    return `TZS ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `TZS ${(amount / 1000).toFixed(0)}K`;
  }
  return `TZS ${amount.toLocaleString()}`;
}

function formatTZSFull(amount: number): string {
  return `TZS ${amount.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("wiki");
  const [customFrom, setCustomFrom] = useState("2026-04-13");
  const [customTo, setCustomTo] = useState("2026-04-19");

  // Determine how many days to show based on selected range
  const days = useMemo(() => {
    switch (dateRange) {
      case "leo": return 1;
      case "wiki": return 7;
      case "mwezi": return 30;
      case "miezi3": return 90;
      case "custom": {
        const from = new Date(customFrom);
        const to = new Date(customTo);
        const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return Math.max(1, Math.min(diff, 90));
      }
      default: return 7;
    }
  }, [dateRange, customFrom, customTo]);

  const dailyData = useMemo(() => generateDailyData(days), [days]);

  // Aggregate KPIs
  const totalRevenue = dailyData.reduce((s, d) => s + d.revenue, 0);
  const totalCOGS = dailyData.reduce((s, d) => s + d.cogs, 0);
  const totalExpenses = dailyData.reduce((s, d) => s + d.expenses, 0);
  const netProfit = totalRevenue - totalCOGS - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0";
  const cogsPercent = totalRevenue > 0 ? ((totalCOGS / totalRevenue) * 100).toFixed(1) : "0";

  // Simulated previous period change
  const revenueChange = 12.4;

  // Chart data - limit bars for readability
  const chartData = useMemo(() => {
    if (days <= 31) return dailyData;
    // For 90 days, aggregate into weekly buckets
    const weekly: DailyData[] = [];
    for (let i = 0; i < dailyData.length; i += 7) {
      const chunk = dailyData.slice(i, i + 7);
      const agg: DailyData = {
        date: chunk[0].date,
        label: `${chunk[0].label}`,
        revenue: chunk.reduce((s, c) => s + c.revenue, 0),
        cogs: chunk.reduce((s, c) => s + c.cogs, 0),
        expenses: chunk.reduce((s, c) => s + c.expenses, 0),
      };
      weekly.push(agg);
    }
    return weekly;
  }, [dailyData, days]);

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));

  // Last 7 days for the profit/loss table
  const last7 = dailyData.slice(-7);

  // Total payment amount for percentage calculations
  const totalPayments = paymentMethods.reduce((s, p) => s + p.amount, 0);

  // Total expense categories
  const totalExpCat = expenseCategories.reduce((s, e) => s + e.amount, 0);

  // Date range labels
  const rangeButtons: { key: DateRange; label: string; sub: string }[] = [
    { key: "leo", label: "Leo", sub: "Today" },
    { key: "wiki", label: "Wiki Hii", sub: "This Week" },
    { key: "mwezi", label: "Mwezi Huu", sub: "This Month" },
    { key: "miezi3", label: "Miezi 3", sub: "3 Months" },
  ];

  return (
    <div className="space-y-6">
      {/* ---------- Header ---------- */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ripoti na Uchambuzi</h1>
        <p className="text-xs text-muted-foreground">
          Reports &amp; Analytics — Angalia utendaji wa biashara yako kwa undani
        </p>
      </div>

      {/* ---------- Date Range Selector ---------- */}
      <div className="rounded-xl bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-medium text-muted-foreground mr-1">Kipindi / Period:</p>

          {/* Quick filter buttons */}
          {rangeButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setDateRange(btn.key)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                dateRange === btn.key
                  ? "bg-brand-green text-white shadow-sm"
                  : "bg-muted text-foreground hover:bg-brand-green/10"
              }`}
            >
              {btn.label}
              <span className={`ml-1 text-[10px] ${dateRange === btn.key ? "text-white/70" : "text-muted-foreground"}`}>
                ({btn.sub})
              </span>
            </button>
          ))}

          {/* Custom range */}
          <button
            onClick={() => setDateRange("custom")}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              dateRange === "custom"
                ? "bg-brand-green text-white shadow-sm"
                : "bg-muted text-foreground hover:bg-brand-green/10"
            }`}
          >
            Kipindi Maalum
            <span className={`ml-1 text-[10px] ${dateRange === "custom" ? "text-white/70" : "text-muted-foreground"}`}>
              (Custom)
            </span>
          </button>
        </div>

        {/* Custom date inputs */}
        {dateRange === "custom" && (
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Kuanzia (From):</label>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Hadi (To):</label>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
              />
            </div>
          </div>
        )}
      </div>

      {/* ---------- KPI Summary Cards ---------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Mapato (Revenue) */}
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Mapato</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green/10 text-base">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-green">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Revenue</p>
          <p className="mt-2 text-2xl font-bold text-brand-green">{formatTZS(totalRevenue)}</p>
          <p className="mt-1 text-xs text-green-600">
            <span className="inline-flex items-center gap-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17l5-5 5 5M7 7l5 5 5-5" />
              </svg>
              +{revenueChange}% kuliko kipindi kilichopita
            </span>
          </p>
        </div>

        {/* Gharama za Bidhaa (COGS) */}
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Gharama za Bidhaa</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/10 text-base">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-orange">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">COGS — Cost of Goods Sold</p>
          <p className="mt-2 text-2xl font-bold text-brand-orange">{formatTZS(totalCOGS)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{cogsPercent}% ya mapato</p>
        </div>

        {/* Matumizi Mengine (Other Expenses) */}
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Matumizi Mengine</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-base">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Other Expenses</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{formatTZS(totalExpenses)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : "0"}% ya mapato
          </p>
        </div>

        {/* Faida Halisi (Net Profit) */}
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Faida Halisi</p>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${netProfit >= 0 ? "bg-green-100" : "bg-red-100"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={netProfit >= 0 ? "text-green-600" : "text-red-500"}>
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Net Profit</p>
          <p className={`mt-2 text-2xl font-bold ${netProfit >= 0 ? "text-brand-green" : "text-red-600"}`}>
            {formatTZS(netProfit)}
          </p>
          <p className={`mt-1 text-xs ${Number(profitMargin) >= 0 ? "text-green-600" : "text-red-600"}`}>
            {profitMargin}% margin
          </p>
        </div>
      </div>

      {/* ---------- Revenue Chart ---------- */}
      <div className="rounded-xl bg-card p-5 shadow-sm">
        <div className="mb-1">
          <h3 className="text-sm font-bold text-foreground">Chati ya Mapato</h3>
          <p className="text-[10px] text-muted-foreground">Revenue Chart — Mapato ya kila siku</p>
        </div>

        {days === 1 ? (
          /* Single day view */
          <div className="mt-4 flex flex-col items-center justify-center py-8">
            <p className="text-3xl font-bold text-brand-green">{formatTZSFull(dailyData[0]?.revenue || 0)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Mapato ya Leo / Today&apos;s Revenue</p>
            <div className="mt-4 grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-xs text-muted-foreground">COGS</p>
                <p className="text-lg font-bold text-brand-orange">{formatTZS(dailyData[0]?.cogs || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Matumizi</p>
                <p className="text-lg font-bold text-foreground">{formatTZS(dailyData[0]?.expenses || 0)}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Multi-day bar chart */
          <div className="mt-4">
            {/* Y-axis labels and chart area */}
            <div className="flex">
              {/* Y-axis */}
              <div className="flex w-16 flex-col justify-between pr-2 text-right" style={{ height: "220px" }}>
                <span className="text-[10px] text-muted-foreground">{formatTZS(maxRevenue)}</span>
                <span className="text-[10px] text-muted-foreground">{formatTZS(Math.round(maxRevenue * 0.75))}</span>
                <span className="text-[10px] text-muted-foreground">{formatTZS(Math.round(maxRevenue * 0.5))}</span>
                <span className="text-[10px] text-muted-foreground">{formatTZS(Math.round(maxRevenue * 0.25))}</span>
                <span className="text-[10px] text-muted-foreground">0</span>
              </div>

              {/* Bars */}
              <div className="flex flex-1 items-end gap-[2px] border-b border-l border-border pl-1" style={{ height: "220px" }}>
                {chartData.map((d, i) => {
                  const barHeight = maxRevenue > 0 ? (d.revenue / maxRevenue) * 200 : 0;
                  return (
                    <div
                      key={i}
                      className="group relative flex flex-1 flex-col items-center justify-end"
                      style={{ height: "100%" }}
                    >
                      {/* Tooltip on hover */}
                      <div className="pointer-events-none absolute bottom-full mb-1 hidden rounded-lg bg-foreground px-2 py-1 text-[10px] text-background shadow-lg group-hover:block z-10 whitespace-nowrap">
                        <p className="font-bold">{formatTZSFull(d.revenue)}</p>
                        <p>{d.date}</p>
                      </div>
                      {/* Bar */}
                      <div
                        className="w-full min-w-[4px] rounded-t transition-all duration-300 hover:opacity-80"
                        style={{
                          height: `${barHeight}px`,
                          backgroundColor: "#2D7A3A",
                          maxWidth: chartData.length > 14 ? "20px" : "40px",
                          margin: "0 auto",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex pl-16">
              {chartData.map((d, i) => {
                // Show every Nth label to prevent overlap
                const showEvery = chartData.length > 14 ? Math.ceil(chartData.length / 10) : 1;
                return (
                  <div key={i} className="flex-1 text-center">
                    {i % showEvery === 0 && (
                      <p className="mt-1 text-[9px] text-muted-foreground">{d.label}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ---------- Top Selling Items & Payment Methods ---------- */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top Selling Items Table (2/3) */}
        <div className="rounded-xl bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground">Bidhaa Zinazouzwa Zaidi</h3>
            <p className="text-[10px] text-muted-foreground">Top Selling Items — Nafasi 10 bora</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 pr-3 text-[10px] font-semibold uppercase text-muted-foreground">#</th>
                  <th className="pb-2 pr-3 text-[10px] font-semibold uppercase text-muted-foreground">Bidhaa (Item)</th>
                  <th className="pb-2 pr-3 text-right text-[10px] font-semibold uppercase text-muted-foreground">Idadi (Qty)</th>
                  <th className="pb-2 pr-3 text-right text-[10px] font-semibold uppercase text-muted-foreground">Mapato (Revenue)</th>
                  <th className="pb-2 text-right text-[10px] font-semibold uppercase text-muted-foreground">Faida % (Margin)</th>
                </tr>
              </thead>
              <tbody>
                {topSellingItems.map((item) => (
                  <tr key={item.rank} className="border-b border-border/50 transition hover:bg-muted/30">
                    <td className="py-2.5 pr-3">
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        item.rank <= 3
                          ? "bg-brand-green/10 text-brand-green"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-foreground">{item.name}</td>
                    <td className="py-2.5 pr-3 text-right text-muted-foreground">{item.quantity}</td>
                    <td className="py-2.5 pr-3 text-right font-medium text-foreground">{formatTZS(item.revenue)}</td>
                    <td className="py-2.5 text-right">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.margin >= 40
                          ? "bg-green-100 text-green-700"
                          : item.margin >= 25
                          ? "bg-brand-green/10 text-brand-green"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {item.margin}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Method Breakdown (1/3) */}
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground">Njia za Malipo</h3>
            <p className="text-[10px] text-muted-foreground">Payment Method Breakdown</p>
          </div>

          {/* Stacked bar visual */}
          <div className="mb-4 flex h-6 overflow-hidden rounded-full">
            {paymentMethods.map((pm, i) => {
              const pct = (pm.amount / totalPayments) * 100;
              return (
                <div
                  key={i}
                  className="h-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: pm.color,
                  }}
                  title={`${pm.name}: ${pct.toFixed(1)}%`}
                />
              );
            })}
          </div>

          {/* Legend list */}
          <div className="space-y-3">
            {paymentMethods.map((pm, i) => {
              const pct = ((pm.amount / totalPayments) * 100).toFixed(1);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: pm.color }}
                      />
                      <span className="text-sm text-foreground">{pm.name}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{pct}%</span>
                  </div>
                  <div className="ml-5 mt-0.5">
                    <p className="text-[10px] text-muted-foreground">{formatTZSFull(pm.amount)}</p>
                  </div>
                  {/* Bar */}
                  <div className="ml-5 mt-1 h-1.5 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pm.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Jumla (Total)</span>
              <span className="text-sm font-bold text-foreground">{formatTZSFull(totalPayments)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Expense Categories ---------- */}
      <div className="rounded-xl bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Mgawanyo wa Gharama</h3>
          <p className="text-[10px] text-muted-foreground">Expense Categories — Gharama kwa aina</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expenseCategories.map((cat, i) => {
            const pct = ((cat.amount / totalExpCat) * 100).toFixed(1);
            const maxCat = Math.max(...expenseCategories.map((e) => e.amount));
            const barWidthPct = (cat.amount / maxCat) * 100;
            return (
              <div key={i} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{cat.name}</p>
                    <p className="text-[10px] text-muted-foreground">{cat.nameEn}</p>
                  </div>
                  <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold text-brand-orange">
                    {pct}%
                  </span>
                </div>
                <p className="mt-2 text-lg font-bold text-foreground">{formatTZSFull(cat.amount)}</p>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${barWidthPct}%`,
                      backgroundColor: i === 0 ? "#E8712B" : i === 1 ? "#2D7A3A" : "#E9C46A",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
          <span className="text-sm font-medium text-foreground">Jumla ya Gharama (Total Expenses)</span>
          <span className="text-lg font-bold text-brand-orange">{formatTZSFull(totalExpCat)}</span>
        </div>
      </div>

      {/* ---------- Daily Profit/Loss Summary ---------- */}
      <div className="rounded-xl bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Muhtasari wa Faida/Hasara kwa Siku</h3>
          <p className="text-[10px] text-muted-foreground">Daily Profit/Loss Summary — Siku 7 zilizopita</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 text-[10px] font-semibold uppercase text-muted-foreground">Tarehe (Date)</th>
                <th className="pb-2 pr-4 text-right text-[10px] font-semibold uppercase text-muted-foreground">Mapato (Revenue)</th>
                <th className="pb-2 pr-4 text-right text-[10px] font-semibold uppercase text-muted-foreground">COGS</th>
                <th className="pb-2 pr-4 text-right text-[10px] font-semibold uppercase text-muted-foreground">Matumizi (Expenses)</th>
                <th className="pb-2 pr-4 text-right text-[10px] font-semibold uppercase text-muted-foreground">Faida (Profit)</th>
                <th className="pb-2 text-right text-[10px] font-semibold uppercase text-muted-foreground">Margin %</th>
              </tr>
            </thead>
            <tbody>
              {last7.map((day, i) => {
                const profit = day.revenue - day.cogs - day.expenses;
                const margin = day.revenue > 0 ? ((profit / day.revenue) * 100).toFixed(1) : "0";
                const isPositive = profit >= 0;

                return (
                  <tr key={i} className="border-b border-border/50 transition hover:bg-muted/30">
                    <td className="py-2.5 pr-4 font-medium text-foreground">{day.date}</td>
                    <td className="py-2.5 pr-4 text-right text-foreground">{formatTZS(day.revenue)}</td>
                    <td className="py-2.5 pr-4 text-right text-brand-orange">{formatTZS(day.cogs)}</td>
                    <td className="py-2.5 pr-4 text-right text-muted-foreground">{formatTZS(day.expenses)}</td>
                    <td className={`py-2.5 pr-4 text-right font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPositive ? "" : "-"}{formatTZS(Math.abs(profit))}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Totals row */}
            <tfoot>
              <tr className="bg-muted/30">
                <td className="py-3 pr-4 text-sm font-bold text-foreground">Jumla (Total)</td>
                <td className="py-3 pr-4 text-right text-sm font-bold text-brand-green">
                  {formatTZS(last7.reduce((s, d) => s + d.revenue, 0))}
                </td>
                <td className="py-3 pr-4 text-right text-sm font-bold text-brand-orange">
                  {formatTZS(last7.reduce((s, d) => s + d.cogs, 0))}
                </td>
                <td className="py-3 pr-4 text-right text-sm font-bold text-foreground">
                  {formatTZS(last7.reduce((s, d) => s + d.expenses, 0))}
                </td>
                <td className={`py-3 pr-4 text-right text-sm font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatTZS(last7.reduce((s, d) => s + (d.revenue - d.cogs - d.expenses), 0))}
                </td>
                <td className="py-3 text-right">
                  {(() => {
                    const totRev = last7.reduce((s, d) => s + d.revenue, 0);
                    const totProfit = last7.reduce((s, d) => s + (d.revenue - d.cogs - d.expenses), 0);
                    const m = totRev > 0 ? ((totProfit / totRev) * 100).toFixed(1) : "0";
                    const positive = totProfit >= 0;
                    return (
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {m}%
                      </span>
                    );
                  })()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ---------- Footer Disclaimer ---------- */}
      <div className="rounded-lg bg-muted/40 px-4 py-3 text-center">
        <p className="text-[10px] text-muted-foreground">
          Takwimu hizi ni za makadirio — Data is illustrative. Unganisha na mfumo kamili kupata ripoti halisi.
        </p>
      </div>
    </div>
  );
}
