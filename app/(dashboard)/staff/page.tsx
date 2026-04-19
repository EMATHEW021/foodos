"use client";

import { useState } from "react";

// ───── Types ─────
interface StaffMember {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: "Mmiliki" | "Meneja" | "Karani";
  roleEn: "Owner" | "Manager" | "Cashier";
  pin: string;
  status: "active" | "inactive";
  dateJoined: string;
  activity: {
    ordersToday: number;
    revenueToday: number;
    lastActive: string;
  };
}

// ───── Sample Data ─────
const initialStaff: StaffMember[] = [
  {
    id: 1,
    name: "Erick Mathew",
    phone: "+255 712 345 678",
    email: "erick@foodos.co.tz",
    role: "Mmiliki",
    roleEn: "Owner",
    pin: "0000",
    status: "active",
    dateJoined: "2025-01-15",
    activity: { ordersToday: 0, revenueToday: 0, lastActive: "Sasa hivi" },
  },
  {
    id: 2,
    name: "Amina Hassan",
    phone: "+255 754 123 456",
    email: "amina@foodos.co.tz",
    role: "Meneja",
    roleEn: "Manager",
    pin: "1234",
    status: "active",
    dateJoined: "2025-03-01",
    activity: { ordersToday: 18, revenueToday: 245000, lastActive: "Dakika 5 zilizopita" },
  },
  {
    id: 3,
    name: "Joseph Mwanga",
    phone: "+255 678 234 567",
    email: "",
    role: "Karani",
    roleEn: "Cashier",
    pin: "5678",
    status: "active",
    dateJoined: "2025-06-10",
    activity: { ordersToday: 34, revenueToday: 420000, lastActive: "Dakika 2 zilizopita" },
  },
  {
    id: 4,
    name: "Fatma Bakari",
    phone: "+255 712 876 543",
    email: "fatma.b@gmail.com",
    role: "Karani",
    roleEn: "Cashier",
    pin: "4321",
    status: "active",
    dateJoined: "2025-08-20",
    activity: { ordersToday: 27, revenueToday: 310000, lastActive: "Dakika 15 zilizopita" },
  },
  {
    id: 5,
    name: "David Kimaro",
    phone: "+255 655 432 109",
    email: "",
    role: "Karani",
    roleEn: "Cashier",
    pin: "8765",
    status: "inactive",
    dateJoined: "2025-09-05",
    activity: { ordersToday: 0, revenueToday: 0, lastActive: "Siku 3 zilizopita" },
  },
];

// ───── Helpers ─────
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function avatarColor(role: string): string {
  if (role === "Mmiliki") return "bg-brand-orange text-white";
  if (role === "Meneja") return "bg-brand-green text-white";
  return "bg-brand-gold text-brand-charcoal";
}

function roleBadge(role: string): string {
  if (role === "Mmiliki") return "bg-brand-orange/10 text-brand-orange";
  if (role === "Meneja") return "bg-brand-green/10 text-brand-green";
  return "bg-brand-gold/20 text-brand-charcoal";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ago", "Sep", "Okt", "Nov", "Des"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ───── Main Component ─────
export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("Wote");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);

  // Add form
  const [addForm, setAddForm] = useState({
    name: "",
    phone: "+255 ",
    email: "",
    role: "Karani" as "Meneja" | "Karani",
    pin: "",
  });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  // Edit form
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "Karani" as "Meneja" | "Karani" | "Mmiliki",
    pin: "",
    status: "active" as "active" | "inactive",
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [showResetPin, setShowResetPin] = useState(false);
  const [newPin, setNewPin] = useState("");

  // ── Stats ──
  const totalStaff = staff.length;
  const activeStaff = staff.filter((s) => s.status === "active").length;
  const managers = staff.filter((s) => s.role === "Meneja" || s.role === "Mmiliki").length;
  const cashiers = staff.filter((s) => s.role === "Karani").length;

  // ── Filtering ──
  const roleFilterMap: Record<string, string | null> = {
    Wote: null,
    Mmiliki: "Mmiliki",
    Meneja: "Meneja",
    Karani: "Karani",
  };

  const filtered = staff.filter((s) => {
    const matchesRole = roleFilterMap[roleFilter] === null || s.role === roleFilterMap[roleFilter];
    const q = search.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(q) || s.phone.includes(q);
    return matchesRole && matchesSearch;
  });

  // ── Add Staff ──
  function validateAdd() {
    const errors: Record<string, string> = {};
    if (!addForm.name.trim()) errors.name = "Jina linahitajika";
    if (!addForm.phone.trim() || addForm.phone.trim().length < 14) errors.phone = "Nambari sahihi ya +255 inahitajika";
    if (addForm.pin.length !== 4 || !/^\d{4}$/.test(addForm.pin)) errors.pin = "PIN lazima iwe tarakimu 4";
    return errors;
  }

  function handleAdd() {
    const errors = validateAdd();
    setAddErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newStaff: StaffMember = {
      id: Date.now(),
      name: addForm.name.trim(),
      phone: addForm.phone.trim(),
      email: addForm.email.trim(),
      role: addForm.role,
      roleEn: addForm.role === "Meneja" ? "Manager" : "Cashier",
      pin: addForm.pin,
      status: "active",
      dateJoined: new Date().toISOString().slice(0, 10),
      activity: { ordersToday: 0, revenueToday: 0, lastActive: "Hajaingia bado" },
    };

    setStaff([newStaff, ...staff]);
    setAddForm({ name: "", phone: "+255 ", email: "", role: "Karani", pin: "" });
    setAddErrors({});
    setShowAddModal(false);
  }

  // ── Edit Staff ──
  function openEditModal(s: StaffMember) {
    setEditingStaff(s);
    setEditForm({
      name: s.name,
      phone: s.phone,
      email: s.email,
      role: s.role,
      pin: s.pin,
      status: s.status,
    });
    setEditErrors({});
    setShowResetPin(false);
    setNewPin("");
  }

  function validateEdit() {
    const errors: Record<string, string> = {};
    if (!editForm.name.trim()) errors.name = "Jina linahitajika";
    if (!editForm.phone.trim() || editForm.phone.trim().length < 14) errors.phone = "Nambari sahihi ya +255 inahitajika";
    if (showResetPin && (newPin.length !== 4 || !/^\d{4}$/.test(newPin))) errors.pin = "PIN mpya lazima iwe tarakimu 4";
    return errors;
  }

  function handleEdit() {
    if (!editingStaff) return;
    const errors = validateEdit();
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStaff(
      staff.map((s) =>
        s.id === editingStaff.id
          ? {
              ...s,
              name: editForm.name.trim(),
              phone: editForm.phone.trim(),
              email: editForm.email.trim(),
              role: editForm.role as StaffMember["role"],
              roleEn: editForm.role === "Mmiliki" ? "Owner" : editForm.role === "Meneja" ? "Manager" : "Cashier",
              pin: showResetPin && newPin ? newPin : s.pin,
              status: editForm.status,
            }
          : s
      )
    );
    setEditingStaff(null);
    setShowResetPin(false);
    setNewPin("");
  }

  // ── Delete Staff ──
  function handleDelete() {
    if (!deletingStaff) return;
    setStaff(staff.filter((s) => s.id !== deletingStaff.id));
    setDeletingStaff(null);
  }

  // ───── Render ─────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wafanyakazi</h1>
          <p className="text-xs text-muted-foreground">Staff Management — Simamia timu yako</p>
        </div>
        <button
          onClick={() => {
            setAddForm({ name: "", phone: "+255 ", email: "", role: "Karani", pin: "" });
            setAddErrors({});
            setShowAddModal(true);
          }}
          className="rounded-xl bg-brand-green px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-green-dark"
        >
          + Ongeza Mfanyakazi
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Jumla ya Wafanyakazi</p>
          <p className="text-[10px] text-muted-foreground">Total Staff</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{totalStaff}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Walio Hai</p>
          <p className="text-[10px] text-muted-foreground">Active</p>
          <p className="mt-2 text-2xl font-bold text-brand-green">{activeStaff}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Wasimamizi</p>
          <p className="text-[10px] text-muted-foreground">Managers &amp; Owner</p>
          <p className="mt-2 text-2xl font-bold text-brand-orange">{managers}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Wakusanyaji</p>
          <p className="text-[10px] text-muted-foreground">Cashiers</p>
          <p className="mt-2 text-2xl font-bold text-brand-gold">{cashiers}</p>
        </div>
      </div>

      {/* ── Filters + Search ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Role filter tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: "Wote", en: "All" },
            { key: "Mmiliki", en: "Owner" },
            { key: "Meneja", en: "Manager" },
            { key: "Karani", en: "Cashier" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
                roleFilter === tab.key
                  ? "bg-brand-green text-white"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.key}{" "}
              <span className={`${roleFilter === tab.key ? "text-white/70" : "text-muted-foreground"}`}>
                ({tab.en})
              </span>
            </button>
          ))}
        </div>

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
            placeholder="Tafuta jina au nambari..."
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground sm:w-64"
          />
        </div>
      </div>

      {/* ── Staff List ── */}
      <div className="rounded-xl bg-card shadow-sm">
        {/* Desktop header */}
        <div className="hidden border-b border-border px-5 py-3 md:grid md:grid-cols-12 md:gap-4">
          <p className="col-span-4 text-xs font-semibold text-muted-foreground">Mfanyakazi</p>
          <p className="col-span-2 text-xs font-semibold text-muted-foreground">Simu</p>
          <p className="col-span-2 text-xs font-semibold text-muted-foreground">Jukumu</p>
          <p className="col-span-1 text-xs font-semibold text-muted-foreground">Hali</p>
          <p className="col-span-2 text-xs font-semibold text-muted-foreground">Tarehe Kuanza</p>
          <p className="col-span-1 text-xs font-semibold text-muted-foreground text-right">Vitendo</p>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-3xl">👤</p>
            <p className="mt-3 text-sm font-medium text-foreground">Hakuna mfanyakazi aliyepatikana</p>
            <p className="text-xs text-muted-foreground">No staff found matching your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((s) => (
              <div key={s.id}>
                {/* Main Row */}
                <div className="flex flex-col gap-3 px-5 py-4 md:grid md:grid-cols-12 md:items-center md:gap-4">
                  {/* Avatar + Name */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(
                        s.role
                      )}`}
                    >
                      {getInitials(s.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                      {s.email && (
                        <p className="truncate text-[10px] text-muted-foreground">{s.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground md:hidden">Simu:</p>
                    <p className="text-sm text-foreground">{s.phone}</p>
                  </div>

                  {/* Role */}
                  <div className="col-span-2">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${roleBadge(
                        s.role
                      )}`}
                    >
                      {s.role} ({s.roleEn})
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        s.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          s.status === "active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      {s.status === "active" ? "Hai" : "Simama"}
                    </span>
                  </div>

                  {/* Date Joined */}
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground md:hidden">Kuanza:</p>
                    <p className="text-sm text-foreground">{formatDate(s.dateJoined)}</p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    {/* Expand activity */}
                    <button
                      onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                      title="Shughuli"
                      className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`transition-transform ${expandedId === s.id ? "rotate-180" : ""}`}
                      >
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(s)}
                      title="Hariri"
                      className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 2l3 3L5 14H2v-3L11 2z" />
                      </svg>
                    </button>

                    {/* Delete */}
                    {s.role !== "Mmiliki" && (
                      <button
                        onClick={() => setDeletingStaff(s)}
                        title="Futa"
                        className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-red-50 hover:text-red-500"
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h10M5 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6h12z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Activity Summary (expandable) ── */}
                {expandedId === s.id && (
                  <div className="border-t border-dashed border-border bg-muted/30 px-5 py-4">
                    <p className="mb-3 text-xs font-semibold text-muted-foreground">
                      Muhtasari wa Shughuli — Activity Summary
                    </p>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                      <div className="rounded-lg bg-card p-3 shadow-sm">
                        <p className="text-[10px] text-muted-foreground">Oda Leo / Orders Today</p>
                        <p className="mt-1 text-lg font-bold text-foreground">{s.activity.ordersToday}</p>
                      </div>
                      <div className="rounded-lg bg-card p-3 shadow-sm">
                        <p className="text-[10px] text-muted-foreground">Mapato / Revenue</p>
                        <p className="mt-1 text-lg font-bold text-brand-green">
                          TZS {s.activity.revenueToday.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg bg-card p-3 shadow-sm">
                        <p className="text-[10px] text-muted-foreground">Mwisho Kuonekana / Last Active</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{s.activity.lastActive}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          ADD STAFF MODAL
         ══════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">Ongeza Mfanyakazi Mpya</h3>
            <p className="text-xs text-muted-foreground">Add New Staff Member</p>

            <div className="mt-5 space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Jina Kamili (Full Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Jina la mfanyakazi"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
                />
                {addErrors.name && <p className="mt-1 text-[11px] text-red-500">{addErrors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Nambari ya Simu (Phone) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  placeholder="+255 7XX XXX XXX"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
                />
                {addErrors.phone && <p className="mt-1 text-[11px] text-red-500">{addErrors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Barua Pepe (Email) <span className="text-muted-foreground/60">— si lazima</span>
                </label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="email@example.com"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Role */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">Jukumu (Role)</label>
                <select
                  value={addForm.role}
                  onChange={(e) =>
                    setAddForm({ ...addForm, role: e.target.value as "Meneja" | "Karani" })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                >
                  <option value="Meneja">Meneja (Manager)</option>
                  <option value="Karani">Karani (Cashier)</option>
                </select>
              </div>

              {/* PIN */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  PIN ya Kuingia (Login PIN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={addForm.pin}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setAddForm({ ...addForm, pin: v });
                  }}
                  placeholder="Tarakimu 4 (e.g. 1234)"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm tracking-[0.3em] text-foreground placeholder:tracking-normal placeholder:text-muted-foreground"
                />
                {addErrors.pin && <p className="mt-1 text-[11px] text-red-500">{addErrors.pin}</p>}
                <p className="mt-1 text-[10px] text-muted-foreground">
                  PIN hii itatumiwa na mfanyakazi kuingia kwenye mfumo
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Ghairi
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 rounded-xl bg-brand-green py-2.5 text-sm font-medium text-white transition hover:bg-brand-green-dark"
              >
                Ongeza Mfanyakazi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          EDIT STAFF MODAL
         ══════════════════════════════════════════ */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">Hariri Mfanyakazi</h3>
            <p className="text-xs text-muted-foreground">Edit Staff Member — {editingStaff.name}</p>

            <div className="mt-5 space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Jina Kamili (Full Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                />
                {editErrors.name && <p className="mt-1 text-[11px] text-red-500">{editErrors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Nambari ya Simu (Phone) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                />
                {editErrors.phone && <p className="mt-1 text-[11px] text-red-500">{editErrors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Barua Pepe (Email) <span className="text-muted-foreground/60">— si lazima</span>
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                />
              </div>

              {/* Role */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">Jukumu (Role)</label>
                {editingStaff.role === "Mmiliki" ? (
                  <div className="mt-1 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
                    Mmiliki (Owner) — haibadilishiki
                  </div>
                ) : (
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value as "Meneja" | "Karani" })
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                  >
                    <option value="Meneja">Meneja (Manager)</option>
                    <option value="Karani">Karani (Cashier)</option>
                  </select>
                )}
              </div>

              {/* Status Toggle */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">Hali (Status)</label>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setEditForm({ ...editForm, status: "active" })}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                      editForm.status === "active"
                        ? "bg-green-100 text-green-700 ring-2 ring-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Hai (Active)
                  </button>
                  <button
                    onClick={() => setEditForm({ ...editForm, status: "inactive" })}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                      editForm.status === "inactive"
                        ? "bg-red-100 text-red-600 ring-2 ring-red-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Simama (Inactive)
                  </button>
                </div>
              </div>

              {/* Reset PIN */}
              <div className="rounded-lg border border-dashed border-border p-3">
                {!showResetPin ? (
                  <button
                    onClick={() => setShowResetPin(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs font-medium text-foreground transition hover:bg-border"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 1v4M7 9v4M1 7h4M9 7h4" />
                    </svg>
                    Weka Upya PIN — Reset PIN
                  </button>
                ) : (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      PIN Mpya (New PIN) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="password"
                        maxLength={4}
                        value={newPin}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setNewPin(v);
                        }}
                        placeholder="Tarakimu 4"
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm tracking-[0.3em] text-foreground placeholder:tracking-normal placeholder:text-muted-foreground"
                      />
                      <button
                        onClick={() => {
                          setShowResetPin(false);
                          setNewPin("");
                        }}
                        className="rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Ghairi
                      </button>
                    </div>
                    {editErrors.pin && <p className="mt-1 text-[11px] text-red-500">{editErrors.pin}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setEditingStaff(null);
                  setShowResetPin(false);
                  setNewPin("");
                }}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Ghairi
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 rounded-xl bg-brand-green py-2.5 text-sm font-medium text-white transition hover:bg-brand-green-dark"
              >
                Hifadhi Mabadiliko
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          DELETE CONFIRMATION MODAL
         ══════════════════════════════════════════ */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            {/* Warning Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <svg width="28" height="28" fill="none" stroke="#DC2626" strokeWidth="2">
                <path d="M14 9v6M14 19h.01M5.07 22h17.86a2 2 0 0 0 1.73-3L15.73 4a2 2 0 0 0-3.46 0L3.34 19a2 2 0 0 0 1.73 3z" />
              </svg>
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-foreground">Futa Mfanyakazi?</h3>
            <p className="mt-1 text-center text-xs text-muted-foreground">Delete Staff Member?</p>

            <div className="mt-4 rounded-lg bg-red-50 p-3">
              <p className="text-center text-sm font-medium text-red-700">{deletingStaff.name}</p>
              <p className="mt-1 text-center text-[11px] text-red-600">
                {deletingStaff.role} ({deletingStaff.roleEn})
              </p>
            </div>

            <div className="mt-4 space-y-2 rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground">
                Onyo — Hatua hii itasababisha:
              </p>
              <ul className="space-y-1 text-[11px] text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-500">&#x2022;</span>
                  Taarifa zote za mfanyakazi huyu zitafutwa kabisa
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-500">&#x2022;</span>
                  Rekodi za oda na shughuli zake zitabaki kwenye ripoti lakini hazitahusishwa na akaunti
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-500">&#x2022;</span>
                  PIN ya kuingia itafutiliwa mbali — hawezi kuingia tena
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-500">&#x2022;</span>
                  Hatua hii haiwezi kutendwa upya (irreversible)
                </li>
              </ul>
              <p className="mt-1 text-[10px] text-muted-foreground italic">
                Badala ya kufuta, fikiria kumsimamisha (deactivate) mfanyakazi.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingStaff(null)}
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
    </div>
  );
}
