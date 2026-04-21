import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
    });

    if (!tenant) {
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // 30-day financials from DailySummary
    let financials = await prisma.dailySummary.findMany({
      where: { tenantId: id, date: { gte: thirtyDaysAgo } },
      orderBy: { date: "asc" },
    });

    // Revenue aggregates
    let totalRevenue30d = 0;
    let totalCogs30d = 0;
    let totalExpenses30d = 0;
    let totalProfit30d = 0;
    const dailyFinancials = financials.map((f) => {
      const rev = Number(f.totalRevenue);
      const cog = Number(f.totalCogs);
      const exp = Number(f.totalExpenses);
      const prof = Number(f.netProfit);
      totalRevenue30d += rev;
      totalCogs30d += cog;
      totalExpenses30d += exp;
      totalProfit30d += prof;
      return {
        date: f.date.toISOString().split("T")[0],
        revenue: rev,
        cogs: cog,
        expenses: exp,
        profit: prof,
        orderCount: f.orderCount,
      };
    });

    // If no DailySummary data, fallback to orders
    if (financials.length === 0) {
      const orders = await prisma.order.findMany({
        where: { tenantId: id, createdAt: { gte: thirtyDaysAgo }, status: { not: "cancelled" } },
        select: { total: true, cogsTotal: true, createdAt: true },
      });
      const byDate: Record<string, { revenue: number; cogs: number; count: number }> = {};
      for (const o of orders) {
        const d = o.createdAt.toISOString().split("T")[0];
        if (!byDate[d]) byDate[d] = { revenue: 0, cogs: 0, count: 0 };
        byDate[d].revenue += Number(o.total);
        byDate[d].cogs += Number(o.cogsTotal);
        byDate[d].count++;
        totalRevenue30d += Number(o.total);
        totalCogs30d += Number(o.cogsTotal);
      }
      totalProfit30d = totalRevenue30d - totalCogs30d;
      for (const [date, data] of Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b))) {
        dailyFinancials.push({
          date,
          revenue: data.revenue,
          cogs: data.cogs,
          expenses: 0,
          profit: data.revenue - data.cogs,
          orderCount: data.count,
        });
      }
    }

    // Order stats by status
    const orderStats = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
      where: { tenantId: id },
    });

    const totalOrders = await prisma.order.count({ where: { tenantId: id } });

    // Top 10 products
    const topProducts = await prisma.orderItem.groupBy({
      by: ["menuItemId"],
      _sum: { totalPrice: true, quantity: true },
      _count: true,
      where: { tenantId: id },
      orderBy: { _sum: { totalPrice: "desc" } },
      take: 10,
    });

    // Resolve product names
    const menuItemIds = topProducts.map((p) => p.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      select: { id: true, name: true, price: true },
    });
    const menuMap: Record<string, { name: string; price: number }> = {};
    for (const m of menuItems) {
      menuMap[m.id] = { name: m.name, price: Number(m.price) };
    }

    // Low stock ingredients - fetch all and filter in JS since Prisma can't compare two columns
    const allIngredients = await prisma.ingredient.findMany({
      where: { tenantId: id, isActive: true },
      select: { id: true, name: true, unit: true, currentStock: true, minStock: true },
    });
    const lowStockItems = allIngredients
      .filter((i) => Number(i.currentStock) <= Number(i.minStock) && Number(i.minStock) > 0)
      .slice(0, 10);

    // Menu items count
    const menuItemsCount = await prisma.menuItem.count({ where: { tenantId: id } });

    // Recent orders by payment method
    const paymentMethodStats = await prisma.order.groupBy({
      by: ["paymentMethod"],
      _sum: { total: true },
      _count: true,
      where: {
        tenantId: id,
        createdAt: { gte: thirtyDaysAgo },
        status: { not: "cancelled" },
        paymentMethod: { not: null },
      },
    });

    // Recent activity (UserAction)
    const recentActivity = await prisma.userAction.findMany({
      where: { tenantId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      where: { tenantId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        cashier: { select: { name: true } },
      },
    });

    // Expenses breakdown
    const expensesByCategory = await prisma.expense.groupBy({
      by: ["category"],
      _sum: { amount: true },
      where: {
        tenantId: id,
        date: { gte: thirtyDaysAgo },
        approvalStatus: "approved",
      },
    });

    return Response.json({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      phone: tenant.phone,
      email: tenant.email,
      address: tenant.address,
      city: tenant.city,
      subscriptionPlan: tenant.subscriptionPlan,
      subscriptionStatus: tenant.subscriptionStatus,
      approvalStatus: tenant.approvalStatus,
      kycStatus: tenant.kycStatus,
      createdAt: tenant.createdAt,
      team: tenant.users,
      financials: {
        totalRevenue30d,
        totalCogs30d,
        totalExpenses30d,
        totalProfit30d,
        dailyTimeSeries: dailyFinancials,
      },
      orderStats: {
        total: totalOrders,
        byStatus: orderStats.map((s) => ({ status: s.status, count: s._count })),
      },
      topProducts: topProducts.map((p) => ({
        menuItemId: p.menuItemId,
        name: menuMap[p.menuItemId]?.name || "Unknown",
        price: menuMap[p.menuItemId]?.price || 0,
        qtySold: Number(p._sum.quantity || 0),
        revenue: Number(p._sum.totalPrice || 0),
        orderCount: p._count,
      })),
      lowStock: lowStockItems.map((i) => ({
        id: i.id,
        name: i.name,
        unit: i.unit,
        current: Number(i.currentStock),
        minimum: Number(i.minStock),
      })),
      menuItemsCount,
      paymentMethods: paymentMethodStats.map((p) => ({
        method: p.paymentMethod,
        amount: Number(p._sum.total || 0),
        count: p._count,
      })),
      expensesByCategory: expensesByCategory.map((e) => ({
        category: e.category,
        amount: Number(e._sum.amount || 0),
      })),
      recentActivity: recentActivity.map((a) => ({
        id: a.id,
        userId: a.userId,
        action: a.action,
        createdAt: a.createdAt,
      })),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: Number(o.total),
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        cashier: o.cashier.name,
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    console.error("Restaurant detail error:", error);
    return Response.json({ error: "Failed to fetch restaurant details" }, { status: 500 });
  }
}
