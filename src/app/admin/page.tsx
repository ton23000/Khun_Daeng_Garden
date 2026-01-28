'use client';

import { MOCK_BOOKINGS } from '@/data/mockBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function AdminPage() {
    const [bookings, setBookings] = useState(MOCK_BOOKINGS);

    const updateStatus = (id: string, newStatus: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>ระบบจัดการร้านค้า (Admin)</h1>
                <Button variant="outline">ออกจากระบบ</Button>
            </header>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <Card>
                    <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>รายการจองรอตรวจสอบ</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>
                            {bookings.filter(b => b.status === 'PENDING').length}
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
                            {bookings.length} ต้น
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
                                <th style={{ padding: '1rem', fontWeight: '500' }}>รายการสินค้า</th>
                                <th style={{ padding: '1rem', fontWeight: '500' }}>วันรับของ</th>
                                <th style={{ padding: '1rem', fontWeight: '500' }}>ยอดมัดจำ</th>
                                <th style={{ padding: '1rem', fontWeight: '500' }}>สถานะ</th>
                                <th style={{ padding: '1rem', fontWeight: '500' }}>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{booking.id}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>{booking.customer}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{booking.phone}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{booking.items.join(', ')}</td>
                                    <td style={{ padding: '1rem' }}>{booking.pickupDate}</td>
                                    <td style={{ padding: '1rem' }}>฿ {booking.deposit.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            backgroundColor: booking.status === 'PENDING' ? '#fef3c7' : booking.status === 'CONFIRMED' ? '#dcfce7' : '#f3f4f6',
                                            color: booking.status === 'PENDING' ? '#d97706' : booking.status === 'CONFIRMED' ? '#166534' : '#374151'
                                        }}>
                                            {booking.status === 'PENDING' ? 'รอตรวจสอบ' : booking.status === 'CONFIRMED' ? 'ยืนยันแล้ว' : 'ยกเลิก'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {booking.status === 'PENDING' && (
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
        </div>
    );
}
