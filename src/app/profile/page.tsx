'use client';

import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [recentBooking, setRecentBooking] = useState<any>(null);

    useEffect(() => {
        if (user) {
            setName(user.name);

            // Load recent booking
            const allBookings = JSON.parse(localStorage.getItem('khun_daeng_bookings') || '[]');
            const userBookings = allBookings.filter((b: any) => b.userId === user.phone).reverse();
            if (userBookings.length > 0) {
                setRecentBooking(userBookings[0]);
            }
        }
    }, [user]);

    if (!user) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <p>กรุณาเข้าสู่ระบบก่อน</p>
                <Link href="/login"><Button>เข้าสู่ระบบ</Button></Link>
            </div>
        );
    }

    const handleSave = () => {
        const db = localStorage.getItem('khun_daeng_db_users');
        let users = db ? JSON.parse(db) : [];
        const idx = users.findIndex((u: any) => u.phone === user.phone);

        if (idx !== -1) {
            users[idx].name = name;
            localStorage.setItem('khun_daeng_db_users', JSON.stringify(users));

            const updatedUser = { ...user, name };
            localStorage.setItem('khun_daeng_user', JSON.stringify(updatedUser));

            window.location.reload();
        }
        setIsEditing(false);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>ข้อมูลส่วนตัว</h1>

            <div style={{ display: 'grid', gap: '2rem' }}>
                <Card>
                    <CardHeader>
                        <CardTitle>บัญชีของฉัน</CardTitle>
                    </CardHeader>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold' }}>ชื่อ-นามสกุล</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!isEditing}
                                />
                                {isEditing ? (
                                    <Button variant="primary" onClick={handleSave}>บันทึก</Button>
                                ) : (
                                    <Button variant="outline" onClick={() => setIsEditing(true)}>แก้ไข</Button>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 'bold' }}>เบอร์โทรศัพท์ (ID)</label>
                            <Input value={user.phone} disabled style={{ backgroundColor: '#f3f4f6' }} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <CardTitle>ประวัติการจองล่าสุด</CardTitle>
                            <Link href="/profile/bookings">
                                <Button variant="ghost">ดูทั้งหมด</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentBooking ? (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold' }}>Order #{recentBooking.id}</span>
                                    <span style={{ color: recentBooking.status === 'PENDING' ? '#d97706' : 'green' }}>
                                        {recentBooking.status === 'PENDING' ? 'รอตรวจสอบ' : recentBooking.status}
                                    </span>
                                </div>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                    {recentBooking.items.length} รายการ - รวม ฿ {recentBooking.totalPrice.toLocaleString()}
                                </p>
                            </div>
                        ) : (
                            <p style={{ color: '#6b7280' }}>ยังไม่มีรายการจอง</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
