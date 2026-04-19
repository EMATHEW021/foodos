import { resend, FROM_EMAIL } from "@/lib/resend";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, otp, name } = await request.json();

    if (!email || !otp) {
      return Response.json(
        { error: "Missing required fields: email and otp are required" },
        { status: 400 }
      );
    }

    const displayName = name || "Mtumiaji";

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Nambari yako ya kuthibitisha — Your verification code",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f7f7f7;">
          <!-- Header -->
          <div style="background: #2D7A3A; padding: 28px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">&#127860; FoodOS</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 6px 0 0;">Mfumo wa Usimamizi wa Mgahawa</p>
          </div>

          <!-- Body -->
          <div style="background: #ffffff; padding: 35px 30px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 8px;">
              Habari ${displayName},
            </h2>
            <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 25px;">
              Tumepokea ombi la kuingia kwenye akaunti yako. Tumia nambari hii ya kuthibitisha:
              <br />
              <span style="color: #888; font-size: 13px;">We received a request to sign in to your account. Use this verification code:</span>
            </p>

            <!-- OTP Code Card -->
            <div style="background: #f8faf8; border: 2px solid #2D7A3A; border-radius: 12px; padding: 30px; text-align: center; margin: 0 0 25px;">
              <p style="color: #888; font-size: 12px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">
                Nambari ya Kuthibitisha (Verification Code)
              </p>
              <div style="font-size: 40px; font-weight: 800; color: #E8712B; letter-spacing: 10px; font-family: 'Courier New', monospace; margin: 0;">
                ${otp}
              </div>
            </div>

            <!-- Expiry Notice -->
            <div style="background: #FFF8F0; border-left: 4px solid #E8712B; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 0 0 25px;">
              <p style="color: #E8712B; font-size: 13px; margin: 0; font-weight: 600;">
                Nambari hii itaisha baada ya dakika 10.
              </p>
              <p style="color: #C06020; font-size: 12px; margin: 4px 0 0;">
                This code expires in 10 minutes.
              </p>
            </div>

            <!-- Security note -->
            <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 0;">
              Ikiwa hukuomba nambari hii, puuza barua pepe hii. Akaunti yako iko salama.
              <br />
              <span style="color: #aaa;">If you didn't request this code, please ignore this email. Your account is safe.</span>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e8e8e8; border-radius: 0 0 12px 12px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <p style="color: #999; font-size: 11px; margin: 0;">
              Maswali? Wasiliana nasi: support@foodos.online
            </p>
            <p style="color: #bbb; font-size: 10px; margin: 6px 0 0;">
              &copy; ${new Date().getFullYear()} FoodOS &mdash; Dar es Salaam, Tanzania
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "Failed to send OTP email" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("OTP email error:", error);
    return Response.json(
      { error: "OTP email send failed" },
      { status: 500 }
    );
  }
}
