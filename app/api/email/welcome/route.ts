"use server";

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
      subject: `Karibu FoodOS! ${restaurantName} imesajiliwa`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 30px 0;">
            <h1 style="color: #2D7A3A; font-size: 28px; margin: 0;">🍴 FoodOS</h1>
            <p style="color: #666; font-size: 14px; margin-top: 5px;">Mfumo wa Usimamizi wa Mgahawa</p>
          </div>

          <div style="background: #f8faf8; border-radius: 12px; padding: 30px; border: 1px solid #e8f0e8;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Habari ${ownerName}! 👋</h2>
            <p style="color: #444; line-height: 1.6;">
              Karibu sana kwenye FoodOS! Mgahawa wako <strong>${restaurantName}</strong> umesajiliwa kwa mafanikio.
            </p>
            <p style="color: #444; line-height: 1.6;">
              Welcome to FoodOS! Your restaurant <strong>${restaurantName}</strong> has been successfully registered.
            </p>

            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <h3 style="color: #2D7A3A; margin-top: 0; font-size: 16px;">Hatua Zifuatazo (Next Steps):</h3>
              <ol style="color: #444; line-height: 2;">
                <li>Ongeza vyakula kwenye menyu yako — Add your menu items</li>
                <li>Sajili malighafi zako — Register your ingredients</li>
                <li>Unganisha resiti na malighafi — Link recipes to ingredients</li>
                <li>Anza kupokea oda! — Start taking orders!</li>
              </ol>
            </div>

            <div style="text-align: center; margin-top: 25px;">
              <a href="https://foodos.online/dashboard"
                 style="background: #2D7A3A; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                Fungua Dashboard →
              </a>
            </div>
          </div>

          <div style="text-align: center; padding: 20px 0; color: #999; font-size: 12px;">
            <p>Maswali? Wasiliana nasi: support@foodos.online</p>
            <p style="margin-top: 5px;">© ${new Date().getFullYear()} FoodOS — Dar es Salaam, Tanzania</p>
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
