'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Mock reset logic
        const exists = resetPassword(identifier);
        if (exists) {
            setIsSent(true);
        } else {
            // For security, usually simply say "If account exists, email sent"
            // But for this mock helpful feedback
            setError('ไม่พบข้อมูลผู้ใช้งานในระบบ');
        }
    };

    if (isSent) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
                <Card style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <CardHeader>
                        <div style={{ margin: '0 auto 1rem', width: '60px', height: '60px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <CardTitle>ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว</CardTitle>
                        <CardDescription>
                            กรุณาตรวจสอบอีเมลหรือ SMS ของคุณเพื่อตั้งรหัสผ่านใหม่
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/login">
                            <Button fullWidth variant="outline">กลับไปหน้าเข้าสู่ระบบ</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <CardHeader>
                    <CardTitle>ลืมรหัสผ่าน</CardTitle>
                    <CardDescription>กรอกอีเมลหรือเบอร์โทรศัพท์ที่ใช้สมัคร</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="อีเมล หรือ เบอร์โทรศัพท์"
                            placeholder="0812345678 หรือ user@example.com"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />

                        {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

                        <Button fullWidth type="submit" variant="primary">ส่งลิงก์รีเซ็ต</Button>
                    </form>
                    <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                        <Link href="/login" style={{ color: '#6b7280' }}>ยกเลิก</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
