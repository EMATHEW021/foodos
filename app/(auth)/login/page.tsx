"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"input" | "otp" | "forgot">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [biometricError, setBiometricError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkBiometric() {
      if (
        typeof window !== "undefined" &&
        window.PublicKeyCredential &&
        typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function"
      ) {
        try {
          const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricSupported(available);
        } catch {
          setBiometricSupported(false);
        }
      }
    }
    checkBiometric();
  }, []);

  function formatPhone(input: string): string {
    let cleaned = input.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
    if (cleaned.startsWith("0")) cleaned = "+255" + cleaned.slice(1);
    else if (cleaned.startsWith("255")) cleaned = "+" + cleaned;
    else if (!cleaned.startsWith("+")) cleaned = "+255" + cleaned;
    return cleaned;
  }

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (method === "phone") {
      const formattedPhone = formatPhone(phone);
      const { error: err } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
      if (err) { setError(err.message); setLoading(false); return; }
    } else {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (err) { setError(err.message); setLoading(false); return; }
    }

    setStep("otp");
    setLoading(false);
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (method === "phone") {
      const { error: err } = await supabase.auth.verifyOtp({
        phone: formatPhone(phone),
        token: otp,
        type: "sms",
      });
      if (err) { setError(err.message); setLoading(false); return; }
    } else {
      const { error: err } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (err) { setError(err.message); setLoading(false); return; }
    }

    router.push("/dashboard");
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (method === "phone") {
      const { error: err } = await supabase.auth.signInWithOtp({ phone: formatPhone(phone) });
      if (err) { setError(err.message); setLoading(false); return; }
    } else {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (err) { setError(err.message); setLoading(false); return; }
    }

    setSuccess(method === "phone" ? "OTP imetumwa kwenye simu yako." : "OTP imetumwa kwenye email yako.");
    setStep("otp");
    setLoading(false);
  }

  async function handleBiometricLogin() {
    setBiometricLoading(true);
    setError("");
    setBiometricError("");
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          rpId: window.location.hostname,
          userVerification: "required",
        },
      });
      if (credential) {
        setBiometricSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1200);
      } else {
        setBiometricError("Uthibitisho umeshindwa. Jaribu tena.");
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setBiometricError("Umeghairi uthibitisho.");
      } else {
        setBiometricError("Uthibitisho umeshindwa. Jaribu tena au tumia OTP.");
      }
    } finally {
      setBiometricLoading(false);
    }
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

  const inputValue = method === "phone" ? phone : email;
  const inputValid = method === "phone" ? phone.length >= 9 : email.includes("@");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-cream px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/8 blur-[120px]" />
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

        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Image src="/images/logo.svg" alt="FoodOS" width={44} height={44} />
            <h1 className="text-3xl font-bold text-brand-charcoal">
              Food<span className="text-brand-orange">OS</span>
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {step === "forgot"
              ? "Pata tena akaunti yako (Recover Account)"
              : "Ingia kwenye akaunti yako (Login)"}
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
          {/* Method Toggle — Phone / Email */}
          {step !== "otp" && (
            <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => { setMethod("phone"); setError(""); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                  method === "phone"
                    ? "bg-white text-brand-charcoal shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
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
                  method === "email"
                    ? "bg-white text-brand-charcoal shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Email
              </button>
            </div>
          )}

          {step === "input" ? (
            <form onSubmit={handleSendOTP}>
              {method === "phone" ? (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Namba ya Simu (Phone Number)
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-600">+255</span>
                    <input
                      type="tel"
                      placeholder="0741234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                    />
                  </div>
                  {phone.length >= 9 && (
                    <p className="mt-1 text-xs text-gray-400">{getProvider(phone)}</p>
                  )}
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Barua pepe (Email Address)
                  </label>
                  <input
                    type="email"
                    placeholder="salma@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                  />
                </>
              )}

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || !inputValid}
                className="mt-6 w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark disabled:opacity-50"
              >
                {loading ? "Inatuma..." : "Tuma OTP (Send OTP)"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("forgot"); setError(""); }}
                className="mt-3 w-full text-xs text-gray-400 transition hover:text-brand-green"
              >
                Umesahau nywila? (Forgot password?)
              </button>
            </form>
          ) : step === "forgot" ? (
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4 rounded-xl bg-brand-green/5 p-4">
                <p className="text-sm text-gray-600">
                  {method === "phone"
                    ? "Ingiza namba yako ya simu. Tutakutumia OTP mpya ya kuingia."
                    : "Ingiza email yako. Tutakutumia OTP mpya ya kuingia."}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {method === "phone"
                    ? "Enter your phone number. We'll send a new OTP."
                    : "Enter your email. We'll send a new OTP."}
                </p>
              </div>

              {method === "phone" ? (
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-600">+255</span>
                  <input
                    type="tel"
                    placeholder="0741234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                  />
                </div>
              ) : (
                <input
                  type="email"
                  placeholder="salma@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                />
              )}

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              {success && <p className="mt-3 text-sm text-brand-green">{success}</p>}

              <button
                type="submit"
                disabled={loading || !inputValid}
                className="mt-6 w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark disabled:opacity-50"
              >
                {loading ? "Inatuma..." : "Tuma OTP Mpya (Send Reset OTP)"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("input"); setError(""); setSuccess(""); }}
                className="mt-3 w-full text-sm text-gray-500 transition hover:text-brand-green"
              >
                Rudi kwenye kuingia (Back to login)
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <p className="text-sm text-gray-600">
                {method === "phone"
                  ? <>Tumekutumia SMS kwenye <strong>{formatPhone(phone)}</strong></>
                  : <>Tumekutumia OTP kwenye <strong>{email}</strong></>}
              </p>
              {success && <p className="mt-2 text-sm text-brand-green">{success}</p>}

              <label className="mt-4 block text-sm font-medium text-gray-700">
                Ingiza Nambari ya OTP
              </label>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-center text-2xl tracking-[0.5em] transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                maxLength={6}
              />

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="mt-6 w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark disabled:opacity-50"
              >
                {loading ? "Inathibitisha..." : "Thibitisha (Verify)"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("input"); setOtp(""); setError(""); setSuccess(""); }}
                className="mt-3 w-full text-sm text-gray-500 transition hover:text-brand-green"
              >
                {method === "phone" ? "Badilisha namba (Change number)" : "Badilisha email (Change email)"}
              </button>
            </form>
          )}

          {/* Biometric Login */}
          {biometricSupported && step === "input" && (
            <>
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-medium text-gray-400">&mdash; au / or &mdash;</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {biometricSuccess ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
                    <svg className="h-7 w-7 text-brand-green" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-brand-green">Umethibitishwa! Inaelekeza...</p>
                  <p className="text-[11px] text-brand-green/60">Authenticated! Redirecting...</p>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    disabled={biometricLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-brand-green/20 bg-brand-green/5 py-3 text-sm font-semibold text-brand-green transition hover:border-brand-green/40 hover:bg-brand-green/10 disabled:opacity-50"
                  >
                    <svg
                      className={`h-6 w-6 text-brand-green ${biometricLoading ? "animate-pulse" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a48.667 48.667 0 00-1.26 10.802M12 2.25c.477 0 .945.043 1.4.126M12 2.25a7.5 7.5 0 00-7.5 7.5c0 .672.034 1.336.1 1.99M12 2.25c-2.036 0-3.9.81-5.258 2.126M12 10.5a2.25 2.25 0 00-2.25 2.25c0 1.81-.2 3.576-.577 5.272M12 10.5c1.243 0 2.25 1.007 2.25 2.25 0 3.156-.382 6.217-1.103 9.138M15 3.375c1.862.86 3.356 2.345 4.236 4.197M9.832 5.893a5.25 5.25 0 017.418 5.857M6.75 10.5a5.25 5.25 0 018.646-4.016M4.5 12.776c.186 1.652.46 3.274.82 4.86M7.5 16.5c.28-1.462.472-2.96.572-4.486" />
                    </svg>
                    <div className="text-left">
                      <span className="block leading-tight">
                        {biometricLoading ? "Inathibitisha..." : "Ingia kwa Alama ya Kidole"}
                      </span>
                      <span className="block text-[11px] font-normal text-brand-green/60">
                        {biometricLoading ? "Authenticating..." : "Biometric Login"}
                      </span>
                    </div>
                  </button>
                  {biometricError && (
                    <p className="mt-2 text-center text-xs text-red-500/80">{biometricError}</p>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Huna akaunti?{" "}
          <Link href="/register" className="font-medium text-brand-green hover:text-brand-green-dark">
            Jisajili hapa (Register)
          </Link>
        </p>
      </div>
    </div>
  );
}
