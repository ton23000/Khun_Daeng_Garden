'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { validatePassword, getPasswordStrength } from '@/lib/passwordValidation';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    // Verify token on mount
    useEffect(() => {
        if (!token) {
            setError('ไม่พบ token');
            setValidating(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await fetch(`/api/auth/verify-reset-token?token=${token}`);
                const data = await res.json();

                if (data.valid) {
                    setTokenValid(true);
                    setUserEmail(data.email);
                } else {
                    setError(data.error || 'ลิงก์ไม่ถูกต้องหรือหมดอายุ');
                }
            } catch (err) {
                setError('เกิดข้อผิดพลาดในการตรวจสอบลิงก์');
            } finally {
                setValidating(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        const validation = validatePassword(newPassword);
        if (!validation.isValid) {
            setError('รหัสผ่านไม่ตรงตามเงื่อนไข: ' + validation.errors.join(', '));
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000); // Redirect after 3 seconds
            } else {
                setError(data.error || 'เกิดข้อผิดพลาด');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setLoading(false);
        }
    };

    // Validating token
    if (validating) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <CardContent style={{ padding: '3rem' }}>
                        <div style={{
                            margin: '0 auto 1rem',
                            width: '60px',
                            height: '60px',
                            border: '4px solid #e5e7eb',
                            borderTopColor: '#059669',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ color: '#6b7280' }}>กำลังตรวจสอบลิงก์...</p>
                        <style jsx>{`
                            @keyframes spin {
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <CardHeader>
                        <div style={{
                            margin: '0 auto 1rem',
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#dcfce7',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem'
                        }}>
                            ✅
                        </div>
                        <CardTitle>เปลี่ยนรหัสผ่านสำเร็จ!</CardTitle>
                        <CardDescription>
                            คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                            กำลังนำคุณไปหน้าเข้าสู่ระบบ...
                        </p>
                        <Button fullWidth onClick={() => router.push('/login')}>
                            ไปหน้าเข้าสู่ระบบ
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Invalid token
    if (!tokenValid) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <CardHeader>
                        <div style={{
                            margin: '0 auto 1rem',
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#fee2e2',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem'
                        }}>
                            ❌
                        </div>
                        <CardTitle>ลิงก์ไม่ถูกต้อง</CardTitle>
                        <CardDescription style={{ color: '#dc2626' }}>
                            {error}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/forgot-password">
                            <Button fullWidth>ขอลิงก์ใหม่</Button>
                        </Link>
                        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                            <Link href="/login" style={{ color: '#6b7280' }}>← กลับไปหน้าเข้าสู่ระบบ</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Reset password form
    return (
        <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <CardHeader>
                    <CardTitle>ตั้งรหัสผ่านใหม่</CardTitle>
                    <CardDescription>
                        สำหรับบัญชี: <strong>{userEmail}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="รหัสผ่านใหม่"
                            type="password"
                            placeholder="อย่างน้อย 8 ตัวอักษร (ตัวใหญ่ + ตัวเล็ก + ตัวเลข)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        {newPassword && (
                            <div style={{ marginTop: '-0.5rem' }}>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{
                                            flex: 1, height: '4px', borderRadius: '2px',
                                            backgroundColor: getPasswordStrength(newPassword) === 'weak' ? (i <= 1 ? '#ef4444' : '#e5e7eb') :
                                                getPasswordStrength(newPassword) === 'medium' ? (i <= 2 ? '#f59e0b' : '#e5e7eb') : '#22c55e'
                                        }} />
                                    ))}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: getPasswordStrength(newPassword) === 'weak' ? '#ef4444' : getPasswordStrength(newPassword) === 'medium' ? '#f59e0b' : '#22c55e' }}>
                                    {getPasswordStrength(newPassword) === 'weak' ? 'อ่อน' : getPasswordStrength(newPassword) === 'medium' ? 'ปานกลาง' : 'แข็งแรง'}
                                </p>
                            </div>
                        )}

                        <Input
                            label="ยืนยันรหัสผ่าน"
                            type="password"
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#fee2e2',
                                borderRadius: '0.375rem',
                                border: '1px solid #fecaca'
                            }}>
                                <p style={{ color: '#991b1b', fontSize: '0.875rem' }}>❌ {error}</p>
                            </div>
                        )}

                        <Button fullWidth type="submit" disabled={loading}>
                            {loading ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <p>กำลังโหลด...</p>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
