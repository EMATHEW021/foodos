import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { authId: authUser.id },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            approvalStatus: true,
            kycStatus: true,
            subscriptionPlan: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      tenantId: user.tenantId,
      tenant: user.tenant,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
