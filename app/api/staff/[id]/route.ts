import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

// PATCH - Update staff member
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
    if (!dbUser) return Response.json({ error: "User not found" }, { status: 404 });

    if (!["owner", "manager"].includes(dbUser.role)) {
      return Response.json({ error: "Permission denied" }, { status: 403 });
    }

    // Ensure target belongs to same tenant
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target || target.tenantId !== dbUser.tenantId) {
      return Response.json({ error: "Staff not found" }, { status: 404 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    if (body.phone) updateData.phone = body.phone;
    if (body.email !== undefined) updateData.email = body.email || null;
    if (body.role && ["manager", "cashier"].includes(body.role)) updateData.role = body.role;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return Response.json({ success: true, staff: updated });
  } catch (error) {
    console.error("Update staff error:", error);
    return Response.json({ error: "Failed to update staff" }, { status: 500 });
  }
}

// DELETE - Remove staff member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
    if (!dbUser) return Response.json({ error: "User not found" }, { status: 404 });

    if (dbUser.role !== "owner") {
      return Response.json({ error: "Only owner can delete staff" }, { status: 403 });
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target || target.tenantId !== dbUser.tenantId) {
      return Response.json({ error: "Staff not found" }, { status: 404 });
    }

    // Can't delete owner
    if (target.role === "owner") {
      return Response.json({ error: "Cannot delete owner" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete staff error:", error);
    return Response.json({ error: "Failed to delete staff" }, { status: 500 });
  }
}
