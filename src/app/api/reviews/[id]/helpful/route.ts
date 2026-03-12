import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345';
    return new TextEncoder().encode(secret);
};

// POST - Mark/Unmark review as helpful
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: reviewId } = await params;

        // Get user from token
        const token = req.cookies.get('khun_daeng_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Please login to vote' }, { status: 401 });
        }

        let userId: string;
        try {
            const verified = await jwtVerify(token, getJwtSecretKey());
            userId = verified.payload.id as string;
        } catch {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        // Use transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Check if already voted
            const existingVote = await tx.reviewHelpful.findUnique({
                where: {
                    reviewId_userId: {
                        reviewId,
                        userId
                    }
                }
            });

            if (existingVote) {
                // Delete vote
                await tx.reviewHelpful.delete({
                    where: { id: existingVote.id }
                });

                // Decrement helpful count
                return await tx.review.update({
                    where: { id: reviewId },
                    data: {
                        helpful: {
                            decrement: 1
                        }
                    }
                });
            } else {
                // Create vote
                await tx.reviewHelpful.create({
                    data: { reviewId, userId }
                });

                // Increment helpful count
                return await tx.review.update({
                    where: { id: reviewId },
                    data: {
                        helpful: {
                            increment: 1
                        }
                    }
                });
            }
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error updating review helpful count:', error);
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}
