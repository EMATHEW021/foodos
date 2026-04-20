"use client";

import { useState } from "react";

// ───── Types ─────
interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: "Mmiliki" | "Msimamizi" | "Mkusanyaji" | "Super Admin";
  roleEn: "Owner" | "Manager" | "Cashier" | "Super Admin";
  restaurant: string;
  status: "active" | "inactive";
  lastActive: string;
  avatar: string;
}

// ───── Sample Data ─────
const initialUsers: User[] = [
  {
    id: 1,
    name: "Erick Mathew",
    phone: "+255 712 345 678",
    email: "erick@foodos.co.tz",
    role: "Super Admin",
    roleEn: "Super Admin",
    restaurant: "FoodOS HQ",
    status: "active",
    lastActive: "Sasa hivi",
    avatar: "EM",
  },
  {
    id: 2,
    name: "Amina Hassan",
    phone: "+255 754 123 456",
    email: "amina@mamasalma.co.tz",
    role: "Mmiliki",
    roleEn: "Owner",
    restaurant: "Mama Salma Kitchen",
    status: "active",
    lastActive: "Dakika 5 zilizopita",
    avatar: "AH",
  },
  {
    id: 3,
    name: "Joseph Mwanga",
    phone: "+255 678 234 567",
    email: "joseph@chipskuku.co.tz",
    role: "Msimamizi",
    roleEn: "Manager",
    restaurant: "Chips Kuku Corner",
    status: "active",
    lastActive: "Dakika 12 zilizopita",
    avatar: "JM",
  },
  {
    id: 4,
    name: "Fatma Bakari",
    phone: "+255 712 876 543",
    email: "fatma.b@gmail.com",
    role: "Mkusanyaji",
    roleEn: "Cashier",
    restaurant: "Mama Salma Kitchen",
    status: "active",
    lastActive: "Saa 1 iliyopita",
    avatar: "FB",
  },
  {
    id: 5,
    name: "David Kimaro",
    phone: "+255 655 432 109",
    email: "david.k@biryani.co.tz",
    role: "Mmiliki",
    roleEn: "Owner",
    restaurant: "Biryani House",
    status: "active",
    lastActive: "Saa 2 zilizopita",
    avatar: "DK",
  },
  {
    id: 6,
    name: "Grace Mushi",
    phone: "+255 756 789 012",
    email: "grace@ugalispot.co.tz",
    role: "Msimamizi",
    roleEn: "Manager",
    restaurant: "Ugali Spot",
    status: "active",
    lastActive: "Dakika 30 zilizopita",
    avatar: "GM",
  },
  {
    id: 7,
    name: "Hassan Omari",
    phone: "+255 784 321 654",
    email: "hassan.o@chipskuku.co.tz",
    role: "Mkusanyaji",
    roleEn: "Cashier",
    restaurant: "Chips Kuku Corner",
    status: "active",
    lastActive: "Dakika 8 zilizopita",
    avatar: "HO",
  },
  {
    id: 8,
    name: "Rehema Juma",
    phone: "+255 713 456 789",
    email: "rehema@pilaupalace.co.tz",
    role: "Mmiliki",
    roleEn: "Owner",
    restaurant: "Pilau Palace",
    status: "active",
    lastActive: "Saa 3 zilizopita",
    avatar: "RJ",
  },
  {
    id: 9,
    name: "Baraka Mwakasege",
    phone: "+255 657 890 123",
    email: "",
    role: "Mkusanyaji",
    roleEn: "Cashier",
    restaurant: "Biryani House",
    status: "inactive",
    lastActive: "Siku 3 zilizopita",
    avatar: "BM",
  },
  {
    id: 10,
    name: "Zainab Kiputa",
    phone: "+255 786 543 210",
    email: "zainab@ugalispot.co.tz",
    role: "Mkusanyaji",
    roleEn: "Cashier",
    restaurant: "Ugali Spot",
    status: "active",
    lastActive: "Dakika 20 zilizopita",
    avatar: "ZK",
  },
  {
    id: 11,
    name: "Peter Mwalimu",
    phone: "+255 714 678 901",
    email: "peter.m@pilaupalace.co.tz",
    role: "Msimamizi",
    roleEn: "Manager",
    restaurant: "Pilau Palace",
    status: "active",
    lastActive: "Saa 1 iliyopita",
    avatar: "PM",
  },
  {
    id: 12,
    name: "Neema Shirima",
    phone: "+255 658 012 345",
    email: "neema@mamasalma.co.tz",
    role: "Mkusanyaji",
    roleEn: "Cashier",
    restaurant: "Mama Salma Kitchen",
    status: "inactive",
    lastActive: "Siku 7 zilizopita",
    avatar: "NS",
  },
];

// ───── Helpers ─────
function roleBadgeStyle(role: string): string {
  switch (role) {
    case "Mmiliki":
      return "bg-[#E8712B]/10 text-[#E8712B]";
    case "Msimamizi":
      return "bg-[#2D7A3A]/10 text-[#2D7A3A]";
    case "Mkusanyaji":
      return "bg-[#E9C46A]/20 text-[#2B2D42]";
    case "Super Admin":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function avatarBg(role: string): string {
  switch (role) {
    case "Mmiliki":
      return "bg-[#E8712B]";
    case "Msimamizi":
      return "bg-[#2D7A3A]";
    case "Mkusanyaji":
      return "bg-[#E9C46A] text-[#2B2D42]";
    case "Super Admin":
      return "bg-purple-600";
    default:
      return "bg-gray-400";
  }
}

const restaurants = [
  "Zote",
  "Mama Salma Kitchen",
  "Chips Kuku Corner",
  "Biryani House",
  "Ugali Spot",
  "Pilau Palace",
  "FoodOS HQ",
];

// ───── Main Component ─────
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Wote");
  const [statusFilter, setStatusFilter] = useState("Wote");
  const [restaurantFilter, setRestaurantFilter] = useState("Zote");

  // Action modals
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [resetPinUser, setResetPinUser] = useState<User | null>(null);
  const [suspendingUser, setSuspendingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);
  const [pinResetSuccess, setPinResetSuccess] = useState(false);

  // Stats
  const totalUsers = 186;
  const activeUsers = 172;
  const owners = 47;
  const managers = 52;
  const cashiers = 87;

  // Filtering
  const roleMap: Record<string, string | null> = {
    Wote: null,
    Mmiliki: "Mmiliki",
    Msimamizi: "Msimamizi",
    Mkusanyaji: "Mkusanyaji",
    "Super Admin": "Super Admin",
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleMap[roleFilter] === null || u.role === roleMap[roleFilter];
    const matchesStatus =
      statusFilter === "Wote" ||
      (statusFilter === "Hai" && u.status === "active") ||
      (statusFilter === "Hawapo" && u.status === "inactive");
    const matchesRestaurant =
      restaurantFilter === "Zote" || u.restaurant === restaurantFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.email.toLowerCase().includes(q);
    return matchesRole && matchesStatus && matchesRestaurant && matchesSearch;
  });

  function handleSuspend() {
    if (!suspendingUser) return;
    setUsers(
      users.map((u) =>
        u.id === suspendingUser.id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
    setSuspendingUser(null);
  }

  function handleDelete() {
    if (!deletingUser) return;
    setUsers(users.filter((u) => u.id !== deletingUser.id));
    setDeletingUser(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Watumiaji</h1>
        <p className="text-xs text-muted-foreground">
          Users Management — Simamia watumiaji wote wa jukwaa
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Jumla ya Watumiaji</p>
          <p className="text-[10px] text-muted-foreground">Total Users</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{totalUsers}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Walio Hai</p>
          <p className="text-[10px] text-muted-foreground">Active</p>
          <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">{activeUsers}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Wamiliki</p>
          <p className="text-[10px] text-muted-foreground">Owners</p>
          <p className="mt-2 text-2xl font-bold text-[#E8712B]">{owners}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Wasimamizi</p>
          <p className="text-[10px] text-muted-foreground">Managers</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">{managers}</p>
        </div>
        <div className="col-span-2 lg:col-span-1 rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Wakusanyaji</p>
          <p className="text-[10px] text-muted-foreground">Cashiers</p>
          <p className="mt-2 text-2xl font-bold text-[#E9C46A]">{cashiers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
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
            placeholder="Tafuta jina, simu, au barua pepe..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground lg:w-80"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
          >
            <option value="Wote">Jukumu: Wote</option>
            <option value="Mmiliki">Mmiliki (Owner)</option>
            <option value="Msimamizi">Msimamizi (Manager)</option>
            <option value="Mkusanyaji">Mkusanyaji (Cashier)</option>
            <option value="Super Admin">Super Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
          >
            <option value="Wote">Hali: Wote</option>
            <option value="Hai">Hai (Active)</option>
            <option value="Hawapo">Hawapo (Inactive)</option>
          </select>

          {/* Restaurant Filter */}
          <select
            value={restaurantFilter}
            onChange={(e) => setRestaurantFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
          >
            {restaurants.map((r) => (
              <option key={r} value={r}>
                {r === "Zote" ? "Mgahawa: Zote" : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden border-b border-border bg-muted/30 px-5 py-3 lg:grid lg:grid-cols-12 lg:gap-4">
          <p className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Jina / Name
          </p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Simu / Phone
          </p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Jukumu / Role
          </p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mgahawa / Restaurant
          </p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Hali / Status
          </p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mwisho Kuonekana
          </p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">
            Vitendo
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              Hakuna mtumiaji aliyepatikana
            </p>
            <p className="text-xs text-muted-foreground">
              No users found matching your filters
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((u) => (
              <div
                key={u.id}
                className="relative flex flex-col gap-3 px-5 py-4 transition hover:bg-muted/20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-4"
              >
                {/* Avatar + Name + Email */}
                <div className="col-span-3 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarBg(u.role)}`}
                  >
                    {u.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {u.name}
                    </p>
                    {u.email && (
                      <p className="truncate text-[10px] text-muted-foreground">
                        {u.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground lg:hidden">Simu:</p>
                  <p className="text-sm text-foreground">{u.phone}</p>
                </div>

                {/* Role Badge */}
                <div className="col-span-1">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${roleBadgeStyle(u.role)}`}
                  >
                    {u.role}
                  </span>
                </div>

                {/* Restaurant */}
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground lg:hidden">Mgahawa:</p>
                  <p className="truncate text-sm text-foreground">{u.restaurant}</p>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      u.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        u.status === "active" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    {u.status === "active" ? "Hai" : "Simama"}
                  </span>
                </div>

                {/* Last Active */}
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground lg:hidden">
                    Mwisho Kuonekana:
                  </p>
                  <p className="text-xs text-muted-foreground">{u.lastActive}</p>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end">
                  <button
                    onClick={() =>
                      setActionMenuId(actionMenuId === u.id ? null : u.id)
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
                  {actionMenuId === u.id && (
                    <div className="absolute right-4 top-12 z-20 w-48 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                      <button
                        onClick={() => {
                          setViewingUser(u);
                          setActionMenuId(null);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-foreground transition hover:bg-muted"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="7" cy="7" r="5" />
                          <path d="M7 5v4M7 11h.01" />
                        </svg>
                        Tazama Profaili
                      </button>
                      <button
                        onClick={() => {
                          setResetPinUser(u);
                          setPinResetSuccess(false);
                          setActionMenuId(null);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-foreground transition hover:bg-muted"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="7" width="8" height="6" rx="1" />
                          <path d="M5 7V5a2 2 0 0 1 4 0v2" />
                        </svg>
                        Weka Upya PIN
                      </button>
                      <button
                        onClick={() => {
                          setSuspendingUser(u);
                          setActionMenuId(null);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#E8712B] transition hover:bg-orange-50"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="7" cy="7" r="6" />
                          <path d="M4 7h6" />
                        </svg>
                        {u.status === "active" ? "Simamisha" : "Rudisha"}
                      </button>
                      {u.role !== "Super Admin" && (
                        <button
                          onClick={() => {
                            setDeletingUser(u);
                            setActionMenuId(null);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-600 transition hover:bg-red-50"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h8M5 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m1 0v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6h6z" />
                          </svg>
                          Futa Mtumiaji
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table Footer */}
        <div className="border-t border-border bg-muted/20 px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Inaonyesha {filtered.length} kati ya {users.length} watumiaji
            <span className="ml-1 text-muted-foreground/60">(Showing {filtered.length} of {users.length} users)</span>
          </p>
          <div className="flex gap-1">
            <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
              Nyuma
            </button>
            <button className="rounded-lg bg-[#2D7A3A] px-3 py-1.5 text-xs font-medium text-white">
              1
            </button>
            <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
              2
            </button>
            <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
              Mbele
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          VIEW PROFILE MODAL
         ══════════════════════════════════════════ */}
      {viewingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setViewingUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white ${avatarBg(viewingUser.role)}`}
              >
                {viewingUser.avatar}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {viewingUser.name}
                </h3>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${roleBadgeStyle(viewingUser.role)}`}
                >
                  {viewingUser.role} ({viewingUser.roleEn})
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-xs text-muted-foreground">Simu / Phone</span>
                <span className="text-sm font-medium text-foreground">
                  {viewingUser.phone}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-xs text-muted-foreground">
                  Barua Pepe / Email
                </span>
                <span className="text-sm font-medium text-foreground">
                  {viewingUser.email || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-xs text-muted-foreground">
                  Mgahawa / Restaurant
                </span>
                <span className="text-sm font-medium text-foreground">
                  {viewingUser.restaurant}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-xs text-muted-foreground">Hali / Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                    viewingUser.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      viewingUser.status === "active"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                  {viewingUser.status === "active" ? "Hai" : "Simama"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-xs text-muted-foreground">
                  Mwisho Kuonekana / Last Active
                </span>
                <span className="text-sm text-foreground">
                  {viewingUser.lastActive}
                </span>
              </div>
            </div>

            <button
              onClick={() => setViewingUser(null)}
              className="mt-6 w-full rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Funga
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          RESET PIN MODAL
         ══════════════════════════════════════════ */}
      {resetPinUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setResetPinUser(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8712B]/10">
              <svg width="24" height="24" fill="none" stroke="#E8712B" strokeWidth="2">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-foreground">
              Weka Upya PIN
            </h3>
            <p className="text-center text-xs text-muted-foreground">
              Reset PIN — {resetPinUser.name}
            </p>

            {pinResetSuccess ? (
              <div className="mt-5 rounded-xl bg-green-50 p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <svg width="20" height="20" fill="none" stroke="#16a34a" strokeWidth="2">
                    <path d="M4 10l4 4 8-8" />
                  </svg>
                </div>
                <p className="mt-2 text-sm font-medium text-green-700">
                  PIN imewekwa upya!
                </p>
                <p className="text-xs text-green-600">
                  PIN mpya: 0000 — Mtumiaji atabadilisha wakati wa kuingia
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-foreground">
                  PIN ya <strong>{resetPinUser.name}</strong> itawekwa upya kuwa{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-bold">
                    0000
                  </code>
                </p>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Mtumiaji atalazimika kubadilisha PIN yake wakati wa kuingia
                  mara ya kwanza.
                </p>
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setResetPinUser(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                {pinResetSuccess ? "Funga" : "Ghairi"}
              </button>
              {!pinResetSuccess && (
                <button
                  onClick={() => setPinResetSuccess(true)}
                  className="flex-1 rounded-xl bg-[#E8712B] py-2.5 text-sm font-medium text-white transition hover:bg-[#d4651f]"
                >
                  Weka Upya
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          SUSPEND MODAL
         ══════════════════════════════════════════ */}
      {suspendingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSuspendingUser(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8712B]/10">
              <svg width="24" height="24" fill="none" stroke="#E8712B" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
              </svg>
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-foreground">
              {suspendingUser.status === "active"
                ? "Simamisha Mtumiaji?"
                : "Rudisha Mtumiaji?"}
            </h3>
            <p className="text-center text-xs text-muted-foreground">
              {suspendingUser.status === "active" ? "Suspend User?" : "Reactivate User?"}
            </p>

            <div className="mt-4 rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm font-semibold text-foreground">
                {suspendingUser.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {suspendingUser.role} - {suspendingUser.restaurant}
              </p>
            </div>

            {suspendingUser.status === "active" && (
              <div className="mt-3 rounded-lg border border-[#E8712B]/20 bg-[#E8712B]/5 p-3">
                <p className="text-[11px] text-[#E8712B]">
                  Mtumiaji huyu hataweza kuingia kwenye mfumo hadi utakapomurudisha.
                </p>
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setSuspendingUser(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Ghairi
              </button>
              <button
                onClick={handleSuspend}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition ${
                  suspendingUser.status === "active"
                    ? "bg-[#E8712B] hover:bg-[#d4651f]"
                    : "bg-[#2D7A3A] hover:bg-[#1B5227]"
                }`}
              >
                {suspendingUser.status === "active" ? "Simamisha" : "Rudisha"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          DELETE MODAL
         ══════════════════════════════════════════ */}
      {deletingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDeletingUser(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <svg width="28" height="28" fill="none" stroke="#DC2626" strokeWidth="2">
                <path d="M14 9v6M14 19h.01M5.07 22h17.86a2 2 0 0 0 1.73-3L15.73 4a2 2 0 0 0-3.46 0L3.34 19a2 2 0 0 0 1.73 3z" />
              </svg>
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-foreground">
              Futa Mtumiaji?
            </h3>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Delete User? — Hatua hii haiwezi kutendwa upya
            </p>

            <div className="mt-4 rounded-lg bg-red-50 p-3 text-center">
              <p className="text-sm font-semibold text-red-700">
                {deletingUser.name}
              </p>
              <p className="text-xs text-red-600">
                {deletingUser.role} - {deletingUser.restaurant}
              </p>
            </div>

            <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground">
                Onyo — Hatua hii itasababisha:
              </p>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-500">&#x2022;</span>
                  Taarifa zote za mtumiaji huyu zitafutwa kabisa
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-500">&#x2022;</span>
                  Akaunti itafungwa na hawezi kuingia tena
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-500">&#x2022;</span>
                  Hatua hii haiwezi kutendwa upya (irreversible)
                </li>
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingUser(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Ghairi
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Ndio, Futa
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
