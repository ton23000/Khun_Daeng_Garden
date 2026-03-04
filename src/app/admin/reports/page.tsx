'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Booking {
    id: string;
    refCode: string;
    totalPrice: number;
    deposit: number;
    status: string;
    createdAt: string;
    items: { treeId: string; tree: { name: string }; quantity: number; price: number;[key: string]: unknown }[];
}

type DateFilter = 'day' | 'month' | 'year' | 'all';

export default function ReportsPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');
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

    // Filter bookings by date
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

    // Stats
    const totalOrders = filteredBookings.length;

    // Only count sales from confirmed orders (PREPARING, READY, COMPLETED)
    // Exclude: CANCELLED, PENDING, VERIFYING_PAYMENT, PAID, PAYMENT_ISSUE
    const confirmedBookings = filteredBookings.filter(b =>
        !['CANCELLED', 'PENDING', 'VERIFYING_PAYMENT', 'PAID', 'PAYMENT_ISSUE'].includes(b.status)
    );

    // For COMPLETED: count full totalPrice, for others: count deposit
    const totalSales = confirmedBookings.reduce((sum, b) =>
        sum + (b.status === 'COMPLETED' ? b.totalPrice : b.deposit), 0
    );

    const totalDeposits = confirmedBookings.reduce((sum, b) => sum + b.deposit, 0);

    const totalTreesSold = filteredBookings.reduce((sum, b) =>
        sum + b.items.reduce((acc, item) => acc + item.quantity, 0), 0
    );
    const pendingOrders = filteredBookings.filter(b => b.status === 'PENDING' || b.status === 'PAID' || b.status === 'VERIFYING_PAYMENT').length;
    const completedOrders = filteredBookings.filter(b => b.status === 'COMPLETED').length;

    // Best Sellers
    const treeCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    filteredBookings.forEach(b => {
        b.items.forEach(item => {
            if (!treeCounts[item.treeId]) {
                treeCounts[item.treeId] = { name: item.tree.name, count: 0, revenue: 0 };
            }
            treeCounts[item.treeId].count += item.quantity;
            treeCounts[item.treeId].revenue += item.price * item.quantity;
        });
    });

    const sortedTrees = Object.values(treeCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Status breakdown
    const statusCounts = {
        PENDING: filteredBookings.filter(b => b.status === 'PENDING').length,
        PAID: filteredBookings.filter(b => b.status === 'PAID').length,
        PREPARING: filteredBookings.filter(b => b.status === 'PREPARING').length,
        READY: filteredBookings.filter(b => b.status === 'READY').length,
        COMPLETED: filteredBookings.filter(b => b.status === 'COMPLETED').length,
        CANCELLED: filteredBookings.filter(b => b.status === 'CANCELLED').length,
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>รายงานภาพรวม (Reports)</h1>
            </div>

            {/* Date Filter */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <CardContent style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600 }}>กรองตามวันที่:</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => setDateFilter('all')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.375rem',
                                    border: dateFilter === 'all' ? '2px solid #166534' : '1px solid #d1d5db',
                                    backgroundColor: dateFilter === 'all' ? '#dcfce7' : 'white',
                                    fontWeight: dateFilter === 'all' ? 600 : 400,
                                    cursor: 'pointer'
                                }}
                            >
                                ทั้งหมด
                            </button>
                            <button
                                onClick={() => setDateFilter('day')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.375rem',
                                    border: dateFilter === 'day' ? '2px solid #166534' : '1px solid #d1d5db',
                                    backgroundColor: dateFilter === 'day' ? '#dcfce7' : 'white',
                                    fontWeight: dateFilter === 'day' ? 600 : 400,
                                    cursor: 'pointer'
                                }}
                            >
                                วัน
                            </button>
                            <button
                                onClick={() => setDateFilter('month')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.375rem',
                                    border: dateFilter === 'month' ? '2px solid #166534' : '1px solid #d1d5db',
                                    backgroundColor: dateFilter === 'month' ? '#dcfce7' : 'white',
                                    fontWeight: dateFilter === 'month' ? 600 : 400,
                                    cursor: 'pointer'
                                }}
                            >
                                เดือน
                            </button>
                            <button
                                onClick={() => setDateFilter('year')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.375rem',
                                    border: dateFilter === 'year' ? '2px solid #166534' : '1px solid #d1d5db',
                                    backgroundColor: dateFilter === 'year' ? '#dcfce7' : 'white',
                                    fontWeight: dateFilter === 'year' ? 600 : 400,
                                    cursor: 'pointer'
                                }}
                            >
                                ปี
                            </button>
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
                <Card
                    onClick={() => router.push('/admin/reports/sales')}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
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
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>💰 ยอดขายรวม</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>฿ {totalSales.toLocaleString()}</div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>เงินมัดจำ: ฿{totalDeposits.toLocaleString()}</p>
                        <p style={{ fontSize: '0.75rem', color: '#166534', marginTop: '0.5rem', fontWeight: 600 }}>ดูรายละเอียด →</p>
                    </CardContent>
                </Card>
                <Card
                    onClick={() => router.push('/admin/reports/orders')}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
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
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>📦 จำนวนออเดอร์</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalOrders}</div>
                        <p style={{ fontSize: '0.75rem', color: '#d97706' }}>{pendingOrders} รอตรวจสอบ</p>
                        <p style={{ fontSize: '0.75rem', color: '#22c55e' }}>{completedOrders} เสร็จสิ้น</p>
                        <p style={{ fontSize: '0.75rem', color: '#166534', marginTop: '0.5rem', fontWeight: 600 }}>ดูรายละเอียด →</p>
                    </CardContent>
                </Card>
                <Card
                    onClick={() => router.push('/admin/reports/trees-sold')}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
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
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>🌳 ต้นไม้ที่ขายได้</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalTreesSold} ต้น</div>
                        <p style={{ fontSize: '0.75rem', color: '#166534', marginTop: '0.5rem', fontWeight: 600 }}>ดูรายละเอียด →</p>
                    </CardContent>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {/* Best Sellers */}
                <Card
                    onClick={() => router.push('/admin/reports/best-sellers')}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                    }}
                >
                    <CardHeader>
                        <CardTitle>⭐ สินค้าขายดี 5 อันดับแรก</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {sortedTrees.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {sortedTrees.map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{idx + 1}. {item.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                ฿{item.revenue.toLocaleString()}
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: 'bold', color: '#166534' }}>{item.count} ต้น</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>ยังไม่มีข้อมูลการขาย</p>
                        )}
                    </CardContent>
                </Card>

                {/* Status Breakdown */}
                <Card
                    onClick={() => router.push('/admin/reports/status-breakdown')}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                    }}
                >
                    <CardHeader>
                        <CardTitle>📋 สถานะออเดอร์</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li
                                onClick={() => router.push('/admin/orders/pending')}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid #f3f4f6',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <span>รอชำระเงิน</span>
                                <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{statusCounts.PENDING}</span>
                            </li>
                            <li
                                onClick={() => router.push('/admin/orders/verifying-payment')}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid #f3f4f6',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <span>รอตรวจสอบ</span>
                                <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{statusCounts.PAID}</span>
                            </li>
                            <li
                                onClick={() => router.push('/admin/orders/preparing')}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid #f3f4f6',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <span>กำลังเตรียม</span>
                                <span style={{ fontWeight: 'bold', color: '#8b5cf6' }}>{statusCounts.PREPARING}</span>
                            </li>
                            <li
                                onClick={() => router.push('/admin/orders/ready')}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid #f3f4f6',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <span>พร้อมรับ</span>
                                <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{statusCounts.READY}</span>
                            </li>
                            <li
                                onClick={() => router.push('/admin/orders/completed')}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid #f3f4f6',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <span>เสร็จสิ้น</span>
                                <span style={{ fontWeight: 'bold', color: '#6b7280' }}>{statusCounts.COMPLETED}</span>
                            </li>
                            <li
                                onClick={() => router.push('/admin/orders/cancelled')}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <span>ยกเลิก</span>
                                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{statusCounts.CANCELLED}</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <CardTitle>กิจกรรมล่าสุด</CardTitle>
                            <Link href="/admin/activities" style={{ fontSize: '0.875rem', color: '#166534', fontWeight: 600, textDecoration: 'none' }}>
                                ดูทั้งหมด →
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.slice(-5).reverse().map((b) => (
                                <div key={b.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                                    <p style={{ fontSize: '0.875rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>#{b.refCode}</span>
                                        <span> - {b.items.length} รายการ</span>
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                        {new Date(b.createdAt).toLocaleString('th-TH')}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534' }}>
                                        ฿{b.totalPrice.toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>ยังไม่มีกิจกรรม</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
