'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

interface BookingItem {
    id: string;
    treeId: string;
    quantity: number;
    price: number;
    tree: {
        name: string;
    };
}

interface Booking {
    id: string;
    refCode: string;
    status: string;
    totalPrice: number;
    deposit: number;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        phone: string;
    };
    items: BookingItem[];
}

export default function AdminActivitiesPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user || user.role !== 'admin') {
            router.push('/admin/login');
            return;
        }
        fetchBookings();
    }, [user, isAuthLoading, router]);

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings');
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

    const filteredBookings = useMemo(() => {
        let result = [...bookings];

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.refCode.toLowerCase().includes(query) ||
                `${b.user.firstName} ${b.user.lastName}`.toLowerCase().includes(query) ||
                b.user.phone.includes(query)
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            result = result.filter(b => b.status === statusFilter);
        }

        return result;
    }, [bookings, searchQuery, statusFilter]);

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: '#f59e0b',
            VERIFYING_PAYMENT: '#3b82f6',
            PAID: '#3b82f6',
            PREPARING: '#8b5cf6',
            READY: '#22c55e',
            COMPLETED: '#6b7280',
            CANCELLED: '#ef4444',
            PAYMENT_ISSUE: '#dc2626'
        };
        return colors[status] || '#6b7280';
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            PENDING: 'รอชำระเงิน',
            VERIFYING_PAYMENT: 'รอตรวจสอบ',
            PAID: 'รอตรวจสอบ',
            PREPARING: 'กำลังเตรียม',
            READY: 'พร้อมรับ',
            COMPLETED: 'เสร็จสิ้น',
            CANCELLED: 'ยกเลิก',
            PAYMENT_ISSUE: 'ชำระเงินมีปัญหา'
        };
        return texts[status] || status;
    };

    if (isAuthLoading || isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>กำลังโหลด...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>กิจกรรมทั้งหมด</h1>

            </div>

            {/* Filters */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <CardContent style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Input
                            placeholder="ค้นหา (รหัส, ชื่อ, เบอร์โทร)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ maxWidth: '300px' }}
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #d1d5db',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="all">ทุกสถานะ</option>
                            <option value="PENDING">รอชำระเงิน</option>
                            <option value="VERIFYING_PAYMENT">รอตรวจสอบ</option>
                            <option value="PREPARING">กำลังเตรียม</option>
                            <option value="READY">พร้อมรับ</option>
                            <option value="COMPLETED">เสร็จสิ้น</option>
                            <option value="CANCELLED">ยกเลิก</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Activities List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <Card key={booking.id}>
                            <CardContent style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                                    {/* Order Info */}
                                    <div>
                                        <p style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem' }}>
                                            #{booking.refCode}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {booking.items.length} รายการ
                                        </p>
                                    </div>

                                    {/* Customer */}
                                    <div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                            {booking.user.firstName} {booking.user.lastName}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            {booking.user.phone}
                                        </p>
                                    </div>

                                    {/* Date & Price */}
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {new Date(booking.createdAt).toLocaleString('th-TH')}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534' }}>
                                            ฿{booking.totalPrice.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <span style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            color: 'white',
                                            backgroundColor: getStatusBadge(booking.status)
                                        }}>
                                            {getStatusText(booking.status)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent style={{ padding: '3rem', textAlign: 'center' }}>
                            <p style={{ color: '#6b7280' }}>ไม่พบกิจกรรม</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Summary */}
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    แสดง <strong>{filteredBookings.length}</strong> รายการจากทั้งหมด <strong>{bookings.length}</strong> รายการ
                </p>
            </div>
        </div>
    );
}
