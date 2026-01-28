'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    if (pathname === '/admin/login') {
        return <>{children}</>;
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
                <div style={{ marginBottom: '2rem', paddingLeft: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#166534' }}>Admin Panel</h2>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin" style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        color: pathname === '/admin' ? '#166534' : '#374151',
                        backgroundColor: pathname === '/admin' ? '#dcfce7' : 'transparent',
                        fontWeight: pathname === '/admin' ? 500 : 400,
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
                        </>
                    )}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                    {user && (
                        <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                            Signed in as: <br /><strong>{user.name}</strong>
                        </div>
                    )}
                    <Button variant="outline" fullWidth onClick={logout}>ออกจากระบบ</Button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}
