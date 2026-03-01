'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function StaffLoginPage() {
    const { loginAdmin } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await loginAdmin(email, password);
        setLoading(false);

        if (success) {
            const stored = localStorage.getItem('khun_daeng_user');
            const user = stored ? JSON.parse(stored) : {};
            if (user.role === 'staff') {
                router.push('/staff/orders');
            } else if (user.role === 'admin') {
                router.push('/admin');
            } else {
                setError('บัญชีนี้ไม่มีสิทธิ์เข้าสู่ระบบสตาฟ์');
            }
        } else {
            setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <CardHeader>
                    <CardTitle style={{ color: '#1d4ed8' }}>🧑‍💼 Staff Login</CardTitle>
                    <CardDescription>เข้าสู่ระบบสำหรับพนักงาน (Staff)</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="อีเมลพนักงาน"
                            type="email"
                            placeholder="staff@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="รหัสผ่าน"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

                        <Button
                            fullWidth
                            type="submit"
                            variant="primary"
                            style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' }}
                            disabled={loading}
                        >
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
