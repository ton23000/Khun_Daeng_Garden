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
    createdAt: string;
    items: {
        treeId: string;
        quantity: number;
        tree: {
            name: string;
        };
    }[];
}

type DateFilter = 'day' | 'month' | 'year' | 'all';

export default function TreesSoldPage() {
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
                const confirmedOrders = data.filter((b: Booking) =>
                    !['CANCELLED', 'PENDING', 'PENDING_APPROVAL', 'VERIFYING_PAYMENT', 'PAID', 'PAYMENT_ISSUE'].includes(b.status)
                );
                setBookings(confirmedOrders);
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

    // Calculate tree statistics
    const treeCounts: Record<string, { name: string; count: number }> = {};
    filteredBookings.forEach(b => {
        b.items.forEach(item => {
            if (!treeCounts[item.treeId]) {
                treeCounts[item.treeId] = { name: item.tree.name, count: 0 };
            }
            treeCounts[item.treeId].count += item.quantity;
        });
    });

    const totalTreesSold = Object.values(treeCounts).reduce((sum, tree) => sum + tree.count, 0);
    const uniqueTreeTypes = Object.keys(treeCounts).length;
    const topTrees = Object.values(treeCounts).sort((a, b) => b.count - a.count).slice(0, 10);
    const mostPopularTree = topTrees[0] || { name: '-', count: 0 };



    if (isAuthLoading || isLoading) {
        return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>

                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
                    🌳 ต้นไม้ที่ขายได้
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                    รายละเอียดต้นไม้ที่ขายได้ทั้งหมด
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

                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <Card style={{ borderLeft: '4px solid #166534' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>🌳 ต้นไม้ทั้งหมด</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
                            {totalTreesSold} ต้น
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            จากออเดอร์ {filteredBookings.length} รายการ
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ borderLeft: '4px solid #3b82f6' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>🏷️ ประเภทต้นไม้</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                            {uniqueTreeTypes} ชนิด
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            ความหลากหลาย
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ borderLeft: '4px solid #22c55e' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>⭐ ต้นไม้ยอดนิยม</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '0.25rem' }}>
                            {mostPopularTree.name}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            ขายได้ {mostPopularTree.count} ต้น
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ borderLeft: '4px solid #f59e0b' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>📊 เฉลี่ยต่อออเดอร์</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                            {filteredBookings.length > 0 ? (totalTreesSold / filteredBookings.length).toFixed(1) : 0}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            ต้นต่อ 1 ออเดอร์
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Top Trees */}
            <Card>
                <CardHeader>
                    <CardTitle>🔝 ต้นไม้ขายดี Top 10</CardTitle>
                </CardHeader>
                <CardContent>
                    {topTrees.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {topTrees.map((tree, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.75rem',
                                        borderRadius: '0.375rem',
                                        backgroundColor: idx < 3 ? '#f0fdf4' : '#f9fafb'
                                    }}
                                >
                                    <div
                                        style={{
                                            minWidth: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: idx === 0 ? '#fbbf24' : idx === 1 ? '#d1d5db' : idx === 2 ? '#f97316' : '#e5e7eb',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {idx + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>{tree.name}</div>
                                        <div
                                            style={{
                                                marginTop: '0.25rem',
                                                height: '6px',
                                                backgroundColor: '#e5e7eb',
                                                borderRadius: '3px',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: `${(tree.count / mostPopularTree.count) * 100}%`,
                                                    backgroundColor: '#166534',
                                                    transition: 'width 0.3s'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: '#166534' }}>{tree.count} ต้น</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            {((tree.count / totalTreesSold) * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>ยังไม่มีข้อมูล</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
