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
          approvalStatus: "approved",
          approvedAt: new Date(),
        },
      });

      // Activate owner user
      await tx.user.updateMany({
        where: { tenantId: id, role: "owner" },
        data: { isActive: true },
      });

      // Get owner details for email
      const owner = await tx.user.findFirst({
        where: { tenantId: id, role: "owner" },
      });

      return { tenant, owner };
    });

    // Send approval email to restaurant owner
    if (result.owner?.email) {
      resend.emails.send({
        from: FROM_EMAIL,
        to: result.owner.email,
        subject: `Hongera! ${result.tenant.name} imeidhinishwa - FoodOS`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f7f7f7;">
            <div style="background: #2D7A3A; padding: 28px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">&#127860; FoodOS</h1>
              <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 6px 0 0;">Mfumo wa Usimamizi wa Mgahawa</p>
            </div>
            <div style="background: #ffffff; padding: 35px 30px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
              <div style="background: #f0fdf4; border: 2px solid #2D7A3A; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
                <div style="font-size: 48px; margin: 0 0 8px;">&#127881;</div>
                <p style="color: #2D7A3A; font-size: 20px; font-weight: 800; margin: 0;">Hongera!</p>
                <p style="color: #166534; font-size: 13px; margin: 6px 0 0;">Mgahawa wako umeidhinishwa!</p>
              </div>
              <h2 style="color: #1a1a1a; font-size: 18px; margin: 0 0 8px;">Habari ${result.owner.name},</h2>
              <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
                Mgahawa wako <strong>${result.tenant.name}</strong> umeidhinishwa na sasa uko tayari kutumia FoodOS!
                <br /><span style="color: #888; font-size: 13px;">Your restaurant has been approved and is ready to use!</span>
              </p>
              <div style="background: #f8faf8; border-radius: 8px; padding: 20px; border: 1px solid #e8f0e8; margin: 0 0 24px;">
                <h3 style="color: #2D7A3A; margin: 0 0 12px; font-size: 14px;">Anza na hatua hizi:</h3>
                <ol style="color: #444; font-size: 13px; line-height: 2.2; margin: 0; padding-left: 20px;">
                  <li><strong>Ingia</strong> kwenye akaunti yako — Log in</li>
                  <li><strong>Ongeza menyu</strong> yako — Add your menu items</li>
                  <li><strong>Ongeza wafanyakazi</strong> (karani, meneja) — Add staff</li>
                  <li><strong>Anza kupokea oda!</strong> — Start taking orders!</li>
                </ol>
              </div>
              <div style="text-align: center;">
                <a href="https://foodos.online/login" style="background: #2D7A3A; color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 14px;">
                  Ingia Sasa &rarr;
                </a>
              </div>
            </div>
            <div style="background: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e8e8e8; border-radius: 0 0 12px 12px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
              <p style="color: #bbb; font-size: 10px; margin: 0;">&copy; ${new Date().getFullYear()} FoodOS &mdash; Dar es Salaam, Tanzania</p>
            </div>
          </div>
        `,
      }).catch(console.error);
    }

    return Response.json({
      success: true,
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        approvalStatus: result.tenant.approvalStatus,
      },
    });
  } catch (error) {
    console.error("Approve error:", error);
    return Response.json({ error: "Failed to approve" }, { status: 500 });
  }
}
