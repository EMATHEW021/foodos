import { resend, FROM_EMAIL } from "@/lib/resend";
import { NextRequest } from "next/server";

interface LowStockItem {
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, restaurantName, items } = await request.json();

    if (!email || !items || !Array.isArray(items) || items.length === 0) {
      return Response.json(
        {
          error:
            "Missing required fields: email and items (non-empty array) are required",
        },
        { status: 400 }
      );
    }

    const restaurant = restaurantName || "FoodOS Restaurant";

    // Build stock items rows
    const itemRows = (items as LowStockItem[])
      .map((item) => {
        const percentage = Math.round(
          (item.currentStock / item.minStock) * 100
        );
        const isVeryLow = percentage <= 50;
        const barColor = isVeryLow ? "#dc2626" : "#E8712B";
        const barWidth = Math.min(percentage, 100);

        return `
          <tr>
            <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; font-weight: 500;">
              ${item.name}
            </td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; text-align: center;">
              <span style="color: ${isVeryLow ? "#dc2626" : "#E8712B"}; font-size: 16px; font-weight: 700;">
                ${item.currentStock}
              </span>
              <span style="color: #aaa; font-size: 12px;"> ${item.unit}</span>
            </td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; text-align: center;">
              <span style="color: #555; font-size: 14px; font-weight: 500;">
                ${item.minStock}
              </span>
              <span style="color: #aaa; font-size: 12px;"> ${item.unit}</span>
            </td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; text-align: center;">
              <div style="background: #f0f0f0; border-radius: 10px; height: 8px; width: 60px; display: inline-block; vertical-align: middle;">
                <div style="background: ${barColor}; border-radius: 10px; height: 8px; width: ${barWidth}%;"></div>
              </div>
              <span style="color: ${isVeryLow ? "#dc2626" : "#E8712B"}; font-size: 11px; margin-left: 6px; font-weight: 600;">
                ${percentage}%
              </span>
            </td>
          </tr>`;
      })
      .join("");

    const criticalCount = (items as LowStockItem[]).filter(
      (i) => Math.round((i.currentStock / i.minStock) * 100) <= 50
    ).length;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `\u26a0\ufe0f Tahadhari: Vifaa vichache — Low stock alert`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f7f7f7;">
          <!-- Header -->
          <div style="background: #2D7A3A; padding: 28px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">&#127860; FoodOS</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 6px 0 0;">Mfumo wa Usimamizi wa Mgahawa</p>
          </div>

          <!-- Body -->
          <div style="background: #ffffff; padding: 35px 30px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <!-- Alert banner -->
            <div style="background: #FFF3E0; border: 2px solid #E8712B; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
              <p style="font-size: 32px; margin: 0 0 8px;">&#9888;&#65039;</p>
              <h2 style="color: #E8712B; font-size: 20px; margin: 0 0 5px;">
                Tahadhari: Vifaa vya Chini
              </h2>
              <p style="color: #C06020; font-size: 13px; margin: 0;">
                Low Stock Alert &mdash; ${restaurant}
              </p>
            </div>

            <!-- Summary -->
            <div style="display: flex; margin-bottom: 25px;">
              <table style="width: 100%;">
                <tr>
                  <td style="background: #FEF2F2; border-radius: 8px; padding: 14px 16px; text-align: center; width: 48%;">
                    <p style="color: #dc2626; font-size: 24px; font-weight: 800; margin: 0;">
                      ${items.length}
                    </p>
                    <p style="color: #888; font-size: 11px; margin: 4px 0 0;">
                      Vifaa vya chini (Low stock items)
                    </p>
                  </td>
                  <td style="width: 4%;"></td>
                  <td style="background: #FFF8F0; border-radius: 8px; padding: 14px 16px; text-align: center; width: 48%;">
                    <p style="color: #E8712B; font-size: 24px; font-weight: 800; margin: 0;">
                      ${criticalCount}
                    </p>
                    <p style="color: #888; font-size: 11px; margin: 4px 0 0;">
                      Hatari sana (Critical &lt;50%)
                    </p>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Items table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="background: #fafafa;">
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Bidhaa (Item)
                  </th>
                  <th style="padding: 10px 16px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Sasa (Current)
                  </th>
                  <th style="padding: 10px 16px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Chini (Min)
                  </th>
                  <th style="padding: 10px 16px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Kiwango
                  </th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>

            <!-- Reorder suggestion -->
            <div style="background: #f0faf0; border-left: 4px solid #2D7A3A; padding: 16px 18px; border-radius: 0 10px 10px 0; margin-bottom: 20px;">
              <p style="color: #2D7A3A; font-size: 14px; font-weight: 600; margin: 0 0 6px;">
                Pendekezo: Agiza Upya (Reorder Suggestion)
              </p>
              <p style="color: #555; font-size: 13px; line-height: 1.6; margin: 0;">
                Tunapendekeza uagize vifaa vilivyoonyeshwa hapo juu ili kuepuka ukosefu wa bidhaa.
                Bonyeza hapa chini kwenda kwenye dashboard yako ya stoku.
              </p>
              <p style="color: #888; font-size: 12px; line-height: 1.5; margin: 6px 0 0;">
                We recommend reordering the items listed above to avoid stockouts.
                Click below to go to your stock dashboard.
              </p>
            </div>

            <!-- CTA button -->
            <div style="text-align: center;">
              <a href="https://foodos.online/stock"
                 style="display: inline-block; background: #2D7A3A; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Fungua Stoku &rarr; Open Stock
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e8e8e8; border-radius: 0 0 12px 12px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <p style="color: #999; font-size: 11px; margin: 0;">
              Arifa hii imetumwa kwa sababu umewasha &quot;Tahadhari za Stoku Chini&quot; kwenye mipangilio.
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
        { error: "Failed to send low stock alert email" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("Low stock email error:", error);
    return Response.json(
      { error: "Low stock alert email send failed" },
      { status: 500 }
    );
  }
}
