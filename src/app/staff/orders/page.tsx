'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
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

export default function StaffOrdersPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [trees, setTrees] = useState<{ id: string; stock: number; reserved: number;[key: string]: unknown }[]>([]);
    const [viewingSlip, setViewingSlip] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ status: '', pickupDate: '', note: '' });
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
            router.push('/staff/login');
        } else {
            setTimeout(() => {
                fetchBookings();
                fetchTrees();
            }, 0);
        }
    }, [user, isLoading, router, fetchBookings, fetchTrees]);

    const handleStatusClick = (status: string | null) => {
        setStatusFilter(status);
        if (status) setViewMode('all');
        setSelectedCustomer(null);
    };

    const filterAndSortBookings = useCallback(() => {
        let result = [...bookings];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b =>
                `${b.user.firstName} ${b.user.lastName}`.toLowerCase().includes(query) ||
                b.user.phone.includes(query) ||
                b.refCode.toLowerCase().includes(query)
            );
        }
        if (viewMode === 'by-customer' && selectedCustomer) {
            result = result.filter(b => `${b.user.firstName} ${b.user.lastName}` === selectedCustomer);
        }
        if (statusFilter) {
            if (statusFilter === 'VERIFYING_PAYMENT') {
                result = result.filter(b => b.status === 'VERIFYING_PAYMENT' || b.status === 'PAID');
            } else if (statusFilter === 'PENDING_APPROVAL') {
                result = result.filter(b => b.status === 'PENDING_APPROVAL' || b.status === 'PRE_ORDER');
            } else {
                result = result.filter(b => b.status === statusFilter);
            }
        }
        if (sortConfig) {
            result.sort((a, b) => {
                let aValue: string | number;
                let bValue: string | number;
                switch (sortConfig.key) {
                    case 'customer': aValue = `${a.user.firstName} ${a.user.lastName}`; bValue = `${b.user.firstName} ${b.user.lastName}`; break;
                    case 'date': aValue = new Date(a.createdAt).getTime(); bValue = new Date(b.createdAt).getTime(); break;
                    case 'price': aValue = a.totalPrice; bValue = b.totalPrice; break;
                    case 'status': aValue = a.status; bValue = b.status; break;
                    default: return 0;
                }
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        setFilteredBookings(result);
    }, [bookings, searchQuery, viewMode, selectedCustomer, sortConfig, statusFilter]);

    useEffect(() => {
        setTimeout(() => filterAndSortBookings(), 0);
    }, [filterAndSortBookings]);

    const handleSort = (key: string) => {
        setSortConfig(current => {
            if (current?.key === key) return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
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
        if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบออเดอร์ ${refCode}?\n\nการลบจะไม่สามารถกู้คืนได้`)) return;
        try {
            const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
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
            PAID: { color: '#3b82f6', label: 'ตรวจสอบการชำระเงิน' }
        };
        const config = statusConfig[status] || { color: '#6b7280', label: status };
        return { backgroundColor: config.color, color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' };
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            PENDING_APPROVAL: 'รอการอนุมัติ', PRE_ORDER: 'รอการอนุมัติ',
            PENDING: 'รอชำระเงิน', PAID: 'ตรวจสอบการชำระเงิน', VERIFYING_PAYMENT: 'ตรวจสอบการชำระเงิน',
            PREPARING: 'กำลังเตรียม', READY: 'พร้อมรับ',
            COMPLETED: 'เสร็จสิ้น', CANCELLED: 'ยกเลิก'
        };
        return texts[status] || status;
    };

    const customers = Array.from(new Set(bookings.map(b => `${b.user.firstName} ${b.user.lastName}`))).sort();

    const getCustomerStats = (customerName: string) => {
        const cb = bookings.filter(b => `${b.user.firstName} ${b.user.lastName}` === customerName);
        return { totalOrders: cb.length, totalSpent: cb.reduce((s, b) => s + b.deposit, 0) };
    };

    if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>Loading...</div>;
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) return null;

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1d4ed8' }}>จัดการออเดอร์ทั้งหมด</h1>
            </header>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                    { id: 'PENDING_APPROVAL', label: 'รอการอนุมัติ', color: '#f59e0b', count: bookings.filter(b => b.status === 'PENDING_APPROVAL' || b.status === 'PRE_ORDER').length },
                    { id: 'PENDING', label: 'รอชำระ', color: '#f59e0b' },
                    { id: 'VERIFYING_PAYMENT', label: 'รอตรวจสอบ', color: '#3b82f6', count: bookings.filter(b => b.status === 'VERIFYING_PAYMENT' || b.status === 'PAID').length },
                    { id: 'PREPARING', label: 'เตรียมสินค้า', color: '#8b5cf6' },
                    { id: 'READY', label: 'พร้อมรับ', color: '#22c55e' },
                    { id: 'COMPLETED', label: 'เสร็จสิ้น', color: '#6b7280' },
                    { id: 'CANCELLED', label: 'ยกเลิก', color: '#dc2626' },
                ].map(stat => (
                    <Card key={stat.id} style={{ cursor: 'pointer', transition: 'transform 0.2s', borderColor: statusFilter === stat.id ? stat.color : undefined }} onClick={() => handleStatusClick(stat.id)} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <CardContent style={{ padding: '1rem', textAlign: 'center' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{stat.label}</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>
                                {stat.count !== undefined ? stat.count : bookings.filter(b => b.status === stat.id).length}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                <Card style={{ borderColor: trees.filter(t => (t.stock - t.reserved) > 0 && (t.stock - t.reserved) < 5).length > 0 ? '#f59e0b' : '#e5e7eb', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => router.push('/admin/inventory')} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <CardContent style={{ padding: '1rem', textAlign: 'center' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.25rem' }}>⚠️ สต็อกต่ำ</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{trees.filter(t => (t.stock - t.reserved) > 0 && (t.stock - t.reserved) < 5).length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>จัดการออเดอร์</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: '100%', maxWidth: '350px' }}>
                        <SearchBar placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, รหัสออเดอร์..." onSearch={setSearchQuery} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Button variant={viewMode === 'all' && !statusFilter ? 'primary' : 'outline'} onClick={() => handleStatusClick(null)} style={{ minWidth: '100px', display: 'flex', justifyContent: 'center', backgroundColor: viewMode === 'all' && !statusFilter ? '#1d4ed8' : undefined, borderColor: '#1d4ed8', color: viewMode === 'all' && !statusFilter ? 'white' : '#1d4ed8' }}>ทั้งหมด</Button>
                        <Button variant={statusFilter === 'PENDING_APPROVAL' ? 'primary' : 'outline'} onClick={() => handleStatusClick('PENDING_APPROVAL')} style={{ backgroundColor: statusFilter === 'PENDING_APPROVAL' ? '#f97316' : undefined, borderColor: '#f97316', color: statusFilter === 'PENDING_APPROVAL' ? 'white' : '#f97316', minWidth: '130px', display: 'flex', justifyContent: 'center' }}>⚠️ รอการอนุมัติ</Button>
                        <Button variant={viewMode === 'by-customer' ? 'primary' : 'outline'} onClick={() => setViewMode('by-customer')} style={{ minWidth: '120px', display: 'flex', justifyContent: 'center', borderColor: '#1d4ed8', color: viewMode === 'by-customer' ? 'white' : '#1d4ed8', backgroundColor: viewMode === 'by-customer' ? '#1d4ed8' : undefined }}>แยกตามลูกค้า</Button>
                    </div>
                </div>
            </div>

            {/* Customer List */}
            {viewMode === 'by-customer' && (
                <Card style={{ marginBottom: '1rem' }}>
                    <CardContent style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>เลือกลูกค้า:</h3>
                            <button
                                onClick={() => { setViewMode('all'); setSelectedCustomer(null); setStatusFilter(null); }}
                                style={{ padding: '0.4rem 0.8rem', borderRadius: '0.375rem', border: '1px solid #1d4ed8', backgroundColor: 'white', color: '#1d4ed8', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                ← ออเดอร์ทั้งหมด
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {customers.map(customer => {
                                const stats = getCustomerStats(customer);
                                return (
                                    <button key={customer} onClick={() => setSelectedCustomer(customer)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: selectedCustomer === customer ? '2px solid #1d4ed8' : '1px solid #d1d5db', backgroundColor: selectedCustomer === customer ? '#dbeafe' : 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: selectedCustomer === customer ? 600 : 400 }}>
                                        <div>{customer}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{stats.totalOrders} ออเดอร์ · ฿{stats.totalSpent.toLocaleString()}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            <style dangerouslySetInnerHTML={{ __html: `.desktop-table-view { display: none; } .mobile-card-view { display: flex; flex-direction: column; gap: 1rem; padding-bottom: 2rem; } @media (min-width: 768px) { .desktop-table-view { display: block; } .mobile-card-view { display: none; } }` }} />

            {/* Mobile View */}
            <div className="mobile-card-view">
                {filteredBookings.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>ไม่มีออเดอร์</div>
                ) : (
                    filteredBookings.map(booking => (
                        <Card key={booking.id} style={{ border: '1px solid #e5e7eb', marginBottom: '1rem' }}>
                            <CardContent style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold' }}>{booking.refCode}</span>
                                    <span style={{ ...getStatusBadge(booking.status), whiteSpace: 'nowrap' }}>{getStatusText(booking.status)}</span>
                                </div>
                                <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                                    <div style={{ fontWeight: 500 }}>{booking.user.firstName} {booking.user.lastName}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{booking.user.phone}</div>
                                </div>
                                <div style={{ fontSize: '0.875rem' }}>
                                    {booking.items.map((item, idx) => (<div key={idx}>• {item.tree.name} x{item.quantity}</div>))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>ยอดรวม:</span>
                                    <span style={{ color: '#1d4ed8' }}>฿{booking.totalPrice.toLocaleString()}</span>
                                </div>
                                {booking.slipUrl && (
                                    <Button size="sm" variant="outline" style={{ borderColor: '#bfdbfe', color: '#1d4ed8', width: '100%' }} onClick={() => setViewingSlip(booking.slipUrl)}>📎 ดูสลิป</Button>
                                )}
                                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                                    {['PENDING_APPROVAL', 'PRE_ORDER'].includes(booking.status) ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button size="sm" onClick={async () => { if (!confirm(`อนุมัติออเดอร์ #${booking.refCode}?`)) return; try { const res = await fetch(`/api/admin/bookings/${booking.id}/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve' }) }); if (res.ok) fetchBookings(); else alert('เกิดข้อผิดพลาด'); } catch { alert('เกิดข้อผิดพลาด'); } }} style={{ backgroundColor: '#22c55e', borderColor: '#22c55e', color: 'white', flex: 1 }}>✅ อนุมัติ</Button>
                                            <Button size="sm" variant="outline" onClick={async () => { if (!confirm(`ปฏิเสธออเดอร์ #${booking.refCode}?`)) return; try { const res = await fetch(`/api/admin/bookings/${booking.id}/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject' }) }); if (res.ok) fetchBookings(); else alert('เกิดข้อผิดพลาด'); } catch { alert('เกิดข้อผิดพลาด'); } }} style={{ borderColor: '#ef4444', color: '#ef4444', flex: 1 }}>❌ ปฏิเสธ</Button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button size="sm" variant="outline" onClick={() => handleEdit(booking)} style={{ flex: 1, borderColor: '#1d4ed8', color: '#1d4ed8' }}>แก้ไข</Button>
                                            {booking.status !== 'COMPLETED' && (
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

            {/* Desktop View */}
            <div className="desktop-table-view">
                <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                    <Card style={{ minWidth: '800px', border: '1px solid #e5e7eb' }}>
                        <CardContent style={{ padding: 0 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ backgroundColor: '#eff6ff', borderBottom: '2px solid #bfdbfe', whiteSpace: 'nowrap' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', width: '15%' }}>รหัส</th>
                                        <SortableTableHeader label="ลูกค้า" sortKey="customer" currentSort={sortConfig} onSort={handleSort} style={{ width: '15%' }} />
                                        <th style={{ padding: '1rem', width: '25%' }}>รายการ</th>
                                        <SortableTableHeader label="ยอดรวม" sortKey="price" currentSort={sortConfig} onSort={handleSort} style={{ width: '10%' }} />
                                        <th style={{ padding: '1rem', width: '10%' }}>สลิป</th>
                                        <SortableTableHeader label="วันรับของ" sortKey="date" currentSort={sortConfig} onSort={handleSort} style={{ width: '10%' }} />
                                        <SortableTableHeader label="สถานะ" sortKey="status" currentSort={sortConfig} onSort={handleSort} style={{ width: '15%' }} />
                                        <th style={{ padding: '1rem', width: '15%' }}>จัดการ</th>
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
                                                    <div>{booking.user.firstName} {booking.user.lastName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{booking.user.phone}</div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {booking.items.map((item, idx) => (<div key={idx} style={{ fontSize: '0.875rem' }}>{item.tree.name} x{item.quantity}</div>))}
                                                </td>
                                                <td style={{ padding: '1rem' }}>฿{booking.totalPrice.toLocaleString()}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    {booking.slipUrl ? <Button size="sm" variant="outline" style={{ borderColor: '#bfdbfe', color: '#1d4ed8', whiteSpace: 'nowrap' }} onClick={() => setViewingSlip(booking.slipUrl)}>📎 ดูสลิป</Button> : <span style={{ color: '#9ca3af' }}>-</span>}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {editingId === booking.id ? <Input type="date" value={editForm.pickupDate} onChange={(e) => setEditForm({ ...editForm, pickupDate: e.target.value })} /> : new Date(booking.pickupDate).toLocaleDateString('th-TH')}
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
                                                    ) : <span style={{ ...getStatusBadge(booking.status), whiteSpace: 'nowrap' }}>{getStatusText(booking.status)}</span>}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {editingId === booking.id ? (
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <Button size="sm" onClick={() => handleUpdate(booking.id)} style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', color: 'white' }}>บันทึก</Button>
                                                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>ยกเลิก</Button>
                                                        </div>
                                                    ) : ['PENDING_APPROVAL', 'PRE_ORDER'].includes(booking.status) ? (
                                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', minWidth: '150px' }}>
                                                            <Button size="sm" onClick={async () => { if (!confirm(`อนุมัติออเดอร์ #${booking.refCode}?`)) return; try { const res = await fetch(`/api/admin/bookings/${booking.id}/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve' }) }); if (res.ok) { alert('อนุมัติออเดอร์เรียบร้อย'); fetchBookings(); } else alert('เกิดข้อผิดพลาด'); } catch { alert('เกิดข้อผิดพลาด'); } }} style={{ backgroundColor: '#22c55e', borderColor: '#22c55e', color: 'white', flex: 1 }}>✅ อนุมัติ</Button>
                                                            <Button size="sm" variant="outline" onClick={async () => { if (!confirm(`ปฏิเสธออเดอร์ #${booking.refCode}?`)) return; try { const res = await fetch(`/api/admin/bookings/${booking.id}/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject' }) }); if (res.ok) { alert('ปฏิเสธออเดอร์เรียบร้อย'); fetchBookings(); } else alert('เกิดข้อผิดพลาด'); } catch { alert('เกิดข้อผิดพลาด'); } }} style={{ borderColor: '#ef4444', color: '#ef4444', flex: 1 }}>❌ ปฏิเสธ</Button>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', gap: '0.5rem', minWidth: '100px' }}>
                                                            <Button size="sm" variant="outline" onClick={() => handleEdit(booking)} style={{ borderColor: '#1d4ed8', color: '#1d4ed8' }}>แก้ไข</Button>
                                                            {booking.status !== 'COMPLETED' && (
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
                        </CardContent>
                    </Card>
                </div>
            </div>

            <SlipViewer isOpen={!!viewingSlip} slipUrl={viewingSlip} onClose={() => setViewingSlip(null)} />
        </div>
    );
}
