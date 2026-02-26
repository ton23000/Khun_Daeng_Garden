'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OrdersPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/admin/orders/pending-approval');
    }, [router]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <p>กำลังโหลด...</p>
        </div>
    );
}
