"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

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
