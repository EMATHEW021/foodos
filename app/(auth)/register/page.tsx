"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function PasswordMeter({ password }: { password: string }) {
  const checks = [
    { label: "Herufi 8+", labelEn: "8+ characters", pass: password.length >= 8 },
    { label: "Herufi kubwa", labelEn: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Herufi ndogo", labelEn: "Lowercase", pass: /[a-z]/.test(password) },
    { label: "Nambari", labelEn: "Number", pass: /\d/.test(password) },
    { label: "Alama maalum", labelEn: "Special char", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const strength = score <= 1 ? "Dhaifu (Weak)" : score <= 3 ? "Wastani (Fair)" : score <= 4 ? "Nzuri (Good)" : "Imara Sana (Strong)";
  const color = score <= 1 ? "bg-red-500" : score <= 3 ? "bg-yellow-500" : score <= 4 ? "bg-brand-green" : "bg-brand-green";

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= score ? color : "bg-gray-200"}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${score <= 1 ? "text-red-500" : score <= 3 ? "text-yellow-600" : "text-brand-green"}`}>
        {strength}
      </p>
      {/* Check list */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        {checks.map((c) => (
          <div key={c.labelEn} className="flex items-center gap-1.5">
            {c.pass ? (
              <svg className="h-3 w-3 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-3 w-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={`text-[11px] ${c.pass ? "text-brand-green" : "text-gray-400"}`}>
              {c.label} ({c.labelEn})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
    email: "",
    password: "",
    city: "Dar es Salaam",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  function formatPhone(input: string): string {
    let cleaned = input.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
    if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
    if (cleaned.startsWith("255") && cleaned.length >= 12) return "+" + cleaned;
    if (cleaned.startsWith("0") && cleaned.length >= 10) return "+255" + cleaned.slice(1);
    if (/^[67]\d{8}$/.test(cleaned)) return "+255" + cleaned;
    return "+255" + cleaned;
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

  const passwordScore = [
    formData.password.length >= 8,
    /[A-Z]/.test(formData.password),
    /[a-z]/.test(formData.password),
    /\d/.test(formData.password),
    /[^A-Za-z0-9]/.test(formData.password),
  ].filter(Boolean).length;

  const formValid =
    formData.restaurantName &&
    formData.ownerName &&
    formData.email.includes("@") &&
    formData.password.length >= 8 &&
    passwordScore >= 3;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign up with email + password via Supabase
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        phone: formData.phone ? formatPhone(formData.phone) : undefined,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      setStep("otp");
    } catch {
      setError("Kuna tatizo. Jaribu tena. (Something went wrong. Try again.)");
    }
    setLoading(false);
  }

  async function handleVerifyAndCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: verifyError } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otp,
        type: "email",
      });

      if (verifyError) {
        setError(verifyError.message);
        setLoading(false);
        return;
      }

      // Create tenant + user via API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: formData.restaurantName,
          ownerName: formData.ownerName,
          phone: formData.phone ? formatPhone(formData.phone) : "",
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

      // Send welcome email to restaurant owner
      fetch("/api/email/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          ownerName: formData.ownerName,
          restaurantName: formData.restaurantName,
        }),
      }).catch(() => {});

      // Notify super admin about new application
      fetch("/api/email/admin-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: formData.restaurantName,
          ownerName: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
        }),
      }).catch(() => {});

      // Go straight to dashboard
      router.push("/dashboard");
    } catch {
      setError("Usajili umeshindwa. Jaribu tena. (Registration failed.)");
    }
    setLoading(false);
  }

  async function handleResendOTP() {
    setLoading(true);
    setError("");
    try {
      const { error: err } = await supabase.auth.resend({ type: "signup", email: formData.email });
      if (err) setError(err.message);
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
            <Image src="/images/logo.png" alt="FoodOS" width={44} height={44} className="h-11 w-11 rounded-lg object-contain" />
            <h1 className="text-3xl font-bold text-brand-charcoal">
              Food<span className="text-brand-orange">OS</span>
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Sajili Mgahawa Wako (Register Your Restaurant)</p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
          {step === "success" ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10">
                <svg className="h-8 w-8 text-brand-orange" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-brand-charcoal">Ombi Limewasilishwa!</h2>
              <p className="text-center text-sm text-gray-500">
                Ombi lako la mgahawa limepokelewa. Tutakutumia barua pepe utakapoidhinishwa.
              </p>
              <p className="text-center text-xs text-gray-400">
                Your restaurant application has been submitted. You&apos;ll receive an email when approved.
              </p>
              <div className="mt-2 rounded-xl bg-brand-green/5 px-4 py-3 text-center">
                <p className="text-xs text-gray-500">
                  Muda wa kawaida wa kuidhinishwa ni masaa 24.
                </p>
                <p className="text-[10px] text-gray-400">
                  Typical approval time is within 24 hours.
                </p>
              </div>
            </div>
          ) : step === "form" ? (
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Barua pepe (Email) <span className="text-red-500">*</span>
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nywila (Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Chagua nywila imara..."
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-12 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                <PasswordMeter password={formData.password} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Namba ya Simu (Phone — Si lazima / Optional)
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
                {formData.phone.length >= 9 && (
                  <p className="mt-1 text-xs text-gray-400">{getProvider(formData.phone)}</p>
                )}
              </div>

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

              <div className="rounded-xl bg-brand-green/5 p-3">
                <p className="text-xs text-gray-500">
                  Tutakutumia OTP kwenye email yako kwa uthibitisho.
                  <span className="text-gray-400"> (We&apos;ll send an OTP to your email to verify.)</span>
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
          ) : (
            <form onSubmit={handleVerifyAndCreate}>
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-brand-green/5 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                  <svg className="h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-charcoal">Thibitisha akaunti yako</p>
                  <p className="text-xs text-gray-500">Verify your account to complete registration</p>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Tumekutumia OTP kwenye <strong>{formData.email}</strong>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                We sent a verification code to your email.
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
                  Rudi nyuma (Go back)
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-brand-green transition hover:text-brand-green-dark disabled:opacity-50"
                >
                  Tuma tena OTP (Resend)
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
