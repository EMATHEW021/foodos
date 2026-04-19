import { resend, FROM_EMAIL } from "@/lib/resend";
import { NextRequest } from "next/server";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export async function POST(request: NextRequest) {
  try {
    const { email, orderNumber, items, total, paymentMethod, restaurantName } =
      await request.json();

    if (!email || !orderNumber || !items || !total) {
      return Response.json(
        {
          error:
            "Missing required fields: email, orderNumber, items, and total are required",
        },
        { status: 400 }
      );
    }

    const restaurant = restaurantName || "FoodOS Restaurant";
    const payment = paymentMethod || "Taslimu (Cash)";

    // Build items rows
    const itemRows = (items as OrderItem[])
      .map(
        (item) => `
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;">
              ${item.name}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #555; text-align: center;">
              ${item.qty}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: right; font-weight: 500;">
              TZS ${Number(item.price).toLocaleString()}
            </td>
          </tr>`
      )
      .join("");

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Oda #${orderNumber} imethibitishwa — Order confirmed`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f7f7f7;">
          <!-- Header -->
          <div style="background: #2D7A3A; padding: 28px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">&#127860; FoodOS</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 6px 0 0;">Mfumo wa Usimamizi wa Mgahawa</p>
          </div>

          <!-- Body -->
          <div style="background: #ffffff; padding: 35px 30px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <!-- Success badge -->
            <div style="text-align: center; margin-bottom: 25px;">
              <div style="display: inline-block; background: #f0faf0; border: 2px solid #2D7A3A; border-radius: 50%; width: 60px; height: 60px; line-height: 60px; font-size: 28px;">
                &#10003;
              </div>
              <h2 style="color: #2D7A3A; font-size: 22px; margin: 15px 0 5px;">
                Oda Imethibitishwa!
              </h2>
              <p style="color: #888; font-size: 13px; margin: 0;">Order Confirmed</p>
            </div>

            <!-- Order number card -->
            <div style="background: #f8faf8; border-radius: 10px; padding: 16px 20px; margin-bottom: 25px; text-align: center; border: 1px solid #e8f0e8;">
              <p style="color: #888; font-size: 11px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 1px;">
                Nambari ya Oda (Order Number)
              </p>
              <p style="color: #2D7A3A; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: 2px;">
                #${orderNumber}
              </p>
              <p style="color: #aaa; font-size: 11px; margin: 6px 0 0;">
                ${restaurant}
              </p>
            </div>

            <!-- Items table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #fafafa;">
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Bidhaa (Item)
                  </th>
                  <th style="padding: 10px 16px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Idadi (Qty)
                  </th>
                  <th style="padding: 10px 16px; text-align: right; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Bei (Price)
                  </th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>

            <!-- Total -->
            <div style="background: #2D7A3A; border-radius: 10px; padding: 18px 20px; display: flex; margin-bottom: 20px;">
              <table style="width: 100%;">
                <tr>
                  <td style="color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 600;">
                    Jumla (Total)
                  </td>
                  <td style="color: #ffffff; font-size: 22px; font-weight: 800; text-align: right;">
                    TZS ${Number(total).toLocaleString()}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Payment method -->
            <div style="background: #FFF8F0; border-radius: 8px; padding: 14px 16px; margin-bottom: 25px; border: 1px solid #F5E0CC;">
              <table style="width: 100%;">
                <tr>
                  <td style="color: #E8712B; font-size: 12px; font-weight: 600;">
                    Njia ya Malipo (Payment Method)
                  </td>
                  <td style="color: #C06020; font-size: 14px; font-weight: 700; text-align: right;">
                    ${payment}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Thank you -->
            <div style="text-align: center; padding: 10px 0;">
              <p style="color: #2D7A3A; font-size: 24px; font-weight: 800; margin: 0 0 8px;">
                Asante! &#127881;
              </p>
              <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0;">
                Asante kwa oda yako! Tunakutayarishia chakula kitamu.
              </p>
              <p style="color: #888; font-size: 13px; margin: 5px 0 0;">
                Thank you for your order! We are preparing your delicious meal.
              </p>
            </div>
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
        { error: "Failed to send order confirmation email" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("Order confirmation email error:", error);
    return Response.json(
      { error: "Order confirmation email send failed" },
      { status: 500 }
    );
  }
}
