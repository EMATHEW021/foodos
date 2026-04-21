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

    // Get menu item details
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
        tenant: { select: { id: true, name: true } },
      },
    });

    if (!menuItem) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Total sales stats
    const totalStats = await prisma.orderItem.aggregate({
      _sum: { totalPrice: true, quantity: true },
      _count: true,
      where: { menuItemId: id },
    });

    // Sales by tenant
    const salesByTenant = await prisma.orderItem.groupBy({
      by: ["tenantId"],
      _sum: { totalPrice: true, quantity: true },
      _count: true,
      where: { menuItemId: id },
      orderBy: { _sum: { totalPrice: "desc" } },
    });

    const tenantIds = salesByTenant.map((s) => s.tenantId);
    const tenants = await prisma.tenant.findMany({
      where: { id: { in: tenantIds } },
      select: { id: true, name: true, city: true },
    });
    const tenantMap: Record<string, { name: string; city: string }> = {};
    for (const t of tenants) {
      tenantMap[t.id] = { name: t.name, city: t.city };
    }

    // Daily sales trend (last 30 days)
    const recentOrders = await prisma.orderItem.findMany({
      where: {
        menuItemId: id,
        order: { createdAt: { gte: thirtyDaysAgo }, status: { not: "cancelled" } },
      },
      select: {
        quantity: true,
        totalPrice: true,
        order: { select: { createdAt: true } },
      },
    });

    const dailySales: Record<string, { qty: number; revenue: number }> = {};
    for (const oi of recentOrders) {
      const d = oi.order.createdAt.toISOString().split("T")[0];
      if (!dailySales[d]) dailySales[d] = { qty: 0, revenue: 0 };
      dailySales[d].qty += oi.quantity;
      dailySales[d].revenue += Number(oi.totalPrice);
    }

    const dailyTrend = Object.entries(dailySales)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, qty: data.qty, revenue: data.revenue }));

    return Response.json({
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      price: Number(menuItem.price),
      category: menuItem.category.name,
      isAvailable: menuItem.isAvailable,
      originTenant: { id: menuItem.tenant.id, name: menuItem.tenant.name },
      totalStats: {
        unitsSold: Number(totalStats._sum.quantity || 0),
        revenue: Number(totalStats._sum.totalPrice || 0),
        orderCount: totalStats._count,
        restaurantCount: salesByTenant.length,
      },
      salesByTenant: salesByTenant.map((s) => ({
        tenantId: s.tenantId,
        name: tenantMap[s.tenantId]?.name || "Unknown",
        city: tenantMap[s.tenantId]?.city || "",
        qtySold: Number(s._sum.quantity || 0),
        revenue: Number(s._sum.totalPrice || 0),
        orderCount: s._count,
      })),
      dailyTrend,
    });
  } catch (error) {
    console.error("Product detail error:", error);
    return Response.json({ error: "Failed to fetch product details" }, { status: 500 });
  }
}
