import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminOrStaff } from "@/lib/auth-server";

// GET - Fetch all reviews for admin (including hidden)
export async function GET(req: Request) {
  try {
    const user = await verifyAdminOrStaff(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        tree: {
          select: { id: true, name: true, images: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
