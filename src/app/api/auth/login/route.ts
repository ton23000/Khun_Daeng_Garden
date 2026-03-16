import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

// Helper to get secret key — must be set via JWT_SECRET env var
const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_only_12345';
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

        // Admin emails stored in env as comma-separated list e.g. "a@b.com,c@d.com"
        const allowedAdminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
        const adminPassword = process.env.ADMIN_PASSWORD || '';
        // Admin check: Only allow specific emails with expected admin password
        if (adminPassword && password === adminPassword && allowedAdminEmails.includes(identifier)) {
            const adminUser = {
                id: 'admin',
                firstName: 'Admin',
                lastName: '',
                phone: '0000000000',
                role: 'admin',
                email: identifier
            };

            const token = await new SignJWT({ ...adminUser })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('7d')
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
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 days
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
            isValid = await bcrypt.compare(password, user.password);
        } else {
            // 2. Fallback to plain text (for existing users)
            isValid = user.password === password;

            // Optional: Upgrade to hash if plain text match
            if (isValid) {
                const hashedPassword = await bcrypt.hash(password, 10);
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
            .setExpirationTime('7d')
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
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
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
