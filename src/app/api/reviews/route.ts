import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch reviews for a tree
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const treeId = searchParams.get('treeId');
        const userId = searchParams.get('userId');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: any = {
            hidden: false // Only show visible reviews by default
        };
        if (treeId) where.treeId = treeId;
        if (userId) where.userId = userId;

        const reviews = await prisma.review.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true, lastName: true
                    }
                },
                tree: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset
        });

        const total = await prisma.review.count({ where });

        return NextResponse.json({
            reviews,
            total,
            hasMore: offset + limit < total
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

// POST - Create a review
export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { bookingId, treeId, rating, comment, images } = body;

        // Validation
        if (!bookingId || !treeId || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        // Check if booking exists and belongs to user
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                reviews: true,
                items: {
                    include: { tree: true }
                }
            }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.userId !== userId) {
            return NextResponse.json({ error: 'Not your booking' }, { status: 403 });
        }

        if (booking.status !== 'COMPLETED') {
            return NextResponse.json({ error: 'Can only review completed bookings' }, { status: 400 });
        }

        // Check if tree is in booking
        const treeInBooking = booking.items.some(item => item.treeId === treeId);
        if (!treeInBooking) {
            return NextResponse.json({ error: 'Tree not in this booking' }, { status: 400 });
        }

        // Check if review already exists for this tree in this booking
        const existingReview = booking.reviews.find(r => r.treeId === treeId);
        if (existingReview) {
            return NextResponse.json({ error: 'Review already exists for this tree' }, { status: 400 });
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                userId,
                bookingId,
                treeId,
                rating,
                comment: comment || null,
                images: images ? JSON.stringify(images) : null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true, lastName: true
                    }
                }
            }
        });

        // Update tree rating and count
        const allReviews = await prisma.review.findMany({
            where: { treeId, hidden: false }, // Ensure only visible reviews contribute to rating
            select: { rating: true }
        });

        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await prisma.tree.update({
            where: { id: treeId },
            data: {
                rating: avgRating,
                reviewCount: allReviews.length
            }
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}
