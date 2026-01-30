'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface BookingItem {
    id: string;
    treeId: string;
    quantity: number;
    price: number;
    tree: {
        name: string;
        images: string;
    };
}

interface Booking {
    id: string;
    refCode: string;
    status: string;
    totalPrice: number;
    deposit: number;
    pickupDate: string;
    note: string | null;
    createdAt: string;
    items: BookingItem[];
}

export default function MyOrdersPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }
        fetchBookings();
    }, [user, isAuthLoading, router]);

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const res = await fetch(`/api/bookings?userId=${user.phone}`);
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: '#f59e0b',
            PAID: '#3b82f6',
            PREPARING: '#8b5cf6',
            READY: '#22c55e',
            COMPLETED: '#6b7280',
            CANCELLED: '#ef4444'
        };
        return {
            backgroundColor: colors[status] || '#6b7280',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            display: 'inline-block'
        };
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            PENDING: 'รอชำระเงิน',
            PAID: 'ชำระแล้ว',
            PREPARING: 'กำลังเตรียมต้นไม้',
            READY: 'พร้อมรับได้แล้ว',
            COMPLETED: 'เสร็จสิ้น',
            CANCELLED: 'ยกเลิก'
        };
        return texts[status] || status;
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, string> = {
            PENDING: '⏳',
            PAID: '💰',
            PREPARING: '🌱',
            READY: '✅',
            COMPLETED: '🎉',
            CANCELLED: '❌'
        };
        return icons[status] || '📦';
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <p>กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>ออเดอร์ของฉัน</h1>

            {bookings.length === 0 ? (
                <Card>
                    <CardContent style={{ padding: '3rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                            คุณยังไม่มีออเดอร์
                        </p>
                        <Link href="/shop">
                            <Button>เลือกซื้อต้นไม้</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {bookings.map(booking => {
                        const firstImage = booking.items[0]?.tree?.images
                            ? JSON.parse(booking.items[0].tree.images)[0]
                            : null;

                        return (
                            <Card key={booking.id}>
                                <CardHeader style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <CardTitle>รหัสออเดอร์: {booking.refCode}</CardTitle>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                วันที่สั่ง: {new Date(booking.createdAt).toLocaleDateString('th-TH')}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={getStatusBadge(booking.status)}>
                                                {getStatusIcon(booking.status)} {getStatusText(booking.status)}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                                        {/* Image */}
                                        {firstImage && (
                                            <div style={{
                                                backgroundColor: '#f9fafb',
                                                borderRadius: '0.5rem',
                                                padding: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <img
                                                    src={firstImage}
                                                    alt="Tree"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '150px',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Details */}
                                        <div>
                                            <h3 style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>รายการสินค้า:</h3>
                                            {booking.items.map((item, idx) => (
                                                <div key={idx} style={{ marginBottom: '0.5rem' }}>
                                                    • {item.tree.name} x{item.quantity} - ฿{item.price.toLocaleString()}
                                                </div>
                                            ))}

                                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span>ยอดรวม:</span>
                                                    <span style={{ fontWeight: 'bold' }}>฿{booking.totalPrice.toLocaleString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span>มัดจำ (30%):</span>
                                                    <span style={{ color: 'var(--primary)' }}>฿{booking.deposit.toLocaleString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.125rem', marginTop: '0.75rem' }}>
                                                    <span>วันรับของ:</span>
                                                    <span style={{ color: 'var(--secondary)' }}>
                                                        {new Date(booking.pickupDate).toLocaleDateString('th-TH')}
                                                    </span>
                                                </div>
                                            </div>

                                            {booking.note && (
                                                <div style={{
                                                    marginTop: '1rem',
                                                    padding: '0.75rem',
                                                    backgroundColor: '#fef3c7',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    <strong>หมายเหตุจากร้าน:</strong> {booking.note}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
