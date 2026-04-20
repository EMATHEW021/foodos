import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      // Update tenant approval status
      const tenant = await tx.tenant.update({
        where: { id },
        data: {
          approvalStatus: "approved",
          approvedAt: new Date(),
        },
      });

      // Activate owner user
      await tx.user.updateMany({
        where: { tenantId: id, role: "owner" },
        data: { isActive: true },
      });

      return tenant;
    });

    // TODO: Send approval email via Resend

    return Response.json({
      success: true,
      tenant: {
        id: result.id,
        name: result.name,
        approvalStatus: result.approvalStatus,
      },
    });
  } catch (error) {
    console.error("Approve error:", error);
    return Response.json({ error: "Failed to approve" }, { status: 500 });
  }
}
