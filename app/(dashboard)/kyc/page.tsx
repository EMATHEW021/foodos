"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KYCPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState("not_submitted");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form fields
  const [nidaNumber, setNidaNumber] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopType, setShopType] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.tenant) {
          setKycStatus(data.tenant.kycStatus || "not_submitted");
          // Pre-fill if already has data (for resubmission after rejection)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Also fetch tenant details for pre-fill on rejection resubmit
  useEffect(() => {
    if (kycStatus === "rejected") {
      fetch("/api/kyc/status")
        .then((r) => r.json())
        .then((data) => {
          if (data.rejectionReason) setRejectionReason(data.rejectionReason);
        })
        .catch(() => {});
    }
  }, [kycStatus]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nidaNumber, shopAddress, shopType }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Imeshindikana kutuma KYC");
        return;
      }

      setSuccess(true);
      setKycStatus("submitted");
    } catch {
      setError("Tatizo la mtandao. Jaribu tena.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  // Already submitted - show status
  if (kycStatus === "submitted" || success) {
    return (
      <div className="mx-auto max-w-lg py-12">
        <div className="rounded-2xl border-2 border-yellow-400/50 bg-yellow-50 dark:bg-yellow-900/10 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800/30">
            <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="mt-4 text-xl font-bold text-foreground">KYC Imewasilishwa!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Maombi yako yanakaguliwa. Utapata barua pepe inapoidhinishwa.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your application is under review. You&apos;ll receive an email when approved.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-green px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green/90"
          >
            &larr; Rudi Dashibodi
          </button>
        </div>
      </div>
    );
  }

  // Approved - redirect to dashboard
  if (kycStatus === "approved") {
    router.push("/dashboard");
    return null;
  }

  // Form (not_submitted or rejected)
  const shopTypes = [
    "Mgahawa (Restaurant)",
    "Cafe",
    "Bar & Restaurant",
    "Fast Food",
    "Mama Lishe",
    "Klabu (Club/Lounge)",
    "Hotel",
    "Catering",
    "Food Truck",
    "Nyingine (Other)",
  ];

  return (
    <div className="mx-auto max-w-lg py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Rudi
        </button>
        <h1 className="text-2xl font-bold text-foreground">Wasilisha KYC</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Thibitisha biashara yako ili uweze kuunda timu
        </p>
        <p className="text-xs text-muted-foreground">
          Verify your business to unlock team creation
        </p>
      </div>

      {/* Rejection notice */}
      {kycStatus === "rejected" && (
        <div className="mb-6 rounded-xl border-2 border-red-300 bg-red-50 dark:bg-red-900/10 p-4">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">KYC Imekataliwa</p>
              {rejectionReason && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-300">Sababu: {rejectionReason}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">Tafadhali sahihisha na uwasilishe tena.</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NIDA Number */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Namba ya NIDA <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nidaNumber}
            onChange={(e) => setNidaNumber(e.target.value)}
            placeholder="e.g. 19900101-12345-00001-01"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
            required
          />
          <p className="mt-1 text-[11px] text-muted-foreground">National ID (NIDA) number</p>
        </div>

        {/* Shop Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Aina ya Biashara <span className="text-red-500">*</span>
          </label>
          <select
            value={shopType}
            onChange={(e) => setShopType(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
            required
          >
            <option value="">-- Chagua aina --</option>
            {shopTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-muted-foreground">Business type</p>
        </div>

        {/* Shop Address */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Anwani ya Biashara <span className="text-red-500">*</span>
          </label>
          <textarea
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
            placeholder="e.g. Sinza Kwa Remmy, Dar es Salaam"
            rows={3}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green resize-none"
            required
          />
          <p className="mt-1 text-[11px] text-muted-foreground">Physical address of your business</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-brand-green py-3.5 text-sm font-bold text-white transition hover:bg-brand-green/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Inatuma...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Wasilisha KYC
            </>
          )}
        </button>
      </form>

      {/* Info box */}
      <div className="mt-6 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4">
        <div className="flex items-start gap-3">
          <svg className="mt-0.5 h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Kwa nini KYC?</p>
            <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
              Tunathibitisha biashara yako ili kulinda wateja na kutoa huduma bora zaidi.
              Baada ya kuidhinishwa, utaweza kuunda timu yako.
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              We verify your business to protect customers and provide better services.
              After approval, you can create your team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
