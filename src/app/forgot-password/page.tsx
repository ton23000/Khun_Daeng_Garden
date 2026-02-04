'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Step = 'phone' | 'code' | 'password' | 'success';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [devCode, setDevCode] = useState(''); // For development

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            const data = await res.json();

            if (res.ok) {
                if (data.code) {
                    setDevCode(data.code); // For development
                }
                setStep('code');
            } else {
                setError(data.error || 'เกิดข้อผิดพลาด');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/verify-reset-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, code })
            });

            const data = await res.json();

            if (res.ok) {
                setStep('password');
            } else {
                setError(data.error || 'รหัสยืนยันไม่ถูกต้อง');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        if (newPassword.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, code, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setStep('success');
            } else {
                setError(data.error || 'เกิดข้อผิดพลาด');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setLoading(false);
        }
    };

    // Success step
    if (step === 'success') {
        return (
            <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <CardHeader>
                        <div style={{ margin: '0 auto 1rem', width: '60px', height: '60px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                            ✅
                        </div>
                        <CardTitle>เปลี่ยนรหัสผ่านสำเร็จ</CardTitle>
                        <CardDescription>
                            คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button fullWidth onClick={() => router.push('/login')}>
                            ไปหน้าเข้าสู่ระบบ
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Step 1: Enter phone number
    if (step === 'phone') {
        return (
            <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '100%', maxWidth: '400px' }}>
                    <CardHeader>
                        <CardTitle>ลืมรหัสผ่าน</CardTitle>
                        <CardDescription>กรอกเบอร์โทรศัพท์ที่ใช้สมัคร</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Input
                                label="เบอร์โทรศัพท์"
                                placeholder="0812345678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />

                            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

                            <Button fullWidth type="submit" disabled={loading}>
                                {loading ? 'กำลังส่ง...' : 'ส่งรหัสยืนยัน'}
                            </Button>
                        </form>
                        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                            <Link href="/login" style={{ color: '#6b7280' }}>ยกเลิก</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Step 2: Enter verification code
    if (step === 'code') {
        return (
            <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '100%', maxWidth: '400px' }}>
                    <CardHeader>
                        <CardTitle>ยืนยันรหัส</CardTitle>
                        <CardDescription>
                            กรุณากรอกรหัส 6 หลักที่ส่งไปยัง {phone}
                            {devCode && (
                                <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#fef3c7', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                                    <strong>รหัสทดสอบ:</strong> {devCode}
                                </div>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Input
                                label="รหัสยืนยัน"
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={6}
                                required
                            />

                            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

                            <Button fullWidth type="submit" disabled={loading}>
                                {loading ? 'กำลังตรวจสอบ...' : 'ยืนยันรหัส'}
                            </Button>

                            <Button fullWidth variant="outline" onClick={() => setStep('phone')}>
                                ส่งรหัสใหม่
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Step 3: Enter new password
    if (step === 'password') {
        return (
            <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '100%', maxWidth: '400px' }}>
                    <CardHeader>
                        <CardTitle>ตั้งรหัสผ่านใหม่</CardTitle>
                        <CardDescription>กรุณากรอกรหัสผ่านใหม่ของคุณ</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Input
                                label="รหัสผ่านใหม่"
                                type="password"
                                placeholder="อย่างน้อย 6 ตัวอักษร"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                            <Input
                                label="ยืนยันรหัสผ่าน"
                                type="password"
                                placeholder="กรอกรหัสผ่านอีกครั้ง"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

                            <Button fullWidth type="submit" disabled={loading}>
                                {loading ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}
