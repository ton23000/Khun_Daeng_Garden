import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminOrStaff } from "@/lib/auth-server";

// PATCH /api/admin/trees/[id]/stock - Update stock quantity
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await verifyAdminOrStaff(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: treeId } = await params;
    const body = await req.json();

    // Support both old format { stock: number } and new format { action: 'add'|'set', amount: number }
    let updateData: Record<string, unknown>;

    if ("action" in body && "amount" in body) {
      // New format with action
      const { action, amount } = body;

      if (typeof amount !== "number" || amount < 0) {
        return NextResponse.json(
          { error: "จำนวนต้องเป็นตัวเลขที่ไม่ติดลบ" },
          { status: 400 },
        );
      }

      if (action === "add") {
        updateData = {
          stock: {
            increment: amount,
          },
        };
      } else if (action === "set") {
        updateData = {
          stock: amount,
        };
      } else {
        return NextResponse.json(
          { error: 'Invalid action. Use "add" or "set"' },
          { status: 400 },
        );
      }
    } else if ("stock" in body) {
      // Old format - backward compatibility
      const { stock } = body;
      if (typeof stock !== "number" || stock < 0) {
        return NextResponse.json(
          { error: "สต็อกต้องเป็นตัวเลขที่ไม่ติดลบ" },
          { status: 400 },
        );
      }
      updateData = {
        stock: stock,
      };
    } else {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const tree = await prisma.tree.update({
      where: { id: treeId },
      data: updateData,
    });

    return NextResponse.json(tree);
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "ไม่สามารถอัปเดตสต็อกได้" },
      { status: 500 },
    );
  }
}
