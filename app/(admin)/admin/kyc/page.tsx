"use client";

import { useState } from "react";

// ───── Types ─────
interface KYCDocument {
  name: string;
  nameEn: string;
  status: "uploaded" | "missing";
}

interface KYCApplication {
  id: number;
  restaurantName: string;
  ownerName: string;
  phone: string;
  email: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  documents: KYCDocument[];
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

// ───── Sample Data ─────
const initialApplications: KYCApplication[] = [
  // Pending
  {
    id: 1,
    restaurantName: "Baba Mzee Grill",
    ownerName: "Abdallah Mzee",
    phone: "+255 712 456 789",
    email: "abdallah@babamzee.co.tz",
    submittedDate: "2026-04-17",
    status: "pending",
    documents: [
      { name: "Leseni ya Biashara", nameEn: "Business License", status: "uploaded" },
      { name: "Kitambulisho", nameEn: "National ID", status: "uploaded" },
      { name: "Picha ya Mgahawa", nameEn: "Restaurant Photo", status: "uploaded" },
    ],
  },
  {
    id: 2,
    restaurantName: "Nyama Choma Palace",
    ownerName: "Salim Rashid",
    phone: "+255 754 789 012",
    email: "salim@nyamachoma.co.tz",
    submittedDate: "2026-04-16",
    status: "pending",
    documents: [
      { name: "Leseni ya Biashara", nameEn: "Business License", status: "uploaded" },
      { name: "Kitambulisho", nameEn: "National ID", status: "uploaded" },
      { name: "Picha ya Mgahawa", nameEn: "Restaurant Photo", status: "missing" },
    ],
  },
  {
    id: 3,
    restaurantName: "Samaki Fresh",
    ownerName: "Maria Luvanda",
    phone: "+255 678 345 678",
    email: "maria@samakifresh.co.tz",
    submittedDate: "2026-04-15",
    status: "pending",
    documents: [
      { name: "Leseni ya Biashara", nameEn: "Business License", status: "missing" },
      { name: "Kitambulisho", nameEn: "National ID", status: "uploaded" },
      { name: "Picha ya Mgahawa", nameEn: "Restaurant Photo", status: "uploaded" },
    ],
  },
  // Approved
  {
    id: 4,
    restaurantName: "Mama Salma Kitchen",
    ownerName: "Amina Hassan",
    phone: "+255 754 123 456",
    email: "amina@mamasalma.co.tz",
    submittedDate: "2026-03-20",
    status: "approved",
    documents: [
      { name: "Leseni ya Biashara", nameEn: "Business License", status: "uploaded" },
      { name: "Kitambulisho", nameEn: "National ID", status: "uploaded" },
      { name: "Picha ya Mgahawa", nameEn: "Restaurant Photo", status: "uploaded" },
    ],
    approvedBy: "Erick Mathew",
    approvedDate: "2026-03-22",
  },
  {
    id: 5,
    restaurantName: "Chips Kuku Corner",
    ownerName: "Joseph Mwanga",
    phone: "+255 678 234 567",
    email: "joseph@chipskuku.co.tz",
    submittedDate: "2026-03-15",
    status: "approved",
    documents: [
      { name: "Leseni ya Biashara", nameEn: "Business License", status: "uploaded" },
      { name: "Kitambulisho", nameEn: "National ID", status: "uploaded" },
      { name: "Picha ya Mgahawa", nameEn: "Restaurant Photo", status: "uploaded" },
    ],
    approvedBy: "Erick Mathew",
    approvedDate: "2026-03-17",
  },
  {
    id: 6,
    restaurantName: "Biryani House",
    ownerName: "David Kimaro",
    phone: "+255 655 432 109",
    email: "david@biryani.co.tz",
    submittedDate: "2026-03-10",
    status: "approved",
    documents: [
      { name: "Leseni ya Biashara", nameEn: "Business License", status: "uploaded" },
      { name: "Kitambulisho", nameEn: "National ID", status: "uploaded" },
      { name: "Picha ya Mgahawa", nameEn: "Restaurant Photo", status: "uploaded" },
    ],
    approvedBy: "Erick Mathew",
    approvedDate: "2026-03-12",
  },
  {
    id: 7,
    restaurantName: "Ugali Spot",
    ownerName: "Grace Mushi",
    phone: "+255 756 789 012",
    email: "grace@ugalispot.co.tz",
    submittedDate: "2026-02-28",
    status: "approved",
    documents: [
      { name: "Leseni ya Biashara", nameEn: "Business License", status: "uploaded" },
      { name: "Kitambulisho", nameEn: "National ID", status: "uploaded" },
      { name: "Picha ya Mgahawa", nameEn: "Restaurant Photo", status: "uploaded" },
    ],
    approvedBy: "Erick Mathew",
    approvedDate: "2026-03-02",
  },
  {
    id: 8,
    restaurantName: "Pilau Palace",
    ownerName: "Rehema Juma",
    phone: "+255 713 456 789",
    email: "rehema@pilaupalace.co.tz",
    submittedDate: "2026-02-20",
    status: "approved",
    documents: [
      { name: "Leseni ya Biashara", nameEn: "Business License", status: "uploaded" },
      { name: "Kitambulisho", nameEn: "National ID", status: "uploaded" },
      { name: "Picha ya Mgahawa", nameEn: "Restaurant Photo", status: "uploaded" },
    ],
    approvedBy: "Erick Mathew",
    approvedDate: "2026-02-22",
  },
  // Rejected
  {
    id: 9,
    restaurantName: "Kwa Juma Eats",
    ownerName: "Juma Bakari",
    phone: "+255 784 567 890",
    email: "juma@kwajuma.co.tz",
    submittedDate: "2026-04-10",
    status: "rejected",
    documents: [
      { name: "Leseni ya Biashara", nameEn: "Business License", status: "uploaded" },
      { name: "Kitambulisho", nameEn: "National ID", status: "missing" },
      { name: "Picha ya Mgahawa", nameEn: "Restaurant Photo", status: "missing" },
    ],
    rejectionReason: "Taarifa pungufu — Kitambulisho na picha hazikupatikana",
  },
  {
    id: 10,
    restaurantName: "Street Food TZ",
    ownerName: "Hamisi Ally",
    phone: "+255 657 890 123",
    email: "hamisi@streetfoodtz.co.tz",
    submittedDate: "2026-04-08",
    status: "rejected",
    documents: [
      { name: "Leseni ya Biashara", nameEn: "Business License", status: "uploaded" },
      { name: "Kitambulisho", nameEn: "National ID", status: "uploaded" },
      { name: "Picha ya Mgahawa", nameEn: "Restaurant Photo", status: "uploaded" },
    ],
    rejectionReason: "Hati zisizo sahihi — Leseni ya biashara imeisha muda wake",
  },
  {
    id: 11,
    restaurantName: "Mzinga Lounge",
    ownerName: "Saida Kombo",
    phone: "+255 714 012 345",
    email: "saida@mzinga.co.tz",
    submittedDate: "2026-04-05",
    status: "rejected",
    documents: [
      { name: "Leseni ya Biashara", nameEn: "Business License", status: "uploaded" },
      { name: "Kitambulisho", nameEn: "National ID", status: "uploaded" },
      { name: "Picha ya Mgahawa", nameEn: "Restaurant Photo", status: "uploaded" },
    ],
    rejectionReason: "Picha hazilingani — Picha ya mgahawa si ya sehemu halisi",
  },
];

// ───── Helpers ─────
function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Ago", "Sep", "Okt", "Nov", "Des",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const rejectionReasons = [
  { value: "hati_zisizo_sahihi", label: "Hati zisizo sahihi", labelEn: "Invalid documents" },
  { value: "picha_hazilingani", label: "Picha hazilingani", labelEn: "Photos don't match" },
  { value: "taarifa_pungufu", label: "Taarifa pungufu", labelEn: "Incomplete info" },
  { value: "nyingine", label: "Sababu nyingine", labelEn: "Other reason" },
];

// ───── Main Component ─────
export default function KYCPage() {
  const [applications, setApplications] = useState<KYCApplication[]>(initialApplications);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [search, setSearch] = useState("");

  // Rejection modal
  const [rejectingApp, setRejectingApp] = useState<KYCApplication | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  // Document viewer
  const [viewingDoc, setViewingDoc] = useState<{ appName: string; doc: KYCDocument } | null>(null);

  // Stats
  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const approvedCount = 41;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;

  // Filtering
  const filtered = applications.filter((a) => {
    const matchesTab = a.status === activeTab;
    const q = search.toLowerCase();
    const matchesSearch =
      a.restaurantName.toLowerCase().includes(q) ||
      a.ownerName.toLowerCase().includes(q) ||
      a.phone.includes(q);
    return matchesTab && matchesSearch;
  });

  // Approve
  function handleApprove(id: number) {
    setApplications(
      applications.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "approved" as const,
              approvedBy: "Erick Mathew",
              approvedDate: new Date().toISOString().slice(0, 10),
            }
          : a
      )
    );
  }

  // Reject
  function handleReject() {
    if (!rejectingApp) return;
    const reason =
      selectedReason === "nyingine"
        ? customReason
        : rejectionReasons.find((r) => r.value === selectedReason)?.label +
          " — " +
          customReason;

    setApplications(
      applications.map((a) =>
        a.id === rejectingApp.id
          ? {
              ...a,
              status: "rejected" as const,
              rejectionReason: reason || "Imekataliwa na msimamizi",
            }
          : a
      )
    );
    setRejectingApp(null);
    setSelectedReason("");
    setCustomReason("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Uthibitishaji KYC</h1>
        <p className="text-xs text-muted-foreground">
          KYC Verification — Thibitisha na uidhinishe migahawa mipya
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-3">
        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Zinazosubiri</p>
              <p className="text-[10px] text-muted-foreground">Pending</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8712B]/10">
              <svg width="18" height="18" fill="none" stroke="#E8712B" strokeWidth="2">
                <circle cx="9" cy="9" r="8" />
                <path d="M9 5v4l3 2" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#E8712B]">{pendingCount}</p>
        </div>

        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Zimeidhinishwa</p>
              <p className="text-[10px] text-muted-foreground">Approved</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2D7A3A]/10">
              <svg width="18" height="18" fill="none" stroke="#2D7A3A" strokeWidth="2">
                <circle cx="9" cy="9" r="8" />
                <path d="M6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">{approvedCount}</p>
        </div>

        <div className="rounded-xl bg-card p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Zimekataliwa</p>
              <p className="text-[10px] text-muted-foreground">Rejected</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <svg width="18" height="18" fill="none" stroke="#DC2626" strokeWidth="2">
                <circle cx="9" cy="9" r="8" />
                <path d="M6 6l6 6M12 6l-6 6" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">{rejectedCount}</p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {[
            { key: "pending", label: "Zinazosubiri", en: "Pending", count: pendingCount },
            { key: "approved", label: "Zimeidhinishwa", en: "Approved", count: approvedCount },
            { key: "rejected", label: "Zimekataliwa", en: "Rejected", count: rejectedCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`rounded-md px-4 py-2 text-xs font-medium transition ${
                activeTab === tab.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] text-muted-foreground">
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

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
            placeholder="Tafuta mgahawa au mmiliki..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground sm:w-72"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PENDING TAB — Queue Cards
         ══════════════════════════════════════════ */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-xl bg-card p-16 text-center shadow-sm border border-border">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2D7A3A]/10">
                <svg width="28" height="28" fill="none" stroke="#2D7A3A" strokeWidth="1.5">
                  <circle cx="14" cy="14" r="12" />
                  <path d="M10 14l3 3 5-5" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">
                Hakuna maombi yanayosubiri
              </p>
              <p className="text-xs text-muted-foreground">No pending applications</p>
            </div>
          ) : (
            filtered.map((app) => (
              <div
                key={app.id}
                className="rounded-xl bg-card border border-border shadow-sm overflow-hidden"
              >
                {/* Card Header */}
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8712B]/10 text-sm font-bold text-[#E8712B]">
                      {getInitials(app.ownerName)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {app.restaurantName}
                      </h3>
                      <p className="text-sm text-foreground">{app.ownerName}</p>
                      <div className="mt-1 flex flex-wrap gap-3">
                        <span className="text-xs text-muted-foreground">
                          {app.phone}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {app.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8712B]/10 px-3 py-1 text-[10px] font-semibold text-[#E8712B]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E8712B] animate-pulse" />
                      Inasubiri
                    </span>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Imetumwa: {formatDate(app.submittedDate)}
                    </p>
                  </div>
                </div>

                {/* Documents Checklist */}
                <div className="border-t border-border bg-muted/20 px-5 py-4">
                  <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Hati / Documents
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {app.documents.map((doc, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border p-3 ${
                          doc.status === "uploaded"
                            ? "border-[#2D7A3A]/20 bg-[#2D7A3A]/5"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        {/* Document Thumbnail Placeholder */}
                        <div
                          className={`mb-2 flex h-20 items-center justify-center rounded-lg border-2 border-dashed ${
                            doc.status === "uploaded"
                              ? "border-[#2D7A3A]/30 bg-[#2D7A3A]/5"
                              : "border-red-300 bg-red-50"
                          }`}
                        >
                          {doc.status === "uploaded" ? (
                            <svg width="24" height="24" fill="none" stroke="#2D7A3A" strokeWidth="1.5">
                              <rect x="4" y="4" width="16" height="16" rx="2" />
                              <path d="M4 14l4-4 3 3 5-5 4 4" />
                              <circle cx="15" cy="9" r="1.5" />
                            </svg>
                          ) : (
                            <svg width="24" height="24" fill="none" stroke="#DC2626" strokeWidth="1.5">
                              <rect x="4" y="4" width="16" height="16" rx="2" />
                              <path d="M9 9l6 6M15 9l-6 6" />
                            </svg>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-foreground">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {doc.nameEn}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${
                              doc.status === "uploaded"
                                ? "bg-[#2D7A3A]/10 text-[#2D7A3A]"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            <span
                              className={`h-1 w-1 rounded-full ${
                                doc.status === "uploaded"
                                  ? "bg-[#2D7A3A]"
                                  : "bg-red-500"
                              }`}
                            />
                            {doc.status === "uploaded" ? "Imepakiwa" : "Haipo"}
                          </span>
                          {doc.status === "uploaded" && (
                            <button
                              onClick={() =>
                                setViewingDoc({
                                  appName: app.restaurantName,
                                  doc,
                                })
                              }
                              className="rounded-md px-2 py-1 text-[10px] font-medium text-[#2D7A3A] transition hover:bg-[#2D7A3A]/10"
                            >
                              Tazama
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 border-t border-border px-5 py-4">
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="flex-1 rounded-xl bg-[#2D7A3A] py-3 text-sm font-semibold text-white transition hover:bg-[#1B5227]"
                  >
                    Idhinisha (Approve)
                  </button>
                  <button
                    onClick={() => {
                      setRejectingApp(app);
                      setSelectedReason("");
                      setCustomReason("");
                    }}
                    className="flex-1 rounded-xl border-2 border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Kataa (Reject)
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          APPROVED TAB — Table
         ══════════════════════════════════════════ */}
      {activeTab === "approved" && (
        <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
          {/* Table Header */}
          <div className="hidden border-b border-border bg-muted/30 px-5 py-3 lg:grid lg:grid-cols-12 lg:gap-4">
            <p className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mgahawa / Restaurant
            </p>
            <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mmiliki / Owner
            </p>
            <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tarehe ya Kuidhinishwa
            </p>
            <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Imeidhinishwa na
            </p>
            <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Hati
            </p>
            <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Hali
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-sm font-medium text-foreground">
                Hakuna matokeo
              </p>
              <p className="text-xs text-muted-foreground">No results found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-muted/20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-4"
                >
                  {/* Restaurant */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2D7A3A]/10 text-xs font-bold text-[#2D7A3A]">
                      {getInitials(app.restaurantName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {app.restaurantName}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {app.phone}
                      </p>
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground lg:hidden">Mmiliki:</p>
                    <p className="text-sm text-foreground">{app.ownerName}</p>
                  </div>

                  {/* Approved Date */}
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground lg:hidden">
                      Tarehe:
                    </p>
                    <p className="text-sm text-foreground">
                      {app.approvedDate ? formatDate(app.approvedDate) : "—"}
                    </p>
                  </div>

                  {/* Approved By */}
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground lg:hidden">
                      Na:
                    </p>
                    <p className="text-sm text-foreground">
                      {app.approvedBy || "—"}
                    </p>
                  </div>

                  {/* Documents Count */}
                  <div className="col-span-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#2D7A3A]/10 px-2 py-0.5 text-[10px] font-medium text-[#2D7A3A]">
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 2h6v6H2z" />
                      </svg>
                      {app.documents.filter((d) => d.status === "uploaded").length}/3
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-medium text-green-700">
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 5l2.5 2.5L8 3" />
                      </svg>
                      Imeidhinishwa
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          REJECTED TAB — Table
         ══════════════════════════════════════════ */}
      {activeTab === "rejected" && (
        <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
          {/* Table Header */}
          <div className="hidden border-b border-border bg-muted/30 px-5 py-3 lg:grid lg:grid-cols-12 lg:gap-4">
            <p className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mgahawa / Restaurant
            </p>
            <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mmiliki / Owner
            </p>
            <p className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Imetumwa
            </p>
            <p className="col-span-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sababu ya Kukataliwa
            </p>
            <p className="col-span-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Hali
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-sm font-medium text-foreground">
                Hakuna matokeo
              </p>
              <p className="text-xs text-muted-foreground">No results found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-muted/20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-4"
                >
                  {/* Restaurant */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-xs font-bold text-red-600">
                      {getInitials(app.restaurantName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {app.restaurantName}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {app.phone}
                      </p>
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="col-span-2">
                    <p className="text-sm text-foreground">{app.ownerName}</p>
                  </div>

                  {/* Submitted Date */}
                  <div className="col-span-2">
                    <p className="text-sm text-foreground">
                      {formatDate(app.submittedDate)}
                    </p>
                  </div>

                  {/* Rejection Reason */}
                  <div className="col-span-4">
                    <p className="text-xs text-red-600">
                      {app.rejectionReason || "—"}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-medium text-red-600">
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3l4 4M7 3l-4 4" />
                      </svg>
                      Imekataliwa
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          REJECTION REASON MODAL
         ══════════════════════════════════════════ */}
      {rejectingApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setRejectingApp(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <svg width="24" height="24" fill="none" stroke="#DC2626" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 8l8 8M16 8l-8 8" />
              </svg>
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-foreground">
              Kataa Maombi
            </h3>
            <p className="text-center text-xs text-muted-foreground">
              Reject Application — {rejectingApp.restaurantName}
            </p>

            <div className="mt-4 rounded-lg bg-red-50 p-3">
              <p className="text-sm font-medium text-red-700">
                {rejectingApp.restaurantName}
              </p>
              <p className="text-xs text-red-600">
                {rejectingApp.ownerName} - {rejectingApp.phone}
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {/* Reason Dropdown */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Sababu ya Kukataliwa (Rejection Reason){" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                >
                  <option value="">— Chagua sababu —</option>
                  {rejectionReasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label} ({r.labelEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Reason */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Maelezo Zaidi (Additional Details)
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                  placeholder="Andika maelezo zaidi hapa..."
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setRejectingApp(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Ghairi
              </button>
              <button
                onClick={handleReject}
                disabled={!selectedReason}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition ${
                  selectedReason
                    ? "bg-red-600 hover:bg-red-700"
                    : "cursor-not-allowed bg-red-300"
                }`}
              >
                Kataa Maombi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          DOCUMENT VIEWER MODAL
         ══════════════════════════════════════════ */}
      {viewingDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setViewingDoc(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {viewingDoc.doc.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {viewingDoc.doc.nameEn} — {viewingDoc.appName}
                </p>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>

            {/* Document Preview Placeholder */}
            <div className="mt-4 flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
              <div className="text-center">
                <svg
                  className="mx-auto text-muted-foreground"
                  width="48"
                  height="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <rect x="8" y="4" width="32" height="40" rx="3" />
                  <path d="M16 16h16M16 22h16M16 28h10" />
                </svg>
                <p className="mt-2 text-sm text-muted-foreground">
                  Hakikisho la hati
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Document preview placeholder
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setViewingDoc(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Funga
              </button>
              <button className="flex-1 rounded-xl bg-[#2D7A3A] py-2.5 text-sm font-medium text-white transition hover:bg-[#1B5227]">
                Pakua (Download)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
