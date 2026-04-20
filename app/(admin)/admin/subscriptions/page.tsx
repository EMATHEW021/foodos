"use client";

import { useState } from "react";

// ───── Types ─────
interface Subscription {
  id: number;
  restaurant: string;
  plan: "Bure" | "Mwanzo" | "Kitaalamu" | "Biashara";
  planEn: "Free" | "Starter" | "Professional" | "Business";
  status: "active" | "trial" | "past_due" | "cancelled";
  mrr: number;
  started: string;
  nextBilling: string;
  paymentMethod: string;
  trialEndsIn?: number;
}

// ───── Sample Data ─────
const initialSubscriptions: Subscription[] = [
  {
    id: 1,
    restaurant: "Mama Salma Kitchen",
    plan: "Kitaalamu",
    planEn: "Professional",
    status: "active",
    mrr: 59000,
    started: "2025-12-01",
    nextBilling: "2026-05-01",
    paymentMethod: "M-Pesa",
  },
  {
    id: 2,
    restaurant: "Chips Kuku Corner",
    plan: "Mwanzo",
    planEn: "Starter",
    status: "active",
    mrr: 29000,
    started: "2026-01-15",
    nextBilling: "2026-05-15",
    paymentMethod: "Tigo Pesa",
  },
  {
    id: 3,
    restaurant: "Biryani House",
    plan: "Biashara",
    planEn: "Business",
    status: "active",
    mrr: 149000,
    started: "2025-10-01",
    nextBilling: "2026-05-01",
    paymentMethod: "Benki (Bank)",
  },
  {
    id: 4,
    restaurant: "Ugali Spot",
    plan: "Mwanzo",
    planEn: "Starter",
    status: "trial",
    mrr: 29000,
    started: "2026-04-10",
    nextBilling: "2026-05-10",
    paymentMethod: "—",
    trialEndsIn: 5,
  },
  {
    id: 5,
    restaurant: "Pilau Palace",
    plan: "Kitaalamu",
    planEn: "Professional",
    status: "active",
    mrr: 59000,
    started: "2026-02-01",
    nextBilling: "2026-05-01",
    paymentMethod: "M-Pesa",
  },
  {
    id: 6,
    restaurant: "Baba Mzee Grill",
    plan: "Bure",
    planEn: "Free",
    status: "active",
    mrr: 0,
    started: "2026-04-17",
    nextBilling: "—",
    paymentMethod: "—",
  },
  {
    id: 7,
    restaurant: "Nyama Choma Palace",
    plan: "Mwanzo",
    planEn: "Starter",
    status: "trial",
    mrr: 29000,
    started: "2026-04-14",
    nextBilling: "2026-05-14",
    paymentMethod: "—",
    trialEndsIn: 3,
  },
  {
    id: 8,
    restaurant: "Samaki Fresh",
    plan: "Bure",
    planEn: "Free",
    status: "active",
    mrr: 0,
    started: "2026-04-15",
    nextBilling: "—",
    paymentMethod: "—",
  },
  {
    id: 9,
    restaurant: "Kwa Juma Eats",
    plan: "Mwanzo",
    planEn: "Starter",
    status: "past_due",
    mrr: 29000,
    started: "2026-01-10",
    nextBilling: "2026-04-10",
    paymentMethod: "M-Pesa",
  },
  {
    id: 10,
    restaurant: "Street Food TZ",
    plan: "Kitaalamu",
    planEn: "Professional",
    status: "cancelled",
    mrr: 0,
    started: "2025-11-01",
    nextBilling: "—",
    paymentMethod: "Tigo Pesa",
  },
  {
    id: 11,
    restaurant: "Mzinga Lounge",
    plan: "Biashara",
    planEn: "Business",
    status: "active",
    mrr: 149000,
    started: "2025-09-01",
    nextBilling: "2026-05-01",
    paymentMethod: "Benki (Bank)",
  },
  {
    id: 12,
    restaurant: "Chakula Express",
    plan: "Mwanzo",
    planEn: "Starter",
    status: "trial",
    mrr: 29000,
    started: "2026-04-16",
    nextBilling: "2026-05-16",
    paymentMethod: "—",
    trialEndsIn: 6,
  },
];

// ───── Helpers ─────
function formatDate(iso: string): string {
  if (iso === "—") return "—";
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Ago", "Sep", "Okt", "Nov", "Des",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTZS(amount: number): string {
  return `TZS ${amount.toLocaleString()}`;
}

function planBadgeStyle(plan: string): string {
  switch (plan) {
    case "Bure":
      return "bg-gray-100 text-gray-600";
    case "Mwanzo":
      return "bg-blue-100 text-blue-700";
    case "Kitaalamu":
      return "bg-[#2D7A3A]/10 text-[#2D7A3A]";
    case "Biashara":
      return "bg-[#E8712B]/10 text-[#E8712B]";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function statusBadge(status: string): { style: string; label: string; labelEn: string } {
  switch (status) {
    case "active":
      return {
        style: "bg-green-100 text-green-700",
        label: "Hai",
        labelEn: "Active",
      };
    case "trial":
      return {
        style: "bg-blue-100 text-blue-700",
        label: "Jaribio",
        labelEn: "Trial",
      };
    case "past_due":
      return {
        style: "bg-[#E8712B]/10 text-[#E8712B]",
        label: "Imechelewa",
        labelEn: "Past Due",
      };
    case "cancelled":
      return {
        style: "bg-red-100 text-red-600",
        label: "Imesitishwa",
        labelEn: "Cancelled",
      };
    default:
      return { style: "bg-gray-100 text-gray-600", label: "—", labelEn: "—" };
  }
}

// ───── Main Component ─────
export default function SubscriptionsPage() {
  const [subscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("Zote");
  const [statusFilter, setStatusFilter] = useState("Zote");

  // Action modals
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);
  const [changePlanSub, setChangePlanSub] = useState<Subscription | null>(null);
  const [selectedNewPlan, setSelectedNewPlan] = useState("");

  // Trial expiring
  const trialsExpiring = subscriptions.filter(
    (s) => s.status === "trial" && s.trialEndsIn !== undefined && s.trialEndsIn <= 7
  );

  // Filtering
  const filtered = subscriptions.filter((s) => {
    const matchesPlan =
      planFilter === "Zote" || s.plan === planFilter;
    const matchesStatus =
      statusFilter === "Zote" || s.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = s.restaurant.toLowerCase().includes(q);
    return matchesPlan && matchesStatus && matchesSearch;
  });

  // MRR bar chart data
  const mrrBreakdown = [
    { label: "New MRR", labelSw: "MRR Mpya", amount: 145000, color: "#2D7A3A", pct: 42 },
    { label: "Expansion MRR", labelSw: "MRR ya Upanuzi", amount: 89000, color: "#3B82F6", pct: 26 },
    { label: "Churned MRR", labelSw: "MRR Iliyopotea", amount: -58000, color: "#DC2626", pct: 17 },
    { label: "Net New", labelSw: "MRR Halisi", amount: 176000, color: "#E8712B", pct: 51 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usajili</h1>
        <p className="text-xs text-muted-foreground">
          Subscriptions — Simamia mipango na malipo
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Bure (Free) */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-gray-600">
              Bure
            </span>
            <span className="text-[10px] text-muted-foreground">Free</span>
          </div>
          <p className="mt-3 text-xl font-bold text-foreground">
            TZS 0<span className="text-xs font-normal text-muted-foreground">/mwezi</span>
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div>
              <p className="text-lg font-bold text-foreground">25</p>
              <p className="text-[10px] text-muted-foreground">Migahawa</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Kipengele</p>
              <p className="text-[10px] text-foreground">1 mtumiaji, POS ya msingi</p>
            </div>
          </div>
        </div>

        {/* Mwanzo (Starter) */}
        <div className="rounded-xl bg-card border border-blue-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
              Mwanzo
            </span>
            <span className="text-[10px] text-muted-foreground">Starter</span>
          </div>
          <p className="mt-3 text-xl font-bold text-foreground">
            TZS 29,000<span className="text-xs font-normal text-muted-foreground">/mwezi</span>
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div>
              <p className="text-lg font-bold text-foreground">15</p>
              <p className="text-[10px] text-muted-foreground">Migahawa</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">MRR</p>
              <p className="text-sm font-bold text-blue-700">TZS 435,000</p>
            </div>
          </div>
        </div>

        {/* Kitaalamu (Professional) */}
        <div className="rounded-xl bg-card border-2 border-[#2D7A3A] p-5 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 rounded-bl-lg bg-[#2D7A3A] px-2.5 py-0.5">
            <span className="text-[9px] font-semibold text-white">Maarufu</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-block rounded-full bg-[#2D7A3A]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#2D7A3A]">
              Kitaalamu
            </span>
            <span className="text-[10px] text-muted-foreground">Professional</span>
          </div>
          <p className="mt-3 text-xl font-bold text-foreground">
            TZS 59,000<span className="text-xs font-normal text-muted-foreground">/mwezi</span>
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div>
              <p className="text-lg font-bold text-foreground">5</p>
              <p className="text-[10px] text-muted-foreground">Migahawa</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">MRR</p>
              <p className="text-sm font-bold text-[#2D7A3A]">TZS 295,000</p>
            </div>
          </div>
        </div>

        {/* Biashara (Business) */}
        <div className="rounded-xl bg-card border border-[#E8712B]/30 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="inline-block rounded-full bg-[#E8712B]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#E8712B]">
              Biashara
            </span>
            <span className="text-[10px] text-muted-foreground">Business</span>
          </div>
          <p className="mt-3 text-xl font-bold text-foreground">
            TZS 149,000<span className="text-xs font-normal text-muted-foreground">/mwezi</span>
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div>
              <p className="text-lg font-bold text-foreground">2</p>
              <p className="text-[10px] text-muted-foreground">Migahawa</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">MRR</p>
              <p className="text-sm font-bold text-[#E8712B]">TZS 298,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* MRR Summary + MRR Breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* MRR Summary Card */}
        <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground">
            Muhtasari wa MRR
            <span className="ml-2 text-[10px] font-normal text-muted-foreground">
              Monthly Recurring Revenue
            </span>
          </h3>

          <div className="mt-5 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-[#2D7A3A]/5 p-4 text-center">
              <p className="text-[10px] font-medium text-muted-foreground">Total MRR</p>
              <p className="mt-1 text-lg font-bold text-[#2D7A3A]">TZS 1,028,000</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <p className="text-[10px] font-medium text-muted-foreground">ARR</p>
              <p className="mt-1 text-lg font-bold text-blue-700">TZS 12,336,000</p>
            </div>
            <div className="rounded-lg bg-[#E8712B]/5 p-4 text-center">
              <p className="text-[10px] font-medium text-muted-foreground">Ukuaji / Growth</p>
              <p className="mt-1 text-lg font-bold text-[#2D7A3A]">+18%</p>
              <div className="mt-1 flex items-center justify-center gap-1">
                <svg width="12" height="12" fill="none" stroke="#2D7A3A" strokeWidth="2">
                  <path d="M2 8l4-4 4 4" />
                </svg>
                <span className="text-[10px] text-[#2D7A3A]">mwezi huu</span>
              </div>
            </div>
          </div>
        </div>

        {/* MRR Breakdown Bar Chart (CSS) */}
        <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground">
            Mgawanyo wa MRR
            <span className="ml-2 text-[10px] font-normal text-muted-foreground">
              MRR Breakdown
            </span>
          </h3>

          <div className="mt-5 space-y-4">
            {mrrBreakdown.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-medium text-foreground">
                      {item.labelSw}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ({item.label})
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      item.amount < 0 ? "text-red-600" : "text-foreground"
                    }`}
                  >
                    {item.amount < 0 ? "-" : ""}TZS{" "}
                    {Math.abs(item.amount).toLocaleString()}
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted/50">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: item.color,
                      opacity: 0.85,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trial Expiring Soon Alert */}
      {trialsExpiring.length > 0 && (
        <div className="rounded-xl border-2 border-[#E8712B]/30 bg-[#E8712B]/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8712B]/10">
              <svg width="16" height="16" fill="none" stroke="#E8712B" strokeWidth="2">
                <circle cx="8" cy="8" r="7" />
                <path d="M8 4v4l2.5 1.5" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E8712B]">
                Majaribio Yanayokaribia Kuisha
              </h3>
              <p className="text-[10px] text-[#E8712B]/70">
                Trials Expiring Within 7 Days
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {trialsExpiring.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-lg bg-card border border-[#E8712B]/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8712B]/10 text-xs font-bold text-[#E8712B]">
                    {s.restaurant
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {s.restaurant}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.plan} ({s.planEn}) — Jaribio linaisha baada ya siku{" "}
                      <span className="font-bold text-[#E8712B]">
                        {s.trialEndsIn}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-[10px] font-medium text-foreground transition hover:bg-muted">
                    Tuma Ukumbusho
                  </button>
                  <button className="rounded-lg bg-[#2D7A3A] px-3 py-1.5 text-[10px] font-medium text-white transition hover:bg-[#1B5227]">
                    Pandisha Mpango
                  </button>
                  <button className="rounded-lg border border-[#E8712B]/30 bg-[#E8712B]/5 px-3 py-1.5 text-[10px] font-medium text-[#E8712B] transition hover:bg-[#E8712B]/10">
                    Ongeza Muda
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="7" cy="7" r="5" />
            <path d="M14 14l-3-3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tafuta mgahawa..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground sm:w-72"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
          >
            <option value="Zote">Mpango: Zote</option>
            <option value="Bure">Bure (Free)</option>
            <option value="Mwanzo">Mwanzo (Starter)</option>
            <option value="Kitaalamu">Kitaalamu (Professional)</option>
            <option value="Biashara">Biashara (Business)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
          >
            <option value="Zote">Hali: Zote</option>
            <option value="active">Hai (Active)</option>
            <option value="trial">Jaribio (Trial)</option>
            <option value="past_due">Imechelewa (Past Due)</option>
            <option value="cancelled">Imesitishwa (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden border-b border-border bg-muted/30 px-5 py-3 lg:grid lg:grid-cols-12 lg:gap-3">
          <p className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mgahawa
          </p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mpango
          </p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Hali
          </p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">
            MRR
          </p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Imeanza
          </p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Malipo Yajayo
          </p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Njia ya Malipo
          </p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">
            Vitendo
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                <rect x="4" y="4" width="20" height="20" rx="3" />
                <path d="M4 10h20M10 4v20" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              Hakuna usajili uliopatikana
            </p>
            <p className="text-xs text-muted-foreground">
              No subscriptions found matching your filters
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((s) => {
              const badge = statusBadge(s.status);
              return (
                <div
                  key={s.id}
                  className={`relative flex flex-col gap-3 px-5 py-4 transition hover:bg-muted/20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-3 ${
                    s.status === "past_due"
                      ? "bg-[#E8712B]/[0.02]"
                      : ""
                  }`}
                >
                  {/* Restaurant */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${
                        s.plan === "Biashara"
                          ? "bg-[#E8712B]"
                          : s.plan === "Kitaalamu"
                          ? "bg-[#2D7A3A]"
                          : s.plan === "Mwanzo"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {s.restaurant
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {s.restaurant}
                    </p>
                  </div>

                  {/* Plan Badge */}
                  <div className="col-span-1">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${planBadgeStyle(s.plan)}`}
                    >
                      {s.plan}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.style}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* MRR */}
                  <div className="col-span-1 text-right">
                    <p className="text-xs text-muted-foreground lg:hidden">
                      MRR:
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        s.mrr === 0
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {s.mrr === 0 ? "—" : formatTZS(s.mrr)}
                    </p>
                  </div>

                  {/* Started */}
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground lg:hidden">
                      Imeanza:
                    </p>
                    <p className="text-xs text-foreground">
                      {formatDate(s.started)}
                    </p>
                  </div>

                  {/* Next Billing */}
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground lg:hidden">
                      Malipo Yajayo:
                    </p>
                    <p
                      className={`text-xs ${
                        s.status === "past_due"
                          ? "font-semibold text-[#E8712B]"
                          : "text-foreground"
                      }`}
                    >
                      {formatDate(s.nextBilling)}
                      {s.status === "past_due" && (
                        <span className="ml-1 text-[9px] text-red-500">
                          (Overdue)
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="col-span-1">
                    <p className="text-xs text-foreground">{s.paymentMethod}</p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end">
                    <button
                      onClick={() =>
                        setActionMenuId(actionMenuId === s.id ? null : s.id)
                      }
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="3" r="1.5" />
                        <circle cx="8" cy="8" r="1.5" />
                        <circle cx="8" cy="13" r="1.5" />
                      </svg>
                    </button>

                    {/* Action Dropdown */}
                    {actionMenuId === s.id && (
                      <div className="absolute right-4 top-12 z-20 w-52 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                        <button
                          onClick={() => {
                            setChangePlanSub(s);
                            setSelectedNewPlan(s.plan);
                            setActionMenuId(null);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-foreground transition hover:bg-muted"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 8l4-4 4 4M2 14l4-4 4 4" />
                          </svg>
                          Badilisha Mpango
                        </button>
                        <button
                          onClick={() => setActionMenuId(null)}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-foreground transition hover:bg-muted"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="10" height="8" rx="1" />
                            <path d="M2 5l5 3 5-3" />
                          </svg>
                          Tuma Invoice
                        </button>
                        {s.status === "trial" && (
                          <button
                            onClick={() => setActionMenuId(null)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-blue-600 transition hover:bg-blue-50"
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="7" cy="7" r="6" />
                              <path d="M7 4v3l2 1" />
                            </svg>
                            Ongeza Muda wa Jaribio
                          </button>
                        )}
                        {s.status !== "cancelled" && (
                          <button
                            onClick={() => setActionMenuId(null)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#E8712B] transition hover:bg-[#E8712B]/5"
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M2 10l5-5 5 5" transform="rotate(180 7 7)" />
                            </svg>
                            Rejesha Pesa (Refund)
                          </button>
                        )}
                        {s.status !== "cancelled" && (
                          <button
                            onClick={() => setActionMenuId(null)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-600 transition hover:bg-red-50"
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="7" cy="7" r="6" />
                              <path d="M4 4l6 6M10 4l-6 6" />
                            </svg>
                            Sitisha Usajili
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table Footer */}
        <div className="border-t border-border bg-muted/20 px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Inaonyesha {filtered.length} kati ya {subscriptions.length} usajili
            <span className="ml-1 text-muted-foreground/60">
              (Showing {filtered.length} of {subscriptions.length})
            </span>
          </p>
          <div className="flex gap-1">
            <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
              Nyuma
            </button>
            <button className="rounded-lg bg-[#2D7A3A] px-3 py-1.5 text-xs font-medium text-white">
              1
            </button>
            <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
              Mbele
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CHANGE PLAN MODAL
         ══════════════════════════════════════════ */}
      {changePlanSub && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setChangePlanSub(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-foreground">Badilisha Mpango</h3>
            <p className="text-xs text-muted-foreground">
              Change Plan — {changePlanSub.restaurant}
            </p>

            <div className="mt-4 rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Mpango wa sasa:</p>
              <p className="text-sm font-semibold text-foreground">
                {changePlanSub.plan} ({changePlanSub.planEn}) —{" "}
                {formatTZS(changePlanSub.mrr)}/mwezi
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Mpango Mpya (New Plan)
              </label>
              {[
                { plan: "Bure", en: "Free", price: 0 },
                { plan: "Mwanzo", en: "Starter", price: 29000 },
                { plan: "Kitaalamu", en: "Professional", price: 59000 },
                { plan: "Biashara", en: "Business", price: 149000 },
              ].map((p) => (
                <button
                  key={p.plan}
                  onClick={() => setSelectedNewPlan(p.plan)}
                  className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition ${
                    selectedNewPlan === p.plan
                      ? "border-[#2D7A3A] bg-[#2D7A3A]/5 ring-1 ring-[#2D7A3A]"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {p.plan}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({p.en})
                      </span>
                    </p>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {p.price === 0 ? "Bure" : formatTZS(p.price)}
                    <span className="text-xs font-normal text-muted-foreground">
                      /mwezi
                    </span>
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setChangePlanSub(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Ghairi
              </button>
              <button
                onClick={() => setChangePlanSub(null)}
                className="flex-1 rounded-xl bg-[#2D7A3A] py-2.5 text-sm font-medium text-white transition hover:bg-[#1B5227]"
              >
                Hifadhi Mabadiliko
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click-away handler for action menu */}
      {actionMenuId !== null && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActionMenuId(null)}
        />
      )}
    </div>
  );
}
