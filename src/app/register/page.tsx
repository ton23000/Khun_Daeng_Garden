'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { validatePassword, getPasswordStrength } from '@/lib/passwordValidation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Password validation
        const validation = validatePassword(password);
        if (!validation.isValid) {
            setError('รหัสผ่านไม่ตรงตามเงื่อนไข: ' + validation.errors.join(', '));
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

        if (firstName && lastName && phone && email && password) {
            const result = await register(firstName, lastName, phone, email, password);
            if (!result.success) {
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
                            label="ชื่อ"
                            placeholder="สมชาย"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <Input
                            label="นามสกุล"
                            placeholder="ใจดี"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Input
                                label="รหัสผ่าน"
                                type="password"
                                placeholder="สร้างรหัสผ่านของคุณ"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '8px',
                                fontSize: '0.8rem',
                                backgroundColor: '#f9f9f9',
                                padding: '10px',
                                borderRadius: '6px',
                                marginTop: '4px'
                            }}>
                                {[
                                    { label: '8 ตัวอักษรขึ้นไป', valid: password.length >= 8 },
                                    { label: 'ตัวพิมพ์เล็ก (a-z)', valid: /[a-z]/.test(password) },
                                    { label: 'ตัวพิมพ์ใหญ่ (A-Z)', valid: /[A-Z]/.test(password) },
                                    { label: 'ตัวเลข (0-9)', valid: /[0-9]/.test(password) },
                                ].map((req, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: req.valid ? '#10b981' : '#9ca3af',
                                        transition: 'color 0.2s'
                                    }}>
                                        <span style={{
                                            fontSize: '1.2em',
                                            lineHeight: 1
                                        }}>
                                            {req.valid ? '✓' : '•'}
                                        </span>
                                        {req.label}
                                    </div>
                                ))}
                            </div>
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
