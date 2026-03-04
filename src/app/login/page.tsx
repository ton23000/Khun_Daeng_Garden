'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [identifier, setIdentifier] = useState(''); // phone or email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Check if it looks like a phone number (digits only, or at least mostly digits)
        // If user enters email, we skip phone validation range check.
        // Basic logic: If it contains '@', assume email. If digits, assume phone.

        if (!identifier.includes('@')) {
            // Assume phone
            // We can relax validation here to allow users to just try logging in,
            // but strictly enforcing 0-start and 10-digit helps prevent simple typos if that's the rule.
            if (!/^0\d{9}$/.test(identifier)) {
                setError('เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องขึ้นต้นด้วย 0 และมี 10 หลัก)');
                return;
            }
        }

        const success = await login(identifier, password);
        if (success) {
            // Read role from localStorage to redirect appropriately
            const stored = localStorage.getItem('khun_daeng_user');
            const userData = stored ? JSON.parse(stored) : {};
            if (userData.role === 'admin') {
                router.push('/admin');
            } else if (userData.role === 'staff') {
                router.push('/staff/orders');
            } else {
                router.push('/');
            }
        } else {
            setError('ข้อมูลเข้าสู่ระบบไม่ถูกต้อง');
        }

    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <CardHeader>
                    <CardTitle>เข้าสู่ระบบ</CardTitle>
                    <CardDescription>ใช้อีเมลหรือเบอร์โทรศัพท์เพื่อเข้าสู่ระบบ</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Phone/Email Login Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="อีเมล หรือ เบอร์โทรศัพท์"
                            placeholder="0812345678 หรือ user@example.com"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <Input
                                label="รหัสผ่าน"
                                type="password"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div style={{ textAlign: 'right' }}>
                                <Link href="/forgot-password" style={{ fontSize: '0.75rem', color: '#6b7280', textDecoration: 'underline' }}>
                                    ลืมรหัสผ่าน?
                                </Link>
                            </div>
                        </div>

                        {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}
                        <Button fullWidth type="submit" variant="primary">เข้าสู่ระบบ</Button>
                    </form>
                    <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                        ยังไม่มีบัญชี? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>สมัครสมาชิก</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
