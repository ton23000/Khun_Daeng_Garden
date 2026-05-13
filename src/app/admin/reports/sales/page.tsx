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
    refCode: string;
    totalPrice: number;
    deposit: number;
    status: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
    };
}

type DateFilter = 'day' | 'month' | 'year' | 'all';

export default function SalesOverviewPage() {
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

    // Calculate sales
    const confirmedBookings = filteredBookings.filter(b =>
        !['CANCELLED', 'PENDING', 'PENDING_APPROVAL', 'VERIFYING_PAYMENT', 'PAID', 'PAYMENT_ISSUE'].includes(b.status)
    );

    const totalSales = confirmedBookings.reduce((sum, b) =>
        sum + (b.status === 'COMPLETED' ? b.totalPrice : b.deposit), 0
    );

    const totalDeposits = confirmedBookings.reduce((sum, b) => sum + b.deposit, 0);
    const totalFullPayments = confirmedBookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + b.totalPrice, 0);
    const pendingSales = confirmedBookings.filter(b => ['PREPARING', 'READY', 'CONFIRMED'].includes(b.status)).reduce((sum, b) => sum + (b.totalPrice - b.deposit), 0);

    const averageOrderValue = confirmedBookings.length > 0 ? totalSales / confirmedBookings.length : 0;



    if (isAuthLoading || isLoading) {
        return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>

                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
                    📊 ภาพรวมยอดขาย
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                    รายละเอียดยอดขายทั้งหมด
                </p>
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
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>💰 ยอดขายรวม</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
                            ฿{totalSales.toLocaleString()}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            จากออเดอร์ {confirmedBookings.length} รายการ
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ borderLeft: '4px solid #3b82f6' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>💵 เงินมัดจำ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                            ฿{totalDeposits.toLocaleString()}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            {((totalDeposits / totalSales) * 100 || 0).toFixed(1)}% ของยอดรวม
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ borderLeft: '4px solid #22c55e' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>✅ ชำระเต็มแล้ว</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>
                            ฿{totalFullPayments.toLocaleString()}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            ออเดอร์เสร็จสิ้น
                        </p>
                    </CardContent>
                </Card>

                <Card style={{ borderLeft: '4px solid #f59e0b' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '0.875rem', color: '#6b7280' }}>⏳ รอชำระส่วนที่เหลือ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                            ฿{pendingSales.toLocaleString()}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            ออเดอร์กำลังดำเนินการ
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <Card>
                    <CardHeader>
                        <CardTitle>📈 สถิติการขาย</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>ค่าเฉลี่ยต่อออเดอร์</span>
                                    <span style={{ fontWeight: 'bold', color: '#166534' }}>฿{averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>ออเดอร์ที่ยืนยันแล้ว</span>
                                    <span style={{ fontWeight: 'bold' }}>{confirmedBookings.length} รายการ</span>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>อัตราเงินมัดจำ</span>
                                    <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{((totalDeposits / totalSales) * 100 || 0).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>🔝 ออเดอร์มูลค่าสูงสุด</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {confirmedBookings.length > 0 ? (
                            [...confirmedBookings]
                                .sort((a, b) => b.totalPrice - a.totalPrice)
                                .slice(0, 5)
                                .map((b, idx) => (
                                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: idx < 4 ? '1px solid #f3f4f6' : 'none' }}>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>#{b.refCode}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{b.user.firstName} {b.user.lastName}</div>
                                        </div>
                                        <span style={{ fontWeight: 'bold', color: '#166534' }}>฿{b.totalPrice.toLocaleString()}</span>
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
