import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const loginSchema = z.object({
    identifier: z.string(), // phone or email
    password: z.string()
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { identifier, password } = loginSchema.parse(body);

        // Admin hardcoded check (keep existing logic for safety)
        if (password === 'admin1234' && (identifier === 'admin' || identifier === '0000000000')) {
            return NextResponse.json({
                success: true,
                user: {
                    id: 'admin',
                    name: 'Admin',
                    phone: '0000000000',
                    role: 'admin',
                    email: 'admin@khundaeng.com'
                }
            });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: identifier },
                    { email: identifier }
                ],
                password: password // In prod, compare hash
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'เบอร์โทรศัพท์/อีเมล หรือรหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role.toLowerCase() // Ensure lowercase for frontend compatibility
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
