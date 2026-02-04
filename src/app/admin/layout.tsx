'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    // Simple protection check (AuthContext redirect handles the rest usually)
    // But layout renders first, so visual flicker might happen if not handled.
    // We rely on page-level protection for stricter security, layout just provides UI.

    const navItems = [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Manage Trees', href: '/admin/trees' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: '#f9fafb', borderRight: '1px solid #e5e7eb', padding: '2rem 1rem' }}>
                <Link href="/admin/dashboard" style={{ marginBottom: '2rem', paddingLeft: '0.5rem', display: 'block', textDecoration: 'none' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#166534', cursor: 'pointer' }}>Admin Panel</h2>
                </Link>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin/dashboard" style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        color: pathname === '/admin/dashboard' ? '#166534' : '#374151',
                        backgroundColor: pathname === '/admin/dashboard' ? '#dcfce7' : 'transparent',
                        fontWeight: pathname === '/admin/dashboard' ? 500 : 400,
                        textDecoration: 'none'
                    }}>
                        Dashboard
                    </Link>

                    {user?.role === 'admin' && (
                        <>
                            <Link href="/admin/trees" style={{
                                display: 'block',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                color: pathname === '/admin/trees' ? '#166534' : '#374151',
                                backgroundColor: pathname === '/admin/trees' ? '#dcfce7' : 'transparent',
                                fontWeight: pathname === '/admin/trees' ? 500 : 400,
                                textDecoration: 'none'
                            }}>
                                Manage Trees
                            </Link>

                            <Link href="/admin/inventory" style={{
                                display: 'block',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                color: pathname === '/admin/inventory' ? '#166534' : '#374151',
                                backgroundColor: pathname === '/admin/inventory' ? '#dcfce7' : 'transparent',
                                fontWeight: pathname === '/admin/inventory' ? 500 : 400,
                                textDecoration: 'none'
                            }}>
                                📦 จัดการสต็อก
                            </Link>

                            <Link href="/admin/users" style={{
                                display: 'block',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                color: pathname === '/admin/users' ? '#166534' : '#374151',
                                backgroundColor: pathname === '/admin/users' ? '#dcfce7' : 'transparent',
                                fontWeight: pathname === '/admin/users' ? 500 : 400,
                                textDecoration: 'none'
                            }}>
                                ข้อมูลผู้ใช้งาน
                            </Link>

                            <Link href="/admin/reports" style={{
                                display: 'block',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                color: pathname === '/admin/reports' ? '#166534' : '#374151',
                                backgroundColor: pathname === '/admin/reports' ? '#dcfce7' : 'transparent',
                                fontWeight: pathname === '/admin/reports' ? 500 : 400,
                                textDecoration: 'none'
                            }}>
                                รายงาน
                            </Link>
                        </>
                    )}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                    {user && (
                        <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                            Signed in as: <br /><strong>{user.name}</strong>
                        </div>
                    )}
                    <Link href="/logout" style={{ textDecoration: 'none', display: 'block' }}>
                        <Button variant="outline" fullWidth>ออกจากระบบ</Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}
