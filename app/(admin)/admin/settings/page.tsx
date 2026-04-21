"use client";

import { useState, useEffect } from "react";

interface AdminProfile {
  name: string;
  email: string;
  role: string;
}

interface SystemInfo {
  totalRestaurants: number;
  totalUsers: number;
  pendingApprovals: number;
  pendingKyc: number;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Platform settings (local state — no DB table yet)
  const [settings, setSettings] = useState({
    autoApprove: false,
    trialDays: 14,
    maxUsersDefault: 3,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    currency: "TZS",
    timezone: "Africa/Dar_es_Salaam",
    language: "sw",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("foodos-dark");
    setDarkMode(stored === "true");

    // Load saved platform settings from localStorage
    const savedSettings = localStorage.getItem("foodos-platform-settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch { /* ignore */ }
    }

    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ])
      .then(([me, stats]) => {
        if (me.name) setProfile({ name: me.name, email: me.email || "", role: me.role || "super_admin" });
        setSystemInfo({
          totalRestaurants: stats.totalRestaurants || 0,
          totalUsers: stats.totalUsers || 0,
          pendingApprovals: stats.pendingApprovals || 0,
          pendingKyc: stats.pendingKyc || 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleSave() {
    localStorage.setItem("foodos-platform-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("foodos-dark", String(next));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2D7A3A] border-t-transparent" />
          <p className="text-sm text-muted-foreground">Inapakia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mipangilio</h1>
        <p className="text-xs text-muted-foreground">Settings — Usimamizi wa jukwaa na akaunti</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Settings forms */}
        <div className="space-y-6 lg:col-span-2">

          {/* Admin Profile Card */}
          <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold text-foreground">Wasifu wa Admin</h2>
              <p className="text-[11px] text-muted-foreground">Taarifa za akaunti yako</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2D7A3A] text-lg font-bold text-white ring-2 ring-[#4ade80]/30">
                  {profile?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "SA"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{profile?.name || "Super Admin"}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-[#2D7A3A]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#2D7A3A]">
                    Super Admin
                  </span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Jina</label>
                  <input
                    type="text"
                    value={profile?.name || ""}
                    disabled
                    className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Barua pepe</label>
                  <input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground outline-none"
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Taarifa hizi zinabadilishwa kupitia Supabase Auth Dashboard
              </p>
            </div>
          </div>

          {/* Platform Settings Card */}
          <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold text-foreground">Mipangilio ya Jukwaa</h2>
              <p className="text-[11px] text-muted-foreground">Platform configuration</p>
            </div>
            <div className="p-5 space-y-5">
              {/* Auto-approve toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Idhini Moja kwa Moja</p>
                  <p className="text-[11px] text-muted-foreground">Idhinisha maombi ya migahawa moja kwa moja</p>
                </div>
                <button
                  onClick={() => setSettings((s) => ({ ...s, autoApprove: !s.autoApprove }))}
                  className={`relative h-6 w-11 rounded-full transition ${settings.autoApprove ? "bg-[#2D7A3A]" : "bg-gray-300 dark:bg-gray-600"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.autoApprove ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                </button>
              </div>

              {/* Trial days */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Siku za Majaribio</label>
                  <input
                    type="number"
                    min={0}
                    max={90}
                    value={settings.trialDays}
                    onChange={(e) => setSettings((s) => ({ ...s, trialDays: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#2D7A3A]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Watumiaji wa Kawaida</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={settings.maxUsersDefault}
                    onChange={(e) => setSettings((s) => ({ ...s, maxUsersDefault: parseInt(e.target.value) || 3 }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#2D7A3A]"
                  />
                </div>
              </div>

              {/* Currency and Timezone */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Sarafu</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#2D7A3A]"
                  >
                    <option value="TZS">TZS - Shilingi ya Tanzania</option>
                    <option value="KES">KES - Shilingi ya Kenya</option>
                    <option value="UGX">UGX - Shilingi ya Uganda</option>
                    <option value="USD">USD - Dola ya Marekani</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Eneo la Saa</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings((s) => ({ ...s, timezone: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#2D7A3A]"
                  >
                    <option value="Africa/Dar_es_Salaam">Africa/Dar_es_Salaam (EAT +03:00)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT +03:00)</option>
                    <option value="Africa/Kampala">Africa/Kampala (EAT +03:00)</option>
                  </select>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Lugha</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#2D7A3A] sm:w-1/2"
                >
                  <option value="sw">Kiswahili</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Maintenance mode */}
              <div className="flex items-center justify-between rounded-lg bg-red-500/5 px-4 py-3 border border-red-500/10">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Hali ya Matengenezo</p>
                  <p className="text-[11px] text-muted-foreground">Zuia watumiaji kuingia mfumo kwa matengenezo</p>
                </div>
                <button
                  onClick={() => setSettings((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                  className={`relative h-6 w-11 rounded-full transition ${settings.maintenanceMode ? "bg-red-500" : "bg-gray-300 dark:bg-gray-600"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.maintenanceMode ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Settings Card */}
          <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold text-foreground">Arifa</h2>
              <p className="text-[11px] text-muted-foreground">Notification preferences</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Arifa za Barua Pepe</p>
                  <p className="text-[11px] text-muted-foreground">Pokea arifa kupitia barua pepe</p>
                </div>
                <button
                  onClick={() => setSettings((s) => ({ ...s, emailNotifications: !s.emailNotifications }))}
                  className={`relative h-6 w-11 rounded-full transition ${settings.emailNotifications ? "bg-[#2D7A3A]" : "bg-gray-300 dark:bg-gray-600"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.emailNotifications ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Arifa za SMS</p>
                  <p className="text-[11px] text-muted-foreground">Pokea arifa kupitia ujumbe mfupi</p>
                </div>
                <button
                  onClick={() => setSettings((s) => ({ ...s, smsNotifications: !s.smsNotifications }))}
                  className={`relative h-6 w-11 rounded-full transition ${settings.smsNotifications ? "bg-[#2D7A3A]" : "bg-gray-300 dark:bg-gray-600"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.smsNotifications ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold text-foreground">Muonekano</h2>
              <p className="text-[11px] text-muted-foreground">Appearance settings</p>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Hali ya Giza</p>
                  <p className="text-[11px] text-muted-foreground">Badilisha kati ya mwanga na giza</p>
                </div>
                <button
                  onClick={toggleDark}
                  className={`relative h-6 w-11 rounded-full transition ${darkMode ? "bg-[#2D7A3A]" : "bg-gray-300 dark:bg-gray-600"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${darkMode ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="rounded-lg bg-[#2D7A3A] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#236B2F] active:scale-[0.98]"
            >
              Hifadhi Mabadiliko
            </button>
            {saved && (
              <span className="text-sm font-medium text-[#2D7A3A] animate-in fade-in">
                Imehifadhiwa!
              </span>
            )}
          </div>
        </div>

        {/* Right column: System Info */}
        <div className="space-y-6">

          {/* System Stats Card */}
          <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold text-foreground">Taarifa za Mfumo</h2>
              <p className="text-[11px] text-muted-foreground">System information</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Toleo", value: "1.0.0", sub: "FoodOS Platform" },
                { label: "Migahawa", value: String(systemInfo?.totalRestaurants || 0), sub: "Total registered" },
                { label: "Watumiaji", value: String(systemInfo?.totalUsers || 0), sub: "Total users" },
                { label: "Maombi Yanayosubiri", value: String(systemInfo?.pendingApprovals || 0), sub: "Pending approvals" },
                { label: "KYC Zinazosubiri", value: String(systemInfo?.pendingKyc || 0), sub: "Pending verification" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-xs font-medium text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold text-foreground">Viungo vya Haraka</h2>
              <p className="text-[11px] text-muted-foreground">Quick access</p>
            </div>
            <div className="p-3 space-y-1">
              {[
                { label: "Afya ya Mfumo", href: "/admin/health", icon: "heart" },
                { label: "Kumbukumbu za Ukaguzi", href: "/admin/audit", icon: "clipboard" },
                { label: "Maombi ya Migahawa", href: "/admin/applications", icon: "inbox" },
                { label: "Ukaguzi wa KYC", href: "/admin/kyc", icon: "file" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl bg-card shadow-sm border border-red-200 dark:border-red-900/30 overflow-hidden">
            <div className="border-b border-red-200 dark:border-red-900/30 px-5 py-4 bg-red-50 dark:bg-red-950/20">
              <h2 className="text-sm font-bold text-red-600 dark:text-red-400">Eneo Hatari</h2>
              <p className="text-[11px] text-red-500/70">Danger zone — Vitendo visivyoweza kutenduliwa</p>
            </div>
            <div className="p-5 space-y-3">
              <button
                disabled
                className="w-full rounded-lg border border-red-200 dark:border-red-900/30 px-4 py-2.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Futa Data ya Cache
              </button>
              <button
                disabled
                className="w-full rounded-lg border border-red-200 dark:border-red-900/30 px-4 py-2.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rudisha Mipangilio ya Kawaida
              </button>
              <p className="text-[10px] text-muted-foreground text-center">
                Vitendo hivi vitapatikana katika toleo lijalo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
