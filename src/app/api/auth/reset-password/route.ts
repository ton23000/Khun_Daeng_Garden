import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST - Reset password
export async function POST(req: NextRequest) {
    try {
        const { phone, code, newPassword } = await req.json();

        if (!phone || !code || !newPassword) {
            return NextResponse.json({ error: 'กรุณาระบุข้อมูลให้ครบถ้วน' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }, { status: 400 });
        }

        // Find valid reset code
        const resetCode = await prisma.passwordReset.findFirst({
            where: {
                phone,
                code,
                used: false,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!resetCode) {
            return NextResponse.json({ error: 'รหัสยืนยันไม่ถูกต้องหรือหมดอายุ' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        await prisma.user.update({
            where: { phone },
            data: { password: hashedPassword }
        });

        // Mark code as used
        await prisma.passwordReset.update({
            where: { id: resetCode.id },
            data: { used: true }
        });

        return NextResponse.json({
            message: 'เปลี่ยนรหัสผ่านสำเร็จ'
        });

    } catch (error) {
        console.error('Error in reset-password:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}
