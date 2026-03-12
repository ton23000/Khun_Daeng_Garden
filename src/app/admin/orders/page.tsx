'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
// Actually, better to remove the line.
import SlipViewer from '@/components/SlipViewer';
import { SearchBar } from '@/components/admin/SearchBar';
import { SortableTableHeader } from '@/components/admin/SortableTableHeader';

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
    slipUrl: string | null;
    user: {
        firstName: string;
        lastName: string;
        phone: string;
    };
    items: BookingItem[];
}

type ViewMode = 'all' | 'by-customer' | 'pending-approval';
type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

export default function OrdersPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams?.get('booking');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [trees, setTrees] = useState<{ id: string; stock: number; reserved: number;[key: string]: unknown }[]>([]);
    const [viewingSlip, setViewingSlip] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        status: '',
        pickupDate: '',
        note: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('all');
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        try {
            const res = await fetch('/api/bookings');
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        }
    }, []);

    const fetchTrees = useCallback(async () => {
        try {
            const res = await fetch('/api/trees');
            if (res.ok) {
                const data = await res.json();
                setTrees(data);
            }
        } catch (error) {
            console.error('Failed to fetch trees', error);
        }
    }, []);

    useEffect(() => {
        if (isLoading) return;
        if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
            router.push('/login');
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchBookings();
            fetchTrees();
        }
    }, [user, isLoading, router, fetchBookings, fetchTrees]);

    // Highlight booking when URL parameter is present
    useEffect(() => {
        if (bookingId && bookings.length > 0) {
            const targetBooking = bookings.find(b => b.id === bookingId || b.refCode === bookingId);
            if (targetBooking) {
                // Scroll to the booking
                setTimeout(() => {
                    const element = document.getElementById(`booking-${targetBooking.id}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Add highlight effect
                        element.style.backgroundColor = '#fef3c7';
                        setTimeout(() => {
                            element.style.transition = 'background-color 2s';
                            element.style.backgroundColor = '';
                        }, 2000);
                    }
                }, 500);
            }
        }
    }, [bookingId, bookings]);

    const handleStatusClick = (status: string | null) => {
        setStatusFilter(status);
        if (status) setViewMode('all');
        setSelectedCustomer(null);
    };

    const filterAndSortBookings = useCallback(() => {
        let result = [...bookings];

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b =>
                `${b.user.firstName} ${b.user.lastName}`.toLowerCase().includes(query) ||
                b.user.phone.includes(query) ||
                b.refCode.toLowerCase().includes(query)
            );
        }

        // Filter by customer
        if (viewMode === 'by-customer' && selectedCustomer) {
            result = result.filter(b => `${b.user.firstName} ${b.user.lastName}` === selectedCustomer);
        }

        // Filter by status
        if (statusFilter) {
            if (statusFilter === 'VERIFYING_PAYMENT') {
                result = result.filter(b => b.status === 'VERIFYING_PAYMENT' || b.status === 'PAID');
            } else if (statusFilter === 'PENDING_APPROVAL') {
                result = result.filter(b => b.status === 'PENDING_APPROVAL' || b.status === 'PRE_ORDER');
            } else {
                result = result.filter(b => b.status === statusFilter);
            }
        }

        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                let aValue: string | number;
                let bValue: string | number;

                switch (sortConfig.key) {
                    case 'customer':
                        aValue = `${a.user.firstName} ${a.user.lastName}`;
                        bValue = `${b.user.firstName} ${b.user.lastName}`;
                        break;
                    case 'date':
                        aValue = new Date(a.createdAt).getTime();
                        bValue = new Date(b.createdAt).getTime();
                        break;
                    case 'price':
                        aValue = a.totalPrice;
                        bValue = b.totalPrice;
                        break;
                    case 'status':
                        aValue = a.status;
                        bValue = b.status;
                        break;
                    default:
                        return 0;
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredBookings(result);
    }, [bookings, searchQuery, viewMode, selectedCustomer, sortConfig, statusFilter]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        filterAndSortBookings();
    }, [filterAndSortBookings]);

    const handleSort = (key: string) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const handleEdit = (booking: Booking) => {
        setEditingId(booking.id);
        setEditForm({
            status: booking.status,
            pickupDate: new Date(booking.pickupDate).toISOString().split('T')[0],
            note: booking.note || ''
        });
    };

    const handleUpdate = async (id: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                alert('อัปเดตสถานะเรียบร้อย');
                setEditingId(null);
                fetchBookings();
            } else {
                alert('เกิดข้อผิดพลาด');
            }
        } catch (error) {
            console.error('Failed to update', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    };

    const handleDelete = async (id: string, refCode: string) => {
        if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบออเดอร์ ${refCode}?\n\nการลบจะไม่สามารถกู้คืนได้`)) {
            return;
        }

        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('ลบออเดอร์เรียบร้อย');
                fetchBookings();
            } else {
                const data = await res.json();
                alert(`เกิดข้อผิดพลาด: ${data.error || 'ไม่สามารถลบได้'}`);
            }
        } catch (error) {
            console.error('Failed to delete', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { color: string; label: string }> = {
            PENDING_APPROVAL: { color: '#6b7280', label: 'รอการอนุมัติ' },
            PRE_ORDER: { color: '#6b7280', label: 'รอการอนุมัติ' },
            PENDING: { color: '#f59e0b', label: 'รอชำระเงิน' },
            VERIFYING_PAYMENT: { color: '#3b82f6', label: 'ตรวจสอบการชำระเงิน' },
            PAYMENT_ISSUE: { color: '#ef4444', label: 'ชำระเงินมีปัญหา' },
            CONFIRMED: { color: '#10b981', label: 'ยืนยันการจอง' },
            PREPARING: { color: '#8b5cf6', label: 'เตรียมต้นไม้' },
            READY: { color: '#22c55e', label: 'พร้อมรับที่ร้าน' },
            COMPLETED: { color: '#6b7280', label: 'เสร็จสิ้น' },
            CANCELLED: { color: '#dc2626', label: 'ยกเลิกการจอง' },
            // Legacy statuses
            PAID: { color: '#3b82f6', label: 'ตรวจสอบการชำระเงิน' }
        };
        const config = statusConfig[status] || { color: '#6b7280', label: status };
        return {
            backgroundColor: config.color,
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 'bold'
        };
    };



    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            PENDING_APPROVAL: 'รอการอนุมัติ',
            PRE_ORDER: 'รอการอนุมัติ',
            PENDING: 'รอชำระเงิน',
            PAID: 'ตรวจสอบการชำระเงิน',
            VERIFYING_PAYMENT: 'ตรวจสอบการชำระเงิน',
            PREPARING: 'กำลังเตรียม',
            READY: 'พร้อมรับ',
            COMPLETED: 'เสร็จสิ้น',
            CANCELLED: 'ยกเลิก'
        };
        return texts[status] || status;
    };

    // Get unique customers
    const customers = Array.from(new Set(bookings.map(b => `${b.user.firstName} ${b.user.lastName}`))).sort();

    // Customer stats
    const getCustomerStats = (customerName: string) => {
        const customerBookings = bookings.filter(b => `${b.user.firstName} ${b.user.lastName}` === customerName);
        const totalOrders = customerBookings.length;
        const totalSpent = customerBookings.reduce((sum, b) => sum + b.deposit, 0);
        return { totalOrders, totalSpent };
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
        return null;
    }

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>จัดการออเดอร์ทั้งหมด</h1>
            </header>


            {/* Stats */}
            {/* Stats */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                    { id: 'PENDING_APPROVAL', label: 'รอการอนุมัติ', color: '#f59e0b', count: bookings.filter(b => b.status === 'PENDING_APPROVAL' || b.status === 'PRE_ORDER').length },
                    { id: 'PENDING', label: 'รอชำระเงิน', color: '#f59e0b' },
                    { id: 'VERIFYING_PAYMENT', label: 'รอตรวจสอบ', color: '#3b82f6', count: bookings.filter(b => b.status === 'VERIFYING_PAYMENT' || b.status === 'PAID').length },
                    { id: 'PAYMENT_ISSUE', label: 'ชำระมีปัญหา', color: '#ef4444' },
                    { id: 'CONFIRMED', label: 'ยืนยันจอง', color: '#10b981' },
                    { id: 'PREPARING', label: 'เตรียมสินค้า', color: '#8b5cf6' },
                    { id: 'READY', label: 'พร้อมรับ', color: '#22c55e' },
                    { id: 'COMPLETED', label: 'เสร็จสิ้น', color: '#6b7280' },
                    { id: 'CANCELLED', label: 'ยกเลิก', color: '#dc2626' },
                ].map(stat => (
                    <Card
                        key={stat.id}
                        style={{ cursor: 'pointer', transition: 'transform 0.2s', borderColor: statusFilter === stat.id ? stat.color : undefined }}
                        onClick={() => handleStatusClick(stat.id)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <CardContent style={{ padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 500 }}>{stat.label}</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>
                                {stat.count !== undefined ? stat.count : bookings.filter(b => b.status === stat.id).length}
                            </p>
                        </CardContent>
                    </Card>
                ))}

                <Card
                    style={{
                        borderColor: trees.filter(t => (t.stock - t.reserved) > 0 && (t.stock - t.reserved) < 5).length > 0 ? '#f59e0b' : '#e5e7eb',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onClick={() => router.push('/admin/inventory')}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <CardContent style={{ padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 500 }}>⚠️ สต็อกต่ำ</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                            {trees.filter(t => (t.stock - t.reserved) > 0 && (t.stock - t.reserved) < 5).length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Order Management Section */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e11d48' }}>จัดการออเดอร์</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ width: '250px' }}>
                        <SearchBar
                            placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, รหัส"
                            onSearch={setSearchQuery}
                        />
                    </div>
                    <Button
                        variant={viewMode === 'all' && !statusFilter ? 'primary' : 'outline'}
                        onClick={() => { setViewMode('all'); setSelectedCustomer(null); setStatusFilter(null); }}
                        style={{ 
                            backgroundColor: viewMode === 'all' && !statusFilter ? '#e11d48' : 'transparent',
                            color: viewMode === 'all' && !statusFilter ? 'white' : '#374151',
                            borderColor: viewMode === 'all' && !statusFilter ? '#e11d48' : '#e5e7eb',
                            minWidth: '80px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        ทั้งหมด
                    </Button>
                    <Button
                        variant={statusFilter === 'PENDING_APPROVAL' ? 'primary' : 'outline'}
                        onClick={() => handleStatusClick('PENDING_APPROVAL')}
                        style={{
                            backgroundColor: statusFilter === 'PENDING_APPROVAL' ? '#fef3c7' : 'transparent',
                            borderColor: statusFilter === 'PENDING_APPROVAL' ? '#f59e0b' : '#e5e7eb',
                            color: '#d97706',
                            minWidth: '130px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        <span>⚠️</span> รอการอนุมัติ
                    </Button>
                    <Button
                        variant={viewMode === 'by-customer' ? 'primary' : 'outline'}
                        onClick={() => setViewMode('by-customer')}
                        style={{ 
                            backgroundColor: viewMode === 'by-customer' ? '#22c55e' : 'transparent',
                            borderColor: viewMode === 'by-customer' ? '#22c55e' : '#e5e7eb',
                            color: viewMode === 'by-customer' ? 'white' : '#374151',
                            minWidth: '120px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        แยกตามลูกค้า
                    </Button>
                </div>
            </div>

            {/* Customer List (when in by-customer mode) */}
            {viewMode === 'by-customer' && (
                <Card style={{ marginBottom: '1rem' }}>
                    <CardContent style={{ padding: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>เลือกลูกค้า:</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {customers.map(customer => {
                                const stats = getCustomerStats(customer);
                                return (
                                    <button
                                        key={customer}
                                        onClick={() => setSelectedCustomer(customer)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '0.5rem',
                                            border: selectedCustomer === customer ? '2px solid #166534' : '1px solid #d1d5db',
                                            backgroundColor: selectedCustomer === customer ? '#dcfce7' : 'white',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            fontWeight: selectedCustomer === customer ? 600 : 400
                                        }}
                                    >
                                        <div>{customer}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            {stats.totalOrders} ออเดอร์ · ฿{stats.totalSpent.toLocaleString()}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .desktop-table-view { display: none; }
                .mobile-card-view { display: flex; flex-direction: column; gap: 1rem; padding-bottom: 2rem; }
                @media (min-width: 768px) {
                    .desktop-table-view { display: block; }
                    .mobile-card-view { display: none; }
                }
            `}} />

            {/* Mobile View (Cards) */}
            <div className="mobile-card-view">
                {filteredBookings.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>ไม่มีออเดอร์</div>
                ) : (
                    filteredBookings.map(booking => (
                        <Card key={booking.id} id={`booking-${booking.id}`} style={{ border: '1px solid #e5e7eb', marginBottom: '1rem' }}>
                            <CardContent style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold' }}>{booking.refCode}</span>
                                    <span style={{ ...getStatusBadge(booking.status), whiteSpace: 'nowrap' }}>
                                        {getStatusText(booking.status)}
                                    </span>
                                </div>
                                <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                                    <div style={{ fontWeight: 500 }}>{booking.user.firstName} {booking.user.lastName}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{booking.user.phone}</div>
                                </div>
                                <div style={{ fontSize: '0.875rem' }}>
                                    {booking.items.map((item, idx) => (
                                        <div key={idx}>• {item.tree.name} x{item.quantity}</div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                                    <span>ยอดรวม:</span>
                                    <span style={{ color: '#166534' }}>฿{booking.totalPrice.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                    <span>วันรับของ:</span>
                                    <span>{new Date(booking.pickupDate).toLocaleDateString('th-TH')}</span>
                                </div>
                                {booking.slipUrl && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderColor: '#bbf7d0', color: '#166534', width: '100%' }}
                                        onClick={() => setViewingSlip(booking.slipUrl)}
                                    >
                                        📎 ดูสลิป
                                    </Button>
                                )}
                                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                                    {['PENDING_APPROVAL', 'PRE_ORDER'].includes(booking.status) ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button
                                                size="sm"
                                                onClick={async () => {
                                                    if (!confirm(`อนุมัติออเดอร์ #${booking.refCode}?`)) return;
                                                    try {
                                                        const res = await fetch(`/api/admin/bookings/${booking.id}/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve' }) });
                                                        if (res.ok) fetchBookings(); else alert('เกิดข้อผิดพลาด');
                                                    } catch { alert('เกิดข้อผิดพลาด'); }
                                                }}
                                                style={{ backgroundColor: '#22c55e', borderColor: '#22c55e', color: 'white', flex: 1, borderRadius: '4px' }}
                                            >
                                                อนุมัติ
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={async () => {
                                                    if (!confirm(`ปฏิเสธออเดอร์ #${booking.refCode}?`)) return;
                                                    try {
                                                        const res = await fetch(`/api/admin/bookings/${booking.id}/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject' }) });
                                                        if (res.ok) fetchBookings(); else alert('เกิดข้อผิดพลาด');
                                                    } catch { alert('เกิดข้อผิดพลาด'); }
                                                }}
                                                style={{ borderColor: '#ef4444', color: '#ef4444', flex: 1, borderRadius: '4px' }}
                                            >
                                                [ ✕ ปฏิเสธ ]
                                            </Button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button size="sm" variant="outline" onClick={() => handleEdit(booking)} style={{ flex: 1 }}>แก้ไข</Button>
                                            {!['PENDING', 'PAID', 'VERIFYING_PAYMENT', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'].includes(booking.status) && (
                                                <Button size="sm" variant="outline" onClick={() => handleDelete(booking.id, booking.refCode)} style={{ borderColor: '#ef4444', color: '#ef4444', flex: 1 }}>ลบ</Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Desktop View (Table) */}
            <div className="desktop-table-view">
                <div style={{ maxWidth: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '1rem' }}>
                    <div style={{ minWidth: '800px', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                        <div style={{ padding: 0 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', color: '#374151', fontWeight: 600, fontSize: '0.875rem' }}>รหัส</th>
                                        <SortableTableHeader label="ลูกค้า" sortKey="customer" currentSort={sortConfig} onSort={handleSort} style={{ color: '#374151', fontWeight: 600, fontSize: '0.875rem' }} />
                                        <th style={{ padding: '1rem', color: '#374151', fontWeight: 600, fontSize: '0.875rem' }}>รายการ</th>
                                        <SortableTableHeader label="ยอดรวม" sortKey="price" currentSort={sortConfig} onSort={handleSort} style={{ color: '#374151', fontWeight: 600, fontSize: '0.875rem' }} />
                                        <th style={{ padding: '1rem', color: '#374151', fontWeight: 600, fontSize: '0.875rem' }}>สลิป</th>
                                        <SortableTableHeader label="วันรับของ" sortKey="date" currentSort={sortConfig} onSort={handleSort} style={{ color: '#374151', fontWeight: 600, fontSize: '0.875rem' }} />
                                        <SortableTableHeader label="สถานะ" sortKey="status" currentSort={sortConfig} onSort={handleSort} style={{ color: '#374151', fontWeight: 600, fontSize: '0.875rem' }} />
                                        <th style={{ padding: '1rem', color: '#374151', fontWeight: 600, fontSize: '0.875rem' }}>จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.length === 0 ? (
                                        <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center' }}>ไม่มีออเดอร์</td></tr>
                                    ) : (
                                        filteredBookings.map(booking => (
                                            <tr key={booking.id} id={`booking-${booking.id}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '1rem', fontWeight: 500 }}>{booking.refCode}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div>{booking.user.firstName} {booking.user.lastName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{booking.user.phone}</div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {booking.items.map((item, idx) => (
                                                        <div key={idx} style={{ fontSize: '0.875rem' }}>{item.tree.name} x{item.quantity}</div>
                                                    ))}
                                                </td>
                                                <td style={{ padding: '1rem' }}>฿{booking.totalPrice.toLocaleString()}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    {booking.slipUrl ? (
                                                        <Button size="sm" variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', borderColor: '#bbf7d0', color: '#166534', whiteSpace: 'nowrap' }} onClick={() => setViewingSlip(booking.slipUrl)}>
                                                            📎 ดูสลิป
                                                        </Button>
                                                    ) : <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {editingId === booking.id ? (
                                                        <Input type="date" value={editForm.pickupDate} onChange={(e) => setEditForm({ ...editForm, pickupDate: e.target.value })} />
                                                    ) : new Date(booking.pickupDate).toLocaleDateString('th-TH')}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {editingId === booking.id ? (
                                                        <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}>
                                                            <option value="PENDING_APPROVAL">รอการอนุมัติ</option>
                                                            <option value="PENDING">รอชำระเงิน</option>
                                                            <option value="PAID">รอตรวจสอบ</option>
                                                            <option value="PREPARING">กำลังเตรียม</option>
                                                            <option value="READY">พร้อมรับ</option>
                                                            <option value="COMPLETED">เสร็จสิ้น</option>
                                                            <option value="CANCELLED">ยกเลิก</option>
                                                        </select>
                                                    ) : (
                                                        <span style={{ ...getStatusBadge(booking.status), whiteSpace: 'nowrap' }}>{getStatusText(booking.status)}</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {editingId === booking.id ? (
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <Button size="sm" onClick={() => handleUpdate(booking.id)}>บันทึก</Button>
                                                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>ยกเลิก</Button>
                                                        </div>
                                                    ) : ['PENDING_APPROVAL', 'PRE_ORDER'].includes(booking.status) ? (
                                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', minWidth: '150px' }}>
                                                            <Button size="sm" onClick={async () => {
                                                                if (!confirm(`อนุมัติออเดอร์ #${booking.refCode}?`)) return;
                                                                try {
                                                                    const res = await fetch(`/api/admin/bookings/${booking.id}/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve' }) });
                                                                    if (res.ok) { alert('อนุมัติออเดอร์เรียบร้อย'); fetchBookings(); } else alert('เกิดข้อผิดพลาด');
                                                                } catch { alert('เกิดข้อผิดพลาด'); }
                                                            }} style={{ backgroundColor: '#22c55e', borderColor: '#22c55e', color: 'white', flex: 1, borderRadius: '4px' }}>
                                                                อนุมัติ
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={async () => {
                                                                if (!confirm(`ปฏิเสธออเดอร์ #${booking.refCode}?`)) return;
                                                                try {
                                                                    const res = await fetch(`/api/admin/bookings/${booking.id}/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject' }) });
                                                                    if (res.ok) { alert('ปฏิเสธออเดอร์เรียบร้อย'); fetchBookings(); } else alert('เกิดข้อผิดพลาด');
                                                                } catch { alert('เกิดข้อผิดพลาด'); }
                                                            }} style={{ borderColor: '#ef4444', color: '#ef4444', flex: 1, borderRadius: '4px' }}>
                                                                [ ✕ ปฏิเสธ ]
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', gap: '0.5rem', minWidth: '100px' }}>
                                                            <Button size="sm" variant="outline" onClick={() => handleEdit(booking)} style={{ borderColor: '#1d4ed8', color: '#1d4ed8' }}>แก้ไข</Button>
                                                            {!['PENDING', 'PAID', 'VERIFYING_PAYMENT', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'].includes(booking.status) && (
                                                                <Button size="sm" variant="outline" onClick={() => handleDelete(booking.id, booking.refCode)} style={{ borderColor: '#ef4444', color: '#ef4444' }}>ลบ</Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <SlipViewer
                isOpen={!!viewingSlip}
                slipUrl={viewingSlip}
                onClose={() => setViewingSlip(null)}
            />
        </div>
    );
}
