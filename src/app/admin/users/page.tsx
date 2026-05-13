'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { SearchBar } from '@/components/admin/SearchBar';
import { formatThaiDate } from '@/lib/dateUtils';

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
            router.push('/login');
            return;
        }
        fetchUsers();
    }, [currentUser, router]);

    useEffect(() => {
        filterAndSortUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(u =>
                `${u.firstName} ${u.lastName}`.toLowerCase().includes(query) ||
                u.email?.toLowerCase().includes(query) ||
                u.phone?.includes(query)
            );
        }
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
        setUserBookings([]);
        setSelectedUser(user);
        fetchUserBookings(user.id);
    };

    const getTotalSpent = () =>
        userBookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + b.totalPrice, 0);

    const changeRole = async (userId: string, newRole: string) => {
        if (newRole === 'admin' && userId !== currentUser?.id) {
            alert('ไม่สามารถเพิ่มสิทธิ์ admin ให้ผู้ใช้อื่นได้');
            return;
        }
        if (!confirm(`เปลี่ยนสิทธิ์เป็น "${newRole}" ใช่หรือไม่?`)) return;
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
                alert('เปลี่ยนสิทธิ์สำเร็จ');
            } else {
                const data = await res.json();
                alert(data.error || 'เกิดข้อผิดพลาด');
            }
        } catch (error) {
            console.error('Failed to change role', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    };

    const getRoleStyle = (role: string) => {
        if (role === 'admin') return { bg: '#fee2e2', color: '#991b1b', label: 'Admin' };
        if (role === 'staff') return { bg: '#dbeafe', color: '#1e40af', label: 'Staff' };
        return { bg: '#dcfce7', color: '#166534', label: 'User' };
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'COMPLETED': return { bg: '#dcfce7', color: '#166534' };
            case 'CANCELLED': return { bg: '#fee2e2', color: '#991b1b' };
            case 'PREPARING': return { bg: '#ede9fe', color: '#6d28d9' };
            case 'READY': return { bg: '#d1fae5', color: '#065f46' };
            case 'PAID': return { bg: '#dbeafe', color: '#1e40af' };
            case 'VERIFYING_PAYMENT': return { bg: '#fef3c7', color: '#92400e' };
            case 'PENDING': return { bg: '#fff7ed', color: '#c2410c' };
            default: return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    const getInitials = (u: User) =>
        `${(u.firstName || '?')[0]}${(u.lastName || '?')[0]}`.toUpperCase();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>ข้อมูลผู้ใช้งาน (User Info)</h1>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <SearchBar placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..." onSearch={setSearchQuery} />
            </div>

            <Card>
                <CardContent style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <SortableTableHeader label="ชื่อ-นามสกุล" sortKey="name" currentSort={sortConfig} onSort={handleSort} />
                                <SortableTableHeader label="อีเมล" sortKey="email" currentSort={sortConfig} onSort={handleSort} />
                                <th style={{ padding: '1rem' }}>เบอร์โทร</th>
                                <SortableTableHeader label="สถานะ" sortKey="role" currentSort={sortConfig} onSort={handleSort} />
                                <SortableTableHeader label="วันที่สมัคร" sortKey="date" currentSort={sortConfig} onSort={handleSort} />
                                <th style={{ padding: '1rem' }}>ดูประวัติ</th>
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
                                            <select
                                                value={user.role}
                                                onChange={(e) => changeRole(user.id, e.target.value)}
                                                disabled={user.role === 'admin' && user.id !== currentUser?.id}
                                                style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '0.375rem',
                                                    border: '1px solid #d1d5db',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 500,
                                                    backgroundColor: getRoleStyle(user.role).bg,
                                                    color: getRoleStyle(user.role).color,
                                                    cursor: user.role === 'admin' && user.id !== currentUser?.id ? 'not-allowed' : 'pointer',
                                                    opacity: user.role === 'admin' && user.id !== currentUser?.id ? 0.7 : 1,
                                                }}
                                            >
                                                <option value="USER">USER</option>
                                                <option value="staff">staff</option>
                                                {user.role === 'admin' && <option value="admin">admin</option>}
                                            </select>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{formatThaiDate(user.createdAt)}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => handleUserClick(user)}
                                                style={{
                                                    padding: '0.4rem 0.9rem',
                                                    borderRadius: '0.375rem',
                                                    border: '1px solid #166534',
                                                    backgroundColor: 'white',
                                                    color: '#166534',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                🔍 ประวัติ
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* ===== Profile Modal ===== */}
            {selectedUser && (
                <div
                    onClick={() => setSelectedUser(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.55)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                    }}
                >
                    <style>{`
                        @keyframes profileModalIn {
                            from { opacity: 0; transform: translateY(-20px) scale(0.96); }
                            to   { opacity: 1; transform: translateY(0) scale(1); }
                        }
                    `}</style>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '1.25rem',
                            width: '100%',
                            maxWidth: '660px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
                            animation: 'profileModalIn 0.25s ease',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Cover */}
                        <div style={{
                            background: 'linear-gradient(135deg, #14532d 0%, #166534 45%, #15803d 75%, #22c55e 100%)',
                            height: '145px',
                            position: 'relative',
                            flexShrink: 0,
                        }}>
                            {/* decorative bubbles */}
                            <div style={{ position: 'absolute', top: 10, right: 50, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                            <div style={{ position: 'absolute', top: -25, right: 110, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                            <div style={{ position: 'absolute', bottom: 10, left: 160, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

                            {/* Close btn */}
                            <button
                                onClick={() => setSelectedUser(null)}
                                style={{
                                    position: 'absolute', top: 14, right: 14,
                                    width: 34, height: 34,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backdropFilter: 'blur(4px)',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >✕</button>

                            {/* Avatar */}
                            <div style={{
                                position: 'absolute',
                                bottom: -44,
                                left: '2rem',
                                width: 88,
                                height: 88,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #bbf7d0, #86efac)',
                                border: '4px solid white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.85rem', fontWeight: 'bold', color: '#14532d',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                            }}>
                                {getInitials(selectedUser)}
                            </div>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '3.5rem 2rem 2rem 2rem', overflowY: 'auto' }}>
                            {/* Name & Role */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </h2>
                                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                                        สมาชิกตั้งแต่ {formatThaiDate(selectedUser.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '0.3rem 0.9rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    backgroundColor: getRoleStyle(selectedUser.role).bg,
                                    color: getRoleStyle(selectedUser.role).color,
                                    border: `1px solid ${getRoleStyle(selectedUser.role).color}40`,
                                    whiteSpace: 'nowrap',
                                }}>
                                    {getRoleStyle(selectedUser.role).label}
                                </span>
                            </div>

                            {/* Contact */}
                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    📧 {selectedUser.email || '-'}
                                </span>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    📞 {selectedUser.phone || '-'}
                                </span>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginTop: '1.25rem' }}>
                                <div style={{ padding: '0.9rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 600, margin: 0 }}>ออเดอร์ทั้งหมด</p>
                                    <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#14532d', margin: '0.2rem 0 0' }}>{userBookings.length}</p>
                                </div>
                                <div style={{ padding: '0.9rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#fefce8,#fef9c3)', border: '1px solid #fde047', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', color: '#854d0e', fontWeight: 600, margin: 0 }}>เสร็จสิ้น</p>
                                    <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#713f12', margin: '0.2rem 0 0' }}>
                                        {userBookings.filter(b => b.status === 'COMPLETED').length}
                                    </p>
                                </div>
                                <div style={{ padding: '0.9rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', border: '1px solid #bae6fd', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', color: '#075985', fontWeight: 600, margin: 0 }}>ยอดซื้อรวม</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0c4a6e', margin: '0.2rem 0 0' }}>
                                        ฿{getTotalSpent().toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Order Table */}
                            <div style={{ marginTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>
                                    📋 ประวัติออเดอร์
                                </h3>
                                {userBookings.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', backgroundColor: '#f9fafb', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                                        ยังไม่มีประวัติการสั่งซื้อ
                                    </div>
                                ) : (
                                    <div style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead style={{ backgroundColor: '#f9fafb' }}>
                                                <tr>
                                                    {['รหัสออเดอร์', 'วันที่', 'ยอดรวม', 'สถานะ'].map(h => (
                                                        <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userBookings.map((b, i) => (
                                                    <tr key={b.id} style={{ borderTop: '1px solid #e5e7eb', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                                                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{b.refCode}</td>
                                                        <td style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                                                            {formatThaiDate(b.createdAt)}
                                                        </td>
                                                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: '#14532d', fontSize: '0.875rem' }}>
                                                            ฿{b.totalPrice.toLocaleString()}
                                                        </td>
                                                        <td style={{ padding: '0.65rem 1rem' }}>
                                                            <span style={{
                                                                padding: '0.2rem 0.55rem',
                                                                borderRadius: '9999px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: 700,
                                                                backgroundColor: getStatusStyle(b.status).bg,
                                                                color: getStatusStyle(b.status).color,
                                                            }}>
                                                                {b.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
