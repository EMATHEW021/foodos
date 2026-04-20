import { resend, FROM_EMAIL } from "@/lib/resend";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, restaurantName, ownerName } = await request.json();

    if (!email || !restaurantName || !ownerName) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Karibu FoodOS! Ombi la ${restaurantName} limepokelewa`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f7f7f7;">
          <div style="background: #2D7A3A; padding: 28px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">&#127860; FoodOS</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 6px 0 0;">Mfumo wa Usimamizi wa Mgahawa</p>
          </div>
          <div style="background: #ffffff; padding: 35px 30px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 8px;">Habari ${ownerName}!</h2>
            <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
              Asante kwa kusajili mgahawa wako <strong>${restaurantName}</strong> kwenye FoodOS!
              <br /><span style="color: #888; font-size: 13px;">Thank you for registering <strong>${restaurantName}</strong> on FoodOS!</span>
            </p>
            <div style="background: #FFF8F0; border: 2px solid #E8712B; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 20px;">
              <p style="color: #E8712B; font-size: 14px; font-weight: 700; margin: 0 0 6px;">Ombi Lako Linapitiwa</p>
              <p style="color: #C06020; font-size: 12px; margin: 0;">Your application is being reviewed</p>
            </div>
            <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
              Timu yetu itapitia ombi lako na kukuidhinisha ndani ya masaa 24. Utapokea barua pepe mara tu akaunti yako itakapokuwa tayari.
            </p>
            <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 0 0 20px;">
              Our team will review your application and approve it within 24 hours. You'll receive an email once your account is ready.
            </p>
            <div style="background: #f8faf8; border-radius: 8px; padding: 20px; border: 1px solid #e8f0e8;">
              <h3 style="color: #2D7A3A; margin: 0 0 12px; font-size: 14px;">Utakachopata (What you'll get):</h3>
              <ul style="color: #444; font-size: 13px; line-height: 2; margin: 0; padding-left: 20px;">
                <li>Mfumo wa POS — Point of Sale system</li>
                <li>Usimamizi wa Menyu — Menu management</li>
                <li>Ufuatiliaji wa Stoku — Inventory tracking</li>
                <li>Ripoti za Mauzo — Sales reports</li>
                <li>Usimamizi wa Wafanyakazi — Staff management</li>
              </ul>
            </div>
          </div>
          <div style="background: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e8e8e8; border-radius: 0 0 12px 12px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <p style="color: #999; font-size: 11px; margin: 0;">Maswali? Wasiliana nasi: support@foodos.online</p>
            <p style="color: #bbb; font-size: 10px; margin: 6px 0 0;">&copy; ${new Date().getFullYear()} FoodOS &mdash; Dar es Salaam, Tanzania</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    return Response.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("Email error:", error);
    return Response.json({ error: "Email send failed" }, { status: 500 });
  }
}
