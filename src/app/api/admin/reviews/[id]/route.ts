import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH - Toggle review visibility (hidden/visible)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { hidden } = body;

        const review = await prisma.review.update({
            where: { id },
            data: { hidden: Boolean(hidden) }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}

// DELETE - Delete a review permanently
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const review = await prisma.review.findUnique({ where: { id } });
        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        await prisma.review.delete({ where: { id } });

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
