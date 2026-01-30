'use client';

import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useNotification } from '@/lib/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items, removeItem, updateQuantity, updateDate, clearCart } = useCart();
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const router = useRouter();

    // Calculate totals
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deposit = totalPrice * 0.5;

    // Min date (14 days)
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 14);
    const minDateString = minDate.toISOString().split('T')[0];

    const canSubmit = items.length > 0 && items.every(item => item.pickupDate);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) {
            alert('กรุณาระบุวันรับของให้ครบทุกรายการ');
            return;
        }

        if (!user) {
            alert('กรุณาเข้าสู่ระบบก่อนทำการจอง');
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.phone,
                    userName: user.name,
                    items: items.map(item => ({
                        treeId: item.id,
                        treeName: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        pickupDate: item.pickupDate
                    })),
                    totalPrice,
                    deposit
                })
            });

            if (!res.ok) {
                throw new Error('Failed to create booking');
            }

            const booking = await res.json();
            localStorage.setItem('last_booking', JSON.stringify(booking));

            addNotification(
                user.phone,
                `การจอง #${booking.refCode} ของคุณได้รับการบันทึกแล้ว กรุณาชำระเงินมัดจำ`,
                'success'
            );

            clearCart();
            router.push('/booking-success');
        } catch (error) {
            console.error('Booking error:', error);
            alert('เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง');
        }
    };

    if (items.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>ตะกร้าสินค้าว่างเปล่า</h1>
                <p style={{ marginBottom: '2rem', color: '#6b7280' }}>คุณยังไม่ได้เลือกต้นไม้ใดๆ</p>
                <Link href="/shop"><Button variant="primary">เลือกซื้อต้นไม้</Button></Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>ตะกร้าสินค้าของฉัน</h1>

            {!user && (
                <div style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                    ⚠️ กรุณา <Link href="/login" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>เข้าสู่ระบบ</Link> ก่อนยืนยันการจอง
                </div>
            )}

            <div className="grid-cart">
                {/* Item List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {items.map((item) => (
                        <Card key={item.instanceId} style={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <div style={{ width: '80px', height: '80px', backgroundColor: '#f9fafb', borderRadius: '0.375rem', flexShrink: 0, padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb' }}>
                                    <img
                                        src={item.images?.[0] || '/placeholder-tree.jpg'}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                                <div style={{ marginLeft: '1rem', flexGrow: 1 }}>
                                    <h3 style={{ fontWeight: 'bold' }}>{item.name}</h3>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{item.category}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>฿ {item.price.toLocaleString()}</p>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '2px' }}>
                                            <button
                                                onClick={() => updateQuantity(item.instanceId, -1)}
                                                style={{ padding: '0 8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: item.quantity === 1 ? '#d1d5db' : 'inherit' }}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.instanceId, 1)}
                                                style={{ padding: '0 8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginLeft: '1rem' }}>
                                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.instanceId)} style={{ color: '#ef4444' }}>
                                        ลบ
                                    </Button>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                    วันรับสินค้า (สำหรับรายการนี้)
                                </label>
                                <Input
                                    type="date"
                                    min={minDateString}
                                    required
                                    value={item.pickupDate}
                                    onChange={(e) => updateDate(item.instanceId, e.target.value)}
                                />
                                {!item.pickupDate && (
                                    <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                                        * กรุณาระบุวันรับ
                                    </p>
                                )}
                            </div>
                        </Card>
                    ))}
                    <div style={{ marginTop: '1rem' }}>
                        <Link href="/shop"><Button variant="outline">เลือกต้นไม้เพิ่ม</Button></Link>
                    </div>
                </div>

                {/* Summary & Booking Form */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>สรุปรายการจอง</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleBooking}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>จำนวนต้นไม้รวม</span>
                                    <span>{items.reduce((acc, i) => acc + i.quantity, 0)} ต้น</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>ราคารวม</span>
                                    <span>฿ {totalPrice.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', fontWeight: 'bold' }}>
                                    <span>มัดจำที่ต้องชำระ (50%)</span>
                                    <span style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>฿ {deposit.toLocaleString()}</span>
                                </div>

                                <div style={{ marginTop: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                    เงื่อนไข: ต้องชำระมัดจำภายใน 24 ชม. หลังทำรายการ
                                </div>

                                <Button fullWidth type="submit" size="lg" disabled={!canSubmit}>
                                    {canSubmit ? 'ยืนยันการจอง' : 'กรุณาระบุวันให้ครบ'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
