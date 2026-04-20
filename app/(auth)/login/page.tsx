"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"input" | "forgot" | "otp" | "newpass" | "done">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [biometricError, setBiometricError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

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

  // Detect if input is email or phone
  const isEmail = identifier.includes("@");

  function formatPhone(input: string): string {
    let cleaned = input.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
    // Remove leading + for processing
    if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
    // 2557XXXXXXXX or 2556XXXXXXXX → already full number
    if (cleaned.startsWith("255") && cleaned.length >= 12) return "+" + cleaned;
    // 07XXXXXXXX or 06XXXXXXXX → remove leading 0
    if (cleaned.startsWith("0") && cleaned.length >= 10) return "+255" + cleaned.slice(1);
    // 7XXXXXXXX or 6XXXXXXXX → 9 digits starting with 6 or 7
    if (/^[67]\d{8}$/.test(cleaned)) return "+255" + cleaned;
    // Fallback: assume local number
    return "+255" + cleaned;
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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const credentials = isEmail
      ? { email: identifier, password }
      : { phone: formatPhone(identifier), password };

    const { error: err } = await supabase.auth.signInWithPassword(credentials);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    // Role-based redirect
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const userData = await meRes.json();
        if (userData.role === "super_admin") {
          router.push("/admin");
          return;
        }
        if (userData.role === "cashier") {
          router.push("/pos");
          return;
        }
        // Manager goes to dashboard too
        if (userData.role === "manager") {
          router.push("/dashboard");
          return;
        }
      }
    } catch {
      // Fallback to dashboard
    }
    router.push("/dashboard");
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!isEmail) {
      setError("Tafadhali ingiza email yako. (Please enter your email.)");
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.auth.resetPasswordForEmail(identifier);
    if (err) { setError(err.message); setLoading(false); return; }

    setStep("otp");
    setResendTimer(60);
    setLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.verifyOtp({
      email: identifier,
      token: otpCode,
      type: "recovery",
    });
    if (err) { setError(err.message); setLoading(false); return; }

    setStep("newpass");
    setLoading(false);
  }

  async function handleSetNewPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword.length < 6) {
      setError("Nywila lazima iwe na angalau herufi 6. (Password must be at least 6 characters.)");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Nywila hazifanani. (Passwords don't match.)");
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) { setError(err.message); setLoading(false); return; }

    setStep("done");
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
        setBiometricError("Uthibitisho umeshindwa. Jaribu tena.");
      }
    } finally {
      setBiometricLoading(false);
    }
  }

  const inputValid = identifier.length >= 3 && password.length >= 1;

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
            <Image src="/images/logo.png" alt="FoodOS" width={44} height={44} className="h-11 w-11 rounded-lg object-contain" />
            <h1 className="text-3xl font-bold text-brand-charcoal">
              Food<span className="text-brand-orange">OS</span>
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {step === "input"
              ? "Ingia kwenye akaunti yako (Login)"
              : step === "forgot"
              ? "Badilisha nywila yako (Reset Password)"
              : step === "otp"
              ? "Ingiza msimbo wa uthibitisho (Enter OTP)"
              : step === "newpass"
              ? "Weka nywila mpya (Set New Password)"
              : "Nywila imebadilishwa! (Password Changed!)"}
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-lg backdrop-blur-sm">

          {step === "input" ? (
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                {/* Email or Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email au Namba ya Simu (Email or Phone)
                  </label>
                  <input
                    type="text"
                    placeholder="salma@example.com au 0741234567"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                    required
                  />
                  {!isEmail && identifier.length >= 9 && (
                    <p className="mt-1 text-xs text-gray-400">{getProvider(identifier)}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nywila (Password)
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingiza nywila yako..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                </div>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || !inputValid}
                className="mt-6 w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark disabled:opacity-50"
              >
                {loading ? "Inaingia..." : "Ingia (Login)"}
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
            /* ===== FORGOT PASSWORD - ENTER EMAIL ===== */
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4 rounded-xl bg-brand-orange/5 p-4">
                <p className="text-sm text-gray-600">
                  Ingiza email yako. Tutakutumia msimbo wa kuthibitisha.
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Enter your email. We&apos;ll send you a verification code (OTP).
                </p>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Barua pepe (Email)
              </label>
              <input
                type="email"
                placeholder="salma@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                required
              />

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || !identifier.includes("@")}
                className="mt-6 w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark disabled:opacity-50"
              >
                {loading ? "Inatuma..." : "Tuma Msimbo (Send OTP)"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("input"); setError(""); }}
                className="mt-3 w-full text-sm text-gray-500 transition hover:text-brand-green"
              >
                Rudi kwenye kuingia (Back to login)
              </button>
            </form>
          ) : step === "otp" ? (
            /* ===== ENTER OTP CODE ===== */
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4 rounded-xl bg-brand-green/5 p-4">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">Msimbo umetumwa!</p>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Angalia email yako <span className="font-medium text-gray-600">{identifier}</span> kwa msimbo wa tarakimu 6.
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Check your email for the 6-digit code.
                </p>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Msimbo wa OTP (OTP Code)
              </label>
              <input
                type="text"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-center text-2xl font-bold tracking-[0.5em] transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                maxLength={6}
                required
                autoFocus
              />

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="mt-6 w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark disabled:opacity-50"
              >
                {loading ? "Inathibitisha..." : "Thibitisha (Verify)"}
              </button>

              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={() => { handleForgotPassword({ preventDefault: () => {} } as React.FormEvent); }}
                className="mt-3 w-full text-xs text-gray-400 transition hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-gray-400"
              >
                {resendTimer > 0
                  ? `Tuma tena baada ya 0:${resendTimer.toString().padStart(2, "0")} (Resend in 0:${resendTimer.toString().padStart(2, "0")})`
                  : "Hukupata msimbo? Tuma tena (Resend code)"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("input"); setError(""); setOtpCode(""); }}
                className="mt-1 w-full text-sm text-gray-500 transition hover:text-brand-green"
              >
                Rudi kwenye kuingia (Back to login)
              </button>
            </form>
          ) : step === "newpass" ? (
            /* ===== SET NEW PASSWORD ===== */
            <form onSubmit={handleSetNewPassword}>
              <div className="mb-4 rounded-xl bg-brand-green/5 p-4">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm font-medium text-brand-green">Imethibitishwa! (Verified!)</p>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Sasa weka nywila yako mpya. (Now set your new password.)
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nywila mpya (New Password)
                  </label>
                  <input
                    type="password"
                    placeholder="Angalau herufi 6..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thibitisha nywila (Confirm Password)
                  </label>
                  <input
                    type="password"
                    placeholder="Rudia nywila..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-brand-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
                    required
                  />
                </div>
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || newPassword.length < 6}
                className="mt-6 w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark disabled:opacity-50"
              >
                {loading ? "Inabadilisha..." : "Badilisha Nywila (Change Password)"}
              </button>
            </form>
          ) : (
            /* ===== SUCCESS ===== */
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                <svg className="h-8 w-8 text-brand-green" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-brand-charcoal">Nywila imebadilishwa!</p>
                <p className="mt-1 text-sm text-gray-500">Password changed successfully!</p>
              </div>
              <button
                type="button"
                onClick={() => { setStep("input"); setError(""); setOtpCode(""); setNewPassword(""); setConfirmPassword(""); }}
                className="mt-2 w-full rounded-xl bg-brand-green py-3 text-sm font-semibold text-white shadow-lg shadow-brand-green/25 transition hover:bg-brand-green-dark"
              >
                Ingia sasa (Login now)
              </button>
            </div>
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
