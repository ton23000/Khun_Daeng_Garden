'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/lib/AuthContext';

export default function AdminVerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loginWithUser } = useAuth();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('กำลังตรวจสอบสิทธิ์การเข้าถึง...');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            // Use setTimeout to avoid synchronous setState
            setTimeout(() => {
                setStatus('error');
                setMessage('ไม่พบลิงก์ยืนยันตัวตน กรุณาขอลิงก์ใหม่จากหน้าเข้าสู่ระบบ');
            }, 0);
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await fetch('/api/auth/admin-verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage('ยืนยันตัวตนสำเร็จ กำลังพาท่านเข้าสู่ระบบ...');
                    // Set user context and localstorage
                    loginWithUser(data.user);
                    // Redirect to admin orders after short delay
                    setTimeout(() => {
                        router.push('/admin/orders');
                    }, 1000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'ลิงก์การเข้าสู่ระบบไม่ถูกต้องหรือหมดอายุ');
                }
            } catch {
                setStatus('error');
                setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
            }
        };

        verifyToken();
    }, [searchParams, router, loginWithUser]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
            <Card style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '2rem 1rem' }}>
                <CardContent>
                    {status === 'loading' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '3rem', height: '3rem', border: '3px solid #f3f4f6', borderTop: '3px solid #d97706', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>{message}</p>
                            <style>{`
                                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                            `}</style>
                        </div>
                    )}

                    {status === 'success' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '3rem' }}>✅</div>
                            <h2 style={{ color: '#166534', fontSize: '1.25rem', fontWeight: 'bold' }}>เข้าสู่ระบบสำเร็จ!</h2>
                            <p style={{ color: '#4b5563' }}>{message}</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '3rem' }}>❌</div>
                            <h2 style={{ color: '#991b1b', fontSize: '1.25rem', fontWeight: 'bold' }}>เกิดข้อผิดพลาด</h2>
                            <p style={{ color: '#ef4444' }}>{message}</p>
                            <button
                                onClick={() => router.push('/login')}
                                style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#d97706', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                กลับไปหน้าเข้าสู่ระบบ
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
