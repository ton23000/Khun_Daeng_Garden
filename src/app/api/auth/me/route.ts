import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET environment variable is not set');
    return new TextEncoder().encode(secret);
};

// GET - Get current user info
export async function GET(req: NextRequest) {
    try {
        let userId: string | null = null;
        let userRole: string | null = null;
        let mockPayload: { 
            userId?: string; 
            role?: string; 
            firstName?: string; 
            lastName?: string; 
            phone?: string; 
            email?: string; 
        } | null = null;

        // Try getting token from cookies
        const token = req.cookies.get('khun_daeng_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        try {
            const verified = await jwtVerify(token, getJwtSecretKey());
            userId = verified.payload.id as string;
            userRole = verified.payload.role as string;
            mockPayload = verified.payload as { 
                userId?: string; 
                role?: string; 
                firstName?: string; 
                lastName?: string; 
                phone?: string; 
                email?: string; 
            };
        } catch (err) {
            console.warn('JWT verification failed in auth/me:', err);
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        if (userId === 'admin') {
            return NextResponse.json({ 
                user: {
                    id: userId,
                    firstName: mockPayload?.firstName || 'Admin',
                    lastName: mockPayload?.lastName || '',
                    phone: mockPayload?.phone || '0000000000',
                    email: mockPayload?.email || 'admin@example.com',
                    role: userRole || 'admin',
                    verified: true
                } 
            });
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
