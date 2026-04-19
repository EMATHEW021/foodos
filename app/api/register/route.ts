import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantName, ownerName, phone, email, city, slug, authId } = body;

    if (!restaurantName || !ownerName || !phone || !slug) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await prisma.tenant.findUnique({ where: { slug } });
    if (existing) {
      return Response.json({ error: "Restaurant name already taken" }, { status: 409 });
    }

    // Create tenant + owner user in a transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      const tenant = await tx.tenant.create({
        data: {
          name: restaurantName,
          slug,
          phone,
          email: email || null,
          city,
          trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          authId: authId || null,
          name: ownerName,
          phone,
          email: email || null,
          role: "owner",
        },
      });

      return { tenant, user };
    });

    return Response.json({
      success: true,
      tenantId: result.tenant.id,
      userId: result.user.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
