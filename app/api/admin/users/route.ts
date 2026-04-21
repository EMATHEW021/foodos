import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const tenantId = searchParams.get("tenantId");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (role && role !== "all") {
      where.role = role;
    }
    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }
    if (tenantId && tenantId !== "all") {
      where.tenantId = tenantId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }

    const [users, totalUsers, activeUsers, roleCounts, tenants] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          tenant: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.groupBy({
        by: ["role"],
        _count: true,
      }),
      prisma.tenant.findMany({
        where: { approvalStatus: { not: "pending" } },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);

    const counts: Record<string, number> = {};
    for (const rc of roleCounts) {
      counts[rc.role] = rc._count;
    }

    return Response.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isActive: u.isActive,
        tenantId: u.tenantId,
        tenantName: u.tenant.name,
        createdAt: u.createdAt,
      })),
      stats: {
        total: totalUsers,
        active: activeUsers,
        owners: counts.owner || 0,
        managers: counts.manager || 0,
        cashiers: counts.cashier || 0,
        superAdmins: counts.super_admin || 0,
      },
      tenants,
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
