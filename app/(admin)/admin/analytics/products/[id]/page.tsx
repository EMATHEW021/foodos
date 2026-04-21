"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface OriginTenant {
  id: string;
  name: string;
}

interface TotalStats {
  unitsSold: number;
  revenue: number;
  orderCount: number;
  restaurantCount: number;
}

interface SalesByTenant {
  tenantId: string;
  name: string;
  city: string;
  qtySold: number;
  revenue: number;
  orderCount: number;
}

interface DailyTrend {
  date: string;
  qty: number;
  revenue: number;
}

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  originTenant: OriginTenant;
  totalStats: TotalStats;
  salesByTenant: SalesByTenant[];
  dailyTrend: DailyTrend[];
}

function fmt(n: number) {
  return n.toLocaleString("en-TZ");
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/admin/analytics/products/${id}`)
      .then((r) => r.json())
      .then((data) => setProduct(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

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

  if (!product) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-sm text-muted-foreground">Bidhaa haipatikani</p>
      </div>
    );
  }

  const { totalStats, salesByTenant, dailyTrend } = product;
  const maxDailyRevenue = Math.max(...dailyTrend.map((d) => d.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/admin"
          className="hover:text-foreground transition"
        >
          Dashboard
        </Link>
        <span>/</span>
        <Link
          href="/admin/analytics"
          className="hover:text-foreground transition"
        >
          Uchambuzi
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Product Info Card */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-sm text-muted-foreground max-w-xl">
                {product.description}
              </p>
            )}
            <p className="text-lg font-semibold text-[#E8712B]">
              TZS {fmt(product.price)}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                {product.category}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  product.isAvailable
                    ? "bg-[#2D7A3A]/10 text-[#2D7A3A]"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                {product.isAvailable ? "Inapatikana" : "Haipatikani"}
              </span>
            </div>
          </div>
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Mgahawa wa Asili
            </p>
            <Link
              href={`/admin/restaurants/${product.originTenant.id}`}
              className="text-sm font-semibold text-[#2D7A3A] hover:underline transition"
            >
              {product.originTenant.name}
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Units Sold */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Jumla Iliyouzwa
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D7A3A]/10">
              <svg
                className="h-4 w-4 text-[#2D7A3A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">
            {fmt(totalStats.unitsSold)}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">units</p>
        </div>

        {/* Revenue */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Mapato</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8712B]/10">
              <svg
                className="h-4 w-4 text-[#E8712B]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#E8712B]">
            TZS {fmt(totalStats.revenue)}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            jumla ya mapato
          </p>
        </div>

        {/* Restaurants Selling */}
        <div className="rounded-xl bg-card p-5 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Migahawa
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D7A3A]/10">
              <svg
                className="h-4 w-4 text-[#2D7A3A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#2D7A3A]">
            {fmt(totalStats.restaurantCount)}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            zinauza bidhaa hii
          </p>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-foreground">
            Mwenendo wa Mauzo
          </h2>
          <p className="text-xs text-muted-foreground">
            Sales Trend — Siku 30 zilizopita
          </p>
        </div>

        {dailyTrend.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <svg
              className="h-12 w-12 text-muted-foreground/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-sm text-muted-foreground">
              Hakuna data ya mauzo kwa siku 30 zilizopita
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div
              className="flex items-end gap-1.5"
              style={{
                minWidth: dailyTrend.length > 15 ? `${dailyTrend.length * 36}px` : "auto",
                height: "220px",
              }}
            >
              {dailyTrend.map((day, index) => {
                const heightPct = Math.max(
                  (day.revenue / maxDailyRevenue) * 100,
                  2
                );
                const isLatest = index === dailyTrend.length - 1;
                const dateLabel = new Date(day.date).toLocaleDateString(
                  "en-TZ",
                  { day: "2-digit", month: "short" }
                );
                return (
                  <div
                    key={day.date}
                    className="flex flex-1 flex-col items-center gap-1"
                    style={{ minWidth: "28px" }}
                  >
                    <span className="text-[9px] font-medium text-muted-foreground whitespace-nowrap">
                      {fmt(day.revenue)}
                    </span>
                    <div
                      className="w-full rounded-t-md transition-all duration-500"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: isLatest ? "#E8712B" : "#2D7A3A",
                        minHeight: "4px",
                      }}
                    />
                    <span className="text-[8px] text-muted-foreground whitespace-nowrap">
                      {dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sales by Restaurant Table */}
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-foreground">
            Mauzo kwa Mgahawa
          </h2>
          <p className="text-xs text-muted-foreground">
            Sales by Restaurant — Breakdown by tenant
          </p>
        </div>

        {salesByTenant.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Hakuna mauzo yaliyorekodwa
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">
                    Mgahawa
                  </th>
                  <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground">
                    Mji
                  </th>
                  <th className="pb-3 pr-4 text-xs font-semibold text-muted-foreground text-right">
                    Idadi
                  </th>
                  <th className="pb-3 text-xs font-semibold text-muted-foreground text-right">
                    Mapato
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {salesByTenant.map((tenant) => (
                  <tr
                    key={tenant.tenantId}
                    className="hover:bg-muted/30 transition"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        href={`/admin/restaurants/${tenant.tenantId}`}
                        className="text-sm font-medium text-foreground hover:text-[#2D7A3A] transition"
                      >
                        {tenant.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">
                      {tenant.city}
                    </td>
                    <td className="py-3 pr-4 text-sm font-semibold text-foreground text-right">
                      {fmt(tenant.qtySold)}
                    </td>
                    <td className="py-3 text-sm font-semibold text-foreground text-right">
                      TZS {fmt(tenant.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Back Link */}
      <div className="pt-2 pb-4">
        <Link
          href="/admin/analytics"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2D7A3A] hover:underline transition"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Rudi kwa Uchambuzi
        </Link>
      </div>
    </div>
  );
}
