"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [biometricError, setBiometricError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Check if WebAuthn / biometric auth is available on mount
  useEffect(() => {
    async function checkBiometric() {
      if (
        typeof window !== "undefined" &&
        window.PublicKeyCredential &&
        typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function"
      ) {
        try {
          const available =
            await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricSupported(available);
        } catch {
          setBiometricSupported(false);
        }
      }
    }
    checkBiometric();
  }, []);

  // Format phone: add +255 if needed
  function formatPhone(input: string): string {
    let cleaned = input.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "+255" + cleaned.slice(1);
    } else if (cleaned.startsWith("255")) {
      cleaned = "+" + cleaned;
    } else if (!cleaned.startsWith("+")) {
      cleaned = "+255" + cleaned;
    }
    return cleaned;
  }

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formattedPhone = formatPhone(phone);

    const { error: signInError } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    setStep("otp");
    setLoading(false);
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formattedPhone = formatPhone(phone);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  async function handleBiometricLogin() {
    setBiometricLoading(true);
    setError("");
    setBiometricError("");

    try {
      // Request biometric authentication via WebAuthn
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32), // In production this comes from server
          timeout: 60000,
          rpId: window.location.hostname,
          userVerification: "required",
        },
      });

      if (credential) {
        // Biometric auth succeeded — show success then redirect
        setBiometricSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setBiometricError("Uthibitisho umeshindwa. Jaribu tena.");
      }
    } catch (err: unknown) {
      if (
        err instanceof DOMException &&
        err.name === "NotAllowedError"
      ) {
        setBiometricError("Umeghairi uthibitisho.");
      } else {
        setBiometricError(
          "Uthibitisho wa alama ya kidole umeshindwa. Jaribu tena au tumia OTP."
        );
      }
    } finally {
      setBiometricLoading(false);
    }
  }

  // Detect mobile provider from phone number
  function getProvider(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");
    const prefix = cleaned.slice(-9, -7);
    if (["74", "75"].includes(prefix)) return "M-Pesa";
    if (["71", "65"].includes(prefix)) return "Tigo Pesa";
    if (["68", "69"].includes(prefix)) return "Airtel Money";
    if (["62"].includes(prefix)) return "HaloPesa";
    return "";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">FoodOS</h1>
          <p className="mt-1 text-sm text-gray-500">Ingia kwenye akaunti yako</p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">
          {step === "phone" ? (
            <form onSubmit={handleSendOTP}>
              <label className="block text-sm font-medium text-gray-700">
                Namba ya Simu (Phone Number)
              </label>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-600">
                  +255
                </span>
                <input
                  type="tel"
                  placeholder="0741234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              {phone.length >= 9 && (
                <p className="mt-1 text-xs text-gray-400">
                  {getProvider(phone)}
                </p>
              )}

              {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || phone.length < 9}
                className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Inatuma..." : "Tuma OTP (Send OTP)"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <p className="text-sm text-gray-600">
                Tumekutumia SMS kwenye <strong>{formatPhone(phone)}</strong>
              </p>
              <label className="mt-4 block text-sm font-medium text-gray-700">
                Ingiza Nambari ya OTP
              </label>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-2xl tracking-[0.5em] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                maxLength={6}
                required
              />

              {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Inathibitisha..." : "Thibitisha (Verify)"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError("");
                }}
                className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Badilisha namba (Change number)
              </button>
            </form>
          )}

          {/* ---- Biometric Login Section ---- */}
          {biometricSupported && (
            <>
              {/* Separator */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-medium text-gray-400">
                  &mdash; au / or &mdash;
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Biometric success state */}
              {biometricSuccess ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-7 w-7 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-green-700">
                    Umethibitishwa! Inaelekeza...
                  </p>
                  <p className="text-[11px] text-green-600/70">
                    Authenticated! Redirecting...
                  </p>
                </div>
              ) : (
                <>
                  {/* Biometric / Fingerprint Button */}
                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    disabled={biometricLoading}
                    className="w-full rounded-xl border-2 border-brand-green bg-white py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {/* Fingerprint SVG Icon — pulses when loading */}
                    <svg
                      className={`h-6 w-6 text-green-600 ${
                        biometricLoading ? "animate-pulse" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a48.667 48.667 0 00-1.26 10.802M12 2.25c.477 0 .945.043 1.4.126M12 2.25a7.5 7.5 0 00-7.5 7.5c0 .672.034 1.336.1 1.99M12 2.25c-2.036 0-3.9.81-5.258 2.126M12 10.5a2.25 2.25 0 00-2.25 2.25c0 1.81-.2 3.576-.577 5.272M12 10.5c1.243 0 2.25 1.007 2.25 2.25 0 3.156-.382 6.217-1.103 9.138M15 3.375c1.862.86 3.356 2.345 4.236 4.197M9.832 5.893a5.25 5.25 0 017.418 5.857M6.75 10.5a5.25 5.25 0 018.646-4.016M4.5 12.776c.186 1.652.46 3.274.82 4.86M7.5 16.5c.28-1.462.472-2.96.572-4.486"
                      />
                    </svg>
                    <div className="text-left">
                      <span className="block leading-tight">
                        {biometricLoading
                          ? "Inathibitisha..."
                          : "Ingia kwa Alama ya Kidole"}
                      </span>
                      <span className="block text-[11px] font-normal text-green-600/70">
                        {biometricLoading
                          ? "Authenticating..."
                          : "Biometric Login"}
                      </span>
                    </div>
                  </button>

                  {/* Subtle biometric error message in Swahili */}
                  {biometricError && (
                    <p className="mt-2 text-center text-xs text-red-500/80">
                      {biometricError}
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Huna akaunti?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
            Jisajili hapa (Register)
          </Link>
        </p>
      </div>
    </div>
  );
}
