import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get current user info
export async function GET(req: NextRequest) {
    try {
        // Get user ID from cookie or URL parameter
        const urlParams = new URL(req.url).searchParams;
        const userId = req.cookies.get('userId')?.value || urlParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
                role: true,
                verified: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching current user:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}
