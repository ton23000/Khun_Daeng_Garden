import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

// Generate secure random token
function generateToken(): string {
    return randomBytes(32).toString('hex');
}

// POST - Request password reset via email
export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        console.log('Forgot password request for:', email);

        if (!email) {
            return NextResponse.json({ error: 'กรุณาระบุอีเมล' }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'รูปแบบอีเมลไม่ถูกต้อง' }, { status: 400 });
        }

        /* Check if user exists */
        /* Check if user exists */
        // SQLite doesn't support mode: 'insensitive' directly in findFirst
        const users = await prisma.user.findMany({
            where: {
                email: {
                    not: null
                }
            }
        });

        const user = users.find((u: { email: string | null; id: string; firstName: string; lastName: string }) => u.email?.toLowerCase() === email.toLowerCase());

        if (!user) {
            console.log('User not found for email:', email);
            // Still return success to prevent email enumeration
            return NextResponse.json({
                message: 'หากอีเมลนี้มีในระบบ คุณจะได้รับลิงก์รีเซ็ตรหัสผ่านทางอีเมล'
            });
        }

        console.log('User found:', user.id);

        // Generate secure token
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // Delete any existing unused tokens for this user
        await prisma.passwordReset.deleteMany({
            where: {
                userId: user.id,
                used: false
            }
        });

        // Create new reset token
        await prisma.passwordReset.create({
            data: {
                id: crypto.randomUUID(),
                userId: user.id,
                email: user.email!,
                token,
                expiresAt
            }
        });

        // Create reset link
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const resetLink = `${baseUrl}/reset-password?token=${token}`;

        console.log('Generated reset link:', resetLink);

        // Send email
        try {
            await sendPasswordResetEmail({
                email: user.email!,
                resetLink,
                userName: `${user.firstName} ${user.lastName}`
            });
            console.log('Email sent successfully');
        } catch (emailError: unknown) {
            console.error('Failed to send email:', emailError);
            // TEMPORARY: Return actual error for debugging
            return NextResponse.json(
                { error: `ไม่สามารถส่งอีเมลได้: ${emailError instanceof Error ? emailError.message : String(emailError)}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'หากอีเมลนี้มีในระบบ คุณจะได้รับลิงก์รีเซ็ตรหัสผ่านทางอีเมล'
        });

    } catch (error: unknown) {
        console.error('Error in forgot-password:', error);
        return NextResponse.json({ error: `เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
    }
}
