'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OrdersPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard since it already has comprehensive order management
        router.push('/admin/dashboard');
    }, [router]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <p>กำลังโหลด...</p>
        </div>
    );
}
