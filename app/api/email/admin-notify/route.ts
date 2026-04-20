import { resend, FROM_EMAIL } from "@/lib/resend";
import { NextRequest } from "next/server";

const ADMIN_EMAIL = "redvalvet450@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const { restaurantName, ownerName, email, phone, city } = await request.json();

    if (!restaurantName || !ownerName) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Ombi Jipya: ${restaurantName} - FoodOS`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f7f7f7;">
          <div style="background: #2D7A3A; padding: 28px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">&#127860; FoodOS Admin</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 6px 0 0;">New Restaurant Application</p>
          </div>
          <div style="background: #ffffff; padding: 35px 30px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <div style="background: #E8712B; color: white; display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin: 0 0 16px;">
              PENDING APPROVAL
            </div>
            <h2 style="color: #1a1a1a; font-size: 22px; margin: 0 0 20px;">${restaurantName}</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; width: 120px;">Owner</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${ownerName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-size: 14px;">${email || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a; font-size: 14px;">${phone || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #888; font-size: 13px;">City</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 14px;">${city || "—"}</td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 28px;">
              <a href="https://foodos.online/admin/applications"
                 style="background: #2D7A3A; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 14px;">
                Review Application &rarr;
              </a>
            </div>
          </div>
          <div style="background: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e8e8e8; border-radius: 0 0 12px 12px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <p style="color: #bbb; font-size: 10px; margin: 0;">&copy; ${new Date().getFullYear()} FoodOS Admin &mdash; Dar es Salaam, Tanzania</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Admin notify error:", error);
      return Response.json({ error: "Failed to send notification" }, { status: 500 });
    }

    return Response.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("Admin notify error:", error);
    return Response.json({ error: "Notification failed" }, { status: 500 });
  }
}
