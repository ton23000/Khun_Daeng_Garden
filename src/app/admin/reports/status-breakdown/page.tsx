'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

interface Booking {
    id: string;
    status: string;
    createdAt: string;
}

type DateFilter = 'day' | 'month' | 'year' | 'all';

export default function StatusBreakdownPage() {
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

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING_APPROVAL: '#f97316',
            PRE_ORDER: '#f97316',
            PENDING: '#f59e0b',
            VERIFYING_PAYMENT: '#3b82f6',
            PAID: '#3b82f6',
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
            PRE_ORDER: 'รอการอนุมัติ',
            PENDING: 'รอชำระเงิน',
            VERIFYING_PAYMENT: 'รอตรวจสอบ',
            PAID: 'รอตรวจสอบ',
            PREPARING: 'กำลังเตรียม',
            READY: 'พร้อมรับ',
            COMPLETED: 'เสร็จสิ้น',
            CANCELLED: 'ยกเลิก',
        };
        return labels[status] || status;
    };

    const getFilterLabel = () => {
        switch (dateFilter) {
            case 'day': return `วันที่ ${new Date(selectedDate).toLocaleDateString('th-TH')}`;
            case 'month': return `เดือน ${new Date(selectedDate).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}`;
            case 'year': return `ปี ${new Date(selectedDate).toLocaleDateString('th-TH', { year: 'numeric' })}`;
            default: return 'ทั้งหมด';
        }
    };

    if (isAuthLoading || isLoading) {
        return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>

                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
                    📋 รายละเอียดสถานะ
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                    สถิติออเดอร์แยกตามสถานะ
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

            {/* Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {Object.entries(statusCounts).map(([status, count]) => (
                    <Card
                        key={status}
                        onClick={() => router.push(`/admin/orders?status=${status}`)}
                        style={{
                            borderLeft: `4px solid ${getStatusColor(status)}`,
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '';
                        }}
                    >
                        <CardHeader>
                            <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {getStatusLabel(status)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getStatusColor(status), marginBottom: '0.5rem' }}>
                                {count}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                    {((count / totalOrders) * 100 || 0).toFixed(1)}% ของทั้งหมด
                                </span>
                                <span style={{ fontSize: '0.75rem', color: getStatusColor(status), fontWeight: 600 }}>
                                    ดูรายการ →
                                </span>
                            </div>
                            {/* Progress Bar */}
                            <div
                                style={{
                                    marginTop: '0.75rem',
                                    height: '6px',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                }}
                            >
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${(count / totalOrders) * 100 || 0}%`,
                                        backgroundColor: getStatusColor(status),
                                        transition: 'width 0.3s'
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Summary */}
            <Card style={{ marginTop: '2rem' }}>
                <CardHeader>
                    <CardTitle>📊 สรุปภาพรวม</CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>ออเดอร์ทั้งหมด</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>{totalOrders}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>กำลังดำเนินการ</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                                {statusCounts.PENDING_APPROVAL + statusCounts.PENDING + statusCounts.VERIFYING_PAYMENT + statusCounts.PREPARING + statusCounts.READY}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>เสร็จสิ้น</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{statusCounts.COMPLETED}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>ยกเลิก</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>{statusCounts.CANCELLED}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
