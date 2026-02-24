'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { SearchBar } from '@/components/admin/SearchBar';
import { SortableTableHeader } from '@/components/admin/SortableTableHeader';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
}

interface Booking {
    id: string;
    refCode: string;
    totalPrice: number;
    deposit: number;
    status: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userBookings, setUserBookings] = useState<Booking[]>([]);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/admin/login');
            return;
        }
        fetchUsers();
    }, [currentUser, router]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        filterAndSortUsers();
    }, [users, searchQuery, sortConfig]);

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

    const fetchUserBookings = async (userId: string) => {
        try {
            const res = await fetch('/api/bookings');
            if (res.ok) {
                const allBookings = await res.json();
                const filtered = allBookings.filter((b: Booking & { userId: string }) => b.userId === userId);
                setUserBookings(filtered);
            }
        } catch (error) {
            console.error('Failed to fetch user bookings', error);
        }
    };

    const filterAndSortUsers = () => {
        let result = [...users];

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(u =>
                `${u.firstName} ${u.lastName}`.toLowerCase().includes(query) ||
                u.email?.toLowerCase().includes(query) ||
                u.phone?.includes(query)
            );
        }

        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                let aValue: string | number = 0;
                let bValue: string | number = 0;

                switch (sortConfig.key) {
                    case 'name':
                        aValue = `${a.firstName} ${a.lastName}`;
                        bValue = `${b.firstName} ${b.lastName}`;
                        break;
                    case 'email':
                        aValue = a.email || '';
                        bValue = b.email || '';
                        break;
                    case 'role':
                        aValue = a.role;
                        bValue = b.role;
                        break;
                    case 'date':
                        aValue = new Date(a.createdAt).getTime();
                        bValue = new Date(b.createdAt).getTime();
                        break;
                    default:
                        return 0;
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredUsers(result);
    };

    const handleSort = (key: string) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        fetchUserBookings(user.id);
    };

    const getTotalSpent = () => {
        return userBookings
            .filter(b => b.status !== 'CANCELLED')
            .reduce((sum, b) => sum + b.deposit, 0);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>ข้อมูลผู้ใช้งาน (User Info)</h1>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <SearchBar
                    placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
                    onSearch={setSearchQuery}
                />
            </div>

            <Card>
                <CardContent style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <SortableTableHeader
                                    label="ชื่อ-นามสกุล"
                                    sortKey="name"
                                    currentSort={sortConfig}
                                    onSort={handleSort}
                                />
                                <SortableTableHeader
                                    label="อีเมล"
                                    sortKey="email"
                                    currentSort={sortConfig}
                                    onSort={handleSort}
                                />
                                <th style={{ padding: '1rem' }}>เบอร์โทร</th>
                                <SortableTableHeader
                                    label="สถานะ"
                                    sortKey="role"
                                    currentSort={sortConfig}
                                    onSort={handleSort}
                                />
                                <SortableTableHeader
                                    label="วันที่สมัคร"
                                    sortKey="date"
                                    currentSort={sortConfig}
                                    onSort={handleSort}
                                />
                                <th style={{ padding: '1rem' }}>ดูออเดอร์</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>ไม่พบข้อมูลผู้ใช้งาน</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{user.firstName} {user.lastName}</td>
                                        <td style={{ padding: '1rem' }}>{user.email || '-'}</td>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{user.phone || '-'}</td>
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
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => handleUserClick(user)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.375rem',
                                                    border: '1px solid #166534',
                                                    backgroundColor: selectedUser?.id === user.id ? '#166534' : 'white',
                                                    color: selectedUser?.id === user.id ? 'white' : '#166534',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                ดูประวัติ
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* User Order History Modal/Section */}
            {selectedUser && (
                <Card style={{ marginTop: '2rem' }}>
                    <CardContent style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                ประวัติการสั่งซื้อของ {selectedUser.firstName} {selectedUser.lastName}
                            </h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                ปิด
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>จำนวนออเดอร์ทั้งหมด</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{userBookings.length}</p>
                            </div>
                            <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>ยอดซื้อรวม</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>
                                    ฿{getTotalSpent().toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {userBookings.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>ยังไม่มีประวัติการสั่งซื้อ</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    <tr>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>รหัสออเดอร์</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>วันที่</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>ยอดรวม</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userBookings.map(booking => (
                                        <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '0.75rem', fontWeight: 500 }}>{booking.refCode}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                {new Date(booking.createdAt).toLocaleDateString('th-TH')}
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>฿{booking.totalPrice.toLocaleString()}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    backgroundColor: booking.status === 'COMPLETED' ? '#dcfce7' : '#f3f4f6',
                                                    color: booking.status === 'COMPLETED' ? '#166534' : '#374151'
                                                }}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
