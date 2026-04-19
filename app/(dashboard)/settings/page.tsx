"use client";

import { useState, useEffect } from "react";

const cities = [
  "Dar es Salaam",
  "Arusha",
  "Mwanza",
  "Dodoma",
  "Mbeya",
  "Zanzibar",
  "Morogoro",
  "Tanga",
];

const paymentMethods = [
  { key: "cash", label: "Taslimu", sub: "Cash" },
  { key: "mpesa", label: "M-Pesa", sub: "Vodacom" },
  { key: "tigopesa", label: "Tigo Pesa", sub: "Tigo" },
  { key: "airtelmoney", label: "Airtel Money", sub: "Airtel" },
  { key: "halopesa", label: "Halopesa", sub: "Halotel" },
  { key: "card", label: "Kadi", sub: "Card" },
];

const planFeatures: Record<string, string[]> = {
  bure: [
    "Oda hadi 50/siku",
    "Stoku hadi vitu 100",
    "Ripoti za msingi",
    "Mfanyakazi 1",
    "Risiti za kawaida",
  ],
  mwanzo: [
    "Oda zisizo na kikomo",
    "Stoku zisizo na kikomo",
    "Ripoti za kina",
    "Wafanyakazi hadi 5",
    "Risiti za biashara",
    "Msaada wa kipaumbele",
    "Exporting ya data",
  ],
  kitaalamu: [
    "Kila kitu katika Mwanzo",
    "Matawi mengi",
    "API integration",
    "Wafanyakazi wasio na kikomo",
    "Ripoti za AI",
    "Msaada wa 24/7",
    "Mafunzo ya timu",
  ],
};

export default function SettingsPage() {
  // ---- Restaurant Profile ----
  const [restaurantName, setRestaurantName] = useState("Mama Ntilie Kitchen");
  const [phone, setPhone] = useState("+255 712 345 678");
  const [email, setEmail] = useState("info@mamantilie.co.tz");
  const [address, setAddress] = useState("Mtaa wa Uhuru, Kariakoo");
  const [city, setCity] = useState("Dar es Salaam");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // ---- Business Settings ----
  const [taxRate, setTaxRate] = useState("0");
  const [payments, setPayments] = useState<Record<string, boolean>>({
    cash: true,
    mpesa: true,
    tigopesa: false,
    airtelmoney: false,
    halopesa: false,
    card: false,
  });
  const [receiptFooter, setReceiptFooter] = useState(
    "Asante kwa kuja Mama Ntilie Kitchen! Karibu tena."
  );
  const [tablesEnabled, setTablesEnabled] = useState(false);
  const [maxTables, setMaxTables] = useState("10");

  // ---- Notification Settings ----
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [dailyReportSMS, setDailyReportSMS] = useState(false);
  const [dailyReportPhone, setDailyReportPhone] = useState("+255 712 345 678");
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [expenseApprovalAlerts, setExpenseApprovalAlerts] = useState(true);

  // ---- Danger Zone ----
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // ---- Save feedback ----
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---- Biometric / Account Security ----
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricRegistering, setBiometricRegistering] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<
    "not_set" | "registered"
  >("not_set");

  // Check biometric availability on mount
  useEffect(() => {
    async function checkBiometric() {
      if (
        typeof window !== "undefined" &&
        window.PublicKeyCredential &&
        typeof window.PublicKeyCredential
          .isUserVerifyingPlatformAuthenticatorAvailable === "function"
      ) {
        try {
          const available =
            await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricSupported(available);

          // Check if user previously registered (from localStorage)
          const stored = localStorage.getItem("foodos_biometric_registered");
          if (stored === "true") {
            setBiometricEnabled(true);
            setBiometricStatus("registered");
          }
        } catch {
          setBiometricSupported(false);
        }
      }
    }
    checkBiometric();
  }, []);

  async function handleBiometricToggle() {
    if (biometricEnabled) {
      // Disable biometric
      setBiometricEnabled(false);
      setBiometricStatus("not_set");
      localStorage.removeItem("foodos_biometric_registered");
      return;
    }

    // Enable biometric — register credential
    setBiometricRegistering(true);
    try {
      const userId = new Uint8Array(16);
      crypto.getRandomValues(userId);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: {
            name: "FoodOS",
            id: window.location.hostname,
          },
          user: {
            id: userId,
            name: email || "user@foodos.online",
            displayName: restaurantName || "FoodOS User",
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },
            { alg: -257, type: "public-key" },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            residentKey: "required",
          },
          timeout: 60000,
          attestation: "none",
        },
      });

      if (credential) {
        setBiometricEnabled(true);
        setBiometricStatus("registered");
        localStorage.setItem("foodos_biometric_registered", "true");
        // In production: send credential.response to server for storage
      }
    } catch {
      // User cancelled or error occurred
      setBiometricEnabled(false);
      setBiometricStatus("not_set");
    } finally {
      setBiometricRegistering(false);
    }
  }

  function togglePayment(key: string) {
    setPayments((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  }

  function handleDeleteAccount() {
    if (deleteConfirmText === restaurantName) {
      setShowDeleteModal(false);
      setDeleteConfirmText("");
      // In production: call API to delete account
    }
  }

  function handleExportData() {
    // In production: trigger data export
    const blob = new Blob(
      [
        JSON.stringify(
          {
            restaurant: restaurantName,
            exportedAt: new Date().toISOString(),
            note: "Hii ni data ya demo — This is demo data",
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${restaurantName.replace(/\s+/g, "_")}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Trial calculation
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 25);
  const trialEndFormatted = trialEndDate.toLocaleDateString("sw-TZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 pb-28">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mipangilio</h1>
        <p className="text-xs text-muted-foreground">
          Settings — Badilisha mipangilio ya mgahawa wako
        </p>
      </div>

      {/* ================================================================== */}
      {/* 1. Restaurant Profile Section                                       */}
      {/* ================================================================== */}
      <section className="rounded-xl bg-card p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/10 text-lg">
            🏪
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Wasifu wa Mgahawa
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Restaurant Profile
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Logo upload */}
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">
              Nembo (Logo)
            </label>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-2xl">🍽️</p>
                    <p className="text-[9px] text-muted-foreground">80x80</p>
                  </div>
                )}
              </div>
              <div>
                <label className="cursor-pointer rounded-lg border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition hover:bg-muted">
                  Pakia Nembo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  PNG, JPG hadi 2MB — Upload logo
                </p>
              </div>
            </div>
          </div>

          {/* Restaurant name */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Jina la Mgahawa (Restaurant Name)
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Nambari ya Simu (Phone Number)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Barua Pepe (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Jiji (City)
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">
              Anwani / Eneo (Address / Location)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. Business Settings                                                */}
      {/* ================================================================== */}
      <section className="rounded-xl bg-card p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-lg">
            💼
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Mipangilio ya Biashara
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Business Settings
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Currency (read only) */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Sarafu (Currency)
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <span className="text-sm font-medium text-foreground">TZS</span>
              <span className="text-xs text-muted-foreground">
                — Shilingi ya Tanzania
              </span>
              <svg
                className="ml-auto h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Timezone (read only) */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Saa za Eneo (Timezone)
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <span className="text-sm font-medium text-foreground">
                Africa/Dar_es_Salaam
              </span>
              <span className="text-xs text-muted-foreground">— EAT +3</span>
              <svg
                className="ml-auto h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Tax rate */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Kiwango cha Kodi % (Tax Rate)
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-10 text-sm text-foreground outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Itaongezwa kwa kila risiti — Applied to every receipt
            </p>
          </div>

          {/* Table numbers */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Nambari za Meza (Table Numbers)
              </label>
              <button
                onClick={() => setTablesEnabled(!tablesEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  tablesEnabled ? "bg-brand-green" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    tablesEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {tablesEnabled && (
              <div className="mt-2">
                <label className="text-[10px] text-muted-foreground">
                  Idadi ya juu ya meza (Max tables)
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={maxTables}
                  onChange={(e) => setMaxTables(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                />
              </div>
            )}
          </div>

          {/* Payment methods */}
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">
              Njia za Malipo Zinazokubalika (Accepted Payment Methods)
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.key}
                  onClick={() => togglePayment(pm.key)}
                  className={`flex items-center gap-3 rounded-lg border-2 px-3 py-3 text-left transition ${
                    payments[pm.key]
                      ? "border-brand-green bg-brand-green/5"
                      : "border-border bg-background hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                      payments[pm.key]
                        ? "border-brand-green bg-brand-green"
                        : "border-gray-300"
                    }`}
                  >
                    {payments[pm.key] && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {pm.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {pm.sub}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Receipt footer */}
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">
              Ujumbe wa Chini ya Risiti (Receipt Footer Message)
            </label>
            <textarea
              rows={3}
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              className="mt-1 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              Itaonyeshwa chini ya kila risiti — Shown at the bottom of every
              receipt
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. Notification Settings                                            */}
      {/* ================================================================== */}
      <section className="rounded-xl bg-card p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gold/10 text-lg">
            🔔
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Mipangilio ya Arifa
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Notification Settings
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Low stock alerts */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Tahadhari za Stoku Chini
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Low Stock Alerts — Pokea arifa bidhaa zinapokuwa chini
                </p>
              </div>
              <button
                onClick={() => setLowStockAlerts(!lowStockAlerts)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  lowStockAlerts ? "bg-brand-green" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    lowStockAlerts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {lowStockAlerts && (
              <div className="mt-3 flex items-center gap-3">
                <label className="text-[11px] text-muted-foreground whitespace-nowrap">
                  Kizingiti (Threshold):
                </label>
                <input
                  type="number"
                  min="1"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm text-foreground outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
                />
                <span className="text-[11px] text-muted-foreground">
                  vitengo — units
                </span>
              </div>
            )}
          </div>

          {/* Daily report SMS */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Ripoti ya Kila Siku kwa SMS
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Daily Report SMS — Ripoti ya mauzo kila jioni
                </p>
              </div>
              <button
                onClick={() => setDailyReportSMS(!dailyReportSMS)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  dailyReportSMS ? "bg-brand-green" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    dailyReportSMS ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {dailyReportSMS && (
              <div className="mt-3">
                <label className="text-[11px] text-muted-foreground">
                  Nambari ya kupokea SMS (Phone number for SMS)
                </label>
                <input
                  type="tel"
                  value={dailyReportPhone}
                  onChange={(e) => setDailyReportPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 sm:w-64"
                />
              </div>
            )}
          </div>

          {/* Order notifications */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Arifa za Oda
              </p>
              <p className="text-[11px] text-muted-foreground">
                Order Notifications — Sauti inapokuja oda mpya
              </p>
            </div>
            <button
              onClick={() => setOrderNotifications(!orderNotifications)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                orderNotifications ? "bg-brand-green" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  orderNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Expense approval alerts */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Tahadhari za Idhini ya Gharama
              </p>
              <p className="text-[11px] text-muted-foreground">
                Expense Approval Alerts — Pokea arifa gharama zinaposubiri
                idhini
              </p>
            </div>
            <button
              onClick={() =>
                setExpenseApprovalAlerts(!expenseApprovalAlerts)
              }
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                expenseApprovalAlerts ? "bg-brand-green" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  expenseApprovalAlerts ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. Subscription Info Card                                           */}
      {/* ================================================================== */}
      <section className="rounded-xl bg-card p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/10 text-lg">
            💎
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Usajili wako
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Your Subscription
            </p>
          </div>
        </div>

        {/* Current plan badge */}
        <div className="rounded-xl border-2 border-brand-green/30 bg-brand-green/5 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-foreground">
              Mpango wa Sasa:
            </h3>
            <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-bold text-white">
              Bure (Free)
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                Majaribio yanaisha:{" "}
                <span className="font-medium text-foreground">
                  {trialEndFormatted}
                </span>
              </span>
            </div>
            <span className="rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-medium text-brand-orange">
              Siku 25 zimebaki — 25 days remaining
            </span>
          </div>

          {/* Features included */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Vipengele Vilivyojumuishwa (Features Included)
            </p>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {planFeatures.bure.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <svg
                    className="h-4 w-4 shrink-0 text-brand-green"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Plan comparison */}
        <div className="mt-6">
          <h4 className="text-sm font-bold text-foreground">
            Linganisha Mipango (Compare Plans)
          </h4>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 text-xs font-semibold text-muted-foreground">
                    Kipengele (Feature)
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-brand-green">
                    <div>Bure</div>
                    <div className="font-normal text-muted-foreground">
                      TZS 0
                    </div>
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-brand-orange">
                    <div>Mwanzo</div>
                    <div className="font-normal text-muted-foreground">
                      TZS 29,000/mo
                    </div>
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-brand-charcoal">
                    <div>Kitaalamu</div>
                    <div className="font-normal text-muted-foreground">
                      TZS 59,000/mo
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  {
                    feature: "Oda kwa siku (Orders/day)",
                    bure: "50",
                    mwanzo: "Zisizo na kikomo",
                    kitaalamu: "Zisizo na kikomo",
                  },
                  {
                    feature: "Bidhaa za Stoku (Stock Items)",
                    bure: "100",
                    mwanzo: "Zisizo na kikomo",
                    kitaalamu: "Zisizo na kikomo",
                  },
                  {
                    feature: "Wafanyakazi (Staff)",
                    bure: "1",
                    mwanzo: "5",
                    kitaalamu: "Wasio na kikomo",
                  },
                  {
                    feature: "Ripoti (Reports)",
                    bure: "Msingi",
                    mwanzo: "Kina",
                    kitaalamu: "AI + Kina",
                  },
                  {
                    feature: "Matawi (Branches)",
                    bure: false,
                    mwanzo: false,
                    kitaalamu: true,
                  },
                  {
                    feature: "API Integration",
                    bure: false,
                    mwanzo: false,
                    kitaalamu: true,
                  },
                  {
                    feature: "Msaada (Support)",
                    bure: "Email",
                    mwanzo: "Kipaumbele",
                    kitaalamu: "24/7",
                  },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-4 text-xs text-foreground">
                      {row.feature}
                    </td>
                    {(["bure", "mwanzo", "kitaalamu"] as const).map((plan) => (
                      <td key={plan} className="px-3 py-2.5 text-center">
                        {typeof row[plan] === "boolean" ? (
                          row[plan] ? (
                            <svg
                              className="mx-auto h-4 w-4 text-brand-green"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg
                              className="mx-auto h-4 w-4 text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className="text-xs text-foreground">
                            {row[plan]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Upgrade button */}
          <div className="mt-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
            <button className="rounded-xl bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-orange-light hover:shadow-lg">
              Panda Daraja — Upgrade Plan
            </button>
            <p className="text-[11px] text-muted-foreground">
              Badilisha mpango wako wakati wowote — Change your plan anytime
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 5. Account Security (Biometric)                                     */}
      {/* ================================================================== */}
      {biometricSupported && (
        <section className="rounded-xl bg-card p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/10 text-lg">
              <svg
                className="h-5 w-5 text-brand-green"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Usalama wa Akaunti
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Account Security
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Fingerprint Login Toggle */}
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Fingerprint Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      biometricEnabled
                        ? "bg-brand-green/10"
                        : "bg-muted/50"
                    }`}
                  >
                    <svg
                      className={`h-5 w-5 ${
                        biometricEnabled
                          ? "text-brand-green"
                          : "text-muted-foreground"
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
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Ingia kwa Alama ya Kidole
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Fingerprint Login
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBiometricToggle}
                  disabled={biometricRegistering}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    biometricEnabled ? "bg-brand-green" : "bg-gray-300"
                  } ${biometricRegistering ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      biometricEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Status badge */}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    biometricStatus === "registered"
                      ? "bg-brand-green/10 text-brand-green"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {biometricStatus === "registered" ? (
                    <>Imewekwa &#x2713;</>
                  ) : (
                    <>Haijawekwa</>
                  )}
                </span>

                {biometricRegistering && (
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <svg
                      className="h-3.5 w-3.5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Inasajili... (Registering...)
                  </span>
                )}
              </div>

              <p className="mt-2 text-[10px] text-muted-foreground leading-relaxed">
                Tumia alama ya kidole au uso wako kuingia kwenye akaunti yako
                badala ya OTP. Kifaa chako kinahifadhi data ya uthibitisho kwa
                usalama.
                <br />
                Use your fingerprint or face to log in instead of OTP. Your
                device stores the authentication data securely.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* 6. Danger Zone                                                      */}
      {/* ================================================================== */}
      <section className="rounded-xl border-2 border-red-300 bg-card p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-lg">
            ⚠️
          </div>
          <div>
            <h2 className="text-base font-bold text-red-600">
              Eneo Hatari
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Danger Zone — Matendo haya hayawezi kutenduliwa
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Export data */}
          <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Hamisha Data (Export Data)
              </p>
              <p className="text-[11px] text-muted-foreground">
                Pakua data yako yote katika faili la JSON — Download all your
                data as JSON
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="shrink-0 rounded-lg border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Hamisha Data
              </span>
            </button>
          </div>

          {/* Delete account */}
          <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">
                Futa Akaunti ya Mgahawa (Delete Restaurant Account)
              </p>
              <p className="text-[11px] text-red-500">
                Hatua hii itafuta data yako yote milele — This action will
                permanently delete all your data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-red-700"
            >
              Futa Akaunti
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 6. Sticky Save Button                                               */}
      {/* ================================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-card/95 backdrop-blur-sm md:left-64">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          <p className="hidden text-xs text-muted-foreground sm:block">
            {saved
              ? "Mabadiliko yamehifadhiwa! — Changes saved successfully!"
              : "Bonyeza kuhifadhi mabadiliko — Click to save changes"}
          </p>
          <div className="flex items-center gap-3 ml-auto">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand-green">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Imehifadhiwa
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition ${
                saving
                  ? "cursor-not-allowed bg-brand-green/60"
                  : "bg-brand-green hover:bg-brand-green-dark hover:shadow-lg"
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Inahifadhi...
                </span>
              ) : (
                "Hifadhi Mabadiliko — Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Delete Confirmation Modal                                           */}
      {/* ================================================================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-foreground">
              Futa Akaunti ya Mgahawa
            </h3>
            <p className="text-xs text-muted-foreground">
              Delete Restaurant Account
            </p>

            <div className="mt-4 rounded-lg bg-red-50 p-3">
              <p className="text-xs text-red-700">
                Hatua hii itafuta data yako yote milele, ikiwa ni pamoja na
                oda, stoku, ripoti, na mipangilio. Huwezi kurudisha data hii.
              </p>
              <p className="mt-1 text-[10px] text-red-500">
                This action will permanently delete all your data including
                orders, stock, reports, and settings. This cannot be undone.
              </p>
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-foreground">
                Andika{" "}
                <span className="font-bold text-red-600">
                  {restaurantName}
                </span>{" "}
                kuthibitisha:
              </label>
              <p className="text-[10px] text-muted-foreground">
                Type the restaurant name to confirm
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={restaurantName}
                className="mt-2 w-full rounded-lg border border-red-300 bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Ghairi (Cancel)
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== restaurantName}
                className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition ${
                  deleteConfirmText === restaurantName
                    ? "bg-red-600 hover:bg-red-700"
                    : "cursor-not-allowed bg-red-300"
                }`}
              >
                Futa Milele (Delete Forever)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
