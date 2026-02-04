import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Mark review as helpful
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const reviewId = params.id;

        const review = await prisma.review.update({
            where: { id: reviewId },
            data: {
                helpful: {
                    increment: 1
                }
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error('Error marking review as helpful:', error);
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}
