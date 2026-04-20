"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/* ──────────────────── NAV CONFIG ──────────────────── */

interface NavItem {
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "MUHTASARI",
    items: [
      { label: "Dashboard", icon: "home", href: "/admin" },
      { label: "Arifa", icon: "bell", href: "/admin/notifications", badge: 5 },
    ],
  },
  {
    title: "BIASHARA",
    items: [
      { label: "Migahawa", icon: "building", href: "/admin/restaurants" },
      { label: "Maombi", icon: "inbox", href: "/admin/applications" },
      { label: "Watumiaji", icon: "users", href: "/admin/users" },
    ],
  },
  {
    title: "FEDHA",
    items: [
      { label: "Mapato", icon: "wallet", href: "/admin/revenue" },
      { label: "Usajili", icon: "creditcard", href: "/admin/subscriptions" },
    ],
  },
  {
    title: "MFUMO",
    items: [
      { label: "Afya", icon: "heart", href: "/admin/health" },
      { label: "Kumbukumbu", icon: "clipboard", href: "/admin/audit" },
      { label: "Mipangilio", icon: "settings", href: "/admin/settings" },
    ],
  },
];

/* ──────────────────── ICONS ──────────────────── */

function NavIcon({ name, className = "" }: { name: string; className?: string }) {
  const c = `h-[18px] w-[18px] ${className}`;
  switch (name) {
    case "home":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
        </svg>
      );
    case "bell":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    case "inbox":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      );
    case "building":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "users":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "file":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "wallet":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "creditcard":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "heart":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "clipboard":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      );
    case "settings":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ──────────────────── LAYOUT ──────────────────── */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);

  // Fetch pending count and user info
  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.pendingApprovals !== undefined) setPendingCount(data.pendingApprovals);
      })
      .catch(() => {});

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.name) setAdminUser({ name: data.name, email: data.email || "" });
        // Role guard: redirect non-super_admin away from admin
        if (data.role && data.role !== "super_admin") {
          router.push("/dashboard");
        }
      })
      .catch(() => {});
  }, [pathname, router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  // Dark mode toggle
  useEffect(() => {
    const stored = localStorage.getItem("foodos-dark");
    if (stored === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("foodos-dark", String(next));
  }

  // Cmd+K handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchFocused(true);
    }
    if (e.key === "Escape") {
      setSearchFocused(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  /* ── Sidebar content (shared desktop + mobile) ── */
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* ── Logo + Admin Badge ── */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-2">
        <Image src="/images/logo.png" alt="FoodOS" width={36} height={36} className="h-9 w-9 rounded-lg object-contain" />
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-white tracking-tight">Food<span className="text-[#E8712B]">OS</span></span>
          <span className="rounded-md bg-[#2D7A3A]/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#4ade80]">
            Admin
          </span>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pt-4 pb-2">
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 transition ${
            searchFocused
              ? "bg-[#2a3042] ring-1 ring-[#2D7A3A]"
              : "bg-[#141825] hover:bg-[#2a3042]"
          }`}
          onClick={() => setSearchFocused(true)}
        >
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          {searchFocused ? (
            <input
              autoFocus
              type="text"
              placeholder="Tafuta..."
              className="flex-1 bg-transparent text-sm text-gray-300 placeholder:text-gray-500 outline-none"
              onBlur={() => setSearchFocused(false)}
            />
          ) : (
            <span className="flex-1 text-sm text-gray-500">Tafuta...</span>
          )}
          <kbd className="hidden rounded bg-[#141825] px-1.5 py-0.5 text-[10px] font-medium text-gray-500 sm:inline">
            &#8984;K
          </kbd>
        </div>
      </div>

      {/* ── Navigation Sections ── */}
      <nav className="flex-1 overflow-y-auto px-3 pt-2 pb-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${
                        active
                          ? "bg-[#2D7A3A]/15 text-white"
                          : "text-gray-400 hover:bg-[#ffffff08] hover:text-gray-200"
                      }`}
                    >
                      {/* Active left border */}
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#2D7A3A]" />
                      )}

                      <NavIcon
                        name={item.icon}
                        className={active ? "text-[#4ade80]" : "text-gray-500 group-hover:text-gray-300"}
                      />

                      <span className="flex-1">{item.label}</span>

                      {item.badge ? (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#E8712B] px-1.5 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      ) : item.href === "/admin/applications" && pendingCount > 0 ? (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#E8712B] px-1.5 text-[10px] font-bold text-white animate-pulse">
                          {pendingCount}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Bottom: User Profile ── */}
      <div className="border-t border-[#ffffff10] px-4 py-4 space-y-3">
        {/* Dark / Light toggle */}
        <button
          onClick={toggleDark}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-gray-400 transition hover:bg-[#ffffff08] hover:text-gray-200"
        >
          {darkMode ? (
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          <span>{darkMode ? "Mwanga (Light)" : "Giza (Dark)"}</span>
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2D7A3A] text-xs font-bold text-white ring-2 ring-[#4ade80]/30">
            {adminUser?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "SA"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{adminUser?.name || "Super Admin"}</p>
            <p className="truncate text-[11px] text-gray-500">Super Admin</p>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-gray-400 transition hover:bg-red-500/10 hover:text-red-400">
          <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Toka (Logout)</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] dark:bg-[#0f1117]">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex lg:w-[260px] lg:shrink-0 lg:flex-col bg-[#1a1f2e] shadow-xl">
        {sidebarContent}
      </aside>

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="relative z-10 flex w-[280px] flex-col bg-[#1a1f2e] shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-5 rounded-lg p-1.5 text-gray-400 transition hover:bg-[#ffffff10] hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-foreground transition hover:bg-muted"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="FoodOS" width={28} height={28} className="h-7 w-7 rounded object-contain" />
            <span className="text-sm font-bold text-foreground">Food<span className="text-[#E8712B]">OS</span></span>
            <span className="rounded bg-[#2D7A3A]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#2D7A3A]">
              Admin
            </span>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
