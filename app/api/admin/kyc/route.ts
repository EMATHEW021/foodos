import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "submitted";

    const tenants = await prisma.tenant.findMany({
      where: {
        kycStatus: status as "not_submitted" | "submitted" | "approved" | "rejected",
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
      orderBy: { kycSubmittedAt: "desc" },
    });

    const applications = tenants.map((t) => ({
      id: t.id,
      name: t.name,
      phone: t.phone,
      city: t.city,
      nidaNumber: t.nidaNumber,
      shopType: t.shopType,
      shopAddress: t.shopAddress,
      shopPhotoUrl: t.shopPhotoUrl,
      kycStatus: t.kycStatus,
      kycSubmittedAt: t.kycSubmittedAt,
      kycApprovedAt: t.kycApprovedAt,
      kycRejectionReason: t.kycRejectionReason,
      owner: t.users[0] || null,
    }));

    return Response.json({ applications });
  } catch (error) {
    console.error("Admin KYC list error:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
