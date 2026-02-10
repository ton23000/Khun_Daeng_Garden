'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
    slipUrl: string | null;
    createdAt: string;
    items: BookingItem[];
}

export default function MyOrdersPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingSlip, setUploadingSlip] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }
        fetchBookings();
    }, [user, isAuthLoading, router]);

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

    const handleSlipUpload = async (bookingId: string, file: File) => {
        console.log('🔵 handleSlipUpload called', { bookingId, fileName: file?.name });

        if (!file) {
            console.log('❌ No file provided');
            return;
        }

        console.log('📁 File info:', {
            name: file.name,
            type: file.type,
            size: file.size,
            sizeInMB: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        });

        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.log('❌ Invalid file type:', file.type);
            alert('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            console.log('❌ File too large:', file.size);
            alert('ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)');
            return;
        }

        console.log('✅ File validation passed');
        setUploadingSlip(bookingId);

        try {
            console.log('🔄 Starting file conversion to base64...');
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                console.log('✅ Base64 conversion complete, length:', base64String.length);

                // Update booking with slip URL
                console.log('📤 Sending PATCH request to:', `/api/bookings/${bookingId}`);
                const res = await fetch(`/api/bookings/${bookingId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slipUrl: base64String })
                });

                console.log('📥 Response status:', res.status, res.statusText);

                if (res.ok) {
                    const data = await res.json();
                    console.log('✅ Upload successful!', data);
                    alert('อัปโหลดสลิปสำเร็จ! รอการตรวจสอบจากทางร้าน');
                    fetchBookings();
                } else {
                    const errorText = await res.text();
                    console.error('❌ Upload failed:', res.status, errorText);
                    alert('เกิดข้อผิดพลาดในการอัปโหลดสลิป');
                }
                setUploadingSlip(null);
            };

            reader.onerror = (error) => {
                console.error('❌ FileReader error:', error);
                alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
                setUploadingSlip(null);
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error('❌ Failed to upload slip', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
            setUploadingSlip(null);
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
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            display: 'inline-block'
        };
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            PENDING: 'รอชำระเงิน',
            PAID: 'ชำระแล้ว',
            PREPARING: 'กำลังเตรียมต้นไม้',
            READY: 'พร้อมรับได้แล้ว',
            COMPLETED: 'เสร็จสิ้น',
            CANCELLED: 'ยกเลิก'
        };
        return texts[status] || status;
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, string> = {
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
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>ออเดอร์ของฉัน</h1>

            {bookings.length === 0 ? (
                <Card>
                    <CardContent style={{ padding: '3rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                            คุณยังไม่มีออเดอร์
                        </p>
                        <Link href="/shop">
                            <Button>จองต้นไม้</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {bookings.map(booking => {
                        const firstImage = booking.items[0]?.tree?.images
                            ? JSON.parse(booking.items[0].tree.images)[0]
                            : null;

                        return (
                            <Card key={booking.id}>
                                <CardHeader style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <CardTitle>รหัสออเดอร์: {booking.refCode}</CardTitle>
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
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
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
                                            {booking.items.map((item, idx) => (
                                                <div key={idx} style={{ marginBottom: '0.5rem' }}>
                                                    • {item.tree.name} x{item.quantity} - ฿{item.price.toLocaleString()}
                                                </div>
                                            ))}

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

                                            {/* Payment Info */}
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
                                                        <p style={{ marginBottom: '0.25rem' }}>ธนาคาร: <strong>ไทยพาณิชย์</strong></p>
                                                        <p style={{ marginBottom: '0.25rem' }}>เลขที่บัญชี: <strong>123-456-7890</strong></p>
                                                        <p style={{ marginBottom: '0.25rem' }}>ชื่อบัญชี: <strong>คุณแดงการ์เด้น</strong></p>
                                                        <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                                                            ยอดที่ต้องชำระ: ฿{booking.deposit.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Slip Upload Section */}
                                            {booking.status === 'PENDING' && !booking.slipUrl && (
                                                <div style={{ marginTop: '1rem' }}>
                                                    <label
                                                        htmlFor={`slip-upload-${booking.id}`}
                                                        style={{
                                                            display: 'block',
                                                            width: '100%',
                                                            padding: '0.75rem',
                                                            backgroundColor: '#10b981',
                                                            color: 'white',
                                                            borderRadius: '0.5rem',
                                                            textAlign: 'center',
                                                            cursor: uploadingSlip === booking.id ? 'not-allowed' : 'pointer',
                                                            fontWeight: 'bold',
                                                            opacity: uploadingSlip === booking.id ? 0.6 : 1
                                                        }}
                                                    >
                                                        {uploadingSlip === booking.id ? '⏳ กำลังอัปโหลด...' : '📤 อัปโหลดสลิปการโอนเงิน'}
                                                    </label>
                                                    <input
                                                        id={`slip-upload-${booking.id}`}
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleSlipUpload(booking.id, file);
                                                        }}
                                                        disabled={uploadingSlip === booking.id}
                                                    />
                                                </div>
                                            )}

                                            {/* Show uploaded slip */}
                                            {booking.slipUrl && (
                                                <div style={{
                                                    marginTop: '1rem',
                                                    padding: '1rem',
                                                    backgroundColor: '#f0fdf4',
                                                    borderRadius: '0.5rem',
                                                    border: '2px solid #10b981'
                                                }}>
                                                    <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#065f46' }}>
                                                        ✅ สลิปการโอนเงิน
                                                    </h4>
                                                    <img
                                                        src={booking.slipUrl}
                                                        alt="Payment Slip"
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '300px',
                                                            objectFit: 'contain',
                                                            borderRadius: '0.375rem',
                                                            border: '1px solid #d1d5db',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => window.open(booking.slipUrl!, '_blank')}
                                                    />
                                                    <p style={{ fontSize: '0.75rem', color: '#065f46', marginTop: '0.5rem', textAlign: 'center' }}>
                                                        คลิกที่รูปเพื่อดูขนาดเต็ม
                                                    </p>
                                                </div>
                                            )}

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
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
