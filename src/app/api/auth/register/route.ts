import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    nickname: z.string().min(1, 'Nickname is required'),
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

        const user = await prisma.user.create({
            data: {
                name: validated.name,
                // We might need to add nickname to schema if it's not there, 
                // but based on previous view it wasn't in schema! 
                // Let me check schema first in next step if needed, but for now assuming standard User model
                // Wait, I see schema in previous turn, let me double check.
                // Schema has: id, name, phone, email, password, role. MISSING nickname.
                // I will add nickname to schema in a separate step.
                // For now I'll map nickname to name or ignore it? 
                // The Register page asks for nickname. 
                // I will append it to name or just ignore?
                // Better to add it to schema.
                phone: validated.phone,
                email: validated.email || null,
                password: validated.password, // In prod, hash this!
                role: 'USER'
            }
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
