"use client";

import { useState } from "react";

/* ──────────────────── TYPES ──────────────────── */

type Severity = "Info" | "Warning" | "Critical";
type EventType = "Login" | "Data Change" | "Permission" | "Billing" | "System";

interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  avatar: string;
  event: string;
  eventEn: string;
  eventType: EventType;
  restaurant: string;
  ip: string;
  severity: Severity;
  userAgent?: string;
  before?: string;
  after?: string;
  relatedEvents?: string[];
}

/* ──────────────────── DATA ──────────────────── */

const auditEvents: AuditEvent[] = [
  {
    id: "AUD-001",
    timestamp: "2026-04-20 14:32:05",
    user: "Erick Mathew",
    avatar: "EM",
    event: "Erick Mathew ameingira kwenye mfumo",
    eventEn: "Logged into the system",
    eventType: "Login",
    restaurant: "FoodOS HQ",
    ip: "196.192.78.12",
    severity: "Info",
    userAgent: "Chrome 124.0 / macOS 15.4",
    relatedEvents: ["AUD-002"],
  },
  {
    id: "AUD-002",
    timestamp: "2026-04-20 14:28:11",
    user: "Amina Hassan",
    avatar: "AH",
    event: "Amina Hassan amebadilisha bei ya Pilau kuwa TZS 6,000",
    eventEn: "Changed Pilau price to TZS 6,000",
    eventType: "Data Change",
    restaurant: "Mama Lishe Kitchen",
    ip: "196.192.45.88",
    severity: "Info",
    userAgent: "Safari 18.2 / iOS 19.3",
    before: "Bei ya Pilau: TZS 5,000",
    after: "Bei ya Pilau: TZS 6,000",
  },
  {
    id: "AUD-003",
    timestamp: "2026-04-20 13:55:42",
    user: "Joseph Mwanga",
    avatar: "JM",
    event: "Joseph Mwanga: kuingia kumeshindikana (PIN isiyo sahihi)",
    eventEn: "Login failed (incorrect PIN)",
    eventType: "Login",
    restaurant: "Kilimanjaro Bites",
    ip: "41.59.12.203",
    severity: "Warning",
    userAgent: "Chrome 123.0 / Android 15",
    relatedEvents: ["AUD-004"],
  },
  {
    id: "AUD-004",
    timestamp: "2026-04-20 13:55:50",
    user: "Joseph Mwanga",
    avatar: "JM",
    event: "Joseph Mwanga: kuingia kumeshindikana mara ya 2",
    eventEn: "Login failed attempt 2",
    eventType: "Login",
    restaurant: "Kilimanjaro Bites",
    ip: "41.59.12.203",
    severity: "Warning",
    userAgent: "Chrome 123.0 / Android 15",
    relatedEvents: ["AUD-003"],
  },
  {
    id: "AUD-005",
    timestamp: "2026-04-20 13:22:18",
    user: "Mfumo (System)",
    avatar: "SY",
    event: "Chapati House imesimamishwa kwa sababu ya malipo yasiyolipwa",
    eventEn: "Chapati House suspended due to unpaid subscription",
    eventType: "System",
    restaurant: "Chapati House",
    ip: "10.0.0.1",
    severity: "Critical",
    userAgent: "FoodOS System / v2.4.1",
    before: "Hali: Hai (Active)",
    after: "Hali: Imesimamishwa (Suspended)",
  },
  {
    id: "AUD-006",
    timestamp: "2026-04-20 12:45:33",
    user: "Erick Mathew",
    avatar: "EM",
    event: "Plan upgrade: Mama Lishe Kitchen imehamishwa kutoka Mwanzo kwenda Kitaalamu",
    eventEn: "Plan upgrade: Mama Lishe Kitchen moved from Mwanzo to Kitaalamu",
    eventType: "Billing",
    restaurant: "Mama Lishe Kitchen",
    ip: "196.192.78.12",
    severity: "Info",
    userAgent: "Chrome 124.0 / macOS 15.4",
    before: "Mpango: Mwanzo (TZS 29,000/mwezi)",
    after: "Mpango: Kitaalamu (TZS 59,000/mwezi)",
  },
  {
    id: "AUD-007",
    timestamp: "2026-04-20 12:10:05",
    user: "Fatma Bakari",
    avatar: "FB",
    event: "Fatma Bakari amebadilisha ruhusa ya mfanyakazi Hassan kuwa Msimamizi",
    eventEn: "Changed staff Hassan's role to Manager",
    eventType: "Permission",
    restaurant: "Mama Lishe Kitchen",
    ip: "196.192.45.88",
    severity: "Info",
    userAgent: "Firefox 126.0 / Windows 11",
    before: "Jukumu la Hassan: Mkusanyaji (Cashier)",
    after: "Jukumu la Hassan: Msimamizi (Manager)",
  },
  {
    id: "AUD-008",
    timestamp: "2026-04-20 11:30:22",
    user: "David Kimaro",
    avatar: "DK",
    event: "David Kimaro ameongeza bidhaa mpya: Nyama Choma Special",
    eventEn: "Added new menu item: Nyama Choma Special",
    eventType: "Data Change",
    restaurant: "Dar Biriyani House",
    ip: "41.59.88.155",
    severity: "Info",
    userAgent: "Chrome 124.0 / Windows 11",
    after: "Bidhaa: Nyama Choma Special — TZS 12,000",
  },
  {
    id: "AUD-009",
    timestamp: "2026-04-20 10:55:14",
    user: "Mfumo (System)",
    avatar: "SY",
    event: "Hifadhidata imesasishwa kiotomatiki — migahawa 22 imeathirika",
    eventEn: "Automatic database migration — 22 restaurants affected",
    eventType: "System",
    restaurant: "Mfumo Mzima",
    ip: "10.0.0.1",
    severity: "Warning",
    userAgent: "FoodOS System / v2.4.1",
  },
  {
    id: "AUD-010",
    timestamp: "2026-04-20 10:15:08",
    user: "Grace Mushi",
    avatar: "GM",
    event: "Grace Mushi amefuta bidhaa: Chips Mayai ya Kawaida",
    eventEn: "Deleted menu item: Regular Chips Mayai",
    eventType: "Data Change",
    restaurant: "Zanzibar Spice",
    ip: "196.192.33.77",
    severity: "Info",
    userAgent: "Safari 18.2 / macOS 15.4",
    before: "Bidhaa: Chips Mayai ya Kawaida — TZS 3,500 (Hai)",
    after: "Imefutwa",
  },
  {
    id: "AUD-011",
    timestamp: "2026-04-19 18:20:44",
    user: "Erick Mathew",
    avatar: "EM",
    event: "Erick Mathew ameidhinisha KYC ya Arusha Grills",
    eventEn: "Approved KYC for Arusha Grills",
    eventType: "Permission",
    restaurant: "Arusha Grills",
    ip: "196.192.78.12",
    severity: "Info",
    userAgent: "Chrome 124.0 / macOS 15.4",
    before: "Hali ya KYC: Inasubiri (Pending)",
    after: "Hali ya KYC: Imeidhinishwa (Approved)",
  },
  {
    id: "AUD-012",
    timestamp: "2026-04-19 17:05:31",
    user: "Mfumo (System)",
    avatar: "SY",
    event: "Malipo ya M-Pesa yamepokelewa — Dodoma Meals TZS 45,000",
    eventEn: "M-Pesa payment received — Dodoma Meals TZS 45,000",
    eventType: "Billing",
    restaurant: "Dodoma Meals",
    ip: "10.0.0.1",
    severity: "Info",
    userAgent: "FoodOS Payment Gateway / v1.8",
  },
  {
    id: "AUD-013",
    timestamp: "2026-04-19 16:40:18",
    user: "Rehema Juma",
    avatar: "RJ",
    event: "Rehema Juma amejaribu kubadilisha ruhusa bila idhini",
    eventEn: "Attempted unauthorized permission change",
    eventType: "Permission",
    restaurant: "Pilau Palace",
    ip: "41.59.22.91",
    severity: "Critical",
    userAgent: "Chrome 123.0 / Android 15",
  },
  {
    id: "AUD-014",
    timestamp: "2026-04-19 15:22:07",
    user: "Salma Hassan",
    avatar: "SH",
    event: "Salma Hassan amebadilisha bei ya bidhaa 5 kwa pamoja",
    eventEn: "Bulk price change for 5 menu items",
    eventType: "Data Change",
    restaurant: "Mama Lishe Kitchen",
    ip: "196.192.45.88",
    severity: "Info",
    userAgent: "Safari 18.2 / iOS 19.3",
    before: "Bidhaa 5: bei za zamani",
    after: "Bidhaa 5: bei mpya (+10% ongezeko)",
  },
  {
    id: "AUD-015",
    timestamp: "2026-04-19 14:10:55",
    user: "Erick Mathew",
    avatar: "EM",
    event: "Erick Mathew ameingia kwenye akaunti ya Mwanza Fish Point (impersonation)",
    eventEn: "Impersonated Mwanza Fish Point account",
    eventType: "Permission",
    restaurant: "Mwanza Fish Point",
    ip: "196.192.78.12",
    severity: "Warning",
    userAgent: "Chrome 124.0 / macOS 15.4",
  },
  {
    id: "AUD-016",
    timestamp: "2026-04-19 12:30:42",
    user: "Mfumo (System)",
    avatar: "SY",
    event: "Ripoti ya kila siku imetumwa kwa migahawa 18",
    eventEn: "Daily report sent to 18 restaurants",
    eventType: "System",
    restaurant: "Mfumo Mzima",
    ip: "10.0.0.1",
    severity: "Info",
    userAgent: "FoodOS Report Service / v1.3",
  },
  {
    id: "AUD-017",
    timestamp: "2026-04-19 10:05:19",
    user: "Hassan Omari",
    avatar: "HO",
    event: "Hassan Omari ameingira kwenye mfumo kwa mara ya kwanza",
    eventEn: "First time login",
    eventType: "Login",
    restaurant: "Kilimanjaro Bites",
    ip: "41.59.12.210",
    severity: "Info",
    userAgent: "Chrome 123.0 / Android 15",
  },
  {
    id: "AUD-018",
    timestamp: "2026-04-18 22:15:33",
    user: "Mfumo (System)",
    avatar: "SY",
    event: "Hifadhi rudufu ya usiku imekamilika kwa mafanikio",
    eventEn: "Nightly backup completed successfully",
    eventType: "System",
    restaurant: "Mfumo Mzima",
    ip: "10.0.0.1",
    severity: "Info",
    userAgent: "FoodOS Backup Service / v2.1",
  },
  {
    id: "AUD-019",
    timestamp: "2026-04-18 16:45:08",
    user: "Zainab Mwinyi",
    avatar: "ZM",
    event: "Zainab Mwinyi ameghairi usajili wa Chapati House",
    eventEn: "Cancelled Chapati House subscription",
    eventType: "Billing",
    restaurant: "Chapati House",
    ip: "196.192.55.44",
    severity: "Warning",
    userAgent: "Chrome 124.0 / Windows 11",
    before: "Usajili: Mwanzo (Active)",
    after: "Usajili: Umeghairiwa (Cancelled)",
  },
  {
    id: "AUD-020",
    timestamp: "2026-04-18 14:20:55",
    user: "Erick Mathew",
    avatar: "EM",
    event: "Erick Mathew ameongeza mtumiaji mpya: Peter Mwalimu kama Msimamizi",
    eventEn: "Added new user: Peter Mwalimu as Manager",
    eventType: "Permission",
    restaurant: "Pilau Palace",
    ip: "196.192.78.12",
    severity: "Info",
    userAgent: "Chrome 124.0 / macOS 15.4",
    after: "Mtumiaji: Peter Mwalimu — Msimamizi (Manager)",
  },
];

const users = [
  "Wote",
  "Erick Mathew",
  "Amina Hassan",
  "Joseph Mwanga",
  "Fatma Bakari",
  "David Kimaro",
  "Grace Mushi",
  "Rehema Juma",
  "Salma Hassan",
  "Hassan Omari",
  "Zainab Mwinyi",
  "Mfumo (System)",
];

const restaurants = [
  "Zote",
  "FoodOS HQ",
  "Mama Lishe Kitchen",
  "Kilimanjaro Bites",
  "Chapati House",
  "Dar Biriyani House",
  "Zanzibar Spice",
  "Arusha Grills",
  "Dodoma Meals",
  "Pilau Palace",
  "Mwanza Fish Point",
  "Mfumo Mzima",
];

const eventTypes: (EventType | "All")[] = ["All", "Login", "Data Change", "Permission", "Billing", "System"];
const severities: (Severity | "All")[] = ["All", "Info", "Warning", "Critical"];

/* ──────────────────── HELPERS ──────────────────── */

function severityBadge(severity: Severity) {
  const map: Record<Severity, string> = {
    Info: "bg-blue-100 text-blue-700 border-blue-200",
    Warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Critical: "bg-red-100 text-red-700 border-red-200",
  };
  return map[severity];
}

function eventTypeBadge(type: EventType) {
  const map: Record<EventType, string> = {
    Login: "bg-green-50 text-green-700",
    "Data Change": "bg-blue-50 text-blue-700",
    Permission: "bg-purple-50 text-purple-700",
    Billing: "bg-orange-50 text-orange-700",
    System: "bg-gray-100 text-gray-700",
  };
  return map[type];
}

function eventTypeLabel(type: EventType) {
  const map: Record<EventType, string> = {
    Login: "Kuingia",
    "Data Change": "Mabadiliko",
    Permission: "Ruhusa",
    Billing: "Malipo",
    System: "Mfumo",
  };
  return map[type];
}

function avatarBg(avatar: string) {
  const map: Record<string, string> = {
    EM: "bg-purple-600",
    AH: "bg-[#E8712B]",
    JM: "bg-[#2D7A3A]",
    FB: "bg-blue-600",
    DK: "bg-teal-600",
    GM: "bg-pink-600",
    RJ: "bg-amber-700",
    SH: "bg-emerald-600",
    HO: "bg-sky-600",
    ZM: "bg-rose-600",
    SY: "bg-gray-500",
  };
  return map[avatar] || "bg-gray-400";
}

function downloadCSV(events: AuditEvent[]) {
  const headers = "ID,Muda,Mtumiaji,Tukio,Aina,Mgahawa,IP,Ukali\n";
  const rows = events
    .map(
      (e) =>
        `"${e.id}","${e.timestamp}","${e.user}","${e.event}","${e.eventType}","${e.restaurant}","${e.ip}","${e.severity}"`
    )
    .join("\n");
  const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadJSON(events: AuditEvent[]) {
  const json = JSON.stringify(events, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ──────────────────── COMPONENT ──────────────────── */

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("Wote");
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | "All">("All");
  const [restaurantFilter, setRestaurantFilter] = useState("Zote");
  const [severityFilter, setSeverityFilter] = useState<Severity | "All">("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  /* Filtering */
  const filtered = auditEvents.filter((e) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        e.event.toLowerCase().includes(q) ||
        e.eventEn.toLowerCase().includes(q) ||
        e.user.toLowerCase().includes(q) ||
        e.restaurant.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (userFilter !== "Wote" && e.user !== userFilter) return false;
    if (eventTypeFilter !== "All" && e.eventType !== eventTypeFilter) return false;
    if (restaurantFilter !== "Zote" && e.restaurant !== restaurantFilter) return false;
    if (severityFilter !== "All" && e.severity !== severityFilter) return false;
    if (dateFrom) {
      const from = new Date(dateFrom);
      const eventDate = new Date(e.timestamp);
      if (eventDate < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo + "T23:59:59");
      const eventDate = new Date(e.timestamp);
      if (eventDate > to) return false;
    }
    return true;
  });

  /* Stats */
  const totalEvents = auditEvents.length;
  const criticalCount = auditEvents.filter((e) => e.severity === "Critical").length;
  const warningCount = auditEvents.filter((e) => e.severity === "Warning").length;
  const todayCount = auditEvents.filter((e) => e.timestamp.startsWith("2026-04-20")).length;

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kumbukumbu za Ukaguzi</h1>
          <p className="text-sm text-muted-foreground">Audit Logs — Fuatilia shughuli zote za mfumo</p>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => downloadCSV(filtered)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Pakua CSV
          </button>
          <button
            onClick={() => downloadJSON(filtered)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Pakua JSON
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <p className="text-xs font-medium text-muted-foreground">Jumla ya Matukio</p>
          <p className="text-[10px] text-muted-foreground">Total Events</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{totalEvents}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
          <p className="text-xs font-medium text-muted-foreground">Leo</p>
          <p className="text-[10px] text-muted-foreground">Today</p>
          <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">{todayCount}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-yellow-200">
          <p className="text-xs font-medium text-muted-foreground">Maonyo</p>
          <p className="text-[10px] text-muted-foreground">Warnings</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">{warningCount}</p>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-sm border border-red-200">
          <p className="text-xs font-medium text-muted-foreground">Muhimu Sana</p>
          <p className="text-[10px] text-muted-foreground">Critical</p>
          <p className="mt-2 text-2xl font-bold text-red-600">{criticalCount}</p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
        <div className="flex flex-col gap-4">
          {/* Row 1: Search */}
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
              placeholder="Tafuta tukio, mtumiaji, mgahawa, au ID..."
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Row 2: Dropdowns */}
          <div className="flex flex-wrap gap-2">
            {/* User */}
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
            >
              {users.map((u) => (
                <option key={u} value={u}>
                  {u === "Wote" ? "Mtumiaji: Wote" : u}
                </option>
              ))}
            </select>

            {/* Event Type */}
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value as EventType | "All")}
              className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
            >
              {eventTypes.map((t) => (
                <option key={t} value={t}>
                  {t === "All"
                    ? "Aina: Zote"
                    : t === "Login"
                    ? "Kuingia (Login)"
                    : t === "Data Change"
                    ? "Mabadiliko (Data Change)"
                    : t === "Permission"
                    ? "Ruhusa (Permission)"
                    : t === "Billing"
                    ? "Malipo (Billing)"
                    : "Mfumo (System)"}
                </option>
              ))}
            </select>

            {/* Restaurant */}
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

            {/* Severity */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as Severity | "All")}
              className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
            >
              {severities.map((s) => (
                <option key={s} value={s}>
                  {s === "All"
                    ? "Ukali: Wote"
                    : s === "Info"
                    ? "Taarifa (Info)"
                    : s === "Warning"
                    ? "Onyo (Warning)"
                    : "Muhimu (Critical)"}
                </option>
              ))}
            </select>

            {/* Date Range */}
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
              />
              <span className="text-xs text-muted-foreground">hadi</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
              />
            </div>
          </div>

          {/* Row 3: Severity pills */}
          <div className="flex flex-wrap gap-1.5">
            {severities.map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  severityFilter === s
                    ? s === "All"
                      ? "bg-[#2D7A3A] text-white shadow-sm"
                      : s === "Info"
                      ? "bg-blue-600 text-white shadow-sm"
                      : s === "Warning"
                      ? "bg-yellow-500 text-white shadow-sm"
                      : "bg-red-600 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "All"
                  ? "Zote"
                  : s === "Info"
                  ? "Taarifa"
                  : s === "Warning"
                  ? "Onyo"
                  : "Muhimu"}
                <span className="ml-1.5 text-[10px] opacity-80">
                  {s === "All"
                    ? totalEvents
                    : auditEvents.filter((e) => e.severity === s).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Log Table ── */}
      <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
        {/* Table Header */}
        <div className="hidden border-b border-border bg-muted/30 px-5 py-3 lg:grid lg:grid-cols-12 lg:gap-3">
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Muda / Time
          </p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mtumiaji / User
          </p>
          <p className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tukio / Event
          </p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mgahawa
          </p>
          <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            IP
          </p>
          <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">
            Ukali / Severity
          </p>
        </div>

        {/* Table Rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">Hakuna matukio yaliyopatikana</p>
            <p className="text-xs text-muted-foreground">No audit events match your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((e) => (
              <div key={e.id}>
                {/* Main Row */}
                <button
                  className={`w-full text-left transition hover:bg-muted/20 ${
                    e.severity === "Critical"
                      ? "bg-red-50/30"
                      : e.severity === "Warning"
                      ? "bg-yellow-50/20"
                      : ""
                  } ${expandedRow === e.id ? "bg-muted/30" : ""}`}
                  onClick={() => setExpandedRow(expandedRow === e.id ? null : e.id)}
                >
                  <div className="flex flex-col gap-2 px-5 py-4 lg:grid lg:grid-cols-12 lg:items-center lg:gap-3">
                    {/* Timestamp */}
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground lg:hidden font-medium">Muda:</p>
                      <p className="text-xs text-foreground whitespace-nowrap">{e.timestamp.split(" ")[0]}</p>
                      <p className="text-[10px] text-muted-foreground">{e.timestamp.split(" ")[1]}</p>
                    </div>

                    {/* User */}
                    <div className="col-span-2 flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${avatarBg(e.avatar)}`}
                      >
                        {e.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{e.user}</p>
                      </div>
                    </div>

                    {/* Event */}
                    <div className="col-span-3">
                      <p className="text-xs text-muted-foreground lg:hidden font-medium">Tukio:</p>
                      <p className="text-sm text-foreground leading-snug">{e.event}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${eventTypeBadge(e.eventType)}`}
                        >
                          {eventTypeLabel(e.eventType)}
                        </span>
                      </div>
                    </div>

                    {/* Restaurant */}
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground lg:hidden font-medium">Mgahawa:</p>
                      <p className="text-sm text-foreground truncate">{e.restaurant}</p>
                    </div>

                    {/* IP */}
                    <div className="col-span-1">
                      <p className="text-xs text-muted-foreground lg:hidden font-medium">IP:</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{e.ip}</p>
                    </div>

                    {/* Severity */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${severityBadge(e.severity)}`}
                      >
                        {e.severity === "Critical" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        )}
                        {e.severity === "Info"
                          ? "Taarifa"
                          : e.severity === "Warning"
                          ? "Onyo"
                          : "Muhimu"}
                      </span>
                      <svg
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedRow === e.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expanded Detail */}
                {expandedRow === e.id && (
                  <div className="border-t border-border bg-muted/10 px-5 py-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Full Event */}
                      <div className="sm:col-span-2 lg:col-span-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Maelezo Kamili / Full Details
                        </p>
                        <p className="mt-1 text-sm text-foreground">{e.event}</p>
                        <p className="text-xs text-muted-foreground">{e.eventEn}</p>
                      </div>

                      {/* Before/After */}
                      {(e.before || e.after) && (
                        <div className="sm:col-span-2 lg:col-span-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            {e.before && (
                              <div className="rounded-lg bg-red-50/50 border border-red-100 p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600">
                                  Kabla / Before
                                </p>
                                <p className="mt-1 text-sm text-red-800 font-mono">{e.before}</p>
                              </div>
                            )}
                            {e.after && (
                              <div className="rounded-lg bg-green-50/50 border border-green-100 p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-green-600">
                                  Baada / After
                                </p>
                                <p className="mt-1 text-sm text-green-800 font-mono">{e.after}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ID */}
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          ID ya Tukio
                        </p>
                        <p className="mt-1 text-sm font-mono text-foreground">{e.id}</p>
                      </div>

                      {/* User Agent */}
                      {e.userAgent && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Kivinjari / User Agent
                          </p>
                          <p className="mt-1 text-sm text-foreground">{e.userAgent}</p>
                        </div>
                      )}

                      {/* IP */}
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Anwani ya IP
                        </p>
                        <p className="mt-1 text-sm font-mono text-foreground">{e.ip}</p>
                      </div>

                      {/* Timestamp */}
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Muda Kamili / Timestamp
                        </p>
                        <p className="mt-1 text-sm font-mono text-foreground">{e.timestamp}</p>
                      </div>

                      {/* Related Events */}
                      {e.relatedEvents && e.relatedEvents.length > 0 && (
                        <div className="sm:col-span-2 lg:col-span-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Matukio Yanayohusiana / Related Events
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {e.relatedEvents.map((relId) => {
                              const relEvent = auditEvents.find((ae) => ae.id === relId);
                              return (
                                <button
                                  key={relId}
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    setExpandedRow(relId);
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground transition hover:bg-muted"
                                >
                                  <span className="font-mono font-semibold text-[#2D7A3A]">{relId}</span>
                                  {relEvent && (
                                    <span className="text-muted-foreground truncate max-w-[200px]">
                                      {relEvent.event.substring(0, 40)}...
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Table Footer */}
        <div className="border-t border-border bg-muted/20 px-5 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Inaonyesha {filtered.length} kati ya {totalEvents} matukio
            <span className="ml-1 text-muted-foreground/60">
              (Showing {filtered.length} of {totalEvents} events)
            </span>
          </p>
          <div className="flex gap-1">
            <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition">
              Nyuma
            </button>
            <button className="rounded-lg bg-[#2D7A3A] px-3 py-1.5 text-xs font-medium text-white">
              1
            </button>
            <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition">
              Mbele
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
