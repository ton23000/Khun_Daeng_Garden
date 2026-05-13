'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { formatThaiDate } from '@/lib/dateUtils';

import { useRouter } from 'next/navigation';
import ThaiDatePicker from '@/components/ThaiDatePicker';
import { getBEYear } from '@/lib/dateUtils';


interface Booking {
    id: string;
    status: string;
    totalPrice: number;
    deposit: number;
    createdAt: string;
    items: {
        treeId: string;
        quantity: number;
        price: number;
        tree: {
            name: string;
            images: string;
        };
    }[];
}

type DateFilter = 'day' | 'month' | 'year' | 'all';

export default function BestSellersPage() {
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

    // Calculate best sellers using exact same logic as Sales Report
    // Filter out unconfirmed/cancelled statuses
    const confirmedBookings = filteredBookings.filter(b =>
        !['CANCELLED', 'PENDING', 'PENDING_APPROVAL', 'VERIFYING_PAYMENT', 'PAID', 'PAYMENT_ISSUE'].includes(b.status)
    );

    const treeSales: Record<string, { name: string; count: number; revenue: number; images: string }> = {};
    confirmedBookings.forEach(b => {
        b.items.forEach(item => {
            if (!treeSales[item.treeId]) {
                treeSales[item.treeId] = {
                    name: item.tree.name,
                    count: 0,
                    revenue: 0,
                    images: item.tree.images
                };
            }
            treeSales[item.treeId].count += item.quantity;
            treeSales[item.treeId].revenue += item.price * item.quantity;
        });
    });

    const sortedTrees = Object.values(treeSales).sort((a, b) => b.count - a.count).slice(0, 10);
    const totalRevenue = confirmedBookings.reduce((sum, b) =>
        sum + (b.status === 'COMPLETED' ? b.totalPrice : b.deposit), 0
    );

    const getFilterLabel = () => {
        switch (dateFilter) {
            case 'day': return `วันที่ ${formatThaiDate(selectedDate)}`;
            case 'month': return `เดือน ${formatThaiDate(selectedDate, { month: 'long', year: 'numeric' })}`;
            case 'year': return `ปี ${formatThaiDate(selectedDate, { year: 'numeric' })}`;
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
                    ⭐ สินค้าขายดี
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                    รายละเอียดสินค้าขายดี Top 10
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ThaiDatePicker
                                    value={selectedDate}
                                    onChange={(val) => setSelectedDate(val)}
                                    mode={dateFilter}
                                />
                            </div>
                        )}
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            แสดงข้อมูล: <strong>{getFilterLabel()}</strong>
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <Card style={{ borderLeft: '4px solid #fbbf24' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>🥇 อันดับ 1</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#166534', marginBottom: '0.25rem' }}>
                            {sortedTrees[0]?.name || '-'}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {sortedTrees[0]?.count || 0} ต้น • ฿{(sortedTrees[0]?.revenue || 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ borderLeft: '4px solid #166534' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>💰 รายได้รวม Top 10</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
                            ฿{totalRevenue.toLocaleString()}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            จาก {sortedTrees.reduce((sum, t) => sum + t.count, 0)} ต้น
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Best Sellers List */}
            <Card>
                <CardHeader>
                    <CardTitle>🏆 รายการสินค้าขายดี</CardTitle>
                </CardHeader>
                <CardContent>
                    {sortedTrees.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sortedTrees.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                        backgroundColor: idx < 3 ? '#f0fdf4' : '#f9fafb',
                                        border: idx < 3 ? '2px solid #bbf7d0' : '1px solid #e5e7eb'
                                    }}
                                >
                                    {/* Rank Badge */}
                                    <div
                                        style={{
                                            minWidth: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            backgroundColor: idx === 0 ? '#fbbf24' : idx === 1 ? '#d1d5db' : idx === 2 ? '#f97316' : '#e5e7eb',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '1.25rem',
                                            color: idx < 3 ? 'white' : '#6b7280'
                                        }}
                                    >
                                        {idx + 1}
                                    </div>

                                    {/* Details */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                            {item.name}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>จำนวนที่ขาย</div>
                                                <div style={{ fontWeight: 'bold', color: '#166534' }}>{item.count} ต้น</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>รายได้</div>
                                                <div style={{ fontWeight: 'bold', color: '#166534' }}>฿{item.revenue.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>% ของยอดขาย</div>
                                                <div style={{ fontWeight: 'bold', color: '#166534' }}>
                                                    {((item.revenue / totalRevenue) * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div
                                            style={{
                                                height: '8px',
                                                backgroundColor: '#e5e7eb',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: `${(item.count / sortedTrees[0].count) * 100}%`,
                                                    backgroundColor: idx < 3 ? '#166534' : '#6b7280',
                                                    transition: 'width 0.3s'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>ยังไม่มีข้อมูลการขาย</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
