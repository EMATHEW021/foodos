"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const content = {
  sw: {
    nav: { login: "Ingia", register: "Jisajili Bure", staff: "Staff Portal" },
    hero: {
      badge: "Kwa Migahawa ya Tanzania",
      title1: "Simamia Mgahawa Wako",
      title2: "Kutoka Simu",
      desc: "POS, Stoku, Gharama, na Faida yako halisi — yote katika mfumo mmoja rahisi. Hakuna karatasi, hakuna Excel, hakuna kubahatisha.",
      descEn: "Manage your restaurant from your phone. Sales, stock, expenses, and real profit — all in one system.",
      cta: "Anza Bure — Siku 14",
      ctaSub: "Start Free — 14 Days",
      secondary: "Angalia Zaidi",
      trust: "Hakuna kadi ya benki · Jisajili kwa namba ya simu · M-Pesa, Tigo, Airtel, Halo",
    },
    phone: {
      greeting: "Habari, Mama Salma",
      today: "Leo - Dashboard",
      revenue: "Mapato",
      cogs: "Gharama Bidhaa",
      expenses: "Matumizi",
      profit: "Faida Halisi",
      chart: "Mauzo - Wiki Hii",
      alert: "Stoku Chini: Mchele 3kg, Nyama 2kg",
      nav: ["Dashboard", "POS", "Stoku", "Ripoti"],
    },
    features: {
      title: "Kila Kitu Unahitaji, Pahali Pamoja",
      subtitle: "Everything you need to run your restaurant — in one place",
      items: [
        { icon: "receipt", title: "POS - Pata Oda", desc: "Menu grid, tap to order, malipo ya M-Pesa, Tigo, Cash — haraka na rahisi" },
        { icon: "package", title: "Stoku - Fuatilia Bidhaa", desc: "Ingiza bidhaa, toa, hariri — yote chini ya idhini ya mkurugenzi" },
        { icon: "trending", title: "Faida Halisi", desc: "Mapato - Gharama Bidhaa - Matumizi = Faida yako halisi kwa wakati halisi" },
        { icon: "chart", title: "Ripoti za Kila Siku", desc: "Mauzo, gharama, faida — kila siku, wiki, mwezi kwenye simu yako" },
        { icon: "shield", title: "Mfumo wa Idhini", desc: "Kila badiliko la stoku linahitaji kibali — hakuna wizi" },
        { icon: "wifi", title: "Inafanya Kazi Offline", desc: "Hata wakati wa kukatika umeme — mfumo unafanya kazi" },
      ],
    },
    roles: {
      title: "Watu 3, Mfumo 1",
      subtitle: "3 people, 1 system — replaces 6-7 staff members",
      items: [
        { role: "Mkurugenzi", roleEn: "Owner", desc: "Angalia faida, thibitisha stoku, simamia kutoka nyumbani", color: "green" },
        { role: "Msimamizi Stoku", roleEn: "Stock Manager", desc: "Ingiza bidhaa, toa, hariri — yote yanahitaji idhini", color: "orange" },
        { role: "Karani", roleEn: "Cashier", desc: "Pata oda, pokea malipo ya M-Pesa na Cash", color: "gold" },
      ],
    },
    pricing: {
      title: "Bei Rahisi",
      subtitle: "Simple pricing — start free, upgrade when you grow",
      plans: [
        { name: "Bure", nameEn: "Free Trial", price: "0", period: "Siku 14", features: ["Mtumiaji 1", "Vipengele vyote", "Ripoti kamili", "Siku 14 za bure"], cta: "Anza Bure" },
        { name: "FoodOS", nameEn: "", price: "65,000", period: "/mwezi (~$25)", features: ["Watumiaji 3", "Mgahawa 1 / Kituo 1", "Oda zisizo na kikomo", "Ripoti kamili", "SMS alerts", "Mfumo wa idhini", "Msaada wa kipaumbele"], cta: "Chagua Mpango", popular: true },
      ],
    },
    cta: {
      title: "Anza Leo — Bure Kabisa",
      desc: "Jisajili kwa sekunde 30. Hakuna kadi ya benki. Hakuna mkataba.",
      button: "Sajili Mgahawa Wako",
    },
    footer: {
      tagline: "Mfumo wa Usimamizi wa Mgahawa",
      rights: "Haki zote zimehifadhiwa.",
    },
  },
  en: {
    nav: { login: "Login", register: "Start Free", staff: "Staff Portal" },
    hero: {
      badge: "For Tanzanian Restaurants",
      title1: "Manage Your Restaurant",
      title2: "From Your Phone",
      desc: "POS, Inventory, Expenses, and your real Profit — all in one simple system. No paper, no Excel, no guessing.",
      descEn: "",
      cta: "Start Free — 14 Days",
      ctaSub: "",
      secondary: "Learn More",
      trust: "No credit card · Sign up with phone number · M-Pesa, Tigo, Airtel, Halo",
    },
    phone: {
      greeting: "Hi, Mama Salma",
      today: "Today - Dashboard",
      revenue: "Revenue",
      cogs: "COGS",
      expenses: "Expenses",
      profit: "Net Profit",
      chart: "Sales - This Week",
      alert: "Low Stock: Rice 3kg, Meat 2kg",
      nav: ["Dashboard", "POS", "Stock", "Reports"],
    },
    features: {
      title: "Everything You Need, In One Place",
      subtitle: "Complete restaurant management from your phone",
      items: [
        { icon: "receipt", title: "POS - Take Orders", desc: "Menu grid, tap to order, M-Pesa, Tigo, Cash payments — fast and simple" },
        { icon: "package", title: "Track Inventory", desc: "Add stock, remove, edit — all under owner approval" },
        { icon: "trending", title: "Real Profit", desc: "Revenue - COGS - Expenses = Your real profit in real-time" },
        { icon: "chart", title: "Daily Reports", desc: "Sales, costs, profit — daily, weekly, monthly on your phone" },
        { icon: "shield", title: "Approval System", desc: "Every stock change needs approval — no theft" },
        { icon: "wifi", title: "Works Offline", desc: "Even during power cuts — the system keeps working" },
      ],
    },
    roles: {
      title: "3 People, 1 System",
      subtitle: "Replaces 6-7 staff members with smart automation",
      items: [
        { role: "Owner", roleEn: "", desc: "View profit, approve stock, manage from home", color: "green" },
        { role: "Stock Manager", roleEn: "", desc: "Add stock, remove, edit — all needs approval", color: "orange" },
        { role: "Cashier", roleEn: "", desc: "Take orders, receive M-Pesa and Cash payments", color: "gold" },
      ],
    },
    pricing: {
      title: "Simple Pricing",
      subtitle: "Start free, upgrade when you grow",
      plans: [
        { name: "Free Trial", nameEn: "", price: "0", period: "14 days", features: ["1 User", "All features", "Full reports", "14 days free"], cta: "Start Free" },
        { name: "FoodOS", nameEn: "", price: "65,000", period: "/month (~$25)", features: ["3 Users", "1 Restaurant / Station", "Unlimited orders", "Full reports", "SMS alerts", "Approval system", "Priority support"], cta: "Choose Plan", popular: true },
      ],
    },
    cta: {
      title: "Start Today — Completely Free",
      desc: "Sign up in 30 seconds. No credit card. No contract.",
      button: "Register Your Restaurant",
    },
    footer: {
      tagline: "Restaurant Management System",
      rights: "All rights reserved.",
    },
  },
};

function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    receipt: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
    package: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    trending: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    chart: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M9 17V9m4 8V5m4 12v-4" />
      </svg>
    ),
    shield: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    wifi: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
      </svg>
    ),
  };
  return <>{icons[name]}</>;
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [lang, setLang] = useState<"sw" | "en">("sw");
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const t = content[lang];

  // Hero entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("foodos-theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
    const savedLang = localStorage.getItem("foodos-lang");
    if (savedLang === "en" || savedLang === "sw") setLang(savedLang);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("foodos-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("foodos-theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("foodos-lang", lang);
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const roleColors: Record<string, string> = {
    green: "bg-brand-green/10 text-brand-green dark:bg-brand-green/20",
    orange: "bg-brand-orange/10 text-brand-orange dark:bg-brand-orange/20",
    gold: "bg-brand-gold/10 text-brand-gold dark:bg-brand-gold/20",
  };

  const roleIconColors: Record<string, string> = {
    green: "bg-brand-green",
    orange: "bg-brand-orange",
    gold: "bg-brand-gold",
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-[#0F1117] text-gray-100" : "bg-brand-cream text-brand-charcoal"}`}>
      {/* ===== NAVBAR ===== */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? dark
              ? "border-b border-white/5 bg-[#0F1117]/80 backdrop-blur-xl"
              : "border-b border-gray-200/50 bg-brand-cream/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="FoodOS" width={48} height={48} className="h-12 w-12 rounded-lg object-contain" />
            <span className="text-2xl font-bold">
              Food<span className="text-brand-orange">OS</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "sw" ? "en" : "sw")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                dark ? "bg-white/10 text-gray-300 hover:bg-white/15" : "bg-brand-charcoal/5 text-brand-charcoal hover:bg-brand-charcoal/10"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {lang === "sw" ? "EN" : "SW"}
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={() => setDark(!dark)}
              className={`rounded-full p-2 transition-all ${
                dark ? "bg-white/10 text-yellow-400 hover:bg-white/15" : "bg-brand-charcoal/5 text-brand-charcoal hover:bg-brand-charcoal/10"
              }`}
            >
              {dark ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <Link
              href="/login"
              className={`hidden rounded-lg px-4 py-2 text-sm font-medium transition sm:block ${
                dark ? "text-gray-300 hover:bg-white/10" : "text-brand-charcoal hover:bg-white"
              }`}
            >
              {t.nav.login}
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand-green px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark hover:shadow-lg hover:shadow-brand-green/25"
            >
              {t.nav.register}
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 md:px-12 lg:px-24 lg:pb-24 lg:pt-36">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full blur-[120px] ${dark ? "bg-brand-green/8" : "bg-brand-green/10"}`} />
          <div className={`absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full blur-[120px] ${dark ? "bg-brand-orange/5" : "bg-brand-orange/10"}`} />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row lg:justify-between">
          {/* Left: Text */}
          <div
            className="max-w-xl text-center lg:text-left"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ${dark ? "bg-brand-green/15 text-brand-green-light" : "bg-brand-green/10 text-brand-green"}`}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
              </span>
              {t.hero.badge}
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              {t.hero.title1}
              <br />
              <span className="bg-gradient-to-r from-brand-green to-brand-green-light bg-clip-text text-transparent">
                {t.hero.title2}
              </span>
            </h1>

            <p className={`mt-6 text-lg leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>
              {t.hero.desc}
            </p>
            {t.hero.descEn && (
              <p className={`mt-2 text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>
                {t.hero.descEn}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand-green px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-green/25 transition-all hover:bg-brand-green-dark hover:shadow-xl hover:shadow-brand-green/30"
              >
                <span>{t.hero.cta}</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#features"
                className={`rounded-xl border-2 px-8 py-4 text-center text-base font-semibold transition-all ${
                  dark
                    ? "border-white/15 text-gray-300 hover:border-white/25 hover:bg-white/5"
                    : "border-brand-green/20 text-brand-green hover:border-brand-green/40 hover:bg-brand-green/5"
                }`}
              >
                {t.hero.secondary}
              </Link>
            </div>

            <p className={`mt-5 text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>
              {t.hero.trust}
            </p>
          </div>

          {/* Right: Phone Mockup */}
          <div
            className="relative flex-shrink-0"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 1s ease 0.3s, transform 1s ease 0.3s",
            }}
          >
            <div className={`relative mx-auto h-[580px] w-[280px] rounded-[40px] border-4 p-2 shadow-2xl ${dark ? "border-gray-700 bg-gray-800" : "border-brand-charcoal bg-white"}`}>
              {/* Phone notch */}
              <div className={`absolute left-1/2 top-0 z-10 h-6 w-24 -translate-x-1/2 rounded-b-xl ${dark ? "bg-gray-700" : "bg-brand-charcoal"}`} />

              {/* Screen */}
              <div className={`h-full overflow-hidden rounded-[32px] ${dark ? "bg-[#1A1A2E]" : "bg-brand-cream"}`}>
                <div className="flex items-center justify-between bg-brand-green-dark px-4 pb-1 pt-8">
                  <span className="text-[10px] font-medium text-white/70">FoodOS</span>
                  <span className="text-[10px] text-white/70">09:41</span>
                </div>
                <div className="bg-brand-green px-4 pb-4 pt-2">
                  <p className="text-[10px] text-white/70">{t.phone.greeting}</p>
                  <p className="text-sm font-bold text-white">{t.phone.today}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3">
                  {[
                    { label: t.phone.revenue, val: "TZS 450K", sub: "+12%", color: "text-brand-green" },
                    { label: t.phone.cogs, val: "TZS 180K", sub: "40%", color: "text-brand-orange" },
                    { label: t.phone.expenses, val: "TZS 35K", sub: "Gesi, Ufungaji", color: dark ? "text-gray-300" : "text-gray-700" },
                    { label: t.phone.profit, val: "TZS 235K", sub: "52% margin", color: "text-brand-green" },
                  ].map((kpi) => (
                    <div key={kpi.label} className={`rounded-xl p-3 shadow-sm ${dark ? "bg-gray-800/80" : "bg-white"}`}>
                      <p className={`text-[9px] ${dark ? "text-gray-500" : "text-gray-500"}`}>{kpi.label}</p>
                      <p className={`text-sm font-bold ${kpi.color}`}>{kpi.val}</p>
                      <p className="text-[8px] text-gray-400">{kpi.sub}</p>
                    </div>
                  ))}
                </div>

                <div className={`mx-3 rounded-xl p-3 shadow-sm ${dark ? "bg-gray-800/80" : "bg-white"}`}>
                  <p className={`text-[9px] font-medium ${dark ? "text-gray-500" : "text-gray-500"}`}>{t.phone.chart}</p>
                  <div className="mt-2 flex items-end gap-1.5">
                    {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t"
                          style={{
                            height: `${h * 0.5}px`,
                            backgroundColor: i === 6 ? "#E8712B" : "#2D7A3A",
                            opacity: i === 6 ? 1 : 0.6 + i * 0.05,
                          }}
                        />
                        <span className="text-[7px] text-gray-400">
                          {["Ju", "Ju", "Al", "Al", "Ij", "Ju", "Leo"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mx-3 mt-2 rounded-lg bg-red-500/10 p-2">
                  <p className="text-[9px] font-medium text-red-500">{t.phone.alert}</p>
                </div>

                <div className={`absolute bottom-2 left-2 right-2 flex items-center justify-around rounded-2xl py-2 shadow-md ${dark ? "bg-gray-800" : "bg-white"}`}>
                  {t.phone.nav.map((label, i) => (
                    <div key={label} className="flex flex-col items-center gap-0.5">
                      <div className={`h-4 w-4 rounded-full ${i === 0 ? "bg-brand-green" : dark ? "bg-gray-700" : "bg-gray-200"}`} />
                      <span className={`text-[7px] ${i === 0 ? "font-bold text-brand-green" : "text-gray-400"}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className={`absolute -left-6 top-16 rounded-xl px-3 py-2 shadow-lg ${dark ? "border border-white/5 bg-[#1E1E2E]" : "bg-white"}`}>
              <p className="text-[10px] font-medium text-brand-green">M-Pesa</p>
              <p className={`text-xs font-bold ${dark ? "text-gray-200" : "text-brand-charcoal"}`}>Malipo Papo</p>
            </div>
            <div className={`absolute -right-6 top-40 rounded-xl px-3 py-2 shadow-lg ${dark ? "border border-white/5 bg-[#1E1E2E]" : "bg-white"}`}>
              <p className="text-[10px] font-medium text-brand-orange">Idhini</p>
              <p className={`text-xs font-bold ${dark ? "text-gray-200" : "text-brand-charcoal"}`}>2 Zinasubiri</p>
            </div>
            <div className={`absolute -left-2 bottom-24 rounded-xl px-3 py-2 shadow-lg ${dark ? "border border-white/5 bg-[#1E1E2E]" : "bg-white"}`}>
              <p className="text-[10px] font-medium text-green-500">Offline</p>
              <p className={`text-xs font-bold ${dark ? "text-gray-200" : "text-brand-charcoal"}`}>Inafanya Kazi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className={`px-6 py-20 md:px-12 lg:px-24 ${dark ? "bg-[#13131D]" : "bg-white"}`}>
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t.features.title}</h2>
            <p className={`mx-auto mt-3 max-w-lg text-sm ${dark ? "text-gray-500" : "text-gray-500"}`}>
              {t.features.subtitle}
            </p>
          </AnimatedSection>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((f, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div
                  className={`group h-full rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    dark
                      ? "border-white/5 bg-[#1A1A2E] hover:border-brand-green/20 hover:shadow-brand-green/5"
                      : "border-gray-100 bg-brand-cream hover:border-brand-green/20 hover:shadow-brand-green/10"
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${dark ? "bg-brand-green/15" : "bg-brand-green/10"}`}>
                    <FeatureIcon name={f.icon} className="h-6 w-6 text-brand-green" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROLES ===== */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t.roles.title}</h2>
            <p className={`mx-auto mt-3 max-w-lg text-sm ${dark ? "text-gray-500" : "text-gray-500"}`}>
              {t.roles.subtitle}
            </p>
          </AnimatedSection>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {t.roles.items.map((r, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div
                  className={`h-full rounded-2xl border p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    dark
                      ? "border-white/5 bg-[#1A1A2E] hover:shadow-white/5"
                      : "border-gray-100 bg-white shadow-md"
                  }`}
                >
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${roleColors[r.color]}`}>
                    <div className={`h-8 w-8 rounded-full ${roleIconColors[r.color]}`} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{r.role}</h3>
                  {r.roleEn && <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{r.roleEn}</p>}
                  <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>{r.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className={`px-6 py-20 md:px-12 lg:px-24 ${dark ? "bg-[#13131D]" : "bg-white"}`}>
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t.pricing.title}</h2>
            <p className={`mx-auto mt-3 max-w-lg text-sm ${dark ? "text-gray-500" : "text-gray-500"}`}>
              {t.pricing.subtitle}
            </p>
          </AnimatedSection>

          <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-2">
            {t.pricing.plans.map((plan, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
              <div
                className={`relative h-full rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? dark
                      ? "border-brand-green/40 bg-brand-green/5 shadow-lg shadow-brand-green/10"
                      : "border-brand-green bg-brand-green/5 shadow-lg shadow-brand-green/10"
                    : dark
                    ? "border-white/5 bg-[#1A1A2E]"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-light px-4 py-1 text-xs font-bold text-white shadow-lg">
                    {lang === "sw" ? "MAARUFU" : "POPULAR"}
                  </div>
                )}
                <h3 className="text-lg font-bold">
                  {plan.name}
                  {plan.nameEn && <span className={`ml-1 text-sm font-normal ${dark ? "text-gray-500" : "text-gray-400"}`}>({plan.nameEn})</span>}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-sm">TZS</span>
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                </div>
                <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>{plan.period}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-sm">
                      <svg className="h-4 w-4 flex-shrink-0 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={dark ? "text-gray-300" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`mt-7 block rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-brand-green text-white shadow-lg shadow-brand-green/25 hover:bg-brand-green-dark"
                      : dark
                      ? "border border-white/10 text-gray-300 hover:border-brand-green/40 hover:text-brand-green"
                      : "border-2 border-brand-green text-brand-green hover:bg-brand-green/5"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden px-6 py-20 md:px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-brand-green-dark to-brand-green" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
        <AnimatedSection className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">{t.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-md text-base text-white/70">{t.cta.desc}</p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-bold text-brand-green shadow-2xl transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            {t.cta.button}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </AnimatedSection>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={`px-6 py-10 ${dark ? "bg-[#0A0A12]" : "bg-brand-charcoal"}`}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left: Logo */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="FoodOS" width={36} height={36} className="h-9 w-9 rounded-lg object-contain" />
              <span className="text-lg font-bold text-white">
                Food<span className="text-brand-orange">OS</span>
              </span>
            </div>
            <p className="text-xs text-gray-500">{t.footer.tagline}</p>
          </div>

          {/* Center: Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              foodos.online
            </p>
            <p className="mt-1 text-xs text-gray-600">
              &copy; 2026 FoodOS. {t.footer.rights}
            </p>
          </div>

          {/* Right: Staff Portal */}
          <div className="flex flex-col items-center gap-2 md:items-end">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-gray-400 transition hover:border-white/20 hover:text-gray-300"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
              {t.nav.staff}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
