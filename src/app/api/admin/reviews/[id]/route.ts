import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminOrStaff } from "@/lib/auth-server";

// PATCH - Toggle review visibility (hidden/visible)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await verifyAdminOrStaff(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Define update data type
    const updateData: { hidden?: boolean; isFeatured?: boolean } = {};

    if (body.hidden !== undefined) updateData.hidden = Boolean(body.hidden);
    if (body.isFeatured !== undefined)
      updateData.isFeatured = Boolean(body.isFeatured);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
    });

    // Enforce max 4 featured reviews
    if (updateData.isFeatured) {
      const featuredReviews = await prisma.review.findMany({
        where: { isFeatured: true },
        orderBy: { updatedAt: "desc" },
      });

      if (featuredReviews.length > 4) {
        // Keep the 4 most recently updated, unfeature the rest
        const reviewsToUnfeature = featuredReviews.slice(4);

        for (const oldReview of reviewsToUnfeature) {
          await prisma.review.update({
            where: { id: oldReview.id },
            data: { isFeatured: false },
          });
        }
      }
    }

    // Recalculate tree rating
    const allReviews = await prisma.review.findMany({
      where: {
        treeId: review.treeId,
        hidden: false,
      },
      select: { rating: true },
    });

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    await prisma.tree.update({
      where: { id: review.treeId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a review permanently
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await verifyAdminOrStaff(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await prisma.review.delete({ where: { id } });

    // Recalculate tree rating
    const allReviews = await prisma.review.findMany({
      where: { treeId: review.treeId },
      select: { rating: true },
    });

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    await prisma.tree.update({
      where: { id: review.treeId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
