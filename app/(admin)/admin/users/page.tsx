"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: string;
  isActive: boolean;
  tenantId: string;
  tenantName: string;
  createdAt: string;
}

interface TenantOption {
  id: string;
  name: string;
}

interface Stats {
  total: number;
  active: number;
  owners: number;
  managers: number;
  cashiers: number;
  superAdmins: number;
}

function roleLabelSw(role: string) {
  switch (role) {
    case "owner": return "Mmiliki";
    case "manager": return "Msimamizi";
    case "cashier": return "Mkusanyaji";
    case "super_admin": return "Super Admin";
    default: return role;
  }
}

function roleBadgeStyle(role: string) {
  switch (role) {
    case "owner": return "bg-[#E8712B]/10 text-[#E8712B]";
    case "manager": return "bg-[#2D7A3A]/10 text-[#2D7A3A]";
    case "cashier": return "bg-[#E9C46A]/20 text-[#2B2D42]";
    case "super_admin": return "bg-purple-100 text-purple-700";
    default: return "bg-gray-100 text-gray-600";
  }
}

function avatarBg(role: string) {
  switch (role) {
    case "owner": return "bg-[#E8712B]";
    case "manager": return "bg-[#2D7A3A]";
    case "cashier": return "bg-[#E9C46A] text-[#2B2D42]";
    case "super_admin": return "bg-purple-600";
    default: return "bg-gray-400";
  }
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("sw-TZ", { day: "2-digit", month: "short", year: "numeric" });
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, owners: 0, managers: 0, cashiers: 0, superAdmins: 0 });
  const [tenants, setTenants] = useState<TenantOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tenantFilter, setTenantFilter] = useState("all");

  const [suspendingUser, setSuspendingUser] = useState<User | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function fetchUsers() {
    try {
      const params = new URLSearchParams();
      if (roleFilter !== "all") params.set("role", roleFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (tenantFilter !== "all") params.set("tenantId", tenantFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setStats(data.stats || stats);
      setTenants(data.tenants || []);
    } catch {
      // Silent fail
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, statusFilter, tenantFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function toggleUserActive(user: User) {
    setToggling(user.id);
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch {
      // Silent
    }
    setToggling(null);
    setSuspendingUser(null);
  }

  function clearFilters() {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setTenantFilter("all");
  }

  const hasFilters = search || roleFilter !== "all" || statusFilter !== "all" || tenantFilter !== "all";

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
          <p className="mt-2 text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Walio Hai</p>
          <p className="text-[10px] text-muted-foreground">Active</p>
          <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">{stats.active}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Wamiliki</p>
          <p className="text-[10px] text-muted-foreground">Owners</p>
          <p className="mt-2 text-2xl font-bold text-[#E8712B]">{stats.owners}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Wasimamizi</p>
          <p className="text-[10px] text-muted-foreground">Managers</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">{stats.managers}</p>
        </div>
        <div className="col-span-2 lg:col-span-1 rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Wakusanyaji</p>
          <p className="text-[10px] text-muted-foreground">Cashiers</p>
          <p className="mt-2 text-2xl font-bold text-[#E9C46A]">{stats.cashiers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
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
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
          >
            <option value="all">Jukumu: Wote</option>
            <option value="owner">Mmiliki (Owner)</option>
            <option value="manager">Msimamizi (Manager)</option>
            <option value="cashier">Mkusanyaji (Cashier)</option>
            <option value="super_admin">Super Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
          >
            <option value="all">Hali: Wote</option>
            <option value="active">Hai (Active)</option>
            <option value="inactive">Hawapo (Inactive)</option>
          </select>

          <select
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
          >
            <option value="all">Mgahawa: Zote</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
        <div className="hidden border-b border-border bg-muted/30 px-5 py-3 lg:grid lg:grid-cols-12 lg:gap-4">
          <p className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Jina / Name</p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Simu / Phone</p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Jukumu</p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mgahawa</p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Hali</p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tarehe</p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Vitendo</p>
        </div>

        {users.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">Hakuna mtumiaji aliyepatikana</p>
            <p className="text-xs text-muted-foreground mb-4">No users found matching your filters</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="rounded-lg bg-[#2D7A3A] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1B5227]"
              >
                Ondoa Vichujio
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {users.map((u) => (
              <div
                key={u.id}
                className="relative flex flex-col gap-3 px-5 py-4 transition hover:bg-muted/20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-4"
              >
                <div className="col-span-3 flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarBg(u.role)}`}>
                    {getInitials(u.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{u.name}</p>
                    {u.email && <p className="truncate text-[10px] text-muted-foreground">{u.email}</p>}
                  </div>
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground lg:hidden">Simu:</p>
                  <p className="text-sm text-foreground">{u.phone || "—"}</p>
                </div>

                <div className="col-span-1">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${roleBadgeStyle(u.role)}`}>
                    {roleLabelSw(u.role)}
                  </span>
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground lg:hidden">Mgahawa:</p>
                  <p className="truncate text-sm text-foreground">{u.tenantName}</p>
                </div>

                <div className="col-span-1">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                    u.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                    {u.isActive ? "Hai" : "Simama"}
                  </span>
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</p>
                </div>

                <div className="col-span-1 flex items-center justify-end">
                  <button
                    onClick={() => setActionMenuId(actionMenuId === u.id ? null : u.id)}
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <circle cx="8" cy="3" r="1.5" />
                      <circle cx="8" cy="8" r="1.5" />
                      <circle cx="8" cy="13" r="1.5" />
                    </svg>
                  </button>

                  {actionMenuId === u.id && (
                    <div className="absolute right-4 top-12 z-20 w-48 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                      <Link
                        href={`/admin/users/${u.id}`}
                        onClick={() => setActionMenuId(null)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-foreground transition hover:bg-muted"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="7" cy="7" r="5" />
                          <path d="M7 5v4M7 11h.01" />
                        </svg>
                        Tazama Profaili
                      </Link>
                      {u.role !== "super_admin" && (
                        <button
                          onClick={() => { setSuspendingUser(u); setActionMenuId(null); }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#E8712B] transition hover:bg-orange-50"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="7" cy="7" r="6" />
                            <path d="M4 7h6" />
                          </svg>
                          {u.isActive ? "Simamisha" : "Rudisha"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-border bg-muted/20 px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Inaonyesha {users.length} watumiaji
            <span className="ml-1 text-muted-foreground/60">(Showing {users.length} users)</span>
          </p>
        </div>
      </div>

      {/* SUSPEND/REACTIVATE MODAL */}
      {suspendingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSuspendingUser(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8712B]/10">
              <svg width="24" height="24" fill="none" stroke="#E8712B" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
              </svg>
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-foreground">
              {suspendingUser.isActive ? "Simamisha Mtumiaji?" : "Rudisha Mtumiaji?"}
            </h3>

            <div className="mt-4 rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm font-semibold text-foreground">{suspendingUser.name}</p>
              <p className="text-xs text-muted-foreground">{roleLabelSw(suspendingUser.role)} - {suspendingUser.tenantName}</p>
            </div>

            {suspendingUser.isActive && (
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
                onClick={() => toggleUserActive(suspendingUser)}
                disabled={toggling === suspendingUser.id}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition disabled:opacity-50 ${
                  suspendingUser.isActive ? "bg-[#E8712B] hover:bg-[#d4651f]" : "bg-[#2D7A3A] hover:bg-[#1B5227]"
                }`}
              >
                {toggling === suspendingUser.id ? "Inaendelea..." : suspendingUser.isActive ? "Simamisha" : "Rudisha"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click-away handler */}
      {actionMenuId !== null && (
        <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />
      )}
    </div>
  );
}
