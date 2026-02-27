import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT verification
const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_this_in_production';
    return new TextEncoder().encode(secret);
};

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin and /api/admin paths
    const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin/login';
    const isAdminApi = pathname.startsWith('/api/admin');

    if (isAdminPath || isAdminApi) {
        const token = request.cookies.get('khun_daeng_token')?.value;

        if (!token) {
            // No token found
            if (isAdminApi) {
                return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            // Verify JWT token using jose
            const verified = await jwtVerify(token, getJwtSecretKey());
            const userRole = verified.payload.role as string;

            if (userRole !== 'admin') {
                // Token valid but not an admin
                if (isAdminApi) {
                    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
                }
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }

            // Valid admin token, allow request to proceed
            return NextResponse.next();
        } catch (err) {
            // Token verification failed (expired, invalid signature, etc.)
            console.warn('Middleware JWT Error:', err);

            if (isAdminApi) {
                return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Pass through all other requests
    return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*'
    ]
};
