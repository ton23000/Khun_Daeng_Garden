'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import PaymentModal from '@/components/PaymentModal';
import './styles.css';

export default function BookingSuccessPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [booking, setBooking] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [qrLoading, setQrLoading] = useState(true);

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

    const downloadQRCode = () => {
        if (!booking) return;
        
        const link = document.createElement('a');
        link.href = `https://promptpay.io/0616900908/${booking.deposit}.png`;
        link.download = `promptpay-${booking.refCode || booking.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!booking) return null;

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '600px', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#e1ffe1', color: '#16a34a', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#e11d48', fontWeight: 'bold' }}>การจองสำเร็จ!</h1>
            <p style={{ color: '#0369a1', marginBottom: '2rem', fontSize: '0.875rem' }}>
                รหัสการจอง: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{booking.refCode || booking.id}</span>
            </p>

            {['PENDING_APPROVAL', 'PRE_ORDER'].includes(booking.status) ? (
                <div style={{ backgroundColor: '#fef9c3', color: '#854d0e', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #fde047', textAlign: 'left', marginBottom: '2rem' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c' }}>
                        <span style={{ color: '#3b82f6' }}>⏳</span> รอการอนุมัติจากแอดมิน
                    </h3>
                    <p style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                        คำสั่งซื้อของคุณอยู่ในคิวรอการอนุมัติจากทางร้าน เนื่องจากสินค้าบางรายการมี<br />
                        สต็อกไม่เพียงพอในขณะนี้
                    </p>
                    <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        ทางร้านจะตรวจสอบและแจ้งกลับให้คุณทราบโดยเร็วที่สุด
                    </p>
                    <p style={{ fontWeight: 'bold', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#b45309' }}>
                        <span style={{ color: '#eab308' }}>💡</span> คุณจะสามารถแนบสลิปการโอนเงินได้หลังจากทางร้านอนุมัติคำสั่งซื้อแล้ว
                    </p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', textAlign: 'left', marginBottom: '2rem' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>รายละเอียดการชำระเงิน</h3>

                    {/* PromptPay QR Code */}
                    <div style={{
                        backgroundColor: '#f0f9ff',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        border: '2px solid #0ea5e9',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.75rem', color: '#0369a1', fontSize: '1rem' }}>
                            💳 สแกน QR Code เพื่อชำระเงิน
                        </p>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            position: 'relative'
                        }}>
                            {qrLoading && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '0.5rem'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ 
                                            width: '40px', 
                                            height: '40px', 
                                            border: '4px solid #f3f4f6', 
                                            borderTop: '4px solid #3b82f6', 
                                            borderRadius: '50%', 
                                            animation: 'spin 1s linear infinite',
                                            margin: '0 auto 0.5rem'
                                        }}></div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>กำลังโหลด QR Code...</div>
                                    </div>
                                </div>
                            )}
                            <img
                                src={`https://promptpay.io/0616900908/${booking.deposit}.png`}
                                alt="PromptPay QR Code"
                                style={{
                                    width: '250px',
                                    height: '250px',
                                    display: 'block',
                                    objectFit: 'contain',
                                    opacity: qrLoading ? 0.5 : 1
                                }}
                                onLoad={() => setQrLoading(false)}
                                onError={(e) => {
                                    // Fallback if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=promptpay://0616900908?amount=${booking.deposit}`;
                                    setQrLoading(false);
                                }}
                            />
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button
                                onClick={downloadQRCode}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #3b82f6',
                                    backgroundColor: 'white',
                                    color: '#3b82f6',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                📥 ดาวน์โหลด QR Code
                            </button>
                            <button
                                onClick={() => {
                                    const qrUrl = `https://promptpay.io/0616900908/${booking.deposit}.png`;
                                    navigator.clipboard.writeText(qrUrl);
                                    alert('คัดลอกลิงก์ QR Code แล้ว');
                                }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #10b981',
                                    backgroundColor: 'white',
                                    color: '#10b981',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                📋 คัดลอกลิงก์
                            </button>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.75rem' }}>
                            สแกนด้วยแอพธนาคารเพื่อชำระ ฿{booking.deposit.toLocaleString()}
                        </p>
                    </div>

                    {/* Bank Transfer Details */}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', textAlign: 'center' }}>
                            หรือโอนเงินผ่านบัญชีธนาคาร
                        </p>
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
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/"><button style={{ padding: '0.5rem 1.5rem', borderRadius: '9999px', border: '1px solid #22c55e', color: '#22c55e', backgroundColor: 'transparent', fontWeight: 500, cursor: 'pointer' }}>หน้าหลัก</button></Link>
                <Link href="/profile/bookings"><button style={{ padding: '0.5rem 1.5rem', borderRadius: '9999px', border: '1px solid #14b8a6', color: '#14b8a6', backgroundColor: 'transparent', fontWeight: 500, cursor: 'pointer' }}>รายละเอียดการจอง</button></Link>
                {!uploadSuccess && !['PENDING_APPROVAL', 'PRE_ORDER'].includes(booking.status) && (
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
