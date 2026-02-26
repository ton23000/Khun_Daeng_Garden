'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectToOrders() {
    const router = useRouter();

    useEffect(() => {
        router.push('/admin/orders');
    }, [router]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <p>กำลังโหลด...</p>
        </div>
    );
}
