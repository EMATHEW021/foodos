import { prisma } from "@/lib/prisma";

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  starter: 29000,
  professional: 59000,
  business: 149000,
  enterprise: 299000,
};

export async function GET() {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const monthAgo = new Date(now.getTime() - 30 * 86400000);

    const [
      totalRestaurants,
      pendingApprovals,
      approvedRestaurants,
      rejectedRestaurants,
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      newTenantsThisWeek,
      newTenantsThisMonth,
      pendingKyc,
      recentTenants,
      recentUsers,
      roleCounts,
      activeTenants,
      revenueSummaries,
      ordersThisWeek,
    ] = await Promise.all([
      prisma.tenant.count({ where: { slug: { not: "foodos-admin" } } }),
      prisma.tenant.count({ where: { approvalStatus: "pending" } }),
      prisma.tenant.count({ where: { approvalStatus: "approved", slug: { not: "foodos-admin" } } }),
      prisma.tenant.count({ where: { approvalStatus: "rejected" } }),
      prisma.user.count({ where: { role: { not: "super_admin" } } }),
      prisma.user.count({ where: { isActive: true, role: { not: "super_admin" } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo }, role: { not: "super_admin" } } }),
      prisma.tenant.count({ where: { createdAt: { gte: weekAgo }, slug: { not: "foodos-admin" } } }),
      prisma.tenant.count({ where: { createdAt: { gte: monthAgo }, slug: { not: "foodos-admin" } } }),
      prisma.tenant.count({ where: { kycStatus: "submitted" } }),
      prisma.tenant.findMany({
        take: 10,
        where: { slug: { not: "foodos-admin" } },
        orderBy: { createdAt: "desc" },
        include: {
          users: {
            where: { role: "owner" },
            select: { name: true, email: true, phone: true },
          },
        },
      }),
      prisma.user.findMany({
        take: 8,
        where: { role: { not: "super_admin" } },
        orderBy: { createdAt: "desc" },
        include: {
          tenant: { select: { name: true } },
        },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: true,
        where: { role: { not: "super_admin" } },
      }),
      // For MRR: get active/trial + approved tenants
      prisma.tenant.findMany({
        where: {
          slug: { not: "foodos-admin" },
          approvalStatus: "approved",
          subscriptionStatus: { in: ["active", "trial"] },
        },
        select: { subscriptionPlan: true },
      }),
      // Revenue aggregates from DailySummary
      prisma.dailySummary.aggregate({
        _sum: { totalRevenue: true, netProfit: true },
        where: { date: { gte: monthAgo } },
      }),
      // Orders this week
      prisma.order.count({
        where: { createdAt: { gte: weekAgo }, status: { not: "cancelled" } },
      }),
    ]);

    const counts: Record<string, number> = {};
    for (const rc of roleCounts) {
      counts[rc.role] = rc._count;
    }

    // Calculate MRR
    let mrr = 0;
    for (const t of activeTenants) {
      mrr += PLAN_PRICES[t.subscriptionPlan] || 0;
    }

    const revenueThisMonth = Number(revenueSummaries._sum.totalRevenue || 0);
    const netProfitThisMonth = Number(revenueSummaries._sum.netProfit || 0);

    // If DailySummary is empty, fallback to Order aggregation
    let fallbackRevenue = revenueThisMonth;
    if (revenueThisMonth === 0) {
      const orderRevenue = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: monthAgo },
          status: { not: "cancelled" },
          paymentStatus: "paid",
        },
      });
      fallbackRevenue = Number(orderRevenue._sum.total || 0);
    }

    // Revenue this week
    let revenueThisWeek = 0;
    const weekRevenue = await prisma.dailySummary.aggregate({
      _sum: { totalRevenue: true },
      where: { date: { gte: weekAgo } },
    });
    revenueThisWeek = Number(weekRevenue._sum.totalRevenue || 0);
    if (revenueThisWeek === 0) {
      const orderWeekRevenue = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: weekAgo },
          status: { not: "cancelled" },
          paymentStatus: "paid",
        },
      });
      revenueThisWeek = Number(orderWeekRevenue._sum.total || 0);
    }

    // Active restaurants (have orders in the last 30 days)
    const activeRestaurantsData = await prisma.order.groupBy({
      by: ["tenantId"],
      where: { createdAt: { gte: monthAgo } },
    });

    return Response.json({
      totalRestaurants,
      pendingApprovals,
      approvedRestaurants,
      rejectedRestaurants,
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      newTenantsThisWeek,
      newTenantsThisMonth,
      pendingKyc,
      roleCounts: counts,
      // New financial KPIs
      mrr,
      arr: mrr * 12,
      revenueThisWeek,
      revenueThisMonth: fallbackRevenue,
      netProfitThisMonth,
      ordersThisWeek,
      activeRestaurants: activeRestaurantsData.length,
      recentTenants: recentTenants.map((t) => ({
        id: t.id,
        name: t.name,
        city: t.city,
        approvalStatus: t.approvalStatus,
        subscriptionPlan: t.subscriptionPlan,
        createdAt: t.createdAt,
        owner: t.users[0] || null,
      })),
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        tenantName: u.tenant.name,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
