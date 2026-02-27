import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    email: z.string().email().optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validated = registerSchema.parse(body);

        // Check if phone already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: validated.phone },
                    // Only check email if it's provided
                    ...(validated.email ? [{ email: validated.email }] : [])
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'เบอร์โทรศัพท์หรืออีเมลนี้ถูกใช้งานแล้ว' },
                { status: 400 }
            );
        }

        // Generate verification token
        const verificationToken = randomUUID();

        // Hash the password before saving to the database
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(validated.password, 10);

        const user = await prisma.user.create({
            data: {
                firstName: validated.firstName,
                lastName: validated.lastName,
                phone: validated.phone,
                email: validated.email || null,
                password: hashedPassword,
                role: 'USER',
                verified: false,
                verificationToken
            }
        });

        // Send verification email if email is provided
        if (validated.email) {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            const verifyLink = `${baseUrl}/verify-email?token=${verificationToken}`;

            // Send asynchronously - don't block registration
            sendVerificationEmail({
                email: validated.email,
                verifyLink,
                userName: `${validated.firstName} ${validated.lastName}`
            }).catch(err => console.error('Failed to send verification email:', err));
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                role: user.role,
                verified: user.verified
            },
            message: validated.email
                ? 'สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี'
                : 'สมัครสมาชิกสำเร็จ!'
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
