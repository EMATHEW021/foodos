import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    // Exclude the system admin tenant
    where.slug = { not: "foodos-admin" };

    if (status && status !== "all") {
      where.approvalStatus = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const tenants = await prisma.tenant.findMany({
      where,
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
        _count: {
          select: {
            menuItems: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      restaurants: tenants.map((t) => {
        const owner = t.users.find((u) => u.role === "owner");
        return {
          id: t.id,
          name: t.name,
          slug: t.slug,
          phone: t.phone,
          email: t.email,
          city: t.city,
          approvalStatus: t.approvalStatus,
          kycStatus: t.kycStatus,
          subscriptionPlan: t.subscriptionPlan,
          subscriptionStatus: t.subscriptionStatus,
          createdAt: t.createdAt,
          staffCount: t.users.length,
          menuItems: t._count.menuItems,
          totalOrders: t._count.orders,
          owner: owner
            ? { name: owner.name, email: owner.email, phone: owner.phone }
            : null,
          team: t.users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            isActive: u.isActive,
            createdAt: u.createdAt,
          })),
        };
      }),
    });
  } catch (error) {
    console.error("Admin restaurants error:", error);
    return Response.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}
