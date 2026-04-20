"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
    email: "",
    city: "Dar es Salaam",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  function formatPhone(input: string): string {
    let cleaned = input.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
    if (cleaned.startsWith("0")) cleaned = "+255" + cleaned.slice(1);
    else if (cleaned.startsWith("255")) cleaned = "+" + cleaned;
    else if (!cleaned.startsWith("+")) cleaned = "+255" + cleaned;
    return cleaned;
  }

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
  }

  function getProvider(ph: string): string {
    const cleaned = ph.replace(/\D/g, "");
    const prefix = cleaned.slice(-9, -7);
    if (["74", "75"].includes(prefix)) return "M-Pesa";
    if (["71", "65"].includes(prefix)) return "Tigo Pesa";
    if (["68", "69"].includes(prefix)) return "Airtel Money";
    if (["62"].includes(prefix)) return "HaloPesa";
    return "";
  }

  const contactValid = method === "phone" ? formData.phone.length >= 9 : formData.email.includes("@");
  const formValid = formData.restaurantName && formData.ownerName && contactValid;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (method === "phone") {
        const formattedPhone = formatPhone(formData.phone);
        const { error: err } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
        if (err) { setError(err.message); setLoading(false); return; }
      } else {
        if (!formData.email) { setError("Email is required"); setLoading(false); return; }
        const { error: err } = await supabase.auth.signInWithOtp({
          email: formData.email,
          options: { shouldCreateUser: true },
        });
        if (err) { setError(err.message); setLoading(false); return; }
      }
      setStep("otp");
    } catch {
      setError("Kuna tatizo. Jaribu tena.");
    }
    setLoading(false);
  }

  async function handleVerifyAndCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let authData;

      if (method === "phone") {
        const { data, error: err } = await supabase.auth.verifyOtp({
          phone: formatPhone(formData.phone),
          token: otp,
          type: "sms",
        });
        if (err) { setError(err.message); setLoading(false); return; }
        authData = data;
      } else {
        const { data, error: err } = await supabase.auth.verifyOtp({
          email: formData.email,
          token: otp,
          type: "email",
        });
        if (err) { setError(err.message); setLoading(false); return; }
        authData = data;
      }

      // Create tenant + user via API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: formData.restaurantName,
          ownerName: formData.ownerName,
          phone: method === "phone" ? formatPhone(formData.phone) : formData.phone || "",
          email: formData.email,
          city: formData.city,
          slug: generateSlug(formData.restaurantName),
          authId: authData.user?.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Send welcome email if email provided
      if (formData.email) {
        fetch("/api/email/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formData.email,
            name: formData.ownerName,
            restaurantName: formData.restaurantName,
          }),
        }).catch(() => {}); // fire and forget
      }

      setStep("success");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      setError("Usajili umeshindwa. Jaribu tena.");
    }
    setLoading(false);
  }

  async function handleResendOTP() {
    setLoading(true);
    setError("");
    try {
      if (method === "phone") {
        const { error: err } = await supabase.auth.signInWithOtp({ phone: formatPhone(formData.phone) });
        if (err) { setError(err.message); setLoading(false); return; }
      } else {
        const { error: err } = await supabase.auth.signInWithOtp({
          email: formData.email,
          options: { shouldCreateUser: true },
        });
        if (err) { setError(err.message); setLoading(false); return; }
      }
      setError("");
    } catch {
      setError("Imeshindwa kutuma tena.");
    }
    setLoading(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-cream px-4 py-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-brand-orange/5 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back arrow */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand-green"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Rudi Nyumbani
        </Link>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Image src="/images/logo.png" alt="FoodOS" width={44} height={44} />
            <h1 className="text-3xl font-bold text-brand-charcoal">
              Food<span className="text-brand-orange">OS</span>
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Sajili Mgahawa Wako (Register Your Restaurant)</p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
          {step === "success" ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                <svg className="h-8 w-8 text-brand-green" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-brand-charcoal">Hongera! (Congratulations!)</h2>
              <p className="text-center text-sm text-gray-500">
                Mgahawa wako umesajiliwa. Unaelekezwa kwenye Dashboard...
              </p>
              <p className="text-center text-xs text-gray-400">
                Your restaurant is registered. Redirecting to Dashboard...
              </p>
              <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full animate-[progress_2s_ease-in-out] rounded-full bg-brand-green" style={{ animation: "progress 2s ease-in-out forwards" }} />
              </div>
            </div>
          ) : step === "form" ? (
            <>
              {/* Method Toggle */}
              <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => { setMethod("phone"); setError(""); }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                    method === "phone" ? "bg-white text-brand-charcoal shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                  Simu
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod("email"); setError(""); }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                    method === "email" ? "bg-white text-brand-charcoal shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  Email
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Jina la Mgahawa (Restaurant Name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mama Salma Kitchen"
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Jina Lako (Your Name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Salma Hassan"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                    required
                  />
                </div>

                {method === "phone" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Namba ya Simu (Phone)
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-600">+255</span>
                      <input
                        type="tel"
                        placeholder="0741234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                        required
                      />
                    </div>
                    {formData.phone.length >= 9 && (
                      <p className="mt-1 text-xs text-gray-400">{getProvider(formData.phone)}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Barua pepe (Email Address)
                    </label>
                    <input
                      type="email"
                      placeholder="salma@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                      required
                    />
                  </div>
                )}

                {/* Optional: show the other field */}
                {method === "phone" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email (Si lazima — Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="salma@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                    />
                  </div>
                )}
                {method === "email" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Namba ya Simu (Si lazima — Optional)
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-600">+255</span>
                      <input
                        type="tel"
                        placeholder="0741234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Jiji (City)
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                  >
                    <option>Dar es Salaam</option>
                    <option>Arusha</option>
                    <option>Mwanza</option>
                    <option>Dodoma</option>
                    <option>Zanzibar</option>
                    <option>Mbeya</option>
                    <option>Morogoro</option>
                    <option>Tanga</option>
                  </select>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                {/* Info box */}
                <div className="rounded-xl bg-brand-green/5 p-3">
                  <p className="text-xs text-gray-500">
                    {method === "phone"
                      ? "Tutakutumia SMS ya OTP kwa uthibitisho (We'll send an SMS OTP to verify)"
                      : "Tutakutumia OTP kwenye email yako kwa uthibitisho (We'll send an OTP to your email to verify)"}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !formValid}
                  className="mt-2 w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark disabled:opacity-50"
                >
                  {loading ? "Inatuma OTP..." : "Endelea — Tuma OTP (Continue)"}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyAndCreate}>
              {/* OTP Verification Step */}
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-brand-green/5 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                  <svg className="h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-charcoal">Thibitisha akaunti yako</p>
                  <p className="text-xs text-gray-500">Verify your account to continue</p>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                {method === "phone"
                  ? <>Tumekutumia SMS kwenye <strong>{formatPhone(formData.phone)}</strong></>
                  : <>Tumekutumia OTP kwenye <strong>{formData.email}</strong></>}
              </p>

              <label className="mt-4 block text-sm font-medium text-gray-700">
                Ingiza Nambari ya OTP (Enter OTP Code)
              </label>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-2xl tracking-[0.5em] transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                maxLength={6}
                autoFocus
              />

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="mt-6 w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark disabled:opacity-50"
              >
                {loading ? "Inasajili..." : "Thibitisha na Sajili (Verify & Register)"}
              </button>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setStep("form"); setOtp(""); setError(""); }}
                  className="text-sm text-gray-500 transition hover:text-brand-green"
                >
                  Rudi nyuma
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-brand-green transition hover:text-brand-green-dark disabled:opacity-50"
                >
                  Tuma tena OTP
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Una akaunti tayari?{" "}
          <Link href="/login" className="font-medium text-brand-green hover:text-brand-green-dark">
            Ingia hapa (Login)
          </Link>
        </p>
      </div>
    </div>
  );
}
