"use client";

import { useState, useEffect } from "react";

interface SubTenant {
  id: string;
  name: string;
  city: string;
  phone: string;
  plan: string;
  status: string;
  trialEndsAt: string | null;
  approvalStatus: string;
  createdAt: string;
  owner: { name: string; phone: string } | null;
}

interface TrialExpiring {
  id: string;
  name: string;
  plan: string;
  trialEndsAt: string;
  daysLeft: number;
  owner: { name: string } | null;
}

interface SubData {
  tenants: SubTenant[];
  planCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  mrr: number;
  arr: number;
  mrrByPlan: Record<string, number>;
  trialsExpiring: TrialExpiring[];
}

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  starter: 29000,
  professional: 59000,
  business: 149000,
  enterprise: 299000,
};

const PLAN_SW: Record<string, string> = {
  free: "Bure",
  starter: "Mwanzo",
  professional: "Kitaalamu",
  business: "Biashara",
  enterprise: "Kampuni",
};

const STATUS_INFO: Record<string, { label: string; style: string; dot: string }> = {
  active: { label: "Hai", style: "bg-green-100 text-green-700", dot: "bg-green-500" },
  trial: { label: "Jaribio", style: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  past_due: { label: "Imechelewa", style: "bg-[#E8712B]/10 text-[#E8712B]", dot: "bg-[#E8712B]" },
  cancelled: { label: "Imesitishwa", style: "bg-red-100 text-red-600", dot: "bg-red-500" },
};

function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

function formatDate(iso: string) {
  if (!iso || iso === "—") return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("sw-TZ", { day: "2-digit", month: "short", year: "numeric" });
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function SubscriptionsPage() {
  const [data, setData] = useState<SubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/subscriptions")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
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

  const filtered = (data?.tenants || []).filter((t) => {
    const matchesPlan = planFilter === "all" || t.plan === planFilter;
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = t.name.toLowerCase().includes(q) || (t.owner?.name || "").toLowerCase().includes(q);
    return matchesPlan && matchesStatus && matchesSearch;
  });

  const planCards = [
    { key: "free", border: "border-border", color: "text-gray-600", bgBadge: "bg-gray-100 text-gray-600" },
    { key: "starter", border: "border-blue-200", color: "text-blue-700", bgBadge: "bg-blue-100 text-blue-700" },
    { key: "professional", border: "border-[#2D7A3A]", color: "text-[#2D7A3A]", bgBadge: "bg-[#2D7A3A]/10 text-[#2D7A3A]", popular: true },
    { key: "business", border: "border-[#E8712B]/30", color: "text-[#E8712B]", bgBadge: "bg-[#E8712B]/10 text-[#E8712B]" },
  ];

  const activeTenantCount = (data?.statusCounts?.active || 0) + (data?.statusCounts?.trial || 0);
  const avgMrrPerRestaurant = activeTenantCount > 0 ? Math.round((data?.mrr || 0) / activeTenantCount) : 0;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top rounded-lg bg-[#2D7A3A] px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usajili</h1>
        <p className="text-xs text-muted-foreground">Subscriptions — Simamia mipango na malipo</p>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {planCards.map((pc) => (
          <div key={pc.key} className={`rounded-xl bg-card border ${pc.popular ? "border-2" : ""} ${pc.border} p-5 shadow-sm relative overflow-hidden`}>
            {pc.popular && (
              <div className="absolute right-0 top-0 rounded-bl-lg bg-[#2D7A3A] px-2.5 py-0.5">
                <span className="text-[9px] font-semibold text-white">Maarufu</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${pc.bgBadge}`}>
                {PLAN_SW[pc.key]}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize">{pc.key}</span>
            </div>
            <p className="mt-3 text-xl font-bold text-foreground">
              TZS {fmt(PLAN_PRICES[pc.key])}
              <span className="text-xs font-normal text-muted-foreground">/mwezi</span>
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div>
                <p className="text-lg font-bold text-foreground">{data?.planCounts[pc.key] || 0}</p>
                <p className="text-[10px] text-muted-foreground">Migahawa</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">MRR</p>
                <p className={`text-sm font-bold ${pc.color}`}>TZS {fmt(data?.mrrByPlan[pc.key] || 0)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MRR Summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground">Total MRR</h3>
          <p className="text-[10px] text-muted-foreground">Monthly Recurring Revenue</p>
          <p className="mt-3 text-2xl font-bold text-[#2D7A3A]">TZS {fmt(data?.mrr || 0)}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Wastani kwa mgahawa: <span className="font-semibold text-foreground">TZS {fmt(avgMrrPerRestaurant)}</span>
          </p>
        </div>
        <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground">ARR</h3>
          <p className="text-[10px] text-muted-foreground">Annual Recurring Revenue</p>
          <p className="mt-3 text-2xl font-bold text-blue-700">TZS {fmt(data?.arr || 0)}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground">Hali ya Usajili</h3>
          <p className="text-[10px] text-muted-foreground">Subscription Status</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(data?.statusCounts || {}).map(([status, count]) => {
              const si = STATUS_INFO[status];
              return (
                <span
                  key={status}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${si?.style || "bg-gray-100 text-gray-600"}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${si?.dot || "bg-gray-400"}`} />
                  {si?.label || status}: {count}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trial Expiring Alert */}
      {(data?.trialsExpiring || []).length > 0 && (
        <div className="rounded-xl border-2 border-[#E8712B]/30 bg-[#E8712B]/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8712B]/10">
              <svg width="16" height="16" fill="none" stroke="#E8712B" strokeWidth="2">
                <circle cx="8" cy="8" r="7" />
                <path d="M8 4v4l2.5 1.5" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E8712B]">Majaribio Yanayokaribia Kuisha</h3>
              <p className="text-[10px] text-[#E8712B]/70">Trials Expiring Within 7 Days</p>
            </div>
          </div>
          <div className="space-y-2">
            {data?.trialsExpiring.map((t) => (
              <div key={t.id} className="flex flex-col gap-3 rounded-lg bg-card border border-[#E8712B]/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8712B]/10 text-xs font-bold text-[#E8712B]">
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {PLAN_SW[t.plan] || t.plan} — Siku <span className="font-bold text-[#E8712B]">{t.daysLeft}</span> zilizobaki
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => showToast(`Ukumbusho umetumwa kwa ${t.name}`)}
                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-[10px] font-medium text-foreground transition hover:bg-muted"
                  >
                    Tuma Ukumbusho
                  </button>
                  <button
                    onClick={() => showToast(`Ombi la kupandisha mpango limetumwa kwa ${t.name}`)}
                    className="rounded-lg bg-[#2D7A3A] px-3 py-1.5 text-[10px] font-medium text-white transition hover:bg-[#1B5227]"
                  >
                    Pandisha Mpango
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
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
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
            <option value="all">Mpango: Zote</option>
            <option value="free">Bure (Free)</option>
            <option value="starter">Mwanzo (Starter)</option>
            <option value="professional">Kitaalamu (Professional)</option>
            <option value="business">Biashara (Business)</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
          >
            <option value="all">Hali: Zote</option>
            <option value="active">Hai (Active)</option>
            <option value="trial">Jaribio (Trial)</option>
            <option value="past_due">Imechelewa (Past Due)</option>
            <option value="cancelled">Imesitishwa (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
        <div className="hidden border-b border-border bg-muted/30 px-5 py-3 lg:grid lg:grid-cols-12 lg:gap-3">
          <p className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mgahawa</p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mpango</p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Hali</p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Jiji</p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tarehe</p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">MRR</p>
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-sm font-medium text-foreground">Hakuna usajili uliopatikana</p>
            <p className="text-xs text-muted-foreground">No subscriptions match your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((t) => {
              const si = STATUS_INFO[t.status] || { label: t.status, style: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };
              const planPrice = PLAN_PRICES[t.plan] || 0;
              const avatarBg = t.plan === "business" ? "bg-[#E8712B]" : t.plan === "professional" ? "bg-[#2D7A3A]" : t.plan === "starter" ? "bg-blue-500" : "bg-gray-400";
              return (
                <div key={t.id} className="flex flex-col gap-3 px-5 py-4 transition hover:bg-muted/20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-3">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${avatarBg}`}>
                      {getInitials(t.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                      {t.owner && <p className="truncate text-[10px] text-muted-foreground">{t.owner.name}</p>}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      t.plan === "free" ? "bg-gray-100 text-gray-600" :
                      t.plan === "starter" ? "bg-blue-100 text-blue-700" :
                      t.plan === "professional" ? "bg-[#2D7A3A]/10 text-[#2D7A3A]" :
                      "bg-[#E8712B]/10 text-[#E8712B]"
                    }`}>
                      {PLAN_SW[t.plan] || t.plan}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${si.style}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${si.dot}`} />
                      {si.label}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-foreground">{t.city}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">{formatDate(t.createdAt)}</p>
                  </div>
                  <div className="col-span-1 text-right">
                    <p className={`text-sm font-bold ${planPrice === 0 ? "text-muted-foreground" : "text-foreground"}`}>
                      {planPrice === 0 ? "—" : `TZS ${fmt(planPrice)}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-border bg-muted/20 px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Inaonyesha {filtered.length} kati ya {data?.tenants.length || 0} usajili
          </p>
        </div>
      </div>
    </div>
  );
}
