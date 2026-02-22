import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Verify reset token validity
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({
                valid: false,
                error: 'ไม่พบ token'
            }, { status: 400 });
        }

        // Find the reset token
        const resetToken = await prisma.passwordReset.findUnique({
            where: { token },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true, lastName: true
                    }
                }
            }
        });

        if (!resetToken) {
            return NextResponse.json({
                valid: false,
                error: 'ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้อง'
            }, { status: 404 });
        }

        // Check if token is expired
        if (new Date() > resetToken.expiresAt) {
            return NextResponse.json({
                valid: false,
                error: 'ลิงก์รีเซ็ตรหัสผ่านหมดอายุแล้ว กรุณาขอลิงก์ใหม่'
            }, { status: 410 });
        }

        // Check if token has been used
        if (resetToken.used) {
            return NextResponse.json({
                valid: false,
                error: 'ลิงก์นี้ถูกใช้งานไปแล้ว'
            }, { status: 410 });
        }

        return NextResponse.json({
            valid: true,
            email: resetToken.email
        });

    } catch (error: unknown) {
        console.error('Error verifying token:', error);
        return NextResponse.json({
            valid: false,
            error: `เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : String(error)}`
        }, { status: 500 });
    }
}
