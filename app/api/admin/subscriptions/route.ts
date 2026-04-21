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
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 86400000);

    const [tenants, planCounts, statusCounts, trialsExpiring] = await Promise.all([
      // All tenants with subscription data
      prisma.tenant.findMany({
        where: { slug: { not: "foodos-admin" } },
        select: {
          id: true,
          name: true,
          city: true,
          phone: true,
          subscriptionPlan: true,
          subscriptionStatus: true,
          trialEndsAt: true,
          approvalStatus: true,
          createdAt: true,
          users: {
            where: { role: "owner" },
            select: { name: true, phone: true },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      // Plan counts
      prisma.tenant.groupBy({
        by: ["subscriptionPlan"],
        _count: true,
        where: { slug: { not: "foodos-admin" } },
      }),
      // Status counts
      prisma.tenant.groupBy({
        by: ["subscriptionStatus"],
        _count: true,
        where: { slug: { not: "foodos-admin" } },
      }),
      // Trials expiring within 7 days
      prisma.tenant.findMany({
        where: {
          slug: { not: "foodos-admin" },
          subscriptionStatus: "trial",
          trialEndsAt: { lte: sevenDaysFromNow, gte: now },
        },
        select: {
          id: true,
          name: true,
          subscriptionPlan: true,
          trialEndsAt: true,
          users: {
            where: { role: "owner" },
            select: { name: true },
            take: 1,
          },
        },
      }),
    ]);

    // Calculate MRR per plan
    const planCountMap: Record<string, number> = {};
    for (const pc of planCounts) {
      planCountMap[pc.subscriptionPlan] = pc._count;
    }

    const statusCountMap: Record<string, number> = {};
    for (const sc of statusCounts) {
      statusCountMap[sc.subscriptionStatus] = sc._count;
    }

    // MRR = sum of plan prices for active/trial + approved tenants
    let mrr = 0;
    for (const t of tenants) {
      if (
        (t.subscriptionStatus === "active" || t.subscriptionStatus === "trial") &&
        t.approvalStatus === "approved"
      ) {
        mrr += PLAN_PRICES[t.subscriptionPlan] || 0;
      }
    }

    // MRR per plan
    const mrrByPlan: Record<string, number> = {};
    for (const t of tenants) {
      if (
        (t.subscriptionStatus === "active" || t.subscriptionStatus === "trial") &&
        t.approvalStatus === "approved"
      ) {
        const plan = t.subscriptionPlan;
        mrrByPlan[plan] = (mrrByPlan[plan] || 0) + (PLAN_PRICES[plan] || 0);
      }
    }

    return Response.json({
      tenants: tenants.map((t) => ({
        id: t.id,
        name: t.name,
        city: t.city,
        phone: t.phone,
        plan: t.subscriptionPlan,
        status: t.subscriptionStatus,
        trialEndsAt: t.trialEndsAt,
        approvalStatus: t.approvalStatus,
        createdAt: t.createdAt,
        owner: t.users[0] || null,
      })),
      planCounts: planCountMap,
      statusCounts: statusCountMap,
      mrr,
      arr: mrr * 12,
      mrrByPlan,
      trialsExpiring: trialsExpiring.map((t) => ({
        id: t.id,
        name: t.name,
        plan: t.subscriptionPlan,
        trialEndsAt: t.trialEndsAt,
        daysLeft: t.trialEndsAt
          ? Math.max(0, Math.ceil((t.trialEndsAt.getTime() - now.getTime()) / 86400000))
          : 0,
        owner: t.users[0] || null,
      })),
    });
  } catch (error) {
    console.error("Subscriptions API error:", error);
    return Response.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}
