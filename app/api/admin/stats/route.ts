import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalRestaurants,
      pendingApprovals,
      approvedRestaurants,
      rejectedRestaurants,
      totalUsers,
      recentTenants,
    ] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.count({ where: { approvalStatus: "pending" } }),
      prisma.tenant.count({ where: { approvalStatus: "approved" } }),
      prisma.tenant.count({ where: { approvalStatus: "rejected" } }),
      prisma.user.count(),
      prisma.tenant.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          users: {
            where: { role: "owner" },
            select: { name: true, email: true, phone: true },
          },
        },
      }),
    ]);

    return Response.json({
      totalRestaurants,
      pendingApprovals,
      approvedRestaurants,
      rejectedRestaurants,
      totalUsers,
      recentTenants: recentTenants.map((t) => ({
        id: t.id,
        name: t.name,
        city: t.city,
        approvalStatus: t.approvalStatus,
        subscriptionPlan: t.subscriptionPlan,
        createdAt: t.createdAt,
        owner: t.users[0] || null,
      })),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
