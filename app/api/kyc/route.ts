import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { NextRequest } from "next/server";

// POST - Submit KYC
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
      include: { tenant: true },
    });
    if (!dbUser || dbUser.role !== "owner") {
      return Response.json({ error: "Only owner can submit KYC" }, { status: 403 });
    }

    const { nidaNumber, shopAddress, shopType, shopPhotoUrl } = await request.json();

    if (!nidaNumber || !shopAddress || !shopType) {
      return Response.json({ error: "NIDA, address and shop type are required" }, { status: 400 });
    }

    const tenant = await prisma.tenant.update({
      where: { id: dbUser.tenantId },
      data: {
        nidaNumber,
        shopAddress,
        shopType,
        shopPhotoUrl: shopPhotoUrl || null,
        kycStatus: "submitted",
        kycSubmittedAt: new Date(),
      },
    });

    // Notify admin
    resend.emails.send({
      from: FROM_EMAIL,
      to: "redvalvet450@gmail.com",
      subject: `KYC Mpya: ${tenant.name} - FoodOS`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #f7f7f7;">
          <div style="background: #2D7A3A; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; font-size: 22px; margin: 0;">&#127860; FoodOS Admin</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 4px 0 0;">New KYC Submission</p>
          </div>
          <div style="background: #fff; padding: 30px; border: 1px solid #e8e8e8; border-top: none;">
            <div style="background: #E8712B; color: white; display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin: 0 0 16px;">PENDING KYC</div>
            <h2 style="margin: 0 0 16px; font-size: 20px;">${tenant.name}</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Owner</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600;">${dbUser.name}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">NIDA</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${nidaNumber}</td></tr>
              <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Shop Type</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${shopType}</td></tr>
              <tr><td style="padding: 10px 0; color: #888; font-size: 13px;">Address</td><td style="padding: 10px 0;">${shopAddress}</td></tr>
            </table>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://foodos.online/admin/kyc" style="background: #2D7A3A; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">Review KYC &rarr;</a>
            </div>
          </div>
        </div>
      `,
    }).catch(console.error);

    return Response.json({ success: true, kycStatus: "submitted" });
  } catch (error) {
    console.error("KYC submit error:", error);
    return Response.json({ error: "KYC submission failed" }, { status: 500 });
  }
}
