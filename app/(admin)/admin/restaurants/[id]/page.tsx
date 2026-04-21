"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

/* ─── Types ─── */
interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface DailyEntry {
  date: string;
  revenue: number;
  cogs: number;
  expenses: number;
  profit: number;
  orderCount: number;
}

interface TopProduct {
  menuItemId: string;
  name: string;
  price: number;
  qtySold: number;
  revenue: number;
  orderCount: number;
}

interface LowStockItem {
  id: string;
  name: string;
  unit: string;
  current: number;
  minimum: number;
}

interface PaymentMethodEntry {
  method: string;
  amount: number;
  count: number;
}

interface ExpenseCategory {
  category: string;
  amount: number;
}

interface ActivityEntry {
  id: string;
  userId: string;
  action: string;
  createdAt: string;
}

interface RecentOrder {
  id: string;
  orderNumber: number;
  status: string;
  total: number;
  paymentMethod: string | null;
  paymentStatus: string;
  cashier: string;
  createdAt: string;
}

interface RestaurantDetail {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  approvalStatus: string;
  kycStatus: string;
  createdAt: string;
  team: TeamMember[];
  financials: {
    totalRevenue30d: number;
    totalCogs30d: number;
    totalExpenses30d: number;
    totalProfit30d: number;
    dailyTimeSeries: DailyEntry[];
  };
  orderStats: {
    total: number;
    byStatus: { status: string; count: number }[];
  };
  topProducts: TopProduct[];
  lowStock: LowStockItem[];
  menuItemsCount: number;
  paymentMethods: PaymentMethodEntry[];
  expensesByCategory: ExpenseCategory[];
  recentActivity: ActivityEntry[];
  recentOrders: RecentOrder[];
}

interface PlatformStats {
  totalRestaurants: number;
  approvedRestaurants: number;
  revenueThisMonth: number;
  [key: string]: unknown;
}

/* ─── Helpers ─── */
type TabKey = "muhtasari" | "wafanyakazi" | "fedha" | "bidhaa" | "shughuli";

function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("sw-TZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("sw-TZ", {
    day: "2-digit",
    month: "short",
  });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("sw-TZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ─── Badge helpers ─── */
function planBadge(plan: string) {
  switch (plan) {
    case "free":
      return { label: "Bure", bg: "bg-gray-100", text: "text-gray-700" };
    case "starter":
      return { label: "Mwanzo", bg: "bg-blue-50", text: "text-blue-700" };
    case "professional":
      return { label: "Kitaalamu", bg: "bg-purple-50", text: "text-purple-700" };
    case "business":
      return { label: "Biashara", bg: "bg-amber-50", text: "text-amber-700" };
    default:
      return { label: plan, bg: "bg-gray-100", text: "text-gray-700" };
  }
}

function statusBadge(status: string) {
  switch (status) {
    case "approved":
      return { label: "Hai", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" };
    case "pending":
      return { label: "Inasubiri", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
    case "rejected":
      return { label: "Imekataliwa", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" };
    case "suspended":
      return { label: "Imesimamishwa", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" };
    default:
      return { label: status, bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
  }
}

function kycLabel(status: string) {
  switch (status) {
    case "not_submitted":
      return { label: "Haijawasilishwa", color: "text-gray-500" };
    case "submitted":
      return { label: "Imewasilishwa", color: "text-amber-600" };
    case "approved":
      return { label: "Imeidhinishwa", color: "text-green-600" };
    case "rejected":
      return { label: "Imekataliwa", color: "text-red-600" };
    default:
      return { label: status, color: "text-gray-500" };
  }
}

function roleLabelSw(role: string) {
  switch (role) {
    case "owner":
      return "Mmiliki";
    case "manager":
      return "Msimamizi";
    case "cashier":
      return "Mkusanyaji";
    default:
      return role;
  }
}

function roleBadgeStyle(role: string) {
  switch (role) {
    case "owner":
      return "bg-[#E8712B]/10 text-[#E8712B]";
    case "manager":
      return "bg-[#2D7A3A]/10 text-[#2D7A3A]";
    case "cashier":
      return "bg-[#E9C46A]/20 text-[#2B2D42]";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function avatarBg(role: string) {
  switch (role) {
    case "owner":
      return "bg-[#E8712B]";
    case "manager":
      return "bg-[#2D7A3A]";
    case "cashier":
      return "bg-[#E9C46A] text-[#2B2D42]";
    default:
      return "bg-gray-400";
  }
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Taslimu",
  mpesa: "M-Pesa",
  tigopesa: "Tigo Pesa",
  airtelmoney: "Airtel Money",
  halopesa: "Halo Pesa",
  card: "Kadi",
};

const PAYMENT_COLORS: Record<string, string> = {
  cash: "#2D7A3A",
  mpesa: "#E8712B",
  tigopesa: "#3B82F6",
  airtelmoney: "#EF4444",
  halopesa: "#7C3AED",
  card: "#F59E0B",
};

function orderStatusStyle(status: string) {
  switch (status) {
    case "completed":
      return { label: "Imekamilika", bg: "bg-green-100", text: "text-green-700" };
    case "pending":
      return { label: "Inasubiri", bg: "bg-amber-100", text: "text-amber-700" };
    case "cancelled":
      return { label: "Imefutwa", bg: "bg-red-100", text: "text-red-700" };
    case "preparing":
      return { label: "Inaandaliwa", bg: "bg-blue-100", text: "text-blue-700" };
    default:
      return { label: status, bg: "bg-gray-100", text: "text-gray-600" };
  }
}

function orderStatusBarColor(status: string) {
  switch (status) {
    case "completed":
      return "#2D7A3A";
    case "pending":
      return "#F59E0B";
    case "cancelled":
      return "#EF4444";
    case "preparing":
      return "#3B82F6";
    default:
      return "#6B7280";
  }
}

function paymentStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return { label: "Limelipwa", bg: "bg-green-100", text: "text-green-700" };
    case "pending":
      return { label: "Linasubiri", bg: "bg-yellow-100", text: "text-yellow-700" };
    case "failed":
      return { label: "Limeshindwa", bg: "bg-red-100", text: "text-red-700" };
    case "refunded":
      return { label: "Limerudishwa", bg: "bg-gray-100", text: "text-gray-600" };
    default:
      return { label: status, bg: "bg-gray-100", text: "text-gray-600" };
  }
}

/* ─── Revenue Bar Chart Component ─── */
function RevenueBarChart({ data }: { data: DailyEntry[] }) {
  if (data.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center gap-3">
        <svg className="h-12 w-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm font-medium text-muted-foreground">Hakuna data ya mapato kwa kipindi hiki</p>
      </div>
    );
  }

  const maxBarVal = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="mt-6 flex items-end gap-1 overflow-x-auto" style={{ height: 220, minWidth: 0 }}>
      {data.map((d, i) => {
        const heightPct = (d.revenue / maxBarVal) * 100;
        const isLast = i === data.length - 1;
        return (
          <div
            key={d.date}
            className="flex flex-1 min-w-[20px] flex-col items-center gap-1"
            title={`${d.date}: TZS ${fmt(d.revenue)}`}
          >
            <p className="text-[8px] font-medium text-foreground whitespace-nowrap">
              {d.revenue >= 1000000
                ? `${(d.revenue / 1000000).toFixed(1)}M`
                : d.revenue >= 1000
                  ? `${Math.round(d.revenue / 1000)}K`
                  : fmt(d.revenue)}
            </p>
            <div className="relative w-full flex justify-center">
              <div
                className="w-full max-w-[28px] rounded-t-md transition-all duration-500"
                style={{
                  height: `${Math.max(heightPct * 1.6, 4)}px`,
                  backgroundColor: isLast ? "#E8712B" : "#2D7A3A",
                  opacity: 0.6 + i * (0.4 / Math.max(data.length, 1)),
                }}
              />
            </div>
            <p className="text-[7px] text-muted-foreground whitespace-nowrap">{shortDate(d.date)}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function RestaurantDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<RestaurantDetail | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("muhtasari");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/restaurants/${id}`).then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ])
      .then(([detail, platformStats]) => {
        setData(detail);
        setStats(platformStats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  /* ─── CSV Export ─── */
  function exportCSV() {
    if (!data) return;
    const rows = [["Tarehe", "Mapato (TZS)", "Gharama (TZS)", "Matumizi (TZS)", "Faida (TZS)", "Oda"]];
    for (const d of data.financials.dailyTimeSeries) {
      rows.push([d.date, String(d.revenue), String(d.cogs), String(d.expenses), String(d.profit), String(d.orderCount)]);
    }
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.slug}-fedha-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ─── Loading ─── */
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

  if (!data) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-12 w-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-sm font-medium text-muted-foreground">Mgahawa haujapatikana</p>
          <Link href="/admin/restaurants" className="rounded-lg bg-[#2D7A3A] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1B5227]">
            Rudi kwenye Migahawa
          </Link>
        </div>
      </div>
    );
  }

  const sb = statusBadge(data.approvalStatus);
  const pb = planBadge(data.subscriptionPlan);
  const kyc = kycLabel(data.kycStatus);
  const owner = data.team.find((m) => m.role === "owner");
  const platformAvgRevenue =
    stats && stats.approvedRestaurants > 0
      ? Math.round(stats.revenueThisMonth / stats.approvedRestaurants)
      : 0;

  const totalOrdersByStatus = data.orderStats.byStatus.reduce((s, b) => s + b.count, 0) || 1;

  const TABS: { key: TabKey; label: string }[] = [
    { key: "muhtasari", label: "Muhtasari" },
    { key: "wafanyakazi", label: "Wafanyakazi" },
    { key: "fedha", label: "Fedha" },
    { key: "bidhaa", label: "Bidhaa" },
    { key: "shughuli", label: "Shughuli" },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Breadcrumb ─── */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/admin" className="transition hover:text-[#2D7A3A]">
          Dashboard
        </Link>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/admin/restaurants" className="transition hover:text-[#2D7A3A]">
          Migahawa
        </Link>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium text-foreground">{data.name}</span>
      </nav>

      {/* ─── Header Bar ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2D7A3A] text-sm font-bold text-white shadow-sm">
            {getInitials(data.name)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-foreground">{data.name}</h1>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${pb.bg} ${pb.text}`}>
                {pb.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${sb.bg} ${sb.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${sb.dot}`} />
                {sb.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{data.city}</p>
          </div>
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="flex items-center gap-2">
        <button
          onClick={exportCSV}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
        >
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </span>
        </button>
      </div>

      {/* ─── Tab Bar ─── */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-4 py-1.5 text-xs font-medium transition whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-[#2D7A3A] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
         TAB: MUHTASARI (Overview)
         ═══════════════════════════════════════════════════════ */}
      {activeTab === "muhtasari" && (
        <div className="space-y-6">
          {/* Info Card */}
          <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
            <h2 className="text-sm font-bold text-foreground mb-4">Maelezo ya Mgahawa</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium uppercase text-muted-foreground">Jina</p>
                <p className="text-sm font-medium text-foreground">{data.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-muted-foreground">Mmiliki</p>
                <p className="text-sm font-medium text-foreground">{owner?.name || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-muted-foreground">Simu</p>
                <p className="text-sm text-foreground">{data.phone || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-muted-foreground">Barua Pepe</p>
                <p className="text-sm text-foreground">{data.email || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-muted-foreground">Jiji</p>
                <p className="text-sm text-foreground">{data.city}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-muted-foreground">Slug</p>
                <p className="text-sm text-foreground font-mono">{data.slug}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-muted-foreground">Mpango</p>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${pb.bg} ${pb.text}`}>
                  {pb.label}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-muted-foreground">Hali</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${sb.bg} ${sb.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${sb.dot}`} />
                  {sb.label}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-muted-foreground">KYC</p>
                <p className={`text-sm font-medium ${kyc.color}`}>{kyc.label}</p>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Mapato */}
            <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Mapato (30 siku)</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D7A3A]/10">
                  <svg className="h-4 w-4 text-[#2D7A3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">TZS {fmt(data.financials.totalRevenue30d)}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Wastani wa jukwaa: TZS {fmt(platformAvgRevenue)}
              </p>
            </div>

            {/* Oda */}
            <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Oda</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{fmt(data.orderStats.total)}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">Siku 30 zilizopita</p>
            </div>

            {/* Menyu */}
            <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Menyu</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8712B]/10">
                  <svg className="h-4 w-4 text-[#E8712B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{fmt(data.menuItemsCount)}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">bidhaa</p>
            </div>

            {/* Wafanyakazi */}
            <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Wafanyakazi</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                  <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{data.team.length}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">watu</p>
            </div>
          </div>

          {/* Revenue Bar Chart */}
          <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
            <h2 className="text-sm font-bold text-foreground">Mapato kwa Wakati</h2>
            <p className="text-xs text-muted-foreground">Revenue Over Time — Siku 30 (TZS)</p>
            <RevenueBarChart data={data.financials.dailyTimeSeries} />
          </div>

          {/* Order Status Breakdown */}
          <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
            <h2 className="text-sm font-bold text-foreground mb-1">Hali za Oda</h2>
            <p className="text-xs text-muted-foreground mb-5">Order Status Breakdown</p>
            {data.orderStats.byStatus.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Hakuna data</p>
            ) : (
              <div className="space-y-4">
                {data.orderStats.byStatus
                  .sort((a, b) => b.count - a.count)
                  .map((s) => {
                    const pct = Math.round((s.count / totalOrdersByStatus) * 100);
                    const os = orderStatusStyle(s.status);
                    return (
                      <div key={s.status}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="text-foreground">{os.label}</span>
                          <span className="font-semibold text-foreground">
                            {fmt(s.count)} ({pct}%)
                          </span>
                        </div>
                        <div className="h-7 w-full rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div
                            className="h-full rounded-lg flex items-center justify-end pr-2 text-[10px] font-bold text-white transition-all duration-500"
                            style={{
                              width: `${Math.max(pct, 2)}%`,
                              backgroundColor: orderStatusBarColor(s.status),
                            }}
                          >
                            {pct}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
         TAB: WAFANYAKAZI (Team)
         ═══════════════════════════════════════════════════════ */}
      {activeTab === "wafanyakazi" && (
        <div className="space-y-6">
          <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-foreground">Wafanyakazi</h2>
                <p className="text-xs text-muted-foreground">
                  {data.team.length} {data.team.length === 1 ? "mtu" : "watu"} kwenye timu
                </p>
              </div>
            </div>

            {data.team.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <svg className="h-7 w-7 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-muted-foreground">Hakuna wafanyakazi bado</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {data.team.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    {/* Avatar */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarBg(member.role)}`}>
                      {getInitials(member.name)}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/admin/users/${member.id}`}
                          className="text-sm font-semibold text-foreground hover:text-[#2D7A3A] transition truncate"
                        >
                          {member.name}
                        </Link>
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${roleBadgeStyle(member.role)}`}>
                          {roleLabelSw(member.role)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{member.email || member.phone}</p>
                    </div>

                    {/* Status + Date */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        member.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${member.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                        {member.isActive ? "Hai" : "Simama"}
                      </span>
                      <p className="text-xs text-muted-foreground hidden sm:block">{fmtDate(member.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
         TAB: FEDHA (Financials)
         ═══════════════════════════════════════════════════════ */}
      {activeTab === "fedha" && (
        <div className="space-y-6">
          {/* Revenue Bar Chart */}
          <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
            <h2 className="text-sm font-bold text-foreground">Mapato kwa Wakati</h2>
            <p className="text-xs text-muted-foreground">Revenue Over Time — Siku 30 (TZS)</p>
            <RevenueBarChart data={data.financials.dailyTimeSeries} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Expense Breakdown */}
            <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
              <h2 className="text-sm font-bold text-foreground">Matumizi kwa Aina</h2>
              <p className="text-xs text-muted-foreground mb-5">Expenses by Category</p>
              {data.expensesByCategory.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Hakuna data ya matumizi</p>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const maxExpense = Math.max(...data.expensesByCategory.map((e) => e.amount), 1);
                    const expenseColors = ["#E8712B", "#2D7A3A", "#3B82F6", "#EF4444", "#7C3AED", "#F59E0B"];
                    return data.expensesByCategory
                      .sort((a, b) => b.amount - a.amount)
                      .map((e, i) => {
                        const pct = Math.round((e.amount / maxExpense) * 100);
                        return (
                          <div key={e.category}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span className="text-foreground capitalize">{e.category}</span>
                              <span className="font-semibold text-foreground">TZS {fmt(e.amount)}</span>
                            </div>
                            <div className="h-7 w-full rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <div
                                className="h-full rounded-lg transition-all duration-500"
                                style={{
                                  width: `${Math.max(pct, 2)}%`,
                                  backgroundColor: expenseColors[i % expenseColors.length],
                                }}
                              />
                            </div>
                          </div>
                        );
                      });
                  })()}
                </div>
              )}
            </div>

            {/* Profit Margin */}
            <div className="space-y-4">
              <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
                <h2 className="text-sm font-bold text-foreground mb-1">Kiwango cha Faida</h2>
                <p className="text-xs text-muted-foreground mb-4">Profit Margin</p>
                {(() => {
                  const rev = data.financials.totalRevenue30d;
                  const margin = rev > 0
                    ? Math.round(((rev - data.financials.totalCogs30d - data.financials.totalExpenses30d) / rev) * 100)
                    : 0;
                  const marginColor = margin >= 20 ? "text-green-600" : margin >= 0 ? "text-amber-600" : "text-red-600";
                  return (
                    <div className="flex flex-col items-center gap-2">
                      <p className={`text-5xl font-bold ${marginColor}`}>{margin}%</p>
                      <div className="mt-2 w-full space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mapato</span>
                          <span className="font-medium text-foreground">TZS {fmt(rev)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gharama (COGS)</span>
                          <span className="font-medium text-foreground">TZS {fmt(data.financials.totalCogs30d)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Matumizi</span>
                          <span className="font-medium text-foreground">TZS {fmt(data.financials.totalExpenses30d)}</span>
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between font-semibold">
                          <span className="text-muted-foreground">Faida</span>
                          <span className={marginColor}>TZS {fmt(data.financials.totalProfit30d)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Payment Method Split */}
              <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
                <h2 className="text-sm font-bold text-foreground">Njia za Malipo</h2>
                <p className="text-xs text-muted-foreground mb-5">Payment Methods</p>
                {data.paymentMethods.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Hakuna data</p>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      const totalPayments = data.paymentMethods.reduce((s, p) => s + p.amount, 0) || 1;
                      return data.paymentMethods
                        .sort((a, b) => b.amount - a.amount)
                        .map((p) => {
                          const pct = Math.round((p.amount / totalPayments) * 100);
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
                        });
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
         TAB: BIDHAA (Products)
         ═══════════════════════════════════════════════════════ */}
      {activeTab === "bidhaa" && (
        <div className="space-y-6">
          {/* Top Products Table */}
          <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
            <div className="mb-5">
              <h2 className="text-sm font-bold text-foreground">Bidhaa Bora 10</h2>
              <p className="text-xs text-muted-foreground">Top 10 Products by Revenue</p>
            </div>

            {data.topProducts.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <svg className="h-12 w-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-sm font-medium text-muted-foreground">Hakuna bidhaa bado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">#</th>
                      <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Jina</th>
                      <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground text-right">Kiasi Kilichouzwa</th>
                      <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground text-right">Mapato (TZS)</th>
                      <th className="pb-3 text-xs font-semibold text-muted-foreground text-right">Oda</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.topProducts.map((p, i) => (
                      <tr key={p.menuItemId} className="hover:bg-muted/30 transition">
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{i + 1}</td>
                        <td className="py-3 pr-4 font-medium text-foreground">{p.name}</td>
                        <td className="py-3 pr-4 text-right text-foreground">{fmt(p.qtySold)}</td>
                        <td className="py-3 pr-4 text-right font-semibold text-foreground">TZS {fmt(p.revenue)}</td>
                        <td className="py-3 text-right text-muted-foreground">{fmt(p.orderCount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low Stock Alerts */}
          <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
            <div className="mb-5">
              <h2 className="text-sm font-bold text-foreground">Tahadhari ya Hisa Ndogo</h2>
              <p className="text-xs text-muted-foreground">Low Stock Alerts</p>
            </div>

            {data.lowStock.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <svg className="h-12 w-12 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-muted-foreground">Hakuna bidhaa zenye hisa ndogo</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.lowStock.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border-2 border-red-200 bg-red-50/50 dark:bg-red-950/10 p-4"
                  >
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Sasa hivi</span>
                      <span className="font-bold text-red-600">
                        {fmt(item.current)} {item.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-muted-foreground">Kiwango cha chini</span>
                      <span className="font-medium text-foreground">
                        {fmt(item.minimum)} {item.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
         TAB: SHUGHULI (Activity)
         ═══════════════════════════════════════════════════════ */}
      {activeTab === "shughuli" && (
        <div className="space-y-6">
          {/* Activity Timeline */}
          <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
            <div className="mb-5">
              <h2 className="text-sm font-bold text-foreground">Shughuli za Hivi Karibuni</h2>
              <p className="text-xs text-muted-foreground">Recent Activity Timeline</p>
            </div>

            {data.recentActivity.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <svg className="h-12 w-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-muted-foreground">Hakuna shughuli za hivi karibuni</p>
              </div>
            ) : (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

                <div className="space-y-4">
                  {data.recentActivity.map((activity) => (
                    <div key={activity.id} className="relative flex items-start gap-4 pl-6">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-[#2D7A3A] bg-card" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.action}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {fmtDateTime(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Orders Table */}
          <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
            <div className="mb-5">
              <h2 className="text-sm font-bold text-foreground">Oda za Hivi Karibuni</h2>
              <p className="text-xs text-muted-foreground">Recent Orders</p>
            </div>

            {data.recentOrders.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <svg className="h-12 w-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm font-medium text-muted-foreground">Hakuna oda za hivi karibuni</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Namba</th>
                      <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Hali</th>
                      <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground text-right">Jumla (TZS)</th>
                      <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Njia</th>
                      <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Malipo</th>
                      <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">Mkusanyaji</th>
                      <th className="pb-3 text-xs font-semibold text-muted-foreground">Tarehe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.recentOrders.map((order) => {
                      const os = orderStatusStyle(order.status);
                      const ps = paymentStatusBadge(order.paymentStatus);
                      return (
                        <tr key={order.id} className="hover:bg-muted/30 transition">
                          <td className="py-3 pr-4 font-semibold text-foreground">#{order.orderNumber}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${os.bg} ${os.text}`}>
                              {os.label}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-right font-semibold text-foreground">TZS {fmt(order.total)}</td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {PAYMENT_LABELS[order.paymentMethod || ""] || order.paymentMethod || "—"}
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${ps.bg} ${ps.text}`}>
                              {ps.label}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-sm text-foreground">{order.cashier}</td>
                          <td className="py-3 text-xs text-muted-foreground whitespace-nowrap">{fmtDateTime(order.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
