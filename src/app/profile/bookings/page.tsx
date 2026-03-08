'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import SlipViewer from '@/components/SlipViewer';
import ReviewModal from '@/components/ReviewModal';
import Link from 'next/link';

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
    items: BookingItem[];
    reviews?: Array<{ id: string; treeId: string; }>;
}

export default function MyBookingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams?.get('booking');
    const { user, isLoading: isAuthLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [viewingSlip, setViewingSlip] = useState<string | null>(null);
    const [reviewModal, setReviewModal] = useState<{ bookingId: string; treeId: string; treeName: string; } | null>(null);
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        fetchBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isAuthLoading, router]);

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

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const res = await fetch(`/api/bookings?userId=${user.id}`);
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

    const canUploadSlip = (status: string) => {
        return status === 'PENDING' || status === 'PAID';
    };

    const handleFileSelect = async (bookingId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        console.log('🔵 handleFileSelect called', { bookingId, fileName: file.name });
        setUploadingId(bookingId);

        try {
            // Upload file first
            const formData = new FormData();
            formData.append('file', file);

            console.log('📤 Uploading file to /api/upload...');
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) {
                const errorText = await uploadRes.text();
                console.error('❌ Upload failed:', uploadRes.status, errorText);
                throw new Error('Failed to upload file');
            }

            const uploadData = await uploadRes.json();
            console.log('✅ Upload response:', uploadData);

            // API returns { urls: [...] }, get the first URL
            const url = uploadData.urls?.[0] || uploadData.url;

            if (!url) {
                console.error('❌ No URL in response:', uploadData);
                throw new Error('No URL returned from upload');
            }

            console.log('📎 Slip URL:', url);

            // Update booking with slip URL
            console.log('📤 Updating booking...');
            const updateRes = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slipUrl: url }),
            });

            if (!updateRes.ok) {
                const errorText = await updateRes.text();
                console.error('❌ Update failed:', updateRes.status, errorText);
                throw new Error('Failed to update booking');
            }

            console.log('✅ Booking updated successfully');

            // Refresh bookings
            await fetchBookings();
            alert('แนบสลิปสำเร็จ! รอร้านตรวจสอบ');
        } catch (error) {
            console.error('❌ Upload error:', error);
            alert('เกิดข้อผิดพลาดในการแนบสลิป กรุณาลองใหม่');
        } finally {
            setUploadingId(null);
            // Reset file input
            if (fileInputRefs.current[bookingId]) {
                fileInputRefs.current[bookingId]!.value = '';
            }
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            PENDING_APPROVAL: '#6b7280',
            PRE_ORDER: '#6b7280',
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
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            display: 'inline-block'
        };
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            PENDING_APPROVAL: 'PRE_ORDER',
            PRE_ORDER: 'PRE_ORDER',
            PENDING: 'รอชำระเงิน',
            PAID: 'รอตรวจสอบ',
            PREPARING: 'กำลังเตรียมต้นไม้',
            READY: 'พร้อมรับได้แล้ว',
            COMPLETED: 'เสร็จสิ้น',
            CANCELLED: 'ยกเลิก'
        };
        return texts[status] || status;
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, string> = {
            PENDING_APPROVAL: '📦',
            PRE_ORDER: '📦',
            PENDING: '⏳',
            PAID: '💰',
            PREPARING: '🌱',
            READY: '✅',
            COMPLETED: '🎉',
            CANCELLED: '❌'
        };
        return icons[status] || '📦';
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <p>กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>การจองของฉัน</h1>

            {bookings.length === 0 ? (
                <Card>
                    <CardContent style={{ padding: '3rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                            คุณยังไม่มีการจอง
                        </p>
                        <Link href="/shop">
                            <Button>จองต้นไม้</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {bookings.map(booking => {
                        let firstImage = null;
                        if (booking.items[0]?.tree?.images) {
                            try {
                                const parsed = JSON.parse(booking.items[0].tree.images);
                                firstImage = Array.isArray(parsed) ? parsed[0] : parsed;
                            } catch {
                                firstImage = booking.items[0].tree.images;
                            }
                        }

                        return (
                            <Card key={booking.id} id={`booking-${booking.id}`}>
                                <CardHeader style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <div className="booking-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <CardTitle style={{ wordBreak: 'break-all' }}>รหัสการจอง: {booking.refCode}</CardTitle>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                วันที่สั่ง: {new Date(booking.createdAt).toLocaleDateString('th-TH')}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={getStatusBadge(booking.status)}>
                                                {getStatusIcon(booking.status)} {getStatusText(booking.status)}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent style={{ padding: '1.5rem' }}>
                                    <div className="responsive-grid">
                                        {/* Image */}
                                        {firstImage && (
                                            <div style={{
                                                backgroundColor: '#f9fafb',
                                                borderRadius: '0.5rem',
                                                padding: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <img
                                                    src={firstImage}
                                                    alt="Tree"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '150px',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Details */}
                                        <div>
                                            <h3 style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>รายการสินค้า:</h3>
                                            {booking.items.map((item, idx) => {
                                                const isReviewed = booking.reviews?.some(r => r.treeId === item.treeId);
                                                const canReview = booking.status === 'COMPLETED';

                                                return (
                                                    <div key={idx} style={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: '0.5rem',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '0.75rem',
                                                        padding: '0.5rem',
                                                        backgroundColor: '#f9fafb',
                                                        borderRadius: '0.375rem',
                                                        wordBreak: 'break-word'
                                                    }}>
                                                        <div>
                                                            • {item.tree.name} x{item.quantity} - ฿{item.price.toLocaleString()}
                                                        </div>
                                                        {canReview && (
                                                            <Button
                                                                size="sm"
                                                                variant={isReviewed ? "outline" : "primary"}
                                                                disabled={isReviewed}
                                                                onClick={() => setReviewModal({
                                                                    bookingId: booking.id,
                                                                    treeId: item.treeId,
                                                                    treeName: item.tree.name
                                                                })}
                                                                style={{ fontSize: '0.75rem' }}
                                                            >
                                                                {isReviewed ? '✓ รีวิวแล้ว' : '⭐ รีวิว'}
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span>ยอดรวม:</span>
                                                    <span style={{ fontWeight: 'bold' }}>฿{booking.totalPrice.toLocaleString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span>มัดจำ (30%):</span>
                                                    <span style={{ color: 'var(--primary)' }}>฿{booking.deposit.toLocaleString()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.125rem', marginTop: '0.75rem' }}>
                                                    <span>วันรับของ:</span>
                                                    <span style={{ color: 'var(--secondary)' }}>
                                                        {new Date(booking.pickupDate).toLocaleDateString('th-TH')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* PromptPay QR Code - Show for PENDING orders */}
                                            {booking.status === 'PENDING' && (
                                                <div style={{
                                                    marginTop: '1rem',
                                                    padding: '1rem',
                                                    backgroundColor: '#fef3c7',
                                                    borderRadius: '0.5rem',
                                                    border: '2px solid #fbbf24'
                                                }}>
                                                    <h4 style={{ fontWeight: 'bold', marginBottom: '0.75rem', color: '#92400e' }}>
                                                        💰 ข้อมูลการชำระเงิน
                                                    </h4>

                                                    {/* PromptPay QR Code */}
                                                    <div style={{
                                                        backgroundColor: '#f0f9ff',
                                                        padding: '1rem',
                                                        borderRadius: '0.5rem',
                                                        marginBottom: '1rem',
                                                        border: '2px solid #0ea5e9',
                                                        textAlign: 'center'
                                                    }}>
                                                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#0369a1', fontSize: '0.875rem' }}>
                                                            💳 สแกน QR Code เพื่อชำระเงิน
                                                        </p>
                                                        <div style={{
                                                            backgroundColor: 'white',
                                                            padding: '0.75rem',
                                                            borderRadius: '0.5rem',
                                                            display: 'inline-block',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}>
                                                            <img
                                                                src={`https://promptpay.io/0616900908/${booking.deposit}.png`}
                                                                alt="PromptPay QR Code"
                                                                style={{
                                                                    width: '200px',
                                                                    height: '200px',
                                                                    display: 'block'
                                                                }}
                                                            />
                                                        </div>
                                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                                            สแกนด้วยแอพธนาคารเพื่อชำระ ฿{booking.deposit.toLocaleString()}
                                                        </p>
                                                    </div>

                                                    {/* Bank Transfer Details */}
                                                    <div style={{ fontSize: '0.875rem', color: '#78350f' }}>
                                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', textAlign: 'center' }}>
                                                            หรือโอนเงินผ่านบัญชีธนาคาร
                                                        </p>
                                                        <p style={{ marginBottom: '0.25rem' }}>ธนาคาร: <strong>กสิกรไทย (KBank)</strong></p>
                                                        <p style={{ marginBottom: '0.25rem' }}>เลขที่บัญชี: <strong>123-4-56789-0</strong></p>
                                                        <p style={{ marginBottom: '0.25rem' }}>ชื่อบัญชี: <strong>บจก. สวนคุณแดง</strong></p>
                                                        <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                                                            ยอดที่ต้องชำระ: ฿{booking.deposit.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Slip Upload Section */}
                                            <div style={{
                                                marginTop: '1rem',
                                                padding: '1rem',
                                                backgroundColor: '#f0fdf4',
                                                borderRadius: '0.5rem',
                                                border: '1px solid #bbf7d0'
                                            }}>
                                                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#166534' }}>
                                                    📎 หลักฐานการโอนเงิน
                                                </h4>
                                                {booking.slipUrl ? (
                                                    <div>
                                                        {/* Slip Preview */}
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: '1rem',
                                                            alignItems: 'center',
                                                            marginBottom: '0.75rem'
                                                        }}>
                                                            <div style={{
                                                                width: '100px',
                                                                height: '100px',
                                                                borderRadius: '0.5rem',
                                                                overflow: 'hidden',
                                                                border: '2px solid #bbf7d0',
                                                                cursor: 'pointer'
                                                            }}
                                                                onClick={() => setViewingSlip(booking.slipUrl)}
                                                            >
                                                                <img
                                                                    src={booking.slipUrl}
                                                                    alt="Payment Slip"
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover'
                                                                    }}
                                                                />
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <p style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '0.5rem' }}>
                                                                    ✅ แนบสลิปเรียบร้อยแล้ว
                                                                </p>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setViewingSlip(booking.slipUrl)}
                                                                >
                                                                    🔍 ดูสลิปขนาดเต็ม
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {canUploadSlip(booking.status) && (
                                                            <div>
                                                                <input
                                                                    ref={el => { fileInputRefs.current[booking.id] = el; }}
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleFileSelect(booking.id, e)}
                                                                    style={{ display: 'none' }}
                                                                    id={`file-${booking.id}`}
                                                                />
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => document.getElementById(`file-${booking.id}`)?.click()}
                                                                    disabled={uploadingId === booking.id}
                                                                    style={{ marginTop: '0.5rem' }}
                                                                >
                                                                    {uploadingId === booking.id ? 'กำลังอัปโหลด...' : '🔄 เปลี่ยนสลิป'}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {canUploadSlip(booking.status) ? (
                                                            <div>
                                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                                                    กรุณาแนบสลิปการโอนเงิน
                                                                </p>
                                                                <input
                                                                    ref={el => { fileInputRefs.current[booking.id] = el; }}
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleFileSelect(booking.id, e)}
                                                                    style={{ display: 'none' }}
                                                                    id={`file-${booking.id}`}
                                                                />
                                                                <Button
                                                                    size="sm"
                                                                    variant="primary"
                                                                    onClick={() => document.getElementById(`file-${booking.id}`)?.click()}
                                                                    disabled={uploadingId === booking.id}
                                                                >
                                                                    {uploadingId === booking.id ? 'กำลังอัปโหลด...' : '📤 แนบสลิป'}
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                                                ไม่สามารถแนบสลิปได้ในสถานะนี้
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {booking.note && (
                                                <div style={{
                                                    marginTop: '1rem',
                                                    padding: '0.75rem',
                                                    backgroundColor: '#fef3c7',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    <strong>หมายเหตุจากร้าน:</strong> {booking.note}
                                                </div>
                                            )}

                                            {/* Cancel Button */}
                                            {['PENDING', 'VERIFYING_PAYMENT', 'PAID', 'PAYMENT_ISSUE', 'PENDING_APPROVAL', 'PRE_ORDER'].includes(booking.status) && (
                                                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                                    <Button
                                                        variant="ghost"
                                                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                                        onClick={async () => {
                                                            if (!confirm('ยืนยันที่จะยกเลิกออเดอร์นี้?')) return;
                                                            try {
                                                                const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
                                                                    method: 'PATCH'
                                                                });
                                                                if (res.ok) {
                                                                    alert('ยกเลิกออเดอร์เรียบร้อย');
                                                                    fetchBookings();
                                                                } else {
                                                                    const d = await res.json();
                                                                    alert(d.error || 'ไม่สามารถยกเลิกได้');
                                                                }
                                                            } catch {
                                                                alert('เกิดข้อผิดพลาด');
                                                            }
                                                        }}
                                                    >
                                                        ❌ ยกเลิกออเดอร์
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <SlipViewer
                isOpen={!!viewingSlip}
                slipUrl={viewingSlip}
                onClose={() => setViewingSlip(null)}
            />

            {reviewModal && user && (
                <ReviewModal
                    bookingId={reviewModal.bookingId}
                    treeId={reviewModal.treeId}
                    treeName={reviewModal.treeName}
                    userId={user.id}
                    onClose={() => setReviewModal(null)}
                    onSuccess={() => {
                        fetchBookings(); // Refresh to show updated review status
                    }}
                />
            )}
        </div>
    );
}
