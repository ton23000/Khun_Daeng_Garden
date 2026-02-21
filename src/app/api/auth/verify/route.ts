import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Verify email with token
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        // Find user with this verification token
        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        if (user.verified) {
            return NextResponse.json({ message: 'Email already verified' });
        }

        // Verify the user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verified: true,
                verificationToken: null // Clear token after use
            }
        });

        console.log(`✅ User ${user.firstName} ${user.lastName} (${user.email}) verified successfully`);

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.error('Error verifying email:', error);
        return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 });
    }
}

// POST - Resend verification email
export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const userId = body.userId;

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.verified) {
            return NextResponse.json({ message: 'Already verified' });
        }

        if (!user.email) {
            return NextResponse.json({ error: 'ไม่พบอีเมลในบัญชีของคุณ กรุณาเพิ่มอีเมลในโปรไฟล์ก่อน' }, { status: 400 });
        }

        // Generate new token
        const crypto = require('crypto');
        const newToken = crypto.randomUUID();

        await prisma.user.update({
            where: { id: userId },
            data: { verificationToken: newToken }
        });

        // Send verification email
        const { sendVerificationEmail } = await import('@/lib/email');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const verifyLink = `${baseUrl}/verify-email?token=${newToken}`;

        await sendVerificationEmail({
            email: user.email,
            verifyLink,
            userName: `${user.firstName} ${user.lastName}`
        });

        return NextResponse.json({ success: true, message: 'ส่งอีเมลยืนยันแล้ว กรุณาตรวจสอบกล่องจดหมาย' });
    } catch (error) {
        console.error('Error resending verification email:', error);
        return NextResponse.json({ error: 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่' }, { status: 500 });
    }
}
