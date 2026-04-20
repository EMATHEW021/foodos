import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        approvalStatus: "rejected",
        rejectionReason: reason || "Ombi limekataliwa (Application rejected)",
      },
    });

    return Response.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        approvalStatus: tenant.approvalStatus,
      },
    });
  } catch (error) {
    console.error("Reject error:", error);
    return Response.json({ error: "Failed to reject" }, { status: 500 });
  }
}
