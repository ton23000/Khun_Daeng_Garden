import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { SignJWT } from 'jose';
import { sendAdminMagicLinkEmail } from '@/lib/email';

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET environment variable is not set');
    return new TextEncoder().encode(secret);
};

const magicLinkSchema = z.object({
    email: z.string().email()
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = magicLinkSchema.parse(body);

        let userToLink = null;

        // Admin emails from env var (comma-separated)
        const allowedAdminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
        if (allowedAdminEmails.includes(email)) {
            userToLink = {
                id: 'admin',
                firstName: 'Admin',
                lastName: '',
                phone: '0000000000',
                role: 'admin',
                email: email
            };
        } else {
            // Check in DB for admin/staff role
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (user && (user.role === 'admin' || user.role === 'staff')) {
                userToLink = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                    email: user.email
                };
            }
        }

        if (!userToLink) {
            // Delay slightly to prevent timing attacks, then return success anyway (security best practice)
            // But for internal tools it's often better to just tell them "not found"
            return NextResponse.json(
                { error: 'อีเมลนี้ไม่มีสิทธิ์เข้าถึงระบบจัดการ' },
                { status: 403 }
            );
        }

        // Generate magic link token (valid for 15 minutes)
        // We include a special flag 'magic: true' to distinguish it from a normal auth token
        const token = await new SignJWT({ ...userToLink, magic: true })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('15m')
            .sign(getJwtSecretKey());

        // Construct the magic link URL
        // Example: http://localhost:3000/admin/verify?token=XYZ
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const magicLink = `${baseUrl}/admin/verify?token=${token}`;

        // Send Email
        await sendAdminMagicLinkEmail({
            email,
            magicLink,
            userName: userToLink.firstName || 'Admin'
        });

        // For local development logging
        console.log(`[Admin Magic Link] -> ${magicLink}`);

        return NextResponse.json({
            success: true,
            message: 'ส่งลิงก์เข้าสู่ระบบไปยังอีเมลของคุณแล้ว'
        });

    } catch (error) {
        console.error('Magic link error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
