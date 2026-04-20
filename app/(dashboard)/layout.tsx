"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashibodi", icon: "📊" },
  { href: "/pos", label: "POS - Oda", icon: "🧾" },
  { href: "/stock", label: "Stoku", icon: "📦" },
  { href: "/expenses", label: "Gharama", icon: "💸" },
  { href: "/menu", label: "Menyu", icon: "🍽️" },
  { href: "/reports", label: "Ripoti", icon: "📈" },
  { href: "/staff", label: "Wafanyakazi", icon: "👥" },
  { href: "/settings", label: "Mipangilio", icon: "⚙️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  function toggleDark() {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-green-dark transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5">
          <Image src="/images/logo.png" alt="FoodOS" width={32} height={32} />
          <span className="text-lg font-bold text-white">
            Food<span className="text-brand-orange">OS</span>
          </span>
        </div>

        {/* Restaurant name */}
        <div className="mx-4 rounded-lg bg-white/10 px-3 py-2">
          <p className="text-xs text-white/60">Mgahawa</p>
          <p className="text-sm font-semibold text-white">Mama Salma Kitchen</p>
        </div>

        {/* Nav items */}
        <nav className="mt-4 flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-brand-green font-semibold text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Dark mode toggle */}
        <div className="px-4 pb-4">
          <button
            onClick={toggleDark}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            {darkMode ? "☀️" : "🌙"} {darkMode ? "Hali ya Mwanga" : "Hali ya Giza"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-foreground hover:bg-muted md:hidden"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">
              {navItems.find((i) => i.href === pathname)?.label || "Dashibodi"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-foreground hover:bg-muted">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13.73 21a2 2 0 0 1-3.46 0M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              </svg>
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-orange" />
            </button>

            {/* User */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
                MS
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium text-foreground">Mama Salma</p>
                <p className="text-[10px] text-muted-foreground">Mkurugenzi</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
