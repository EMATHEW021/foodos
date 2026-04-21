"use client";

import { useState, useEffect } from "react";

interface KYCApplication {
  id: string;
  name: string;
  phone: string;
  city: string;
  nidaNumber: string | null;
  shopType: string | null;
  shopAddress: string | null;
  kycStatus: string;
  kycSubmittedAt: string | null;
  kycRejectionReason: string | null;
  owner: { name: string; email: string | null; phone: string } | null;
}

export default function AdminKYCPage() {
  const [tab, setTab] = useState<"submitted" | "approved" | "rejected">("submitted");
  const [applications, setApplications] = useState<KYCApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detail, setDetail] = useState<KYCApplication | null>(null);

  async function fetchData(status: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/kyc?status=${status}`);
      const data = await res.json();
      setApplications(data.applications || []);
    } catch {
      // Silent
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData(tab);
  }, [tab]);

  async function handleApprove(id: string) {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/kyc/${id}/approve`, { method: "POST" });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
        setDetail(null);
      }
    } catch {
      // Silent
    }
    setActing(null);
  }

  async function handleReject() {
    if (!rejectId) return;
    setActing(rejectId);
    try {
      const res = await fetch(`/api/admin/kyc/${rejectId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== rejectId));
        setRejectId(null);
        setRejectReason("");
        setDetail(null);
      }
    } catch {
      // Silent
    }
    setActing(null);
  }

  function formatDate(d: string | null) {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("sw-TZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">KYC - Uthibitisho</h1>
        <p className="text-sm text-muted-foreground">Kagua na uidhinishe KYC za migahawa</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-muted/30 p-1 w-fit">
        {(["submitted", "approved", "rejected"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "submitted" ? "Zinasubiri" : t === "approved" ? "Zimeidhinishwa" : "Zimekataliwa"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2D7A3A] border-t-transparent" />
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20">
          <svg className="h-12 w-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-muted-foreground">
            Hakuna maombi {tab === "submitted" ? "yanayosubiri" : tab === "approved" ? "yaliyoidhinishwa" : "yaliyokataliwa"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border border-border bg-card overflow-hidden transition hover:shadow-md"
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2D7A3A]/10 text-sm font-bold text-[#2D7A3A]">
                    {app.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">{app.name}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      {app.owner && (
                        <span className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{app.owner.name}</span>
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{app.city}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(app.kycSubmittedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetail(detail?.id === app.id ? null : app)}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    {detail?.id === app.id ? "Funga" : "Maelezo"}
                  </button>
                  {tab === "submitted" && (
                    <>
                      <button
                        onClick={() => handleApprove(app.id)}
                        disabled={acting === app.id}
                        className="flex items-center gap-1.5 rounded-lg bg-[#2D7A3A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1B5227] disabled:opacity-50"
                      >
                        {acting === app.id ? (
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        Idhinisha
                      </button>
                      <button
                        onClick={() => { setRejectId(app.id); setRejectReason(""); }}
                        className="rounded-lg border border-red-200 dark:border-red-800 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Kataa
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Detail panel */}
              {detail?.id === app.id && (
                <div className="border-t border-border bg-muted/10 p-5">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">NIDA</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{app.nidaNumber || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Aina ya Biashara</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{app.shopType || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Simu ya Biashara</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{app.phone || "-"}</p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Anwani</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{app.shopAddress || "-"}</p>
                    </div>
                    {app.owner?.email && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email ya Mmiliki</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{app.owner.email}</p>
                      </div>
                    )}
                    {app.owner?.phone && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Simu ya Mmiliki</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{app.owner.phone}</p>
                      </div>
                    )}
                    {app.kycRejectionReason && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500">Sababu ya Kukataliwa</p>
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{app.kycRejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">Kataa KYC</h3>
            <p className="mt-1 text-sm text-muted-foreground">Andika sababu ya kukataa</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. NIDA number is invalid, please resubmit..."
              rows={3}
              className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
            />
            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => { setRejectId(null); setRejectReason(""); }}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Ghairi
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || acting === rejectId}
                className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {acting === rejectId && (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Kataa KYC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
