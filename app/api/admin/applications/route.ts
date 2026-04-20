import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";

    const tenants = await prisma.tenant.findMany({
      where: {
        approvalStatus: status as "pending" | "approved" | "rejected" | "suspended",
      },
      include: {
        users: {
          where: { role: "owner" },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const applications = tenants.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      phone: t.phone,
      email: t.email,
      city: t.city,
      approvalStatus: t.approvalStatus,
      createdAt: t.createdAt,
      approvedAt: t.approvedAt,
      rejectionReason: t.rejectionReason,
      owner: t.users[0] || null,
    }));

    return Response.json({ applications });
  } catch (error) {
    console.error("List applications error:", error);
    return Response.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
