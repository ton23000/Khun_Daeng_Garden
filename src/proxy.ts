import { NextResponse } from 'next/server';

// Middleware: pass all requests through.
// Auth is handled client-side in each admin/staff page.
export default function proxy() {
    return NextResponse.next();
}

export const config = {
    matcher: []
};
