import { prisma } from "@/lib/prisma";

function getPeriodRange(period: string): { start: Date; end: Date } {
  const now = new Date();
  const end = now;
  let start: Date;
  switch (period) {
    case "week":
      start = new Date(now.getTime() - 7 * 86400000);
      break;
    case "month":
      start = new Date(now.getTime() - 30 * 86400000);
      break;
    case "quarter":
      start = new Date(now.getTime() - 90 * 86400000);
      break;
    case "year":
      start = new Date(now.getTime() - 365 * 86400000);
      break;
    default:
      start = new Date(now.getTime() - 30 * 86400000);
  }
  return { start, end };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";
    const { start, end } = getPeriodRange(period);

    // Previous period for growth calculation
    const periodMs = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - periodMs);

    // Try DailySummary first
    const [summaries, prevSummaries] = await Promise.all([
      prisma.dailySummary.findMany({
        where: { date: { gte: start, lte: end } },
        orderBy: { date: "asc" },
      }),
      prisma.dailySummary.findMany({
        where: { date: { gte: prevStart, lt: start } },
      }),
    ]);

    let revenue = 0;
    let cogs = 0;
    let expenses = 0;
    let netProfit = 0;
    let dailyTimeSeries: { date: string; revenue: number; cogs: number; expenses: number; profit: number }[] = [];

    if (summaries.length > 0) {
      // Use DailySummary data
      const byDate: Record<string, { revenue: number; cogs: number; expenses: number; profit: number }> = {};
      for (const s of summaries) {
        const dateKey = s.date.toISOString().split("T")[0];
        if (!byDate[dateKey]) {
          byDate[dateKey] = { revenue: 0, cogs: 0, expenses: 0, profit: 0 };
        }
        byDate[dateKey].revenue += Number(s.totalRevenue);
        byDate[dateKey].cogs += Number(s.totalCogs);
        byDate[dateKey].expenses += Number(s.totalExpenses);
        byDate[dateKey].profit += Number(s.netProfit);
      }
      for (const s of summaries) {
        revenue += Number(s.totalRevenue);
        cogs += Number(s.totalCogs);
        expenses += Number(s.totalExpenses);
        netProfit += Number(s.netProfit);
      }
      dailyTimeSeries = Object.entries(byDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => ({ date, ...data }));
    } else {
      // Fallback: aggregate from Order table
      const orders = await prisma.order.findMany({
        where: {
          createdAt: { gte: start, lte: end },
          status: { not: "cancelled" },
          paymentStatus: "paid",
        },
        select: { total: true, cogsTotal: true, createdAt: true },
      });

      const byDate: Record<string, { revenue: number; cogs: number; expenses: number; profit: number }> = {};
      for (const o of orders) {
        const dateKey = o.createdAt.toISOString().split("T")[0];
        if (!byDate[dateKey]) {
          byDate[dateKey] = { revenue: 0, cogs: 0, expenses: 0, profit: 0 };
        }
        const rev = Number(o.total);
        const c = Number(o.cogsTotal);
        byDate[dateKey].revenue += rev;
        byDate[dateKey].cogs += c;
        byDate[dateKey].profit += rev - c;
        revenue += rev;
        cogs += c;
      }
      netProfit = revenue - cogs;
      dailyTimeSeries = Object.entries(byDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => ({ date, ...data }));

      // Get expenses separately
      const expenseData = await prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: start, lte: end }, approvalStatus: "approved" },
      });
      expenses = Number(expenseData._sum.amount || 0);
      netProfit -= expenses;
    }

    // Previous period revenue for growth
    let prevRevenue = 0;
    if (prevSummaries.length > 0) {
      for (const s of prevSummaries) {
        prevRevenue += Number(s.totalRevenue);
      }
    } else {
      const prevOrders = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: prevStart, lt: start },
          status: { not: "cancelled" },
          paymentStatus: "paid",
        },
      });
      prevRevenue = Number(prevOrders._sum.total || 0);
    }

    const growthPct = prevRevenue > 0 ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : 0;

    // Revenue by payment method
    const byPaymentMethod = await prisma.order.groupBy({
      by: ["paymentMethod"],
      _sum: { total: true },
      _count: true,
      where: {
        createdAt: { gte: start, lte: end },
        status: { not: "cancelled" },
        paymentStatus: "paid",
        paymentMethod: { not: null },
      },
    });

    // Revenue by city via tenant
    const ordersByTenant = await prisma.order.groupBy({
      by: ["tenantId"],
      _sum: { total: true },
      where: {
        createdAt: { gte: start, lte: end },
        status: { not: "cancelled" },
        paymentStatus: "paid",
      },
    });

    const tenantIds = ordersByTenant.map((o) => o.tenantId);
    const tenantCities = await prisma.tenant.findMany({
      where: { id: { in: tenantIds } },
      select: { id: true, city: true },
    });
    const tenantCityMap: Record<string, string> = {};
    for (const t of tenantCities) {
      tenantCityMap[t.id] = t.city;
    }
    const cityRevenue: Record<string, number> = {};
    for (const o of ordersByTenant) {
      const city = tenantCityMap[o.tenantId] || "Nyinginezo";
      cityRevenue[city] = (cityRevenue[city] || 0) + Number(o._sum.total || 0);
    }
    const byCity = Object.entries(cityRevenue)
      .map(([city, amount]) => ({ city, amount }))
      .sort((a, b) => b.amount - a.amount);

    // Recent transactions
    const recentTransactions = await prisma.order.findMany({
      take: 20,
      where: {
        createdAt: { gte: start, lte: end },
        status: { not: "cancelled" },
      },
      orderBy: { createdAt: "desc" },
      include: {
        tenant: { select: { name: true } },
        cashier: { select: { name: true } },
      },
    });

    return Response.json({
      period,
      totals: { revenue, cogs, expenses, netProfit },
      growthPct,
      dailyTimeSeries,
      byPaymentMethod: byPaymentMethod.map((p) => ({
        method: p.paymentMethod,
        amount: Number(p._sum.total || 0),
        count: p._count,
      })),
      byCity,
      recentTransactions: recentTransactions.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        restaurant: o.tenant.name,
        cashier: o.cashier.name,
        amount: Number(o.total),
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        status: o.status,
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    console.error("Revenue API error:", error);
    return Response.json({ error: "Failed to fetch revenue data" }, { status: 500 });
  }
}
