'use client';

import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BookingHistoryPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            const allBookings = JSON.parse(localStorage.getItem('khun_daeng_bookings') || '[]');
            const userBookings = allBookings.filter((b: any) => b.userId === user.phone).reverse(); // Newest first
            setBookings(userBookings);
        }
    }, [user]);

    if (!user) {
        return <div className="container" style={{ padding: '2rem' }}>Please login</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <Link href="/profile" style={{ display: 'inline-block', marginBottom: '1rem', color: '#6b7280' }}>
                ← กลับไปหน้าข้อมูลส่วนตัว
            </Link>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>ประวัติการจอง</h1>

            {bookings.length === 0 ? (
                <Card>
                    <CardContent style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                        คุณยังไม่มีรายการจอง
                    </CardContent>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {bookings.map((booking) => (
                        <Card key={booking.id}>
                            <CardHeader style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontWeight: 'bold' }}>Order #{booking.id}</span>
                                        <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                            {new Date(booking.dateCreated).toLocaleDateString('th-TH')}
                                        </span>
                                    </div>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        backgroundColor: booking.status === 'PENDING' ? '#fef3c7' : booking.status === 'CONFIRMED' ? '#dcfce7' : '#f3f4f6',
                                        color: booking.status === 'PENDING' ? '#d97706' : booking.status === 'CONFIRMED' ? '#166534' : '#374151'
                                    }}>
                                        {booking.status === 'PENDING' ? 'รอตรวจสอบ' : booking.status === 'CONFIRMED' ? 'ยืนยันแล้ว' : 'ยกเลิก'}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent style={{ paddingTop: '1rem' }}>
                                {booking.items.map((item: any, idx: number) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span>{item.quantity} x {item.name}</span>
                                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>รับวันที่: {new Date(item.pickupDate).toLocaleDateString('th-TH')}</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: '1rem', borderTop: '1px dashed #e5e7eb', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>ยอดมัดจำ</span>
                                    <span style={{ color: 'var(--primary)' }}>฿ {booking.deposit.toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
