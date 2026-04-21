"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Tenant {
  id: string;
  name: string;
  city: string;
  subscriptionPlan: string;
  approvalStatus: string;
}

interface Activity {
  id: string;
  action: string;
  createdAt: string;
}

interface OrderStatusCount {
  status: string;
  count: number;
}

interface CashierStats {
  totalOrders: number;
  totalRevenue: number;
  byStatus: OrderStatusCount[];
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

interface UserDetail {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  tenant: Tenant;
  activity: Activity[];
  cashierStats: CashierStats;
  recentOrders: RecentOrder[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

function roleLabelSw(role: string) {
  switch (role) {
    case "owner":
      return "Mmiliki";
    case "manager":
      return "Msimamizi";
    case "cashier":
      return "Mkusanyaji";
    case "super_admin":
      return "Super Admin";
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
    case "super_admin":
      return "bg-purple-100 text-purple-700";
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
    case "super_admin":
      return "bg-purple-600";
    default:
      return "bg-gray-400";
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("sw-TZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function relativeTime(dateStr: string) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "sasa hivi";
  if (minutes < 60) return `dakika ${minutes} zilizopita`;
  if (hours < 24) return `saa ${hours} zilizopita`;
  if (days < 7) return `siku ${days} zilizopita`;
  return formatDate(dateStr);
}

function orderStatusStyle(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function orderStatusLabel(status: string) {
  switch (status) {
    case "completed":
      return "Imekamilika";
    case "pending":
      return "Inasubiri";
    case "cancelled":
      return "Imeghairiwa";
    default:
      return status;
  }
}

function paymentLabel(method: string) {
  switch (method) {
    case "cash":
      return "Taslimu";
    case "mpesa":
      return "M-Pesa";
    case "card":
      return "Kadi";
    case "bank":
      return "Benki";
    default:
      return method;
  }
}

function planLabel(plan: string) {
  switch (plan) {
    case "free":
      return "Bure";
    case "starter":
      return "Starter";
    case "pro":
      return "Pro";
    case "enterprise":
      return "Enterprise";
    default:
      return plan;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function UserDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function fetchUser() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) throw new Error("Imeshindwa kupakia data");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kosa lisilojulikana");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function toggleActive() {
    if (!user) return;
    setToggling(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (!res.ok) throw new Error("Imeshindwa kubadilisha hali");
      setUser({ ...user, isActive: !user.isActive });
    } catch {
      // Silently handle
    } finally {
      setToggling(false);
      setShowConfirm(false);
    }
  }

  /* Loading state */
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

  /* Error state */
  if (error || !user) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">
            {error || "Mtumiaji hajapatikana"}
          </p>
          <Link
            href="/admin/users"
            className="mt-2 rounded-lg bg-[#2D7A3A] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1B5227]"
          >
            Rudi kwenye Watumiaji
          </Link>
        </div>
      </div>
    );
  }

  const hasCashierStats = user.cashierStats && user.cashierStats.totalOrders > 0;
  const hasRecentOrders = user.recentOrders && user.recentOrders.length > 0;
  const hasActivity = user.activity && user.activity.length > 0;

  return (
    <div className="space-y-6">
      {/* ---- 1. Breadcrumb ---- */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/admin"
          className="transition hover:text-foreground"
        >
          Dashboard
        </Link>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
          <path d="M5 3l4 4-4 4" />
        </svg>
        <Link
          href="/admin/users"
          className="transition hover:text-foreground"
        >
          Watumiaji
        </Link>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
          <path d="M5 3l4 4-4 4" />
        </svg>
        <span className="font-medium text-foreground">{user.name}</span>
      </nav>

      {/* ---- 2. Profile Header ---- */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${avatarBg(user.role)}`}
            >
              {getInitials(user.name)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${roleBadgeStyle(user.role)}`}
                >
                  {roleLabelSw(user.role)}
                </span>
                {user.tenant && (
                  <span className="text-xs text-muted-foreground">
                    {user.tenant.name}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      user.isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  {user.isActive ? "Hai" : "Simama"}
                </span>
              </div>
            </div>
          </div>

          {/* ---- 3. Quick Actions ---- */}
          {user.role !== "super_admin" && (
            <button
              onClick={() => setShowConfirm(true)}
              className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition ${
                user.isActive
                  ? "bg-[#E8712B] hover:bg-[#d4651f]"
                  : "bg-[#2D7A3A] hover:bg-[#1B5227]"
              }`}
            >
              {user.isActive ? "Simamisha" : "Rudisha"}
            </button>
          )}
        </div>
      </div>

      {/* ---- 4. Info Card ---- */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Taarifa za Mtumiaji
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              Simu
            </span>
            <span className="text-sm text-foreground">
              {user.phone || "---"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              Barua Pepe
            </span>
            <span className="text-sm text-foreground">
              {user.email || "---"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              Mgahawa
            </span>
            {user.tenant ? (
              <Link
                href={`/admin/restaurants/${user.tenant.id}`}
                className="text-sm font-medium text-[#2D7A3A] underline-offset-2 hover:underline"
              >
                {user.tenant.name}
              </Link>
            ) : (
              <span className="text-sm text-foreground">---</span>
            )}
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              Jukumu
            </span>
            <span
              className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${roleBadgeStyle(user.role)}`}
            >
              {roleLabelSw(user.role)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              Mpango
            </span>
            <span className="text-sm text-foreground">
              {user.tenant ? planLabel(user.tenant.subscriptionPlan) : "---"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              Tarehe ya Kusajiliwa
            </span>
            <span className="text-sm text-foreground">
              {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* ---- 5. Cashier Stats ---- */}
      {hasCashierStats && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">
            Takwimu za Mkusanyaji
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {/* Total Orders */}
            <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
              <p className="text-xs font-medium text-muted-foreground">
                Oda Zilizoshughulikiwa
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {fmt(user.cashierStats.totalOrders)}
              </p>
            </div>
            {/* Total Revenue */}
            <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
              <p className="text-xs font-medium text-muted-foreground">
                Mapato
              </p>
              <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">
                TZS {fmt(user.cashierStats.totalRevenue)}
              </p>
            </div>
            {/* By Status */}
            <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                Mgawanyo kwa Hali
              </p>
              <div className="space-y-2">
                {user.cashierStats.byStatus.map((s) => (
                  <div
                    key={s.status}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${orderStatusStyle(s.status)}`}
                    >
                      {orderStatusLabel(s.status)}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {fmt(s.count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- 6. Activity Timeline ---- */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Shughuli za Hivi Karibuni
        </h2>
        {hasActivity ? (
          <div className="relative ml-3">
            {/* Vertical line */}
            <div className="absolute left-0 top-1 bottom-1 w-px bg-border" />

            <div className="space-y-4">
              {user.activity.map((a, idx) => (
                <div key={a.id} className="relative pl-6">
                  {/* Dot */}
                  <div
                    className={`absolute left-[-3px] top-1.5 h-[7px] w-[7px] rounded-full border-2 border-card ${
                      idx === 0 ? "bg-[#2D7A3A]" : "bg-muted-foreground/40"
                    }`}
                  />
                  <p className="text-sm text-foreground">{a.action}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {relativeTime(a.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground"
              >
                <circle cx="10" cy="10" r="8" />
                <path d="M10 6v4l2.5 2.5" />
              </svg>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Hakuna shughuli zilizorekodiwa
            </p>
          </div>
        )}
      </div>

      {/* ---- 7. Recent Orders Table ---- */}
      {hasRecentOrders ? (
        <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Oda za Hivi Karibuni
            </h2>
          </div>

          {/* Desktop header */}
          <div className="hidden border-b border-border bg-muted/30 px-6 py-3 lg:grid lg:grid-cols-12 lg:gap-4">
            <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Nambari
            </p>
            <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Hali
            </p>
            <p className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Jumla
            </p>
            <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Malipo
            </p>
            <p className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tarehe
            </p>
          </div>

          <div className="divide-y divide-border">
            {user.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-2 px-6 py-4 transition hover:bg-muted/20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-4"
              >
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground lg:hidden">
                    Nambari:
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {order.orderNumber}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground lg:hidden">
                    Hali:
                  </p>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${orderStatusStyle(order.status)}`}
                  >
                    {orderStatusLabel(order.status)}
                  </span>
                </div>
                <div className="col-span-3">
                  <p className="text-xs text-muted-foreground lg:hidden">
                    Jumla:
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    TZS {fmt(order.total)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground lg:hidden">
                    Malipo:
                  </p>
                  <p className="text-sm text-foreground">
                    {paymentLabel(order.paymentMethod)}
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ---- 8. Empty state for orders ---- */
        <div className="rounded-xl bg-card p-10 shadow-sm border border-border text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted-foreground"
            >
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 14l2 2 4-4" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">
            Hakuna oda za hivi karibuni
          </p>
          <p className="text-xs text-muted-foreground">
            Mtumiaji huyu bado hajashughulikia oda yoyote
          </p>
        </div>
      )}

      {/* ---- Confirmation Modal ---- */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8712B]/10">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#E8712B"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-foreground">
              {user.isActive ? "Simamisha Mtumiaji?" : "Rudisha Mtumiaji?"}
            </h3>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              {user.isActive
                ? "Mtumiaji huyu hataweza kuingia kwenye mfumo hadi utakapomurudisha."
                : "Mtumiaji huyu ataweza kuingia kwenye mfumo tena."}
            </p>

            <div className="mt-4 rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {roleLabelSw(user.role)}
                {user.tenant ? ` - ${user.tenant.name}` : ""}
              </p>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Ghairi
              </button>
              <button
                onClick={toggleActive}
                disabled={toggling}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition disabled:opacity-50 ${
                  user.isActive
                    ? "bg-[#E8712B] hover:bg-[#d4651f]"
                    : "bg-[#2D7A3A] hover:bg-[#1B5227]"
                }`}
              >
                {toggling
                  ? "Inaendelea..."
                  : user.isActive
                    ? "Simamisha"
                    : "Rudisha"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
