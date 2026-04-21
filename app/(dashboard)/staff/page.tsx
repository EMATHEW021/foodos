"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface StaffMember {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UserData {
  role: string;
  tenant: { kycStatus: string } | null;
}

export default function StaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");

  async function fetchData() {
    try {
      const [meRes, staffRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/staff"),
      ]);
      const meData = await meRes.json();
      const staffData = await staffRes.json();
      setUser(meData);
      setStaff(staffData.staff || []);
    } catch {
      // Silent
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleAddStaff(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Imeshindikana kuongeza mfanyakazi");
        return;
      }

      setSuccessMsg(`${name} ameongezwa! Anaweza kuingia na email: ${email}`);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("cashier");
      setShowForm(false);
      fetchData();
    } catch {
      setError("Tatizo la mtandao. Jaribu tena.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    try {
      await fetch(`/api/staff/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      fetchData();
    } catch {
      // Silent
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Una uhakika unataka kumfuta mfanyakazi huyu?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStaff((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      // Silent
    }
    setDeleting(null);
  }

  const kycApproved = user?.tenant?.kycStatus === "approved";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  // Block if KYC not approved
  if (!kycApproved) {
    return (
      <div className="mx-auto max-w-lg py-12">
        <div className="rounded-2xl border-2 border-brand-orange/50 bg-brand-orange/5 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10">
            <svg className="h-8 w-8 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="mt-4 text-xl font-bold text-foreground">Timu Imefungwa</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Wasilisha KYC kwanza ili uweze kuunda timu yako.
          </p>
          <p className="text-xs text-muted-foreground">
            Submit KYC first to unlock team creation.
          </p>
          <button
            onClick={() => router.push("/kyc")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-orange/90"
          >
            Wasilisha KYC &rarr;
          </button>
        </div>
      </div>
    );
  }

  const roleLabel = (r: string) => {
    switch (r) {
      case "owner": return "Mkurugenzi";
      case "manager": return "Meneja wa Mauzo";
      case "cashier": return "Karani wa POS";
      default: return r;
    }
  };

  const roleBadge = (r: string) => {
    switch (r) {
      case "owner": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "manager": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "cashier": return "bg-[#2D7A3A]/10 text-[#2D7A3A]";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timu Yangu</h1>
          <p className="text-sm text-muted-foreground">Unda na simamia wafanyakazi wako</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); setSuccessMsg(""); }}
          className="flex items-center gap-2 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green/90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Ongeza Mfanyakazi
        </button>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-4 flex items-start gap-3">
          <svg className="h-5 w-5 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMsg}</p>
            <p className="text-xs text-muted-foreground mt-1">Staff member can now log in with their email and password</p>
          </div>
          <button onClick={() => setSuccessMsg("")} className="ml-auto text-green-600 hover:text-green-800">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Add Staff Form */}
      {showForm && (
        <div className="rounded-2xl border-2 border-brand-green/30 bg-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">Ongeza Mfanyakazi Mpya</h2>
          <p className="text-xs text-muted-foreground mb-5">
            Unda akaunti - mfanyakazi ataingia na email na password
          </p>

          <form onSubmit={handleAddStaff} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Jina Kamili <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amina Juma"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Simu
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0712345678"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. amina@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. changeme123"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                  required
                  minLength={6}
                />
                <p className="mt-1 text-[10px] text-muted-foreground">Mfanyakazi atabadilisha baadaye</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Jukumu (Role) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <label className={`flex-1 cursor-pointer rounded-xl border-2 p-4 text-center transition ${
                  role === "cashier" ? "border-brand-green bg-brand-green/5" : "border-border hover:border-muted-foreground"
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="cashier"
                    checked={role === "cashier"}
                    onChange={() => setRole("cashier")}
                    className="sr-only"
                  />
                  <svg className="mx-auto h-6 w-6 text-brand-green mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm font-semibold text-foreground">Karani wa POS</p>
                  <p className="text-[10px] text-muted-foreground">Cashier</p>
                </label>
                <label className={`flex-1 cursor-pointer rounded-xl border-2 p-4 text-center transition ${
                  role === "manager" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" : "border-border hover:border-muted-foreground"
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="manager"
                    checked={role === "manager"}
                    onChange={() => setRole("manager")}
                    className="sr-only"
                  />
                  <svg className="mx-auto h-6 w-6 text-blue-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm font-semibold text-foreground">Meneja wa Mauzo</p>
                  <p className="text-[10px] text-muted-foreground">Sales Manager</p>
                </label>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Ghairi
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-brand-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-green/90 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Inaunda...
                  </>
                ) : (
                  "Unda Akaunti"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff list */}
      <div className="space-y-3">
        {staff.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <svg className="h-16 w-16 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm font-medium text-muted-foreground">Bado huna wafanyakazi</p>
            <p className="text-xs text-muted-foreground">Bonyeza &quot;Ongeza Mfanyakazi&quot; kuongeza wa kwanza</p>
          </div>
        ) : (
          staff.map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border bg-card p-4 transition hover:shadow-sm ${
                !s.isActive ? "opacity-60 border-border" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                    s.role === "owner" ? "bg-purple-500" : s.role === "manager" ? "bg-blue-500" : "bg-brand-green"
                  }`}>
                    {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{s.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleBadge(s.role)}`}>
                        {roleLabel(s.role)}
                      </span>
                      {!s.isActive && (
                        <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                          Amezimwa
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {s.email && <p className="text-xs text-muted-foreground">{s.email}</p>}
                      {s.phone && <p className="text-xs text-muted-foreground">{s.phone}</p>}
                    </div>
                  </div>
                </div>

                {s.role !== "owner" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(s.id, s.isActive)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        s.isActive
                          ? "border border-yellow-200 dark:border-yellow-800 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          : "border border-green-200 dark:border-green-800 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                      }`}
                    >
                      {s.isActive ? "Zima" : "Washa"}
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={deleting === s.id}
                      className="rounded-lg border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                    >
                      {deleting === s.id ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      ) : (
                        "Futa"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
