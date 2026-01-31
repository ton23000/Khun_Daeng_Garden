'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
    slipUrl: string | null;
    createdAt: string;
    user: {
        name: string;
        phone: string;
    };
    items: BookingItem[];
}

export default function AdminOrdersPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        status: '',
        pickupDate: '',
        note: ''
    });
    const [viewingSlip, setViewingSlip] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user || user.role !== 'admin') {
            router.push('/admin/login');
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

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: '#f59e0b',
            PAID: '#3b82f6',
            PREPARING: '#8b5cf6',
            READY: '#22c55e',
            COMPLETED: '#6b7280',
            CANCELLED: '#ef4444'
        };
        return {
            backgroundColor: colors[status] || '#6b7280',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 'bold'
        };
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            PENDING: 'รอชำระเงิน',
            PAID: 'ชำระแล้ว',
            PREPARING: 'กำลังเตรียม',
            READY: 'พร้อมรับ',
            COMPLETED: 'เสร็จสิ้น',
            CANCELLED: 'ยกเลิก'
        };
        return texts[status] || status;
    };

    if (isAuthLoading || isLoading) {
        return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>จัดการออเดอร์</h1>
            </div>

            <Card>
                <CardContent style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>รหัส</th>
                                <th style={{ padding: '1rem' }}>ลูกค้า</th>
                                <th style={{ padding: '1rem' }}>รายการ</th>
                                <th style={{ padding: '1rem' }}>ยอดรวม</th>
                                <th style={{ padding: '1rem' }}>วันรับของ</th>
                                <th style={{ padding: '1rem' }}>สลิป</th>
                                <th style={{ padding: '1rem' }}>สถานะ</th>
                                <th style={{ padding: '1rem' }}>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length === 0 ? (
                                <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center' }}>ไม่มีออเดอร์</td></tr>
                            ) : (
                                bookings.map(booking => (
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
                                            {booking.slipUrl ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setViewingSlip(booking.slipUrl)}
                                                    style={{ fontSize: '0.75rem' }}
                                                >
                                                    🖼️ ดูสลิป
                                                </Button>
                                            ) : (
                                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ยังไม่มี</span>
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
                                                    <option value="PAID">ชำระแล้ว</option>
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
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(booking)}>แก้ไข</Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Slip Viewer Modal */}
            {viewingSlip && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '2rem'
                    }}
                    onClick={() => setViewingSlip(null)}
                >
                    <div
                        style={{
                            position: 'relative',
                            maxWidth: '90%',
                            maxHeight: '90%',
                            backgroundColor: 'white',
                            borderRadius: '0.5rem',
                            padding: '1rem'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setViewingSlip(null)}
                            style={{
                                position: 'absolute',
                                top: '-1rem',
                                right: '-1rem',
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '2.5rem',
                                height: '2.5rem',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ✕
                        </button>
                        <img
                            src={viewingSlip}
                            alt="Payment Slip"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                borderRadius: '0.375rem'
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
