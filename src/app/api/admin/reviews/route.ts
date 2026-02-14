import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all reviews for admin (including hidden)
export async function GET(req: NextRequest) {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                },
                tree: {
                    select: { id: true, name: true, images: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching admin reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
