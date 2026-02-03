'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/admin/NotificationBell'; // Keep for now if we want to use it elsewhere, or remove line if unused. User wanted it removed from here. 
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
        name: string;
        phone: string;
        nickname?: string;
    };
    items: BookingItem[];
}

type ViewMode = 'all' | 'by-customer';
type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
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

    useEffect(() => {
        if (isLoading) return;
        if (!user || user.role !== 'admin') {
            router.push('/admin/login');
        } else {
            fetchBookings();
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        filterAndSortBookings();
    }, [bookings, searchQuery, viewMode, selectedCustomer, sortConfig]);

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings');
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        }
    };

    const filterAndSortBookings = useCallback(() => {
        let result = [...bookings];

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.user.name.toLowerCase().includes(query) ||
                b.user.phone.includes(query) ||
                b.refCode.toLowerCase().includes(query)
            );
        }

        // Filter by customer
        if (viewMode === 'by-customer' && selectedCustomer) {
            result = result.filter(b => b.user.name === selectedCustomer);
        }

        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                switch (sortConfig.key) {
                    case 'customer':
                        aValue = a.user.name;
                        bValue = b.user.name;
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
    }, [bookings, searchQuery, viewMode, selectedCustomer, sortConfig]);

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
            PENDING: { color: '#f59e0b', label: 'รอชำระเงิน' },
            VERIFYING_PAYMENT: { color: '#3b82f6', label: 'ตรวจสอบการชำระเงิน' },
            PAYMENT_ISSUE: { color: '#ef4444', label: 'ชำระเงินมีปัญหา' },
            CONFIRMED: { color: '#10b981', label: 'ยืนยันการจอง' },
            PREPARING: { color: '#8b5cf6', label: 'เตรียมต้นไม้' },
            READY: { color: '#22c55e', label: 'พร้อมรับที่ร้าน' },
            COMPLETED: { color: '#6b7280', label: 'เสร็จสิ้น' },
            CANCELLED: { color: '#dc2626', label: 'ยกเลิกการจอง' },
            // Legacy statuses
            PAID: { color: '#3b82f6', label: 'รอตรวจสอบ' }
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

    const getStatusLabel = (status: string) => {
        const statusConfig: Record<string, string> = {
            PENDING: 'รอชำระเงิน',
            VERIFYING_PAYMENT: 'ตรวจสอบการชำระเงิน',
            PAYMENT_ISSUE: 'ชำระเงินมีปัญหา',
            CONFIRMED: 'ยืนยันการจอง',
            PREPARING: 'เตรียมต้นไม้',
            READY: 'พร้อมรับที่ร้าน',
            COMPLETED: 'เสร็จสิ้น',
            CANCELLED: 'ยกเลิกการจอง',
            PAID: 'รอตรวจสอบ'
        };
        return statusConfig[status] || status;
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            PENDING: 'รอชำระเงิน',
            PAID: 'รอตรวจสอบ',
            PREPARING: 'กำลังเตรียม',
            READY: 'พร้อมรับ',
            COMPLETED: 'เสร็จสิ้น',
            CANCELLED: 'ยกเลิก'
        };
        return texts[status] || status;
    };

    // Get unique customers
    const customers = Array.from(new Set(bookings.map(b => b.user.name))).sort();

    // Customer stats
    const getCustomerStats = (customerName: string) => {
        const customerBookings = bookings.filter(b => b.user.name === customerName);
        const totalOrders = customerBookings.length;
        const totalSpent = customerBookings.reduce((sum, b) => sum + b.deposit, 0);
        return { totalOrders, totalSpent };
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>Dashboard</h1>
            </header>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <Card>
                    <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>รายการจองรอตรวจสอบ</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>
                            {bookings.filter(b => b.status === 'PENDING' || b.status === 'PAID').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>ยอดขายเดือนนี้</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            ฿ {bookings.filter(b => b.status !== 'CANCELLED').reduce((s, b) => s + b.deposit, 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>ต้นไม้ที่ถูกจอง</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                            {bookings.reduce((acc, b) => acc + b.items.reduce((s, i) => s + i.quantity, 0), 0)} ต้น
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Order Management Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>จัดการออเดอร์</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <SearchBar
                        placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, รหัสออเดอร์..."
                        onSearch={setSearchQuery}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                            variant={viewMode === 'all' ? 'primary' : 'outline'}
                            onClick={() => {
                                setViewMode('all');
                                setSelectedCustomer(null);
                            }}
                        >
                            ทั้งหมด
                        </Button>
                        <Button
                            variant={viewMode === 'by-customer' ? 'primary' : 'outline'}
                            onClick={() => setViewMode('by-customer')}
                        >
                            แยกตามลูกค้า
                        </Button>
                    </div>
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

            <Card>
                <CardContent style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>รหัส</th>
                                <SortableTableHeader
                                    label="ลูกค้า"
                                    sortKey="customer"
                                    currentSort={sortConfig}
                                    onSort={handleSort}
                                />
                                <th style={{ padding: '1rem' }}>รายการ</th>
                                <SortableTableHeader
                                    label="ยอดรวม"
                                    sortKey="price"
                                    currentSort={sortConfig}
                                    onSort={handleSort}
                                />
                                <th style={{ padding: '1rem' }}>สลิป</th>
                                <SortableTableHeader
                                    label="วันรับของ"
                                    sortKey="date"
                                    currentSort={sortConfig}
                                    onSort={handleSort}
                                />
                                <SortableTableHeader
                                    label="สถานะ"
                                    sortKey="status"
                                    currentSort={sortConfig}
                                    onSort={handleSort}
                                />
                                <th style={{ padding: '1rem' }}>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length === 0 ? (
                                <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center' }}>ไม่มีออเดอร์</td></tr>
                            ) : (
                                filteredBookings.map(booking => (
                                    <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{booking.refCode}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div>
                                                {booking.user.name}
                                                {booking.user.nickname && <span style={{ color: '#6b7280', fontSize: '0.875rem' }}> ({booking.user.nickname})</span>}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{booking.user.phone}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {booking.items.map((item, idx) => (
                                                <div key={idx} style={{ fontSize: '0.875rem' }}>
                                                    {item.tree.name} x{item.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td style={{ padding: '1rem' }}>฿{booking.totalPrice.toLocaleString()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {booking.slipUrl ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', borderColor: '#bbf7d0', color: '#166534' }}
                                                    onClick={() => setViewingSlip(booking.slipUrl)}
                                                >
                                                    📎 ดูสลิป
                                                </Button>
                                            ) : (
                                                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {editingId === booking.id ? (
                                                <Input
                                                    type="date"
                                                    value={editForm.pickupDate}
                                                    onChange={(e) => setEditForm({ ...editForm, pickupDate: e.target.value })}
                                                />
                                            ) : (
                                                new Date(booking.pickupDate).toLocaleDateString('th-TH')
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {editingId === booking.id ? (
                                                <select
                                                    value={editForm.status}
                                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                    style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                                                >
                                                    <option value="PENDING">รอชำระเงิน</option>
                                                    <option value="PAID">รอตรวจสอบ</option>
                                                    <option value="PREPARING">กำลังเตรียม</option>
                                                    <option value="READY">พร้อมรับ</option>
                                                    <option value="COMPLETED">เสร็จสิ้น</option>
                                                    <option value="CANCELLED">ยกเลิก</option>
                                                </select>
                                            ) : (
                                                <span style={getStatusBadge(booking.status)}>
                                                    {getStatusText(booking.status)}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {editingId === booking.id ? (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <Button size="sm" onClick={() => handleUpdate(booking.id)}>บันทึก</Button>
                                                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>ยกเลิก</Button>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <Button size="sm" variant="outline" onClick={() => handleEdit(booking)}>แก้ไข</Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(booking.id, booking.refCode)}
                                                        style={{ borderColor: '#ef4444', color: '#ef4444' }}
                                                    >
                                                        ลบ
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <SlipViewer
                isOpen={!!viewingSlip}
                slipUrl={viewingSlip}
                onClose={() => setViewingSlip(null)}
            />
        </div>
    );
}
