import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

// GET - List staff for current tenant
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
    if (!dbUser) return Response.json({ error: "User not found" }, { status: 404 });

    const staff = await prisma.user.findMany({
      where: { tenantId: dbUser.tenantId },
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    });

    return Response.json({ staff });
  } catch (error) {
    console.error("Staff list error:", error);
    return Response.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

// POST - Add new staff member
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
      include: { tenant: true },
    });
    if (!dbUser) return Response.json({ error: "User not found" }, { status: 404 });

    // Only owner/manager can add staff
    if (!["owner", "manager"].includes(dbUser.role)) {
      return Response.json({ error: "Permission denied" }, { status: 403 });
    }

    // Check max users
    const currentCount = await prisma.user.count({ where: { tenantId: dbUser.tenantId } });
    if (currentCount >= (dbUser.tenant?.maxUsers || 3)) {
      return Response.json({ error: "Maximum staff limit reached. Upgrade your plan." }, { status: 400 });
    }

    const { name, phone, email, role } = await request.json();

    if (!name || !phone) {
      return Response.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const validRoles = ["manager", "cashier"];
    if (!validRoles.includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    const newStaff = await prisma.user.create({
      data: {
        tenantId: dbUser.tenantId,
        name,
        phone,
        email: email || null,
        role,
        isActive: true,
      },
    });

    return Response.json({ success: true, staff: newStaff });
  } catch (error) {
    console.error("Add staff error:", error);
    return Response.json({ error: "Failed to add staff" }, { status: 500 });
  }
}
