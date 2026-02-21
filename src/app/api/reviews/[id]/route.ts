import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH - Update review
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: reviewId } = await params;
        const body = await req.json();
        const { rating, comment, images } = body;

        // Check if review exists and belongs to user
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        if (review.userId !== userId) {
            return NextResponse.json({ error: 'Not your review' }, { status: 403 });
        }

        // Update review
        const updated = await prisma.review.update({
            where: { id: reviewId },
            data: {
                rating: rating || review.rating,
                comment: comment !== undefined ? comment : review.comment,
                images: images ? JSON.stringify(images) : review.images
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

        // Recalculate tree rating if rating changed
        if (rating && rating !== review.rating) {
            const allReviews = await prisma.review.findMany({
                where: { treeId: review.treeId },
                select: { rating: true }
            });

            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

            await prisma.tree.update({
                where: { id: review.treeId },
                data: { rating: avgRating }
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}

// DELETE - Delete review
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = req.headers.get('x-user-id');
        const userRole = req.headers.get('x-user-role');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: reviewId } = await params;

        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        // Only owner or admin can delete
        if (review.userId !== userId && userRole !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.review.delete({
            where: { id: reviewId }
        });

        // Recalculate tree rating
        const allReviews = await prisma.review.findMany({
            where: { treeId: review.treeId },
            select: { rating: true }
        });

        const avgRating = allReviews.length > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
            : 0;

        await prisma.tree.update({
            where: { id: review.treeId },
            data: {
                rating: avgRating,
                reviewCount: allReviews.length
            }
        });

        return NextResponse.json({ message: 'Review deleted' });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
