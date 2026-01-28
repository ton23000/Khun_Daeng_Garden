'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const { loginAdmin } = useAuth();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = loginAdmin(password);
        if (success) {
            router.push('/admin');
        } else {
            setError('รหัสผ่านไม่ถูกต้อง');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <CardHeader>
                    <CardTitle style={{ color: '#d97706' }}>Admin Access</CardTitle>
                    <CardDescription>กรุณาระบุรหัสผ่านเพื่อเข้าสู่ระบบจัดการ</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="รหัสผ่านผู้ดูแลระบบ"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}
                        <Button fullWidth type="submit" variant="primary" style={{ backgroundColor: '#d97706', borderColor: '#d97706' }}>เข้าสู่ระบบ</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
