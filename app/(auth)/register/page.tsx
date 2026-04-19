"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
    email: "",
    city: "Dar es Salaam",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

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

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formattedPhone = formatPhone(formData.phone);

    const { error: signUpError } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setStep("otp");
    setLoading(false);
  }

  async function handleVerifyAndCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formattedPhone = formatPhone(formData.phone);

    const { data: authData, error: verifyError } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    // Create tenant + user via API route
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantName: formData.restaurantName,
        ownerName: formData.ownerName,
        phone: formattedPhone,
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

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">FoodOS</h1>
          <p className="mt-1 text-sm text-gray-500">Sajili Mgahawa Wako (Register Your Restaurant)</p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">
          {step === "form" ? (
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
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Namba ya Simu (Phone)
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-600">
                    +255
                  </span>
                  <input
                    type="tel"
                    placeholder="0741234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email (Si lazima)
                </label>
                <input
                  type="email"
                  placeholder="salma@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jiji (City)
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

              <button
                type="submit"
                disabled={loading || !formData.restaurantName || !formData.ownerName || formData.phone.length < 9}
                className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Inatuma..." : "Endelea (Continue)"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndCreate}>
              <p className="text-sm text-gray-600">
                Tumekutumia SMS kwenye <strong>{formatPhone(formData.phone)}</strong>
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

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Inasajili..." : "Sajili Mgahawa (Register)"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setError("");
                }}
                className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Rudi nyuma (Go back)
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Una akaunti tayari?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Ingia hapa (Login)
          </Link>
        </p>
      </div>
    </div>
  );
}
