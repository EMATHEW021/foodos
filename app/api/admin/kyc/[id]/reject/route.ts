import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason } = await request.json();

    await prisma.tenant.update({
      where: { id },
      data: {
        kycStatus: "rejected",
        kycRejectionReason: reason || "KYC rejected",
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("KYC reject error:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
