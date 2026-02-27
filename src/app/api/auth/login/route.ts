import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { SignJWT } from 'jose';

// Helper to get secret key
const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_this_in_production';
    return new TextEncoder().encode(secret);
};

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
            const adminUser = {
                id: 'admin',
                firstName: 'Admin',
                lastName: '',
                phone: '0000000000',
                role: 'admin',
                email: 'admin@khundaeng.com'
            };

            const token = await new SignJWT({ ...adminUser })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('24h')
                .sign(getJwtSecretKey());

            const response = NextResponse.json({
                success: true,
                user: adminUser
            });

            response.cookies.set({
                name: 'khun_daeng_token',
                value: token,
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return response;
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

        const userData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            role: user.role.toLowerCase(),
            verified: user.verified
        };

        const token = await new SignJWT({ ...userData })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(getJwtSecretKey());

        const response = NextResponse.json({
            success: true,
            user: userData
        });

        response.cookies.set({
            name: 'khun_daeng_token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
