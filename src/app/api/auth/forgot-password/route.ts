import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Generate 6-digit code
function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST - Request password reset
export async function POST(req: NextRequest) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ error: 'กรุณาระบุเบอร์โทรศัพท์' }, { status: 400 });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { phone }
        });

        if (!user) {
            return NextResponse.json({ error: 'ไม่พบเบอร์โทรศัพท์นี้ในระบบ' }, { status: 404 });
        }

        // Generate code
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        // Delete any existing unused codes for this phone
        await prisma.passwordReset.deleteMany({
            where: {
                phone,
                used: false
            }
        });

        // Create new reset code
        await prisma.passwordReset.create({
            data: {
                phone,
                code,
                expiresAt
            }
        });

        // In production, send SMS here
        console.log(`Password reset code for ${phone}: ${code}`);

        return NextResponse.json({
            message: 'ส่งรหัสยืนยันเรียบร้อย',
            // NOTE: Remove this in production! Only for development
            code: process.env.NODE_ENV === 'development' ? code : undefined
        });

    } catch (error) {
        console.error('Error in forgot-password:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}
