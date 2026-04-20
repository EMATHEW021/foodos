import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      const tenant = await tx.tenant.update({
        where: { id },
        data: {
          kycStatus: "approved",
          kycApprovedAt: new Date(),
          approvalStatus: "approved",
          approvedAt: new Date(),
        },
      });

      const owner = await tx.user.findFirst({
        where: { tenantId: id, role: "owner" },
      });

      return { tenant, owner };
    });

    // Email owner
    if (result.owner?.email) {
      resend.emails.send({
        from: FROM_EMAIL,
        to: result.owner.email,
        subject: `KYC Imeidhinishwa! Sasa unaweza kuunda timu - FoodOS`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #f7f7f7;">
            <div style="background: #2D7A3A; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #fff; font-size: 22px; margin: 0;">&#127860; FoodOS</h1>
            </div>
            <div style="background: #fff; padding: 30px; border: 1px solid #e8e8e8; border-top: none;">
              <div style="text-align: center; margin: 0 0 20px;">
                <div style="font-size: 48px;">&#127881;</div>
                <h2 style="color: #2D7A3A; margin: 8px 0 4px;">KYC Imeidhinishwa!</h2>
                <p style="color: #888; font-size: 13px;">Your KYC has been approved!</p>
              </div>
              <p style="color: #555; font-size: 14px; line-height: 1.6;">
                Habari ${result.owner.name}, sasa unaweza kuunda timu yako - ongeza Meneja wa Mauzo na Karani wa POS.
              </p>
              <div style="text-align: center; margin-top: 24px;">
                <a href="https://foodos.online/staff" style="background: #2D7A3A; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">Unda Timu &rarr;</a>
              </div>
            </div>
          </div>
        `,
      }).catch(console.error);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("KYC approve error:", error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
