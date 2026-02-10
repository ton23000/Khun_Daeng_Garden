'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useParams } from 'next/navigation';
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
    };
    items: BookingItem[];
}

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

// Status configuration
const STATUS_CONFIG: Record<string, { db: string; label: string; color: string; emoji: string }> = {
    'pending-approval': { db: 'PENDING_APPROVAL', label: 'รอการอนุมัติ', color: '#f97316', emoji: '⏳' },
    'pending': { db: 'PENDING', label: 'รอชำระเงิน', color: '#f59e0b', emoji: '💰' },
    'verifying-payment': { db: 'VERIFYING_PAYMENT', label: 'ตรวจสอบการชำระเงิน', color: '#3b82f6', emoji: '🔍' },
    'payment-issue': { db: 'PAYMENT_ISSUE', label: 'ชำระเงินมีปัญหา', color: '#ef4444', emoji: '⚠️' },
    'confirmed': { db: 'CONFIRMED', label: 'ยืนยันการจอง', color: '#10b981', emoji: '✅' },
    'preparing': { db: 'PREPARING', label: 'เตรียมต้นไม้', color: '#8b5cf6', emoji: '🌱' },
    'ready': { db: 'READY', label: 'พร้อมรับที่ร้าน', color: '#22c55e', emoji: '🎉' },
    'completed': { db: 'COMPLETED', label: 'เสร็จสิ้น', color: '#6b7280', emoji: '✔️' },
    'cancelled': { db: 'CANCELLED', label: 'ยกเลิกการจอง', color: '#dc2626', emoji: '❌' },
};

export default function OrderStatusPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const status = params.status as string;

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
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    const statusConfig = STATUS_CONFIG[status];

    useEffect(() => {
        if (isLoading) return;
        if (!user || user.role !== 'admin') {
            router.push('/admin/login');
        } else if (!statusConfig) {
            router.push('/admin/dashboard');
        } else {
            fetchBookings();
        }
    }, [user, isLoading, router, statusConfig]);

    useEffect(() => {
        filterAndSortBookings();
    }, [bookings, searchQuery, sortConfig]);

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

        // Filter by status
        if (statusConfig) {
            result = result.filter(b => b.status === statusConfig.db);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.user.name.toLowerCase().includes(query) ||
                b.user.phone.includes(query) ||
                b.refCode.toLowerCase().includes(query)
            );
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
                    default:
                        return 0;
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredBookings(result);
    }, [bookings, searchQuery, sortConfig, statusConfig]);

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
            PENDING_APPROVAL: { color: '#f97316', label: 'รอการอนุมัติ' },
            PENDING: { color: '#f59e0b', label: 'รอชำระเงิน' },
            VERIFYING_PAYMENT: { color: '#3b82f6', label: 'ตรวจสอบการชำระเงิน' },
            PAYMENT_ISSUE: { color: '#ef4444', label: 'ชำระเงินมีปัญหา' },
            CONFIRMED: { color: '#10b981', label: 'ยืนยันการจอง' },
            PREPARING: { color: '#8b5cf6', label: 'เตรียมต้นไม้' },
            READY: { color: '#22c55e', label: 'พร้อมรับที่ร้าน' },
            COMPLETED: { color: '#6b7280', label: 'เสร็จสิ้น' },
            CANCELLED: { color: '#dc2626', label: 'ยกเลิกการจอง' },
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
            PENDING_APPROVAL: 'รอการอนุมัติ',
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

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    if (!statusConfig) {
        return null;
    }

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/admin/dashboard')}
                        style={{ marginBottom: '1rem' }}
                    >
                        ← กลับ Dashboard
                    </Button>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: statusConfig.color }}>
                        {statusConfig.emoji} {statusConfig.label}
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                        พบ {filteredBookings.length} รายการ
                    </p>
                </div>
            </header>

            {/* Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <SearchBar
                    placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, รหัสออเดอร์..."
                    onSearch={setSearchQuery}
                />
            </div>

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
                                <th style={{ padding: '1rem' }}>สถานะ</th>
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
                                            <div>{booking.user.name}</div>
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
                                                    <option value="PENDING_APPROVAL">รอการอนุมัติ</option>
                                                    <option value="PENDING">รอชำระเงิน</option>
                                                    <option value="VERIFYING_PAYMENT">ตรวจสอบการชำระเงิน</option>
                                                    <option value="PAYMENT_ISSUE">ชำระเงินมีปัญหา</option>
                                                    <option value="CONFIRMED">ยืนยันการจอง</option>
                                                    <option value="PREPARING">เตรียมต้นไม้</option>
                                                    <option value="READY">พร้อมรับ</option>
                                                    <option value="COMPLETED">เสร็จสิ้น</option>
                                                    <option value="CANCELLED">ยกเลิก</option>
                                                </select>
                                            ) : (
                                                <span style={getStatusBadge(booking.status)}>
                                                    {getStatusLabel(booking.status)}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {editingId === booking.id ? (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <Button size="sm" onClick={() => handleUpdate(booking.id)}>บันทึก</Button>
                                                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>ยกเลิก</Button>
                                                </div>
                                            ) : booking.status === 'PENDING_APPROVAL' ? (
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <Button
                                                        size="sm"
                                                        onClick={async () => {
                                                            if (!confirm(`อนุมัติออเดอร์ #${booking.refCode}?`)) return;
                                                            try {
                                                                const res = await fetch(`/api/admin/bookings/${booking.id}/action`, {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ action: 'approve' })
                                                                });
                                                                if (res.ok) {
                                                                    alert('อนุมัติออเดอร์เรียบร้อย');
                                                                    fetchBookings();
                                                                } else {
                                                                    const data = await res.json();
                                                                    alert(data.error || 'เกิดข้อผิดพลาด');
                                                                }
                                                            } catch (error) {
                                                                console.error('Approve error:', error);
                                                                alert('เกิดข้อผิดพลาด');
                                                            }
                                                        }}
                                                        style={{ backgroundColor: '#22c55e', borderColor: '#22c55e', color: 'white' }}
                                                    >
                                                        ✅ อนุมัติ
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={async () => {
                                                            if (!confirm(`ปฏิเสธออเดอร์ #${booking.refCode}?`)) return;
                                                            try {
                                                                const res = await fetch(`/api/admin/bookings/${booking.id}/action`, {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ action: 'reject' })
                                                                });
                                                                if (res.ok) {
                                                                    alert('ปฏิเสธออเดอร์เรียบร้อย');
                                                                    fetchBookings();
                                                                } else {
                                                                    alert('เกิดข้อผิดพลาด');
                                                                }
                                                            } catch (error) {
                                                                console.error('Reject error:', error);
                                                                alert('เกิดข้อผิดพลาด');
                                                            }
                                                        }}
                                                        style={{ borderColor: '#ef4444', color: '#ef4444' }}
                                                    >
                                                        ❌ ปฏิเสธ
                                                    </Button>
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
