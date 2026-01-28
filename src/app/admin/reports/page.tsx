'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useEffect, useState } from 'react';
import { MOCK_TREES } from '@/data/mockData';

export default function ReportsPage() {
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        const storedBookings = localStorage.getItem('khun_daeng_bookings');
        if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
        }
    }, []);

    // Stats
    const totalOrders = bookings.length;
    const totalSales = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalTreesSold = bookings.reduce((sum, b) => sum + b.items.reduce((acc: number, item: any) => acc + item.quantity, 0), 0);
    const pendingOrders = bookings.filter(b => b.status === 'PENDING').length;

    // Best Sellers
    const treeCounts: Record<string, number> = {};
    bookings.forEach(b => {
        b.items.forEach((item: any) => {
            treeCounts[item.id] = (treeCounts[item.id] || 0) + item.quantity;
        });
    });

    const sortedTrees = Object.entries(treeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, count]) => {
            const tree = MOCK_TREES.find(t => t.id === id);
            return { name: tree?.name || id, count };
        });

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>รายงานภาพรวม (Reports)</h1>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <Card>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>ยอดขายรวม</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>฿ {totalSales.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>จำนวนออเดอร์</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalOrders}</div>
                        <p style={{ fontSize: '0.75rem', color: '#d97706' }}>{pendingOrders} รอตรวจสอบ</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>ต้นไม้ที่ขายได้</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalTreesSold} ต้น</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid-dashboard">
                {/* Best Sellers */}
                <Card>
                    <CardHeader>
                        <CardTitle>สินค้าขายดี 5 อันดับแรก</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {sortedTrees.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {sortedTrees.map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                        <span>{idx + 1}. {item.name}</span>
                                        <span style={{ fontWeight: 'bold' }}>{item.count} ต้น</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#6b7280' }}>ยังไม่มีข้อมูลการขาย</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity Mock */}
                <Card>
                    <CardHeader>
                        <CardTitle>กิจกรรมล่าสุด</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {bookings.slice(-5).reverse().map((b) => (
                            <div key={b.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                                <p style={{ fontSize: '0.875rem' }}>
                                    <span style={{ fontWeight: 'bold' }}>{b.userName}</span> สั่งซื้อ
                                    <span style={{ fontWeight: 'bold' }}> {b.items.length} รายการ</span>
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                    {new Date(b.dateCreated).toLocaleString('th-TH')}
                                </p>
                            </div>
                        ))}
                        {bookings.length === 0 && <p style={{ color: '#6b7280' }}>ยังไม่มีกิจกรรม</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
