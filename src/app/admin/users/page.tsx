'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';

interface User {
    id: string;
    name: string;
    email: string;
    nickname: string;
    role: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/admin/login');
            return;
        }
        fetchUsers();
    }, [currentUser, router]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>ข้อมูลผู้ใช้งาน (User Info)</h1>

            <Card>
                <CardContent style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>ชื่อ-นามสกุล</th>
                                <th style={{ padding: '1rem' }}>ชื่อเล่น</th>
                                <th style={{ padding: '1rem' }}>อีเมล</th>
                                <th style={{ padding: '1rem' }}>สถานะ</th>
                                <th style={{ padding: '1rem' }}>วันที่สมัคร</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>ไม่มีข้อมูลผู้ใช้งาน</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{user.name}</td>
                                        <td style={{ padding: '1rem' }}>{user.nickname || '-'}</td>
                                        <td style={{ padding: '1rem' }}>{user.email || '-'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem',
                                                backgroundColor: user.role === 'admin' ? '#fee2e2' : '#dcfce7',
                                                color: user.role === 'admin' ? '#991b1b' : '#166534'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{new Date(user.createdAt).toLocaleDateString('th-TH')}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
