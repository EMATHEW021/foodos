import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 86400000);

    const [
      pastDueTenants,
      suspendedTenants,
      trialsExpiring,
      inactiveUsersCount,
      newTenantsThisWeek,
      newUsersThisWeek,
    ] = await Promise.all([
      prisma.tenant.findMany({
        where: {
          slug: { not: "foodos-admin" },
          subscriptionStatus: "past_due",
        },
        select: { id: true, name: true, city: true },
      }),
      prisma.tenant.findMany({
        where: {
          slug: { not: "foodos-admin" },
          approvalStatus: "suspended",
        },
        select: { id: true, name: true, city: true },
      }),
      prisma.tenant.findMany({
        where: {
          slug: { not: "foodos-admin" },
          subscriptionStatus: "trial",
          trialEndsAt: { lte: sevenDaysFromNow, gte: now },
        },
        select: {
          id: true,
          name: true,
          trialEndsAt: true,
        },
      }),
      prisma.user.count({
        where: {
          role: { not: "super_admin" },
          isActive: true,
          updatedAt: { lt: thirtyDaysAgo },
        },
      }),
      prisma.tenant.count({
        where: { createdAt: { gte: weekAgo }, slug: { not: "foodos-admin" } },
      }),
      prisma.user.count({
        where: { createdAt: { gte: weekAgo }, role: { not: "super_admin" } },
      }),
    ]);

    const pendingApprovals = await prisma.tenant.count({
      where: { approvalStatus: "pending" },
    });

    const critical: { type: string; message: string; link: string; id?: string }[] = [];
    for (const t of pastDueTenants) {
      critical.push({
        type: "past_due",
        message: `Mgahawa "${t.name}" malipo yamechelewa`,
        link: `/admin/restaurants/${t.id}`,
        id: t.id,
      });
    }
    for (const t of suspendedTenants) {
      critical.push({
        type: "suspended",
        message: `Mgahawa "${t.name}" amesimamishwa`,
        link: `/admin/restaurants/${t.id}`,
        id: t.id,
      });
    }

    const warning: { type: string; message: string; link: string; count?: number }[] = [];
    if (trialsExpiring.length > 0) {
      warning.push({
        type: "trials_expiring",
        message: `Majaribio ${trialsExpiring.length} yanaisha wiki hii`,
        link: "/admin/subscriptions",
        count: trialsExpiring.length,
      });
    }
    if (pendingApprovals > 0) {
      warning.push({
        type: "pending_approvals",
        message: `Maombi ${pendingApprovals} yanasubiri idhini`,
        link: "/admin/applications",
        count: pendingApprovals,
      });
    }
    if (inactiveUsersCount > 0) {
      warning.push({
        type: "inactive_users",
        message: `Watumiaji ${inactiveUsersCount} hawajafanya kazi siku 30+`,
        link: "/admin/users",
        count: inactiveUsersCount,
      });
    }

    const info: { type: string; message: string; link: string; count?: number }[] = [];
    if (newTenantsThisWeek > 0) {
      info.push({
        type: "new_restaurants",
        message: `Migahawa ${newTenantsThisWeek} mipya wiki hii`,
        link: "/admin/restaurants",
        count: newTenantsThisWeek,
      });
    }
    if (newUsersThisWeek > 0) {
      info.push({
        type: "new_users",
        message: `Watumiaji ${newUsersThisWeek} wapya wiki hii`,
        link: "/admin/users",
        count: newUsersThisWeek,
      });
    }

    return Response.json({ critical, warning, info });
  } catch (error) {
    console.error("Alerts API error:", error);
    return Response.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}
