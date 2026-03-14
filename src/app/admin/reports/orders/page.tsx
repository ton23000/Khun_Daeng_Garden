'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

interface Booking {
    id: string;
    refCode: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        phone: string;
    };
    items: { [key: string]: unknown }[];
}

type DateFilter = 'day' | 'month' | 'year' | 'all';

export default function OrdersOverviewPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState<DateFilter>('month');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user || user.role !== 'admin') {
            router.push('/login');
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

    const getFilteredBookings = () => {
        if (dateFilter === 'all') return bookings;

        const selected = new Date(selectedDate);
        return bookings.filter(b => {
            const bookingDate = new Date(b.createdAt);

            switch (dateFilter) {
                case 'day':
                    return bookingDate.toDateString() === selected.toDateString();
                case 'month':
                    return bookingDate.getMonth() === selected.getMonth() &&
                        bookingDate.getFullYear() === selected.getFullYear();
                case 'year':
                    return bookingDate.getFullYear() === selected.getFullYear();
                default:
                    return true;
            }
        });
    };

    const filteredBookings = getFilteredBookings();

    // Calculate statistics
    const statusCounts = {
        PENDING_APPROVAL: filteredBookings.filter(b => b.status === 'PENDING_APPROVAL' || b.status === 'PRE_ORDER').length,
        PENDING: filteredBookings.filter(b => b.status === 'PENDING').length,
        VERIFYING_PAYMENT: filteredBookings.filter(b => b.status === 'VERIFYING_PAYMENT' || b.status === 'PAID').length,
        PREPARING: filteredBookings.filter(b => b.status === 'PREPARING').length,
        READY: filteredBookings.filter(b => b.status === 'READY').length,
        COMPLETED: filteredBookings.filter(b => b.status === 'COMPLETED').length,
        CANCELLED: filteredBookings.filter(b => b.status === 'CANCELLED').length,
    };

    const totalOrders = filteredBookings.length;
    const activeOrders = statusCounts.PENDING_APPROVAL + statusCounts.PENDING + statusCounts.VERIFYING_PAYMENT + statusCounts.PREPARING + statusCounts.READY;
    const completedOrders = statusCounts.COMPLETED;
    const cancelledOrders = statusCounts.CANCELLED;

    const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    const getFilterLabel = () => {
        switch (dateFilter) {
            case 'day': return `วันที่ ${new Date(selectedDate).toLocaleDateString('th-TH')}`;
            case 'month': return `เดือน ${new Date(selectedDate).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}`;
            case 'year': return `ปี ${new Date(selectedDate).toLocaleDateString('th-TH', { year: 'numeric' })}`;
            default: return 'ทั้งหมด';
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING_APPROVAL: '#f97316',
            PENDING: '#f59e0b',
            VERIFYING_PAYMENT: '#3b82f6',
            PREPARING: '#8b5cf6',
            READY: '#22c55e',
            COMPLETED: '#6b7280',
            CANCELLED: '#dc2626',
        };
        return colors[status] || '#6b7280';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            PENDING_APPROVAL: 'รอการอนุมัติ',
            PENDING: 'รอชำระเงิน',
            VERIFYING_PAYMENT: 'รอตรวจสอบ',
            PREPARING: 'กำลังเตรียม',
            READY: 'พร้อมรับ',
            COMPLETED: 'เสร็จสิ้น',
            CANCELLED: 'ยกเลิก',
        };
        return labels[status] || status;
    };

    if (isAuthLoading || isLoading) {
        return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>

                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
                    📦 ภาพรวมออเดอร์
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                    รายละเอียดออเดอร์ทั้งหมด
                </p>
            </div>

            {/* Date Filter */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <CardContent style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600 }}>กรองตามวันที่:</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['all', 'day', 'month', 'year'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setDateFilter(filter as DateFilter)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.375rem',
                                        border: dateFilter === filter ? '2px solid #166534' : '1px solid #d1d5db',
                                        backgroundColor: dateFilter === filter ? '#dcfce7' : 'white',
                                        fontWeight: dateFilter === filter ? 600 : 400,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {filter === 'all' ? 'ทั้งหมด' : filter === 'day' ? 'วัน' : filter === 'month' ? 'เดือน' : 'ปี'}
                                </button>
                            ))}
                        </div>
                        {dateFilter !== 'all' && (
                            <input
                                type={dateFilter === 'year' ? 'number' : dateFilter === 'month' ? 'month' : 'date'}
                                value={
                                    dateFilter === 'year'
                                        ? new Date(selectedDate).getFullYear().toString()
                                        : dateFilter === 'month'
                                            ? selectedDate.substring(0, 7)
                                            : selectedDate
                                }
                                onChange={(e) => {
                                    if (dateFilter === 'year') {
                                        setSelectedDate(`${e.target.value}-01-01`);
                                    } else if (dateFilter === 'month') {
                                        setSelectedDate(`${e.target.value}-01`);
                                    } else {
                                        setSelectedDate(e.target.value);
                                    }
                                }}
                                min={dateFilter === 'year' ? '2020' : undefined}
                                max={dateFilter === 'year' ? new Date().getFullYear().toString() : undefined}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #d1d5db',
                                    width: dateFilter === 'year' ? '120px' : 'auto'
                                }}
                            />
                        )}
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            แสดงข้อมูล: <strong>{getFilterLabel()}</strong>
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <Card style={{ borderLeft: '4px solid #166534' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>📊 ออเดอร์ทั้งหมด</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
                            {totalOrders}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            รายการทั้งหมด
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ borderLeft: '4px solid #3b82f6' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>⏳ กำลังดำเนินการ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                            {activeOrders}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            {((activeOrders / totalOrders) * 100 || 0).toFixed(1)}% ของทั้งหมด
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ borderLeft: '4px solid #22c55e' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>✅ เสร็จสิ้น</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>
                            {completedOrders}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            อัตราความสำเร็จ {conversionRate.toFixed(1)}%
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ borderLeft: '4px solid #dc2626' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>❌ ยกเลิก</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>
                            {cancelledOrders}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            {((cancelledOrders / totalOrders) * 100 || 0).toFixed(1)}% ของทั้งหมด
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Status Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <Card>
                    <CardHeader>
                        <CardTitle>📋 รายละเอียดตามสถานะ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {Object.entries(statusCounts).map(([status, count]) => (
                                <div
                                    key={status}
                                    onClick={() => router.push(`/admin/orders?status=${status}`)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem',
                                        borderRadius: '0.375rem',
                                        backgroundColor: '#f9fafb',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                >
                                    <span style={{ fontSize: '0.875rem' }}>{getStatusLabel(status)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div
                                            style={{
                                                width: `${(count / totalOrders) * 100 || 0}px`,
                                                maxWidth: '50px',
                                                height: '6px',
                                                backgroundColor: getStatusColor(status),
                                                borderRadius: '3px'
                                            }}
                                        />
                                        <span style={{ fontWeight: 'bold', color: getStatusColor(status), minWidth: '30px', textAlign: 'right' }}>
                                            {count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>🕐 ออเดอร์ล่าสุด</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredBookings.length > 0 ? (
                            [...filteredBookings]
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .slice(0, 7)
                                .map((b, idx) => (
                                    <div key={b.id} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: idx < 6 ? '1px solid #f3f4f6' : 'none' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>#{b.refCode}</span>
                                            <span
                                                style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    color: getStatusColor(b.status),
                                                    padding: '0.125rem 0.5rem',
                                                    borderRadius: '9999px',
                                                    backgroundColor: `${getStatusColor(b.status)}15`
                                                }}
                                            >
                                                {getStatusLabel(b.status)}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            {b.user.firstName} {b.user.lastName} • {new Date(b.createdAt).toLocaleDateString('th-TH')}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', marginTop: '0.25rem' }}>
                                            ฿{b.totalPrice.toLocaleString()}
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>ยังไม่มีข้อมูล</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
