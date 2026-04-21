import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// GET - Full user profile with activity and stats
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            city: true,
            subscriptionPlan: true,
            approvalStatus: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Recent activity
    const recentActivity = await prisma.userAction.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    // Cashier stats (if cashier or has orders)
    const orderStats = await prisma.order.aggregate({
      _count: true,
      _sum: { total: true },
      where: { cashierId: id },
    });

    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
      where: { cashierId: id },
    });

    // Recent orders (if cashier)
    const recentOrders = await prisma.order.findMany({
      where: { cashierId: id },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        paymentMethod: true,
        paymentStatus: true,
        createdAt: true,
      },
    });

    return Response.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      tenant: user.tenant,
      activity: recentActivity.map((a) => ({
        id: a.id,
        action: a.action,
        createdAt: a.createdAt,
      })),
      cashierStats: {
        totalOrders: orderStats._count,
        totalRevenue: Number(orderStats._sum.total || 0),
        byStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count })),
      },
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        total: Number(o.total),
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    console.error("User detail error:", error);
    return Response.json({ error: "Failed to fetch user details" }, { status: 500 });
  }
}

// PATCH - Toggle user active/inactive
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Don't allow deactivating super_admin
    if (user.role === "super_admin" && body.isActive === false) {
      return Response.json({ error: "Cannot deactivate super admin" }, { status: 403 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: body.isActive },
    });

    return Response.json({ success: true, user: updated });
  } catch (error) {
    console.error("User update error:", error);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}
