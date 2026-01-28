'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Password Length Check
        if (password.length < 6) {
            setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
            return;
        }

        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        // Validate Phone: Starts with 0, exactly 10 digits
        if (!/^0\d{9}$/.test(phone)) {
            setError('เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0 และมี 10 หลัก (เช่น 0812345678)');
            return;
        }

        // Simple Email Validation
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            setError('รูปแบบอีเมลไม่ถูกต้อง');
            return;
        }

        if (name && nickname && phone && email && password) {
            const result = register(name, nickname, phone, email, password);
            // If result is returned (meaning we updated context to return it), treat it.
            // But if successful, context redirects.
            if (result && !result.success) {
                setError(result.error || 'การสมัครสมาชิกไม่สำเร็จ');
            }
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <CardHeader>
                    <CardTitle>สมัครสมาชิก</CardTitle>
                    <CardDescription>กรอกข้อมูลเพื่อเริ่มต้นใช้งาน</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="ชื่อ-นามสกุล"
                            placeholder="สมชาย ใจดี"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            label="ชื่อเล่น"
                            placeholder="แดง"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                        <Input
                            label="เบอร์โทรศัพท์"
                            placeholder="0812345678"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <Input
                            label="อีเมล"
                            placeholder="somchai@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <Input
                                label="รหัสผ่าน"
                                type="password"
                                placeholder="อย่างน้อย 6 ตัวอักษร"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>* อย่างน้อย 6 ตัวอักษร</p>
                        </div>
                        <Input
                            label="ยืนยันรหัสผ่าน"
                            type="password"
                            placeholder="••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

                        <Button fullWidth type="submit" variant="primary">สมัครสมาชิก</Button>
                    </form>
                    <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                        มีบัญชีอยู่แล้ว? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>เข้าสู่ระบบ</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
