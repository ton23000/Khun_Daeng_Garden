import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function POST() {
    const cookieStore = await cookies();

    // Clear the auth token cookie
    cookieStore.delete('khun_daeng_token');

    return Response.json({ success: true, message: 'Logged out successfully' });
}

export async function GET() {
    const cookieStore = await cookies();

    // Clear the auth token cookie
    cookieStore.delete('khun_daeng_token');

    // Redirect to home page
    redirect('/');
}
