"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  role: string;
  tenant: {
    name: string;
    approvalStatus: string;
    kycStatus: string;
  } | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          setUser(await meRes.json());
        }
      } catch {
        // Silent
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
          <p className="text-sm text-muted-foreground">Inapakia...</p>
        </div>
      </div>
    );
  }

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Habari ya asubuhi";
    if (hour < 17) return "Habari ya mchana";
    return "Habari ya jioni";
  })();

  const today = new Date().toLocaleDateString("sw-TZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const firstName = user?.name?.split(" ")[0] || "Mkurugenzi";
  const kycStatus = user?.tenant?.kycStatus || "not_submitted";
  const kycApproved = kycStatus === "approved";

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting}, {firstName}!
        </h1>
        <p className="text-sm text-muted-foreground">{today}</p>
      </div>

      {/* ════════ KYC BANNER ════════ */}
      {!kycApproved && (
        <div
          onClick={() => router.push("/kyc")}
          className={`relative cursor-pointer overflow-hidden rounded-2xl p-6 transition hover:shadow-xl ${
            kycStatus === "submitted"
              ? "border-2 border-yellow-400/50 bg-yellow-50"
              : kycStatus === "rejected"
              ? "border-2 border-red-400/50 bg-red-50"
              : "border-2 border-brand-orange bg-gradient-to-r from-brand-orange/10 via-brand-orange/5 to-brand-green/10"
          }`}
        >
          {/* Glowing pulse effect for not_submitted */}
          {kycStatus === "not_submitted" && (
            <div className="absolute inset-0 animate-pulse rounded-2xl bg-brand-orange/5" />
          )}

          <div className="relative flex items-center gap-5">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
              kycStatus === "submitted" ? "bg-yellow-400/20" : kycStatus === "rejected" ? "bg-red-400/20" : "bg-brand-orange/15"
            }`}>
              {kycStatus === "submitted" ? (
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : kycStatus === "rejected" ? (
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-brand-orange animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">
                {kycStatus === "not_submitted"
                  ? "Wasilisha KYC - Thibitisha Biashara Yako"
                  : kycStatus === "submitted"
                  ? "KYC Inapitiwa..."
                  : "KYC Imekataliwa - Wasilisha Tena"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {kycStatus === "not_submitted"
                  ? "Submit your NIDA and business details to unlock team creation"
                  : kycStatus === "submitted"
                  ? "Your KYC is under review. We'll notify you when approved."
                  : "Your KYC was rejected. Please resubmit with correct details."}
              </p>
              {kycStatus === "not_submitted" && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-orange/25">
                  Wasilisha Sasa &rarr;
                </div>
              )}
              {kycStatus === "rejected" && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                  Wasilisha Tena &rarr;
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════ WORKSPACE CARDS ════════ */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Eneo la Kazi (Workspace)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* POS / Cashier */}
          <Link
            href="/pos"
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-brand-green hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 transition group-hover:bg-brand-green/20">
              <svg className="h-6 w-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">Karani wa POS</h3>
            <p className="text-xs text-muted-foreground">Cashier / Point of Sale</p>
            <p className="mt-2 text-sm text-muted-foreground">Pokea oda, malipo ya M-Pesa, Cash</p>
          </Link>

          {/* Stock Manager */}
          <Link
            href="/stock"
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-brand-orange hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 transition group-hover:bg-brand-orange/20">
              <svg className="h-6 w-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">Meneja wa Stoku</h3>
            <p className="text-xs text-muted-foreground">Stock / Inventory Manager</p>
            <p className="mt-2 text-sm text-muted-foreground">Ingiza bidhaa, fuatilia malighafi</p>
          </Link>

          {/* Reports / Director */}
          <Link
            href="/reports"
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-blue-400 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 transition group-hover:bg-blue-500/20">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">Mkurugenzi</h3>
            <p className="text-xs text-muted-foreground">Director / Reports</p>
            <p className="mt-2 text-sm text-muted-foreground">Ripoti, faida, idhini</p>
          </Link>

          {/* Menu */}
          <Link
            href="/menu"
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-purple-400 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 transition group-hover:bg-purple-500/20">
              <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">Menyu</h3>
            <p className="text-xs text-muted-foreground">Menu Management</p>
            <p className="mt-2 text-sm text-muted-foreground">Ongeza na hariri bidhaa na bei</p>
          </Link>

          {/* Staff / Team - locked if KYC not approved */}
          {kycApproved ? (
            <Link
              href="/staff"
              className="group rounded-2xl border border-border bg-card p-6 transition hover:border-brand-green hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 transition group-hover:bg-teal-500/20">
                <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">Timu Yangu</h3>
              <p className="text-xs text-muted-foreground">My Team / Staff</p>
              <p className="mt-2 text-sm text-muted-foreground">Unda akaunti za karani na meneja</p>
            </Link>
          ) : (
            <div className="relative rounded-2xl border border-border bg-card p-6 opacity-60">
              <div className="absolute right-4 top-4">
                <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">Timu Yangu</h3>
              <p className="text-xs text-muted-foreground">My Team / Staff</p>
              <p className="mt-2 text-xs text-brand-orange font-medium">Wasilisha KYC kwanza ili kuunda timu</p>
              <p className="text-[10px] text-muted-foreground">Submit KYC first to unlock team creation</p>
            </div>
          )}

          {/* Expenses */}
          <Link
            href="/expenses"
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-red-400 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 transition group-hover:bg-red-500/20">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">Matumizi</h3>
            <p className="text-xs text-muted-foreground">Expenses</p>
            <p className="mt-2 text-sm text-muted-foreground">Rekodi matumizi ya biashara</p>
          </Link>
        </div>
      </div>

      {/* ════════ TODAY'S SUMMARY ════════ */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Muhtasari wa Leo (Today)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
            <p className="text-xs font-medium text-muted-foreground">Mapato ya Leo</p>
            <p className="mt-1 text-2xl font-bold text-brand-green">TZS 0</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Today&apos;s revenue</p>
          </div>
          <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
            <p className="text-xs font-medium text-muted-foreground">Oda za Leo</p>
            <p className="mt-1 text-2xl font-bold text-brand-orange">0</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Today&apos;s orders</p>
          </div>
          <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
            <p className="text-xs font-medium text-muted-foreground">Bidhaa kwenye Menyu</p>
            <p className="mt-1 text-2xl font-bold text-purple-500">0</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Menu items</p>
          </div>
          <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
            <p className="text-xs font-medium text-muted-foreground">Wafanyakazi</p>
            <p className="mt-1 text-2xl font-bold text-teal-600">1</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Team members</p>
          </div>
        </div>
      </div>
    </div>
  );
}
