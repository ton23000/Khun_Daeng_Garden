'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
    const [message, setMessage] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('no-token');
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        verifyEmail(token);
    }, [token]);

    const verifyEmail = async (token: string) => {
        try {
            const res = await fetch(`/api/auth/verify?token=${token}`);
            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'ยืนยันอีเมลสำเร็จ!');
                // Refresh the global auth state if the user is currently logged in
                if (user) {
                    refreshUser();
                }
            } else {
                setStatus('error');
                setMessage(data.error || 'ไม่สามารถยืนยันอีเมลได้');
            }
        } catch (error) {
            setStatus('error');
            setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่');
        }
    };

    const handleResend = async () => {
        if (!user) {
            setResendMessage('กรุณาเข้าสู่ระบบก่อน');
            return;
        }
        setResendLoading(true);
        setResendMessage('');
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });
            const data = await res.json();
            if (res.ok) {
                setResendMessage('✅ ' + (data.message || 'ส่งอีเมลแล้ว กรุณาตรวจสอบกล่องจดหมาย'));
            } else {
                setResendMessage('❌ ' + (data.error || 'ไม่สามารถส่งอีเมลได้'));
            }
        } catch {
            setResendMessage('❌ เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setResendLoading(false);
        }
    };

    const ResendSection = () => (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                ไม่ได้รับอีเมล?
            </p>
            <Button
                variant="outline"
                fullWidth
                onClick={handleResend}
                disabled={resendLoading}
            >
                {resendLoading ? 'กำลังส่ง...' : '📧 ส่งอีเมลยืนยันอีกครั้ง'}
            </Button>
            {resendMessage && (
                <p style={{
                    marginTop: '0.75rem',
                    fontSize: '0.875rem',
                    color: resendMessage.startsWith('✅') ? '#059669' : '#dc2626'
                }}>
                    {resendMessage}
                </p>
            )}
            {!user && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                    ต้อง <Link href="/login" style={{ color: 'var(--primary)' }}>เข้าสู่ระบบ</Link> ก่อนส่งอีเมลใหม่
                </p>
            )}
        </div>
    );

    return (
        <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '100%', maxWidth: '450px', textAlign: 'center' }}>
                <CardHeader>
                    <CardTitle>ยืนยันอีเมล</CardTitle>
                </CardHeader>
                <CardContent>
                    {status === 'loading' && (
                        <div style={{ padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                            <p style={{ color: '#6b7280' }}>กำลังยืนยันอีเมลของคุณ...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div style={{ padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>ยืนยันสำเร็จ!</h3>
                            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{message}</p>
                            <Button onClick={() => router.push('/')} fullWidth variant="primary">
                                กลับหน้าหลัก
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{ padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                            <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>ยืนยันไม่สำเร็จ</h3>
                            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>{message}</p>
                            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>ลิงก์อาจหมดอายุหรือถูกใช้ไปแล้ว</p>
                            <ResendSection />
                        </div>
                    )}

                    {status === 'no-token' && (
                        <div style={{ padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>ยืนยันอีเมลของคุณ</h3>
                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                กรุณาตรวจสอบกล่องจดหมายและคลิกลิงก์ยืนยันที่ส่งไปยังอีเมลของคุณ
                            </p>
                            {user && !user.verified && (
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                    อีเมล: <strong>{user.email || '(ยังไม่มีอีเมล)'}</strong>
                                </p>
                            )}
                            {user && user.verified && (
                                <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                                    ✅ อีเมลของคุณยืนยันแล้ว
                                </div>
                            )}
                            <Button onClick={() => router.push('/')} fullWidth variant="primary" style={{ marginBottom: '0' }}>
                                กลับหน้าหลัก
                            </Button>
                            {user && !user.verified && <ResendSection />}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
