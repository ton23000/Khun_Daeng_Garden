import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_this_in_production';
    return new TextEncoder().encode(secret);
};

// GET - Get current user info
export async function GET(req: NextRequest) {
    try {
        let userId: string | null = null;

        // Try getting token from cookies
        const token = req.cookies.get('khun_daeng_token')?.value;
        if (token) {
            try {
                const verified = await jwtVerify(token, getJwtSecretKey());
                userId = verified.payload.id as string;
            } catch (err) {
                console.warn('JWT verification failed in auth/me:', err);
            }
        }

        // Fallback for explicitly passed userId (e.g. from localStorage sync if token expired)
        const urlParams = new URL(req.url).searchParams;
        if (!userId) {
            userId = urlParams.get('userId');
        }

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
