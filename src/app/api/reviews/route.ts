import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret =
    process.env.JWT_SECRET || "fallback_secret_for_development_only_12345";
  return new TextEncoder().encode(secret);
};

// GET - Fetch reviews for a tree
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const treeId = searchParams.get("treeId");
    const userIdFilter = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get authentication if available
    let currentUserId: string | null = null;
    const token = req.cookies.get("khun_daeng_token")?.value;
    if (token) {
      try {
        const verified = await jwtVerify(token, getJwtSecretKey());
        currentUserId = verified.payload.id as string;
      } catch {
        // Ignore invalid tokens for GET requests, just treat as anonymous
      }
    }

    const where: { hidden: boolean; treeId?: string; userId?: string } = {
      hidden: false, // Only show visible reviews by default
    };
    if (treeId) where.treeId = treeId;
    if (userIdFilter) where.userId = userIdFilter;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        tree: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.review.count({ where });

    // Get helpful votes for current user if logged in
    let userHelpfulReviewIds = new Set<string>();
    if (currentUserId && reviews.length > 0) {
      const reviewIds = reviews.map((r) => r.id);
      const helpfulVotes = await prisma.reviewHelpful.findMany({
        where: {
          userId: currentUserId,
          reviewId: { in: reviewIds },
        },
        select: { reviewId: true },
      });
      userHelpfulReviewIds = new Set(helpfulVotes.map((v) => v.reviewId));
    }

    // Map data to include isHelpful flag
    const formattedReviews = reviews.map((review) => ({
      ...review,
      isHelpful: userHelpfulReviewIds.has(review.id),
    }));

    return NextResponse.json({
      reviews: formattedReviews,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

// POST - Create a review
export async function POST(req: NextRequest) {
  try {
    let userId: string | null = null;
    const token = req.cookies.get("khun_daeng_token")?.value;

    if (token) {
      try {
        const verified = await jwtVerify(token, getJwtSecretKey());
        userId = verified.payload.id as string;
      } catch {
        // Token is invalid or expired — tell user to login again
        return NextResponse.json(
          { error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" },
          { status: 401 },
        );
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId, treeId, rating, comment, images } = body;

    // Validation
    if (!bookingId || !treeId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        reviews: true,
        items: {
          include: { tree: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== userId) {
      return NextResponse.json({ error: "Not your booking" }, { status: 403 });
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Can only review completed bookings" },
        { status: 400 },
      );
    }

    // Check if tree is in booking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const treeInBooking = booking.items.some(
      (item: any) => item.treeId === treeId,
    );
    if (!treeInBooking) {
      return NextResponse.json(
        { error: "Tree not in this booking" },
        { status: 400 },
      );
    }

    // Check if review already exists for this tree in this booking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingReview = booking.reviews.find(
      (r: any) => r.treeId === treeId,
    );
    if (existingReview) {
      return NextResponse.json(
        { error: "Review already exists for this tree" },
        { status: 400 },
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        bookingId,
        treeId,
        rating,
        comment: comment || null,
        images: images ? JSON.stringify(images) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update tree rating and count
    const allReviews = await prisma.review.findMany({
      where: { treeId, hidden: false }, // Ensure only visible reviews contribute to rating
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce(
        (sum: number, r: { rating: number }) => sum + r.rating,
        0,
      ) / allReviews.length;

    await prisma.tree.update({
      where: { id: treeId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
