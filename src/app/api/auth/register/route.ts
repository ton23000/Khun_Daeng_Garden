import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
                verified: true
            }
        });

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
            message: 'สมัครสมาชิกสำเร็จ!'
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
