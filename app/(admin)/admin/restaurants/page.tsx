"use client";

import { useState, useMemo } from "react";

/* ─── Types ─── */
type RestaurantStatus = "active" | "trial" | "pending_kyc" | "suspended";
type PlanType = "Bure" | "Mwanzo" | "Kitaalamu" | "Biashara";

interface Restaurant {
  id: string;
  name: string;
  owner: string;
  ownerPhone: string;
  ownerEmail: string;
  city: string;
  address: string;
  plan: PlanType;
  status: RestaurantStatus;
  mrr: number;
  ordersPerMonth: number;
  joinedDate: string;
  staffCount: number;
  menuItems: number;
  trialEndsAt: string | null;
  logoInitials: string;
  logoBg: string;
}

/* ─── Sample Data ─── */
const RESTAURANTS: Restaurant[] = [
  {
    id: "r001", name: "Mama Lishe Kitchen", owner: "Salma Hassan", ownerPhone: "+255 712 345 678",
    ownerEmail: "salma@malishe.co.tz", city: "Dar es Salaam", address: "Kariakoo, Mtaa wa Msimbazi",
    plan: "Kitaalamu", status: "active", mrr: 59000, ordersPerMonth: 450, joinedDate: "2025-03-15",
    staffCount: 8, menuItems: 42, trialEndsAt: null, logoInitials: "ML", logoBg: "bg-emerald-600",
  },
  {
    id: "r002", name: "Kilimanjaro Cafe", owner: "John Moshi", ownerPhone: "+255 786 123 456",
    ownerEmail: "john@kilicafe.co.tz", city: "Arusha", address: "Njiro, Arusha Road",
    plan: "Mwanzo", status: "active", mrr: 29000, ordersPerMonth: 280, joinedDate: "2025-05-22",
    staffCount: 5, menuItems: 28, trialEndsAt: null, logoInitials: "KC", logoBg: "bg-sky-600",
  },
  {
    id: "r003", name: "Nyama Choma House", owner: "Peter Msangi", ownerPhone: "+255 754 987 654",
    ownerEmail: "peter@nyamachoma.co.tz", city: "Dar es Salaam", address: "Masaki, Haile Selassie Rd",
    plan: "Kitaalamu", status: "active", mrr: 59000, ordersPerMonth: 520, joinedDate: "2025-01-10",
    staffCount: 12, menuItems: 55, trialEndsAt: null, logoInitials: "NC", logoBg: "bg-red-600",
  },
  {
    id: "r004", name: "Chipsi Mayai Corner", owner: "Amina Juma", ownerPhone: "+255 678 456 123",
    ownerEmail: "amina@chipsi.co.tz", city: "Mwanza", address: "Nyamagana, Station Rd",
    plan: "Bure", status: "trial", mrr: 0, ordersPerMonth: 45, joinedDate: "2026-03-28",
    staffCount: 2, menuItems: 12, trialEndsAt: "2026-04-28", logoInitials: "CM", logoBg: "bg-yellow-600",
  },
  {
    id: "r005", name: "Pilau Palace", owner: "Rashid Omar", ownerPhone: "+255 713 789 012",
    ownerEmail: "rashid@pilau.co.tz", city: "Dar es Salaam", address: "Ilala, Libya Street",
    plan: "Mwanzo", status: "active", mrr: 29000, ordersPerMonth: 310, joinedDate: "2025-07-01",
    staffCount: 6, menuItems: 35, trialEndsAt: null, logoInitials: "PP", logoBg: "bg-amber-700",
  },
  {
    id: "r006", name: "Zanzibar Spice", owner: "Fatma Ali", ownerPhone: "+255 777 234 567",
    ownerEmail: "fatma@zspice.co.tz", city: "Zanzibar", address: "Stone Town, Hurumzi St",
    plan: "Mwanzo", status: "active", mrr: 29000, ordersPerMonth: 190, joinedDate: "2025-08-14",
    staffCount: 4, menuItems: 30, trialEndsAt: null, logoInitials: "ZS", logoBg: "bg-purple-600",
  },
  {
    id: "r007", name: "Dar Biriyani", owner: "Ahmed Salim", ownerPhone: "+255 689 345 678",
    ownerEmail: "ahmed@darbiriyani.co.tz", city: "Dar es Salaam", address: "Kinondoni, Mwenge",
    plan: "Bure", status: "pending_kyc", mrr: 0, ordersPerMonth: 0, joinedDate: "2026-04-10",
    staffCount: 0, menuItems: 0, trialEndsAt: null, logoInitials: "DB", logoBg: "bg-orange-600",
  },
  {
    id: "r008", name: "Mwanza Fish House", owner: "Grace Kamala", ownerPhone: "+255 752 567 890",
    ownerEmail: "grace@mwanzafish.co.tz", city: "Mwanza", address: "Ilemela, Capri Point",
    plan: "Mwanzo", status: "active", mrr: 29000, ordersPerMonth: 150, joinedDate: "2025-11-05",
    staffCount: 4, menuItems: 22, trialEndsAt: null, logoInitials: "MF", logoBg: "bg-blue-600",
  },
  {
    id: "r009", name: "Arusha Grill", owner: "David Mollel", ownerPhone: "+255 765 678 901",
    ownerEmail: "david@arushagrill.co.tz", city: "Arusha", address: "CBD, Sokoine Road",
    plan: "Bure", status: "trial", mrr: 0, ordersPerMonth: 30, joinedDate: "2026-04-01",
    staffCount: 2, menuItems: 15, trialEndsAt: "2026-05-01", logoInitials: "AG", logoBg: "bg-lime-700",
  },
  {
    id: "r010", name: "Samaki wa Pwani", owner: "Mwanaisha Bakari", ownerPhone: "+255 714 890 123",
    ownerEmail: "mwanaisha@samaki.co.tz", city: "Dar es Salaam", address: "Mbagala, Zakhem Rd",
    plan: "Kitaalamu", status: "active", mrr: 59000, ordersPerMonth: 380, joinedDate: "2025-04-20",
    staffCount: 9, menuItems: 48, trialEndsAt: null, logoInitials: "SP", logoBg: "bg-teal-600",
  },
  {
    id: "r011", name: "Ugali Express", owner: "Joseph Mkude", ownerPhone: "+255 788 012 345",
    ownerEmail: "joseph@ugali.co.tz", city: "Dodoma", address: "Area D, Nyerere Rd",
    plan: "Bure", status: "active", mrr: 0, ordersPerMonth: 120, joinedDate: "2025-12-18",
    staffCount: 3, menuItems: 18, trialEndsAt: null, logoInitials: "UE", logoBg: "bg-stone-600",
  },
  {
    id: "r012", name: "Chapati House", owner: "Zainab Mwinyi", ownerPhone: "+255 676 123 456",
    ownerEmail: "zainab@chapati.co.tz", city: "Dar es Salaam", address: "Temeke, Mbagala Rangi Tatu",
    plan: "Mwanzo", status: "suspended", mrr: 29000, ordersPerMonth: 0, joinedDate: "2025-06-30",
    staffCount: 5, menuItems: 25, trialEndsAt: null, logoInitials: "CH", logoBg: "bg-rose-600",
  },
  {
    id: "r013", name: "Kuku Choma Spot", owner: "Emmanuel Shirima", ownerPhone: "+255 753 234 567",
    ownerEmail: "emmanuel@kukuchoma.co.tz", city: "Dar es Salaam", address: "Sinza, Shekilango Rd",
    plan: "Bure", status: "active", mrr: 0, ordersPerMonth: 200, joinedDate: "2025-09-12",
    staffCount: 3, menuItems: 14, trialEndsAt: null, logoInitials: "KS", logoBg: "bg-orange-700",
  },
  {
    id: "r014", name: "Mbeya Highland Cafe", owner: "Martha Lweno", ownerPhone: "+255 769 345 678",
    ownerEmail: "martha@highland.co.tz", city: "Mbeya", address: "CBD, Karume Avenue",
    plan: "Bure", status: "trial", mrr: 0, ordersPerMonth: 15, joinedDate: "2026-04-05",
    staffCount: 1, menuItems: 8, trialEndsAt: "2026-05-05", logoInitials: "MH", logoBg: "bg-indigo-600",
  },
  {
    id: "r015", name: "Dodoma Central", owner: "Michael Bwire", ownerPhone: "+255 712 456 789",
    ownerEmail: "michael@dcentral.co.tz", city: "Dodoma", address: "CBD, Lindi Street",
    plan: "Mwanzo", status: "active", mrr: 29000, ordersPerMonth: 95, joinedDate: "2026-01-20",
    staffCount: 3, menuItems: 20, trialEndsAt: null, logoInitials: "DC", logoBg: "bg-cyan-700",
  },
];

/* ─── Helpers ─── */
const STATUS_CONFIG: Record<RestaurantStatus, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: "Hai", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  trial: { label: "Majaribio", bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  pending_kyc: { label: "KYC Inasubiri", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  suspended: { label: "Imesimamishwa", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const PLAN_CONFIG: Record<PlanType, { bg: string; text: string }> = {
  Bure: { bg: "bg-gray-100", text: "text-gray-700" },
  Mwanzo: { bg: "bg-blue-50", text: "text-blue-700" },
  Kitaalamu: { bg: "bg-purple-50", text: "text-purple-700" },
  Biashara: { bg: "bg-amber-50", text: "text-amber-700" },
};

const CITIES = ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Zanzibar"];
const PLANS: PlanType[] = ["Bure", "Mwanzo", "Kitaalamu", "Biashara"];

type StatusFilter = "all" | RestaurantStatus;
type SortOption = "newest" | "oldest" | "most_revenue" | "most_orders";

function formatTZS(amount: number): string {
  if (amount === 0) return "TZS 0";
  return `TZS ${amount.toLocaleString("en-US")}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("sw-TZ", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─── Main Component ─── */
export default function AdminRestaurantsPage() {
  /* Filters */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [planFilter, setPlanFilter] = useState<PlanType | "all">("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  /* Selection */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  /* Modals */
  const [viewRestaurant, setViewRestaurant] = useState<Restaurant | null>(null);
  const [detailTab, setDetailTab] = useState<string>("muhtasari");
  const [impersonateTarget, setImpersonateTarget] = useState<Restaurant | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<Restaurant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Restaurant | null>(null);
  const [bulkAction, setBulkAction] = useState<string | null>(null);

  /* Restaurants state (for suspend/reactivate/delete simulation) */
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS);

  /* Filtered & sorted */
  const filtered = useMemo(() => {
    let result = [...restaurants];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q)
      );
    }

    // Status
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Plan
    if (planFilter !== "all") {
      result = result.filter((r) => r.plan === planFilter);
    }

    // City
    if (cityFilter !== "all") {
      result = result.filter((r) => r.city === cityFilter);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime());
        break;
      case "most_revenue":
        result.sort((a, b) => b.mrr - a.mrr);
        break;
      case "most_orders":
        result.sort((a, b) => b.ordersPerMonth - a.ordersPerMonth);
        break;
    }

    return result;
  }, [restaurants, search, statusFilter, planFilter, cityFilter, sortBy]);

  /* Stats */
  const stats = useMemo(() => {
    const total = restaurants.length;
    const active = restaurants.filter((r) => r.status === "active").length;
    const trial = restaurants.filter((r) => r.status === "trial").length;
    const suspended = restaurants.filter((r) => r.status === "suspended").length;
    return { total, active, trial, suspended };
  }, [restaurants]);

  /* Selection handlers */
  const allSelected = filtered.length > 0 && filtered.every((r) => selectedIds.has(r.id));
  const someSelected = filtered.some((r) => selectedIds.has(r.id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((r) => r.id)));
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  /* Actions */
  function handleSuspend(restaurant: Restaurant) {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurant.id ? { ...r, status: "suspended" as RestaurantStatus, ordersPerMonth: 0 } : r))
    );
    setSuspendTarget(null);
  }

  function handleReactivate(restaurant: Restaurant) {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurant.id ? { ...r, status: "active" as RestaurantStatus } : r))
    );
  }

  function handleDelete(restaurant: Restaurant) {
    setRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
    setDeleteTarget(null);
    selectedIds.delete(restaurant.id);
    setSelectedIds(new Set(selectedIds));
  }

  function handleBulkSuspend() {
    setRestaurants((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id) ? { ...r, status: "suspended" as RestaurantStatus, ordersPerMonth: 0 } : r
      )
    );
    setSelectedIds(new Set());
    setBulkAction(null);
  }

  function handleExportCSV() {
    const headers = "Jina,Mmiliki,Jiji,Mpango,Hali,MRR,Oda/Mwezi,Tarehe\n";
    const rows = filtered
      .map(
        (r) =>
          `"${r.name}","${r.owner}","${r.city}","${r.plan}","${STATUS_CONFIG[r.status].label}","${formatTZS(r.mrr)}","${r.ordersPerMonth}","${r.joinedDate}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "migahawa_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    setBulkAction(null);
  }

  /* ─── Activity data for detail view ─── */
  const recentActivities = [
    { action: "Oda mpya #1247 imepokelewa", time: "Dakika 15 zilizopita", icon: "🧾" },
    { action: "Menyu imesasishwa - bidhaa 3 mpya", time: "Saa 2 zilizopita", icon: "🍽️" },
    { action: "Mfanyakazi mpya ameongezwa", time: "Jana, 14:30", icon: "👤" },
    { action: "Malipo ya mwezi yamefanikiwa", time: "Apr 15, 2026", icon: "💳" },
    { action: "Stoku chini - Mchele 3kg", time: "Apr 14, 2026", icon: "📦" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* ─── Header ─── */}
      <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2B2D42]">Usimamizi wa Migahawa</h1>
            <p className="text-sm text-gray-500">Simamia migahawa yote kwenye jukwaa la FoodOS</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Ongeza Mgahawa
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* ─── Stats Cards ─── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Total */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Jumla ya Migahawa</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-[#2B2D42]">{stats.total}</p>
            <p className="mt-1 text-xs text-gray-400">Total restaurants</p>
          </div>

          {/* Active */}
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Hai (Active)</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-green-700">{stats.active}</p>
            <p className="mt-1 text-xs text-green-600/70">Inafanya kazi sasa</p>
          </div>

          {/* Trial */}
          <div className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Majaribio (Trial)</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-yellow-700">{stats.trial}</p>
            <p className="mt-1 text-xs text-yellow-600/70">Kipindi cha majaribio</p>
          </div>

          {/* Suspended */}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Imesimamishwa</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-red-700">{stats.suspended}</p>
            <p className="mt-1 text-xs text-red-600/70">Suspended</p>
          </div>
        </div>

        {/* ─── Filter Bar ─── */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* Search + Sorts Row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tafuta mgahawa... (jina, mmiliki, jiji)"
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 transition focus:border-[#2D7A3A] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/20"
                />
              </div>

              {/* City */}
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 transition focus:border-[#2D7A3A] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/20"
              >
                <option value="all">Miji Yote</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 transition focus:border-[#2D7A3A] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/20"
              >
                <option value="newest">Mpya Zaidi</option>
                <option value="oldest">Zamani Zaidi</option>
                <option value="most_revenue">Mapato Zaidi</option>
                <option value="most_orders">Oda Zaidi</option>
              </select>
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap gap-2">
              {([
                { value: "all" as StatusFilter, label: "Wote", count: stats.total },
                { value: "active" as StatusFilter, label: "Hai", count: stats.active },
                { value: "trial" as StatusFilter, label: "Majaribio", count: stats.trial },
                { value: "pending_kyc" as StatusFilter, label: "KYC Inasubiri", count: restaurants.filter((r) => r.status === "pending_kyc").length },
                { value: "suspended" as StatusFilter, label: "Imesimamishwa", count: stats.suspended },
              ]).map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setStatusFilter(pill.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    statusFilter === pill.value
                      ? "bg-[#2D7A3A] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {pill.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      statusFilter === pill.value ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Plan Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Mpango:</span>
              <button
                onClick={() => setPlanFilter("all")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  planFilter === "all" ? "bg-[#2B2D42] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Wote
              </button>
              {PLANS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlanFilter(p)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    planFilter === p
                      ? `${PLAN_CONFIG[p].bg} ${PLAN_CONFIG[p].text} ring-1 ring-current`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Bulk Actions Bar ─── */}
        {someSelected && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-[#2D7A3A]/20 bg-[#2D7A3A]/5 px-4 py-3">
            <span className="text-sm font-semibold text-[#2D7A3A]">
              {selectedIds.size} imechaguliwa
            </span>
            <div className="h-4 w-px bg-[#2D7A3A]/20" />
            <button
              onClick={() => setBulkAction("suspend")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-200"
            >
              <span>⏸️</span> Simamisha Zilizochaguliwa
            </button>
            <button
              onClick={() => setBulkAction("announce")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-200"
            >
              <span>📢</span> Tuma Tangazo
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              <span>📥</span> Export CSV
            </button>
          </div>
        )}

        {/* ─── Table ─── */}
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50/80 backdrop-blur-sm">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-[#2D7A3A] accent-[#2D7A3A]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Mgahawa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Mmiliki
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Jiji
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Mpango
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Hali
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    MRR
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Oda/Mwezi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Tarehe
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Vitendo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-500">Hakuna mgahawa uliopatikana</p>
                        <p className="text-xs text-gray-400">Jaribu kubadilisha vigezo vya utafutaji</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, idx) => {
                    const sc = STATUS_CONFIG[r.status];
                    const pc = PLAN_CONFIG[r.plan];
                    return (
                      <tr
                        key={r.id}
                        className={`transition hover:bg-gray-50/80 ${idx % 2 === 1 ? "bg-gray-50/40" : ""} ${
                          selectedIds.has(r.id) ? "bg-[#2D7A3A]/5" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(r.id)}
                            onChange={() => toggleSelect(r.id)}
                            className="h-4 w-4 rounded border-gray-300 text-[#2D7A3A] accent-[#2D7A3A]"
                          />
                        </td>

                        {/* Restaurant Name + Logo */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${r.logoBg} text-xs font-bold text-white shadow-sm`}>
                              {r.logoInitials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#2B2D42]">{r.name}</p>
                              <p className="text-[11px] text-gray-400">{r.id.toUpperCase()}</p>
                            </div>
                          </div>
                        </td>

                        {/* Owner */}
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-800">{r.owner}</p>
                          <p className="text-[11px] text-gray-400">{r.ownerPhone}</p>
                        </td>

                        {/* City */}
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-700">{r.city}</p>
                        </td>

                        {/* Plan Badge */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${pc.bg} ${pc.text}`}>
                            {r.plan}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${sc.bg} ${sc.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                        </td>

                        {/* MRR */}
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-semibold text-gray-800">{formatTZS(r.mrr)}</p>
                          {r.mrr > 0 && <p className="text-[10px] text-gray-400">/mwezi</p>}
                        </td>

                        {/* Orders */}
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-semibold text-gray-800">{r.ordersPerMonth.toLocaleString()}</p>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-600">{formatDate(r.joinedDate)}</p>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            {/* View */}
                            <button
                              onClick={() => { setViewRestaurant(r); setDetailTab("muhtasari"); }}
                              title="Tazama"
                              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-[#2D7A3A]"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {/* Impersonate */}
                            <button
                              onClick={() => setImpersonateTarget(r)}
                              title="Ingia Kama"
                              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-orange-50 hover:text-[#E8712B]"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                              </svg>
                            </button>

                            {/* Suspend / Reactivate */}
                            {r.status === "suspended" ? (
                              <button
                                onClick={() => handleReactivate(r)}
                                title="Rejesha"
                                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-green-50 hover:text-green-600"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => setSuspendTarget(r)}
                                title="Simamisha"
                                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-yellow-50 hover:text-yellow-600"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteTarget(r)}
                              title="Futa"
                              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-4 py-3">
            <p className="text-xs text-gray-500">
              Inaonyesha {filtered.length} kati ya {restaurants.length} migahawa
            </p>
            <div className="flex items-center gap-1">
              <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
                Iliyotangulia
              </button>
              <button className="rounded-lg bg-[#2D7A3A] px-3 py-1.5 text-xs font-medium text-white">
                1
              </button>
              <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
                Inayofuata
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* ─── RESTAURANT DETAIL MODAL ─── */}
      {/* ═══════════════════════════════════════════════ */}
      {viewRestaurant && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm" onClick={() => setViewRestaurant(null)}>
          <div
            className="my-8 w-full max-w-4xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${viewRestaurant.logoBg} text-sm font-bold text-white shadow`}>
                  {viewRestaurant.logoInitials}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#2B2D42]">{viewRestaurant.name}</h2>
                  <p className="text-xs text-gray-500">{viewRestaurant.owner} &middot; {viewRestaurant.city}</p>
                </div>
              </div>
              <button onClick={() => setViewRestaurant(null)} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 px-6">
              {[
                { key: "muhtasari", label: "Muhtasari" },
                { key: "oda", label: "Oda" },
                { key: "menyu", label: "Menyu" },
                { key: "wafanyakazi", label: "Wafanyakazi" },
                { key: "malipo", label: "Malipo" },
                { key: "kumbukumbu", label: "Kumbukumbu" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDetailTab(tab.key)}
                  className={`relative px-4 py-3 text-sm font-medium transition ${
                    detailTab === tab.key
                      ? "text-[#2D7A3A]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {detailTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2D7A3A]" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* ── MUHTASARI (Overview) Tab ── */}
              {detailTab === "muhtasari" && (
                <div className="space-y-6">
                  {/* Restaurant Info Card */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                    <h3 className="text-sm font-bold text-[#2B2D42]">Maelezo ya Mgahawa</h3>
                    <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-[11px] font-medium text-gray-400">Jina</p>
                        <p className="text-sm font-semibold text-gray-800">{viewRestaurant.name}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-400">Mmiliki</p>
                        <p className="text-sm font-semibold text-gray-800">{viewRestaurant.owner}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-400">Simu</p>
                        <p className="text-sm font-semibold text-gray-800">{viewRestaurant.ownerPhone}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-400">Barua pepe</p>
                        <p className="text-sm font-semibold text-gray-800">{viewRestaurant.ownerEmail}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-400">Jiji</p>
                        <p className="text-sm font-semibold text-gray-800">{viewRestaurant.city}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-400">Anwani</p>
                        <p className="text-sm font-semibold text-gray-800">{viewRestaurant.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* KPI Row */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                      <p className="text-[10px] font-semibold uppercase text-green-600">Mapato</p>
                      <p className="mt-1 text-xl font-bold text-green-700">{formatTZS(viewRestaurant.mrr)}</p>
                      <p className="text-[10px] text-green-500">/mwezi</p>
                    </div>
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
                      <p className="text-[10px] font-semibold uppercase text-blue-600">Oda</p>
                      <p className="mt-1 text-xl font-bold text-blue-700">{viewRestaurant.ordersPerMonth}</p>
                      <p className="text-[10px] text-blue-500">/mwezi</p>
                    </div>
                    <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-center">
                      <p className="text-[10px] font-semibold uppercase text-purple-600">Wafanyakazi</p>
                      <p className="mt-1 text-xl font-bold text-purple-700">{viewRestaurant.staffCount}</p>
                      <p className="text-[10px] text-purple-500">watu</p>
                    </div>
                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-center">
                      <p className="text-[10px] font-semibold uppercase text-orange-600">Menyu</p>
                      <p className="mt-1 text-xl font-bold text-orange-700">{viewRestaurant.menuItems}</p>
                      <p className="text-[10px] text-orange-500">bidhaa</p>
                    </div>
                  </div>

                  {/* Subscription Card */}
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#2B2D42]">Usajili / Subscription</h3>
                        <div className="mt-2 flex items-center gap-3">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${PLAN_CONFIG[viewRestaurant.plan].bg} ${PLAN_CONFIG[viewRestaurant.plan].text}`}>
                            {viewRestaurant.plan}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${STATUS_CONFIG[viewRestaurant.status].bg} ${STATUS_CONFIG[viewRestaurant.status].text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[viewRestaurant.status].dot}`} />
                            {STATUS_CONFIG[viewRestaurant.status].label}
                          </span>
                        </div>
                        {viewRestaurant.trialEndsAt && (
                          <p className="mt-2 text-xs text-yellow-600">
                            Majaribio yanaisha: {formatDate(viewRestaurant.trialEndsAt)}
                          </p>
                        )}
                      </div>
                      <button className="rounded-lg bg-[#2D7A3A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1B5227]">
                        Pandisha Mpango
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-[#2B2D42]">Shughuli za Hivi Karibuni</h3>
                    <div className="mt-3 space-y-2">
                      {recentActivities.map((a, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50">
                          <span className="text-lg">{a.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{a.action}</p>
                            <p className="text-[10px] text-gray-400">{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ODA (Orders) Tab ── */}
              {detailTab === "oda" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#2B2D42]">Oda za Hivi Karibuni</h3>
                    <span className="text-xs text-gray-400">Oda {viewRestaurant.ordersPerMonth} mwezi huu</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: "#1247", items: "Pilau x2, Juice x1", total: "TZS 12,000", method: "M-Pesa", time: "12:45", status: "Imekamilika" },
                      { id: "#1246", items: "Chips Kuku x1, Soda x2", total: "TZS 9,500", method: "Cash", time: "12:30", status: "Imekamilika" },
                      { id: "#1245", items: "Wali Maharage x3", total: "TZS 7,500", method: "Tigo Pesa", time: "12:15", status: "Inaandaliwa" },
                      { id: "#1244", items: "Biriani x1, Chai x1", total: "TZS 8,000", method: "M-Pesa", time: "11:58", status: "Imekamilika" },
                      { id: "#1243", items: "Ugali Nyama x2", total: "TZS 14,000", method: "Cash", time: "11:40", status: "Imekamilika" },
                    ].map((o, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                            {o.id}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{o.items}</p>
                            <p className="text-[10px] text-gray-400">{o.method} &middot; {o.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800">{o.total}</p>
                          <p className={`text-[10px] font-medium ${o.status === "Imekamilika" ? "text-green-600" : "text-yellow-600"}`}>
                            {o.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── MENYU (Menu) Tab ── */}
              {detailTab === "menyu" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#2B2D42]">Bidhaa za Menyu</h3>
                    <span className="text-xs text-gray-400">{viewRestaurant.menuItems} bidhaa</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { name: "Pilau ya Nyama", price: "TZS 5,000", category: "Milo Makuu", active: true },
                      { name: "Chips Kuku", price: "TZS 6,500", category: "Milo Makuu", active: true },
                      { name: "Wali Maharage", price: "TZS 2,500", category: "Milo Makuu", active: true },
                      { name: "Juice ya Maembe", price: "TZS 1,500", category: "Vinywaji", active: true },
                      { name: "Biriani Special", price: "TZS 8,000", category: "Milo Makuu", active: false },
                      { name: "Chai ya Tangawizi", price: "TZS 800", category: "Vinywaji", active: true },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center justify-between rounded-lg border p-3 ${item.active ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{item.name}</p>
                          <p className="text-[10px] text-gray-400">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#2D7A3A]">{item.price}</p>
                          <p className={`text-[10px] font-medium ${item.active ? "text-green-600" : "text-gray-400"}`}>
                            {item.active ? "Inapatikana" : "Haipo"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── WAFANYAKAZI (Staff) Tab ── */}
              {detailTab === "wafanyakazi" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#2B2D42]">Wafanyakazi</h3>
                    <span className="text-xs text-gray-400">{viewRestaurant.staffCount} watu</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: viewRestaurant.owner, role: "Mmiliki", status: "Hai", initials: viewRestaurant.logoInitials },
                      { name: "Hassan Ali", role: "Karani (Cashier)", status: "Hai", initials: "HA" },
                      { name: "Mwajuma Said", role: "Mpishi (Chef)", status: "Hai", initials: "MS" },
                      { name: "James Mwita", role: "Stoku (Stock)", status: "Hai", initials: "JM" },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D7A3A]/10 text-xs font-bold text-[#2D7A3A]">
                            {s.initials}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{s.name}</p>
                            <p className="text-[10px] text-gray-400">{s.role}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── MALIPO (Billing) Tab ── */}
              {detailTab === "malipo" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#2B2D42]">Historia ya Malipo</h3>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] font-medium text-gray-400">Mpango wa Sasa</p>
                        <p className="text-sm font-bold text-[#2B2D42]">{viewRestaurant.plan}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-gray-400">MRR</p>
                        <p className="text-sm font-bold text-[#2D7A3A]">{formatTZS(viewRestaurant.mrr)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-gray-400">Hali ya Malipo</p>
                        <p className="text-sm font-bold text-green-600">Sawa</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { date: "Apr 15, 2026", amount: formatTZS(viewRestaurant.mrr), status: "Imefanikiwa", method: "M-Pesa" },
                      { date: "Mar 15, 2026", amount: formatTZS(viewRestaurant.mrr), status: "Imefanikiwa", method: "M-Pesa" },
                      { date: "Feb 15, 2026", amount: formatTZS(viewRestaurant.mrr), status: "Imefanikiwa", method: "Tigo Pesa" },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{p.date}</p>
                          <p className="text-[10px] text-gray-400">{p.method}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800">{p.amount}</p>
                          <p className="text-[10px] font-medium text-green-600">{p.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── KUMBUKUMBU (Audit) Tab ── */}
              {detailTab === "kumbukumbu" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#2B2D42]">Kumbukumbu za Ukaguzi</h3>
                    <span className="text-xs text-gray-400">Audit Log</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { action: "Admin alitazama akaunti", user: "Super Admin", time: "Leo, 14:30", type: "view" },
                      { action: "Mpango ulibadilishwa: Bure -> Mwanzo", user: "System", time: "Apr 10, 2026", type: "upgrade" },
                      { action: "KYC ilithitibiwa", user: "Super Admin", time: "Mar 20, 2026", type: "kyc" },
                      { action: "Akaunti ilitengenezwa", user: viewRestaurant.owner, time: formatDate(viewRestaurant.joinedDate), type: "create" },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${
                          log.type === "view" ? "bg-blue-50 text-blue-600" :
                          log.type === "upgrade" ? "bg-green-50 text-green-600" :
                          log.type === "kyc" ? "bg-purple-50 text-purple-600" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {log.type === "view" ? "👁" : log.type === "upgrade" ? "⬆" : log.type === "kyc" ? "✓" : "➕"}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{log.action}</p>
                          <p className="text-[10px] text-gray-400">{log.user} &middot; {log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* ─── IMPERSONATE CONFIRMATION MODAL ─── */}
      {/* ═══════════════════════════════════════════════ */}
      {impersonateTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setImpersonateTarget(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Warning Header */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8712B]/10">
                <svg className="h-8 w-8 text-[#E8712B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#2B2D42]">Onyo: Kuingia Kama Mgahawa</h3>
              <p className="mt-1 text-xs font-medium text-[#E8712B]">Warning: Restaurant Impersonation</p>
            </div>

            {/* Warning Message */}
            <div className="mt-4 rounded-xl border border-[#E8712B]/20 bg-[#E8712B]/5 p-4">
              <p className="text-sm text-gray-700">
                Utaona jukwaa kama <span className="font-bold text-[#2B2D42]">{impersonateTarget.name}</span>.
                Vitendo vyako vyote vitarekodiwa kwenye kumbukumbu za ukaguzi.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                You will view the platform as <span className="font-semibold">{impersonateTarget.name}</span>.
                All your actions will be logged.
              </p>
            </div>

            {/* Restaurant Info */}
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${impersonateTarget.logoBg} text-xs font-bold text-white`}>
                {impersonateTarget.logoInitials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2B2D42]">{impersonateTarget.name}</p>
                <p className="text-xs text-gray-400">{impersonateTarget.owner} &middot; {impersonateTarget.city}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setImpersonateTarget(null)}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Ghairi
              </button>
              <button
                onClick={() => {
                  setImpersonateTarget(null);
                  /* In production: redirect to impersonated session */
                }}
                className="flex-1 rounded-lg bg-[#E8712B] py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4651f]"
              >
                Endelea Kuingia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* ─── SUSPEND CONFIRMATION MODAL ─── */}
      {/* ═══════════════════════════════════════════════ */}
      {suspendTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setSuspendTarget(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#2B2D42]">Simamisha Mgahawa?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Una uhakika unataka kusimamisha <span className="font-bold">{suspendTarget.name}</span>?
                Mgahawa hautaweza kupokea oda mpya.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSuspendTarget(null)}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Ghairi
              </button>
              <button
                onClick={() => handleSuspend(suspendTarget)}
                className="flex-1 rounded-lg bg-yellow-500 py-2.5 text-sm font-semibold text-white transition hover:bg-yellow-600"
              >
                Simamisha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      {/* ═══════════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-red-700">Futa Mgahawa?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Hatua hii haiwezi kutenduliwa. Data yote ya <span className="font-bold">{deleteTarget.name}</span> itafutwa kabisa.
              </p>
              <p className="mt-1 text-xs text-gray-400">
                This action cannot be undone. All data will be permanently deleted.
              </p>
            </div>

            {/* Restaurant being deleted */}
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${deleteTarget.logoBg} text-xs font-bold text-white`}>
                {deleteTarget.logoInitials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2B2D42]">{deleteTarget.name}</p>
                <p className="text-xs text-gray-400">{deleteTarget.owner} &middot; {deleteTarget.city}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Ghairi
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Futa Kabisa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* ─── BULK SUSPEND CONFIRMATION MODAL ─── */}
      {/* ═══════════════════════════════════════════════ */}
      {bulkAction === "suspend" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setBulkAction(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#2B2D42]">Simamisha Migahawa {selectedIds.size}?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Migahawa yote iliyochaguliwa itasimamishwa na haitaweza kupokea oda.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setBulkAction(null)}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Ghairi
              </button>
              <button
                onClick={handleBulkSuspend}
                className="flex-1 rounded-lg bg-yellow-500 py-2.5 text-sm font-semibold text-white transition hover:bg-yellow-600"
              >
                Simamisha Yote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* ─── BULK ANNOUNCE MODAL ─── */}
      {/* ═══════════════════════════════════════════════ */}
      {bulkAction === "announce" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setBulkAction(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2B2D42]">Tuma Tangazo</h3>
              <button onClick={() => setBulkAction(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Tuma tangazo kwa migahawa {selectedIds.size} iliyochaguliwa
            </p>
            <div className="mt-4">
              <label className="text-xs font-semibold text-gray-600">Kichwa cha Tangazo</label>
              <input
                type="text"
                placeholder="Andika kichwa..."
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#2D7A3A] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/20"
              />
            </div>
            <div className="mt-3">
              <label className="text-xs font-semibold text-gray-600">Ujumbe</label>
              <textarea
                rows={4}
                placeholder="Andika ujumbe wa tangazo..."
                className="mt-1 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#2D7A3A] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/20"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setBulkAction(null)}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Ghairi
              </button>
              <button
                onClick={() => {
                  setBulkAction(null);
                  setSelectedIds(new Set());
                }}
                className="flex-1 rounded-lg bg-[#2D7A3A] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B5227]"
              >
                Tuma Tangazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
