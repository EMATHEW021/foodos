"use client";

import { useState, useEffect, useCallback } from "react";

interface Application {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email: string | null;
  city: string;
  approvalStatus: string;
  createdAt: string;
  approvedAt: string | null;
  rejectionReason: string | null;
  owner: {
    id: string;
    name: string;
    email: string | null;
    phone: string;
  } | null;
}

type StatusFilter = "pending" | "approved" | "rejected" | "all";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Application | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = filter === "all" ? "pending" : filter;
      const urls =
        filter === "all"
          ? ["/api/admin/applications?status=pending", "/api/admin/applications?status=approved", "/api/admin/applications?status=rejected"]
          : [`/api/admin/applications?status=${statusParam}`];

      const results = await Promise.all(urls.map((u) => fetch(u).then((r) => r.json())));
      const all = results.flatMap((r) => r.applications || []);
      all.sort((a: Application, b: Application) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setApplications(all);
    } catch {
      setApplications([]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  async function handleApprove(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}/approve`, { method: "POST" });
      if (res.ok) {
        setSuccessMessage("Mgahawa umeidhinishwa! (Restaurant approved!)");
        setTimeout(() => setSuccessMessage(""), 3000);
        fetchApplications();
      }
    } catch {
      // Error handled silently
    }
    setActionLoading(null);
  }

  async function handleReject(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (res.ok) {
        setSuccessMessage("Ombi limekataliwa. (Application rejected.)");
        setTimeout(() => setSuccessMessage(""), 3000);
        setRejectTarget(null);
        setRejectReason("");
        fetchApplications();
      }
    } catch {
      // Error handled silently
    }
    setActionLoading(null);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Dakika ${minutes} zilizopita`;
    if (hours < 24) return `Saa ${hours} zilizopita`;
    if (days < 7) return `Siku ${days} zilizopita`;
    return d.toLocaleDateString("sw-TZ", { day: "2-digit", month: "short", year: "numeric" });
  }

  function getStatusConfig(status: string) {
    switch (status) {
      case "pending":
        return { label: "Inasubiri", bg: "bg-amber-500/10", text: "text-amber-500", dot: "bg-amber-500" };
      case "approved":
        return { label: "Imeidhinishwa", bg: "bg-emerald-500/10", text: "text-emerald-500", dot: "bg-emerald-500" };
      case "rejected":
        return { label: "Imekataliwa", bg: "bg-red-500/10", text: "text-red-500", dot: "bg-red-500" };
      default:
        return { label: status, bg: "bg-gray-500/10", text: "text-gray-500", dot: "bg-gray-500" };
    }
  }

  const pendingCount = applications.filter((a) => a.approvalStatus === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maombi ya Migahawa</h1>
          <p className="text-sm text-muted-foreground">
            Simamia maombi ya usajili wa migahawa mpya
          </p>
        </div>
        {pendingCount > 0 && filter !== "pending" && (
          <button
            onClick={() => setFilter("pending")}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-500/20"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            </span>
            {pendingCount} Inasubiri Idhini
          </button>
        )}
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-900/20">
          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{successMessage}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1.5">
        {([
          { value: "pending" as StatusFilter, label: "Inasubiri", icon: "clock" },
          { value: "approved" as StatusFilter, label: "Imeidhinishwa", icon: "check" },
          { value: "rejected" as StatusFilter, label: "Imekataliwa", icon: "x" },
          { value: "all" as StatusFilter, label: "Yote", icon: "list" },
        ] as const).map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              filter === tab.value
                ? "bg-[#2D7A3A] text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            {tab.icon === "clock" && (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {tab.icon === "check" && (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {tab.icon === "x" && (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {tab.icon === "list" && (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2D7A3A] border-t-transparent" />
            <p className="text-sm text-muted-foreground">Inapakia maombi...</p>
          </div>
        </div>
      ) : applications.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">Hakuna Maombi</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {filter === "pending"
              ? "Hakuna maombi yanayosubiri kwa sasa"
              : filter === "approved"
              ? "Hakuna maombi yaliyoidhinishwa"
              : filter === "rejected"
              ? "Hakuna maombi yaliyokataliwa"
              : "Hakuna maombi yoyote"}
          </p>
        </div>
      ) : (
        /* Applications list */
        <div className="space-y-3">
          {applications.map((app) => {
            const sc = getStatusConfig(app.approvalStatus);
            const isProcessing = actionLoading === app.id;

            return (
              <div
                key={app.id}
                className={`rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md ${
                  app.approvalStatus === "pending" ? "border-l-4 border-l-amber-500" : ""
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: Restaurant info */}
                  <div className="flex items-start gap-4">
                    {/* Logo placeholder */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2D7A3A]/10 text-sm font-bold text-[#2D7A3A]">
                      {app.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-foreground">{app.name}</h3>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </div>

                      {/* Owner info */}
                      {app.owner && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {app.owner.name}
                          </span>
                          {app.owner.email && (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {app.owner.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {app.owner.phone || app.phone}
                          </span>
                        </div>
                      )}

                      {/* City & Date */}
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {app.city}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(app.createdAt)}
                        </span>
                      </div>

                      {/* Rejection reason */}
                      {app.rejectionReason && (
                        <div className="mt-1 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-900/20">
                          <p className="text-xs text-red-600 dark:text-red-400">
                            Sababu: {app.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  {app.approvalStatus === "pending" && (
                    <div className="flex shrink-0 gap-2 sm:flex-col">
                      <button
                        onClick={() => handleApprove(app.id)}
                        disabled={isProcessing}
                        className="flex items-center gap-2 rounded-lg bg-[#2D7A3A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1B5227] disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        Idhinisha
                      </button>
                      <button
                        onClick={() => setRejectTarget(app)}
                        disabled={isProcessing}
                        className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Kataa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setRejectTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">Kataa Ombi?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ombi la <span className="font-semibold text-foreground">{rejectTarget.name}</span> litakataliwa.
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-muted-foreground">
                Sababu ya Kukataa (Rejection Reason)
              </label>
              <textarea
                rows={3}
                placeholder="Andika sababu ya kukataa ombi hili..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-[#2D7A3A] focus:outline-none focus:ring-2 focus:ring-[#2D7A3A]/20"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setRejectTarget(null);
                  setRejectReason("");
                }}
                className="flex-1 rounded-lg border border-border bg-card py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Ghairi
              </button>
              <button
                onClick={() => handleReject(rejectTarget.id)}
                disabled={actionLoading === rejectTarget.id}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === rejectTarget.id ? "Inakataa..." : "Kataa Ombi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
