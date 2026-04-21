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

    // Top 20 products globally
    const topProducts = await prisma.orderItem.groupBy({
      by: ["menuItemId"],
      _sum: { totalPrice: true, quantity: true },
      _count: true,
      where: {
        order: {
          createdAt: { gte: start, lte: end },
          status: { not: "cancelled" },
        },
      },
      orderBy: { _sum: { totalPrice: "desc" } },
      take: 20,
    });

    // Resolve menu item details
    const menuItemIds = topProducts.map((p) => p.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      select: { id: true, name: true, price: true, tenantId: true },
    });
    const menuMap: Record<string, { name: string; price: number; tenantId: string }> = {};
    for (const m of menuItems) {
      menuMap[m.id] = { name: m.name, price: Number(m.price), tenantId: m.tenantId };
    }

    // Count restaurants per product
    const productTenants = await prisma.orderItem.groupBy({
      by: ["menuItemId", "tenantId"],
      where: {
        menuItemId: { in: menuItemIds },
        order: {
          createdAt: { gte: start, lte: end },
          status: { not: "cancelled" },
        },
      },
    });
    const restaurantCountPerProduct: Record<string, number> = {};
    for (const pt of productTenants) {
      restaurantCountPerProduct[pt.menuItemId] = (restaurantCountPerProduct[pt.menuItemId] || 0) + 1;
    }

    // Restaurant leaderboard (by revenue)
    // Use DailySummary first
    let leaderboard = await prisma.dailySummary.groupBy({
      by: ["tenantId"],
      _sum: { totalRevenue: true, orderCount: true },
      where: { date: { gte: start, lte: end } },
      orderBy: { _sum: { totalRevenue: "desc" } },
      take: 20,
    });

    let leaderboardData: { tenantId: string; revenue: number; orders: number }[] = [];

    if (leaderboard.length > 0) {
      leaderboardData = leaderboard.map((l) => ({
        tenantId: l.tenantId,
        revenue: Number(l._sum.totalRevenue || 0),
        orders: Number(l._sum.orderCount || 0),
      }));
    } else {
      // Fallback to orders
      const orderLeaderboard = await prisma.order.groupBy({
        by: ["tenantId"],
        _sum: { total: true },
        _count: true,
        where: {
          createdAt: { gte: start, lte: end },
          status: { not: "cancelled" },
          paymentStatus: "paid",
        },
        orderBy: { _sum: { total: "desc" } },
        take: 20,
      });
      leaderboardData = orderLeaderboard.map((o) => ({
        tenantId: o.tenantId,
        revenue: Number(o._sum.total || 0),
        orders: o._count,
      }));
    }

    // Resolve tenant names
    const tenantIds = leaderboardData.map((l) => l.tenantId);
    const tenants = await prisma.tenant.findMany({
      where: { id: { in: tenantIds } },
      select: { id: true, name: true, city: true },
    });
    const tenantMap: Record<string, { name: string; city: string }> = {};
    for (const t of tenants) {
      tenantMap[t.id] = { name: t.name, city: t.city };
    }

    return Response.json({
      period,
      topProducts: topProducts.map((p) => ({
        menuItemId: p.menuItemId,
        name: menuMap[p.menuItemId]?.name || "Unknown",
        price: menuMap[p.menuItemId]?.price || 0,
        qtySold: Number(p._sum.quantity || 0),
        revenue: Number(p._sum.totalPrice || 0),
        orderCount: p._count,
        restaurantCount: restaurantCountPerProduct[p.menuItemId] || 0,
      })),
      leaderboard: leaderboardData.map((l, i) => ({
        rank: i + 1,
        tenantId: l.tenantId,
        name: tenantMap[l.tenantId]?.name || "Unknown",
        city: tenantMap[l.tenantId]?.city || "",
        revenue: l.revenue,
        orders: l.orders,
      })),
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return Response.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
