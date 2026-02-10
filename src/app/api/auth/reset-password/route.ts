import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST - Reset password with token
export async function POST(req: NextRequest) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'กรุณาระบุข้อมูลให้ครบถ้วน' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }, { status: 400 });
        }

        // Find valid reset token
        const resetToken = await prisma.passwordReset.findFirst({
            where: {
                token,
                used: false,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!resetToken) {
            return NextResponse.json({
                error: 'ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว'
            }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        await prisma.user.update({
            where: { id: resetToken.userId },
            data: { password: hashedPassword }
        });

        // Mark token as used
        await prisma.passwordReset.update({
            where: { id: resetToken.id },
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
