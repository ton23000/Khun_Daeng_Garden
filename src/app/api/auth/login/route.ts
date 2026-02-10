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

        // Find user by identifier only
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: identifier },
                    { email: identifier }
                ]
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'เบอร์โทรศัพท์/อีเมล หรือรหัสผ่านไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        // Verify password
        let isValid = false;

        // 1. Try bcrypt compare (for new/reset passwords)
        // Check if password looks like a hash (starts with $2) or just try compare
        const isHash = user.password.startsWith('$2');
        if (isHash) {
            isValid = await import('bcryptjs').then(bcrypt => bcrypt.compare(password, user.password));
        } else {
            // 2. Fallback to plain text (for existing users)
            isValid = user.password === password;

            // Optional: Upgrade to hash if plain text match
            if (isValid) {
                const hashedPassword = await import('bcryptjs').then(bcrypt => bcrypt.hash(password, 10));
                await prisma.user.update({
                    where: { id: user.id },
                    data: { password: hashedPassword }
                });
            }
        }

        if (!isValid) {
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
