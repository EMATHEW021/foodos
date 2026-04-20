"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserData {
  name: string;
  role: string;
  tenant: {
    name: string;
    approvalStatus: string;
  } | null;
}

interface DashboardData {
  hasData: boolean;
  todaySales: number;
  todayOrders: number;
  lowStockCount: number;
  activeStaff: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const userData = await meRes.json();
          setUser(userData);

          // For now, we show empty state for new restaurants
          // TODO: Fetch real dashboard data once orders exist
          setData({
            hasData: false,
            todaySales: 0,
            todayOrders: 0,
            lowStockCount: 0,
            activeStaff: 0,
          });
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

  // EMPTY STATE - New restaurant, no data yet
  if (data && !data.hasData) {
    return (
      <div className="space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {greeting}, {firstName}!
          </h1>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>

        {/* Welcome Card */}
        <div className="rounded-2xl border-2 border-brand-green/30 bg-gradient-to-br from-brand-green/5 to-brand-orange/5 p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green/10">
              <svg className="h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-foreground">
              Karibu kwenye FoodOS, {firstName}!
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome to FoodOS! Let&apos;s set up your restaurant.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Fuata hatua hizi kuanza kutumia mfumo wako wa mgahawa
            </p>
          </div>
        </div>

        {/* Onboarding Steps */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Step 1: Add Menu */}
          <Link
            href="/menu"
            className="group rounded-xl border-2 border-dashed border-brand-green/30 bg-card p-6 transition hover:border-brand-green hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-2xl transition group-hover:bg-brand-green/20">
                <svg className="h-6 w-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white">1</span>
                  <h3 className="text-base font-bold text-foreground">Ongeza Menyu</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ongeza bidhaa na bei kwenye menyu yako ya kidijitali
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Add products and prices to your digital menu
                </p>
              </div>
            </div>
          </Link>

          {/* Step 2: Add Inventory */}
          <Link
            href="/stock"
            className="group rounded-xl border-2 border-dashed border-brand-orange/30 bg-card p-6 transition hover:border-brand-orange hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-2xl transition group-hover:bg-brand-orange/20">
                <svg className="h-6 w-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">2</span>
                  <h3 className="text-base font-bold text-foreground">Ongeza Stoku</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ongeza malighafi na bidhaa za stoku yako
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Add raw materials and inventory items
                </p>
              </div>
            </div>
          </Link>

          {/* Step 3: Add Staff */}
          <Link
            href="/staff"
            className="group rounded-xl border-2 border-dashed border-blue-400/30 bg-card p-6 transition hover:border-blue-400 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-2xl transition group-hover:bg-blue-500/20">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">3</span>
                  <h3 className="text-base font-bold text-foreground">Ongeza Wafanyakazi</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sajili wahudumu na maneja wako kwenye mfumo
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Register your cashiers and managers
                </p>
              </div>
            </div>
          </Link>

          {/* Step 4: First Sale */}
          <Link
            href="/pos"
            className="group rounded-xl border-2 border-dashed border-purple-400/30 bg-card p-6 transition hover:border-purple-400 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-2xl transition group-hover:bg-purple-500/20">
                <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white">4</span>
                  <h3 className="text-base font-bold text-foreground">Fanya Mauzo ya Kwanza</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fungua POS na upokee oda yako ya kwanza!
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Open POS and take your first order!
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <h3 className="text-sm font-bold text-foreground">Vitendo vya Haraka (Quick Actions)</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link
              href="/pos"
              className="flex items-center gap-3 rounded-lg border border-brand-green/20 bg-brand-green/5 p-4 transition hover:bg-brand-green/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/10">
                <svg className="h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Oda Mpya</p>
                <p className="text-[10px] text-muted-foreground">New Order</p>
              </div>
            </Link>

            <Link
              href="/menu"
              className="flex items-center gap-3 rounded-lg border border-brand-orange/20 bg-brand-orange/5 p-4 transition hover:bg-brand-orange/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10">
                <svg className="h-5 w-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Ongeza Bidhaa</p>
                <p className="text-[10px] text-muted-foreground">Add Product</p>
              </div>
            </Link>

            <Link
              href="/reports"
              className="flex items-center gap-3 rounded-lg border border-blue-400/20 bg-blue-500/5 p-4 transition hover:bg-blue-500/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Tazama Ripoti</p>
                <p className="text-[10px] text-muted-foreground">View Reports</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE STATE - Has data (same as before but with real queries)
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting}, {firstName}!
        </h1>
        <p className="text-sm text-muted-foreground">{today}</p>
      </div>

      {/* 3 Mode Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/pos"
          className="group rounded-2xl border-2 border-brand-green bg-card p-6 transition hover:border-brand-green hover:shadow-lg"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-green/10 transition group-hover:bg-brand-green/20">
            <svg className="h-7 w-7 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">Hali ya Karani</h3>
          <p className="text-xs text-muted-foreground">Cashier Mode</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Pata oda, pokea malipo ya M-Pesa, Tigo, Cash
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-green">
            Fungua POS &rarr;
          </div>
        </Link>

        <Link
          href="/stock"
          className="group rounded-2xl border-2 border-brand-orange bg-card p-6 transition hover:border-brand-orange hover:shadow-lg"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-orange/10 transition group-hover:bg-brand-orange/20">
            <svg className="h-7 w-7 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">Hali ya Stoku</h3>
          <p className="text-xs text-muted-foreground">Stock Manager Mode</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingiza bidhaa, toa, hariri &mdash; yote chini ya idhini
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-orange">
            Fungua Stoku &rarr;
          </div>
        </Link>

        <Link
          href="/reports"
          className="group rounded-2xl border-2 border-blue-400 bg-card p-6 transition hover:border-blue-400 hover:shadow-lg"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 transition group-hover:bg-blue-500/20">
            <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">Hali ya Mkurugenzi</h3>
          <p className="text-xs text-muted-foreground">Director Mode</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ripoti, faida, idhini, angalia kila kitu
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-500">
            Fungua Ripoti &rarr;
          </div>
        </Link>
      </div>

      {/* Today's Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Mapato ya Leo</p>
          <p className="mt-1 text-2xl font-bold text-brand-green">TZS {data?.todaySales?.toLocaleString() || "0"}</p>
          <p className="mt-1 text-xs text-muted-foreground">Today&apos;s revenue</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Oda za Leo</p>
          <p className="mt-1 text-2xl font-bold text-brand-orange">{data?.todayOrders || 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Today&apos;s orders</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Stoku Chini</p>
          <p className="mt-1 text-2xl font-bold text-red-500">{data?.lowStockCount || 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Low stock alerts</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Wafanyakazi Hai</p>
          <p className="mt-1 text-2xl font-bold text-blue-500">{data?.activeStaff || 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Active staff</p>
        </div>
      </div>
    </div>
  );
}
