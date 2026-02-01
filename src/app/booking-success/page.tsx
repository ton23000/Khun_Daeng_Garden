'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import PaymentModal from '@/components/PaymentModal';

export default function BookingSuccessPage() {
    const [booking, setBooking] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem('last_booking');
        if (data) {
            setBooking(JSON.parse(data));
        }
    }, []);

    const handleUpload = async (file: File) => {
        if (!booking) return;

        try {
            // Upload file first
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) {
                throw new Error('Failed to upload file');
            }

            const uploadData = await uploadRes.json();
            const slipUrl = uploadData.urls?.[0] || uploadData.url;

            // Update booking with slip URL via API
            const updateRes = await fetch(`/api/bookings/${booking.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slipUrl }),
            });

            if (!updateRes.ok) {
                throw new Error('Failed to update booking');
            }

            const updatedBooking = await updateRes.json();
            setBooking(updatedBooking);
            setUploadSuccess(true);
            setIsModalOpen(false);
            localStorage.setItem('last_booking', JSON.stringify(updatedBooking));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('การอัปโหลดสลิปล้มเหลว กรุณาลองใหม่อีกครั้ง');
        }
    };

    if (!booking) return null;

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '600px', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#dcfce7', color: '#166534', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>การจองสำเร็จ!</h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                รหัสการจอง: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{booking.id}</span>
            </p>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', textAlign: 'left', marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>รายละเอียดการชำระเงิน</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>ธนาคาร</span>
                    <span style={{ fontWeight: 'bold' }}>กสิกรไทย (KBank)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>เลขที่บัญชี</span>
                    <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>123-4-56789-0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>ชื่อบัญชี</span>
                    <span>บจก. สวนคุณแดง</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.125rem' }}>
                    <span>ยอดมัดจำที่ต้องโอน</span>
                    <span style={{ color: 'var(--primary)' }}>฿ {booking.deposit.toLocaleString()}</span>
                </div>

                {uploadSuccess && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '0.375rem', fontSize: '0.875rem', textAlign: 'center' }}>
                        ✅ แนบสลิปเรียบร้อยแล้ว รอการตรวจสอบ
                    </div>
                )}

                {booking.slipUrl && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>📎 สลิปที่แนบ:</p>
                        <img
                            src={booking.slipUrl}
                            alt="Payment Slip"
                            style={{
                                width: '100%',
                                maxHeight: '300px',
                                objectFit: 'contain',
                                borderRadius: '0.375rem',
                                border: '1px solid #e5e7eb'
                            }}
                        />
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/"><Button variant="outline">กลับหน้าหลัก</Button></Link>
                <Link href="/profile/bookings"><Button variant="outline">การจองของฉัน</Button></Link>
                {!uploadSuccess && (
                    <Button variant="primary" onClick={() => setIsModalOpen(true)}>แนบสลิปการโอนเงิน</Button>
                )}
            </div>

            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpload={handleUpload}
            />
        </div>
    );
}
