import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware: pass all requests through.
// Auth is handled client-side in each admin/staff page.
export default function proxy(_request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: []
};
