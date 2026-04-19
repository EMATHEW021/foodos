import { resend, FROM_EMAIL } from "@/lib/resend";
import { NextRequest } from "next/server";

interface TopItem {
  name: string;
  qty: number;
}

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      restaurantName,
      date,
      revenue,
      cogs,
      expenses,
      profit,
      orderCount,
      topItems,
    } = await request.json();

    if (!email || !date || revenue === undefined) {
      return Response.json(
        {
          error:
            "Missing required fields: email, date, and revenue are required",
        },
        { status: 400 }
      );
    }

    const restaurant = restaurantName || "FoodOS Restaurant";
    const reportDate = date;
    const totalRevenue = Number(revenue) || 0;
    const totalCogs = Number(cogs) || 0;
    const totalExpenses = Number(expenses) || 0;
    const totalProfit = Number(profit) || totalRevenue - totalCogs - totalExpenses;
    const totalOrders = Number(orderCount) || 0;
    const profitMargin =
      totalRevenue > 0
        ? Math.round((totalProfit / totalRevenue) * 100)
        : 0;
    const isProfitable = totalProfit >= 0;

    // Build top items rows
    const topItemsList = (topItems as TopItem[]) || [];
    const topItemsRows = topItemsList
      .slice(0, 5)
      .map(
        (item, index) => `
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #888; text-align: center; width: 40px;">
              ${index + 1}
            </td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; font-weight: 500;">
              ${item.name}
            </td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #2D7A3A; font-weight: 700; text-align: right;">
              ${item.qty}
            </td>
          </tr>`
      )
      .join("");

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `\ud83d\udcca Ripoti ya Leo — Daily Report ${reportDate}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f7f7f7;">
          <!-- Header -->
          <div style="background: #2D7A3A; padding: 28px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">&#127860; FoodOS</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 6px 0 0;">Mfumo wa Usimamizi wa Mgahawa</p>
          </div>

          <!-- Body -->
          <div style="background: #ffffff; padding: 35px 30px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <!-- Report title -->
            <div style="text-align: center; margin-bottom: 28px;">
              <h2 style="color: #1a1a1a; font-size: 22px; margin: 0 0 5px;">
                Ripoti ya Leo
              </h2>
              <p style="color: #888; font-size: 13px; margin: 0;">
                Daily Report &mdash; ${restaurant}
              </p>
              <div style="display: inline-block; background: #f0f0f0; border-radius: 20px; padding: 6px 16px; margin-top: 10px;">
                <span style="color: #555; font-size: 13px; font-weight: 600;">
                  ${reportDate}
                </span>
              </div>
            </div>

            <!-- KPI Cards -->
            <table style="width: 100%; border-collapse: separate; border-spacing: 8px; margin-bottom: 8px;">
              <tr>
                <!-- Revenue -->
                <td style="background: #f0faf0; border-radius: 10px; padding: 18px 16px; text-align: center; width: 50%; border: 1px solid #e0f0e0;">
                  <p style="color: #888; font-size: 11px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Mapato (Revenue)
                  </p>
                  <p style="color: #2D7A3A; font-size: 22px; font-weight: 800; margin: 0;">
                    TZS ${totalRevenue.toLocaleString()}
                  </p>
                </td>
                <!-- Orders -->
                <td style="background: #FFF8F0; border-radius: 10px; padding: 18px 16px; text-align: center; width: 50%; border: 1px solid #F5E0CC;">
                  <p style="color: #888; font-size: 11px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Oda (Orders)
                  </p>
                  <p style="color: #E8712B; font-size: 22px; font-weight: 800; margin: 0;">
                    ${totalOrders}
                  </p>
                </td>
              </tr>
            </table>

            <table style="width: 100%; border-collapse: separate; border-spacing: 8px; margin-bottom: 25px;">
              <tr>
                <!-- COGS -->
                <td style="background: #FFF8F0; border-radius: 10px; padding: 14px 16px; text-align: center; width: 33%; border: 1px solid #F5E0CC;">
                  <p style="color: #888; font-size: 10px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Gharama za Bidhaa (COGS)
                  </p>
                  <p style="color: #E8712B; font-size: 16px; font-weight: 700; margin: 0;">
                    TZS ${totalCogs.toLocaleString()}
                  </p>
                </td>
                <!-- Expenses -->
                <td style="background: #f5f5f5; border-radius: 10px; padding: 14px 16px; text-align: center; width: 33%; border: 1px solid #e0e0e0;">
                  <p style="color: #888; font-size: 10px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Gharama (Expenses)
                  </p>
                  <p style="color: #666666; font-size: 16px; font-weight: 700; margin: 0;">
                    TZS ${totalExpenses.toLocaleString()}
                  </p>
                </td>
                <!-- Profit -->
                <td style="background: ${isProfitable ? "#f0faf0" : "#FEF2F2"}; border-radius: 10px; padding: 14px 16px; text-align: center; width: 34%; border: 1px solid ${isProfitable ? "#e0f0e0" : "#fde2e2"};">
                  <p style="color: #888; font-size: 10px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Faida (Profit)
                  </p>
                  <p style="color: ${isProfitable ? "#2D7A3A" : "#dc2626"}; font-size: 16px; font-weight: 700; margin: 0;">
                    TZS ${totalProfit.toLocaleString()}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Profit Margin Badge -->
            <div style="text-align: center; margin-bottom: 28px;">
              <div style="display: inline-block; background: ${isProfitable ? "#f0faf0" : "#FEF2F2"}; border: 2px solid ${isProfitable ? "#2D7A3A" : "#dc2626"}; border-radius: 12px; padding: 12px 24px;">
                <p style="color: #888; font-size: 11px; margin: 0 0 4px;">
                  Asilimia ya Faida (Profit Margin)
                </p>
                <p style="color: ${isProfitable ? "#2D7A3A" : "#dc2626"}; font-size: 28px; font-weight: 800; margin: 0;">
                  ${profitMargin}%
                </p>
                <p style="color: ${isProfitable ? "#2D7A3A" : "#dc2626"}; font-size: 11px; margin: 4px 0 0; font-weight: 600;">
                  ${isProfitable ? "Faida Nzuri (Profitable)" : "Hasara (Loss)"}
                </p>
              </div>
            </div>

            ${
              topItemsList.length > 0
                ? `
            <!-- Top 5 Items -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 12px;">
                Bidhaa Bora 5 (Top 5 Items)
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #fafafa;">
                    <th style="padding: 10px 16px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8; width: 40px;">
                      #
                    </th>
                    <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                      Bidhaa (Item)
                    </th>
                    <th style="padding: 10px 16px; text-align: right; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                      Idadi (Qty)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${topItemsRows}
                </tbody>
              </table>
            </div>
            `
                : ""
            }

            <!-- CTA -->
            <div style="text-align: center;">
              <a href="https://foodos.online/reports"
                 style="display: inline-block; background: #2D7A3A; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Tazama Ripoti Kamili &rarr; View Full Report
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e8e8e8; border-radius: 0 0 12px 12px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <p style="color: #999; font-size: 11px; margin: 0;">
              Ripoti hii imetumwa kiotomatiki. Badilisha mipangilio ya arifa kwenye dashboard yako.
            </p>
            <p style="color: #bbb; font-size: 11px; margin: 4px 0 0;">
              This report was sent automatically. Change notification settings in your dashboard.
            </p>
            <p style="color: #bbb; font-size: 10px; margin: 8px 0 0;">
              &copy; ${new Date().getFullYear()} FoodOS &mdash; Dar es Salaam, Tanzania
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "Failed to send daily report email" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("Daily report email error:", error);
    return Response.json(
      { error: "Daily report email send failed" },
      { status: 500 }
    );
  }
}
