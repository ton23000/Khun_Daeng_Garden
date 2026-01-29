'use client';

import { useState, useEffect } from 'react';
import { MOCK_BOOKINGS } from '@/data/mockBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import SlipViewer from '@/components/SlipViewer';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]); // Initialize empty
    const [viewingSlip, setViewingSlip] = useState<string | null>(null);

    useEffect(() => {
        if (isLoading) return;
        if (!user || user.role !== 'admin') {
            router.push('/admin/login');
        } else {
            // Load from localStorage if available, else merge with mock
            const stored = localStorage.getItem('khun_daeng_bookings');
            if (stored) {
                setBookings(JSON.parse(stored));
            } else {
                setBookings(MOCK_BOOKINGS);
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    const updateStatus = (id: string, newStatus: string) => {
        const updatedBookings = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
        setBookings(updatedBookings);
        localStorage.setItem('khun_daeng_bookings', JSON.stringify(updatedBookings));
    };

    return (
        <div className="container" style={{ padding: '0 1rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>Admin Dashboard</h1>
                <Button variant="outline" onClick={() => router.push('/')}>กลับหน้าหลัก</Button>
            </header>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <Card>
                    <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>รายการจองรอตรวจสอบ</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>
                            {bookings.filter(b => b.status === 'PENDING' || b.status === 'PAID_VERIFYING').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>ยอดขายเดือนนี้</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            ฿ {bookings.filter(b => b.status === 'CONFIRMED').reduce((s, b) => s + b.deposit, 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>ต้นไม้ที่ถูกจอง</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                            {bookings.reduce((acc, b) => acc + (b.items?.reduce((s: number, i: any) => s + i.quantity, 0) || b.items.length), 0)} ต้น
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Booking List */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>รายการจองทั้งหมด</h2>
            <Card>
                <CardContent style={{ padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '1rem', fontWeight: '500' }}>รหัสจอง</th>
                                <th style={{ padding: '1rem', fontWeight: '500' }}>ลูกค้า</th>
                                <th style={{ padding: '1rem', fontWeight: '500' }}>วันรับของ</th>
                                <th style={{ padding: '1rem', fontWeight: '500' }}>ยอดมัดจำ</th>
                                <th style={{ padding: '1rem', fontWeight: '500' }}>หลักฐาน</th>
                                <th style={{ padding: '1rem', fontWeight: '500' }}>สถานะ</th>
                                <th style={{ padding: '1rem', fontWeight: '500' }}>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{booking.id}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>{booking.customer || booking.userName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{booking.phone || booking.userId}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{booking.pickupDate || 'หลายรายการ'}</td>
                                    <td style={{ padding: '1rem' }}>฿ {booking.deposit.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {booking.slipUrl ? (
                                            <Button size="sm" variant="outline" onClick={() => setViewingSlip(booking.slipUrl)}>ดูสลิป</Button>
                                        ) : (
                                            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            backgroundColor: booking.status === 'PENDING' ? '#fef3c7' :
                                                booking.status === 'PAID_VERIFYING' ? '#bfdbfe' :
                                                    booking.status === 'CONFIRMED' ? '#dcfce7' : '#f3f4f6',
                                            color: booking.status === 'PENDING' ? '#d97706' :
                                                booking.status === 'PAID_VERIFYING' ? '#1e40af' :
                                                    booking.status === 'CONFIRMED' ? '#166534' : '#374151'
                                        }}>
                                            {booking.status === 'PENDING' ? 'รอชำระ' :
                                                booking.status === 'PAID_VERIFYING' ? 'รอตรวจสอบ' :
                                                    booking.status === 'CONFIRMED' ? 'ยืนยันแล้ว' : 'ยกเลิก'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {(booking.status === 'PENDING' || booking.status === 'PAID_VERIFYING') && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Button size="sm" variant="primary" onClick={() => updateStatus(booking.id, 'CONFIRMED')}>อนุมัติ</Button>
                                                <Button size="sm" variant="outline" onClick={() => updateStatus(booking.id, 'CANCELLED')}>ยกเลิก</Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <SlipViewer
                isOpen={!!viewingSlip}
                slipUrl={viewingSlip}
                onClose={() => setViewingSlip(null)}
            />
        </div>
    );
}
