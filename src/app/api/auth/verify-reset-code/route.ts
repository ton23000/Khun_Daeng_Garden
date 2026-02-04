import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Verify reset code
export async function POST(req: NextRequest) {
    try {
        const { phone, code } = await req.json();

        if (!phone || !code) {
            return NextResponse.json({ error: 'กรุณาระบุเบอร์โทรศัพท์และรหัสยืนยัน' }, { status: 400 });
        }

        // Find valid reset code
        const resetCode = await prisma.passwordReset.findFirst({
            where: {
                phone,
                code,
                used: false,
                expiresAt: {
                    gt: new Date() // Not expired
                }
            }
        });

        if (!resetCode) {
            return NextResponse.json({ error: 'รหัสยืนยันไม่ถูกต้องหรือหมดอายุ' }, { status: 400 });
        }

        return NextResponse.json({
            message: 'ยืนยันรหัสสำเร็จ',
            valid: true
        });

    } catch (error) {
        console.error('Error in verify-reset-code:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}
