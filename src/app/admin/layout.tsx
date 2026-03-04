'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Run once on mount to set initial state based on window width
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsSidebarOpen(true);
        }
    }, [pathname]);

    // Close sidebar on mobile when path changes
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsSidebarOpen(false);
        }
    }, [pathname]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    // Redirect staff to their dedicated panel
    if (user && user.role === 'staff' && pathname !== '/admin/login') {
        router.push('/staff/orders');
        return null;
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                .admin-layout { 
                    display: flex; 
                    min-height: calc(100vh - 64px); 
                    align-items: flex-start;
                }
                
                .admin-sidebar { 
                    width: 260px; 
                    background-color: #f9fafb; 
                    border-right: 1px solid #e5e7eb; 
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                    overflow-y: auto;
                    
                    /* Desktop Default (Sticky) */
                    position: sticky;
                    top: 64px;
                    height: calc(100vh - 64px);
                    z-index: 40;
                    margin-left: 0;
                    transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .admin-sidebar::-webkit-scrollbar { width: 6px; }
                .admin-sidebar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
                
                /* Desktop Closed State */
                .admin-sidebar:not(.open) {
                    margin-left: -260px;
                }

                .admin-main-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    width: 100%;
                }
                
                .admin-top-bar {
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    background-color: white;
                    border-bottom: 1px solid #e5e7eb;
                    position: sticky;
                    top: 64px; /* Default global navbar height */
                    z-index: 30;
                }
                
                .admin-main { 
                    padding: 1rem; 
                    flex: 1;
                    background-color: white;
                }

                .sidebar-backdrop {
                    display: none; /* hidden on desktop */
                }

                .mobile-close-btn {
                    display: none !important;
                }

                /* Mobile overrides */
                @media (max-width: 767px) {
                    .admin-layout {
                        padding-bottom: 5rem; /* Space for the global mobile bottom nav */
                    }
                    .admin-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        height: 100vh;
                        padding: 1.5rem;
                        padding-bottom: 6rem; /* Extra padding so the logout button isn't covered */
                        z-index: 9999;
                        margin-left: 0 !important; /* disable margin transitioning */
                        transform: translateX(-100%);
                        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .admin-sidebar.open {
                        transform: translateX(0);
                    }
                    .mobile-close-btn {
                        display: flex !important;
                    }
                    .sidebar-backdrop {
                        display: block;
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background-color: rgba(0,0,0,0.5);
                        z-index: 9998;
                        opacity: 0;
                        visibility: hidden;
                        transition: opacity 0.3s ease, visibility 0.3s ease;
                    }
                    .sidebar-backdrop.open {
                        opacity: 1;
                        visibility: visible;
                    }
                    .admin-top-bar {
                        position: relative;
                        top: 0; /* Un-stick inner top bar on mobile */
                    }
                }
                
                @media (min-width: 768px) {
                    .admin-main { padding: 2rem; }
                }
            `}} />
            <div className="admin-layout">
                {/* Backdrop */}
                <div
                    className={`sidebar-backdrop ${isSidebarOpen ? 'open' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                ></div>

                {/* Sidebar */}
                <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="admin-sidebar-content-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <Link href="/admin/trees" style={{ textDecoration: 'none', display: 'block' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534', margin: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}>Admin Panel</h2>
                            </Link>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0.5rem',
                                    backgroundColor: '#e5e7eb',
                                    color: '#4b5563',
                                    borderRadius: '0.375rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                className="mobile-close-btn"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2 flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                            {(user?.role === 'admin' || user?.role === 'staff') && (
                                <>
                                    <div style={{ marginTop: '1rem', marginBottom: '0.25rem', paddingLeft: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                        จัดการออเดอร์
                                    </div>
                                    <Link href="/admin/orders" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                                        color: pathname === '/admin/orders' ? '#166534' : '#374151',
                                        backgroundColor: pathname === '/admin/orders' ? '#dcfce7' : 'transparent',
                                        fontWeight: pathname === '/admin/orders' ? 500 : 400, textDecoration: 'none',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        <span style={{ fontSize: '1.25rem' }}>🛒</span> ออเดอร์ทั้งหมด
                                    </Link>
                                    <Link href="/admin/reviews" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                                        color: pathname === '/admin/reviews' ? '#166534' : '#374151',
                                        backgroundColor: pathname === '/admin/reviews' ? '#dcfce7' : 'transparent',
                                        fontWeight: pathname === '/admin/reviews' ? 500 : 400, textDecoration: 'none',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        <span style={{ fontSize: '1.25rem' }}>⭐</span> จัดการรีวิว
                                    </Link>
                                </>
                            )}

                            {user?.role === 'admin' && (
                                <>

                                    <div style={{ marginTop: '1rem', marginBottom: '0.25rem', paddingLeft: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                        จัดการสินค้า
                                    </div>
                                    <Link href="/admin/trees" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                                        color: pathname === '/admin/trees' ? '#166534' : '#374151',
                                        backgroundColor: pathname === '/admin/trees' ? '#dcfce7' : 'transparent',
                                        fontWeight: pathname === '/admin/trees' ? 500 : 400, textDecoration: 'none',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        <span style={{ fontSize: '1.25rem' }}>🌳</span> จัดการต้นไม้
                                    </Link>
                                    <Link href="/admin/inventory" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                                        color: pathname === '/admin/inventory' ? '#166534' : '#374151',
                                        backgroundColor: pathname === '/admin/inventory' ? '#dcfce7' : 'transparent',
                                        fontWeight: pathname === '/admin/inventory' ? 500 : 400, textDecoration: 'none',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        <span style={{ fontSize: '1.25rem' }}>📦</span> จัดการสต็อก
                                    </Link>

                                    <div style={{ marginTop: '1rem', marginBottom: '0.25rem', paddingLeft: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                        อื่นๆ
                                    </div>
                                    <Link href="/admin/users" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                                        color: pathname === '/admin/users' ? '#166534' : '#374151',
                                        backgroundColor: pathname === '/admin/users' ? '#dcfce7' : 'transparent',
                                        fontWeight: pathname === '/admin/users' ? 500 : 400, textDecoration: 'none',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        <span style={{ fontSize: '1.25rem' }}>👥</span> ข้อมูลผู้ใช้งาน
                                    </Link>
                                    <Link href="/admin/reports" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                                        color: pathname === '/admin/reports' ? '#166534' : '#374151',
                                        backgroundColor: pathname === '/admin/reports' ? '#dcfce7' : 'transparent',
                                        fontWeight: pathname === '/admin/reports' ? 500 : 400, textDecoration: 'none',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        <span style={{ fontSize: '1.25rem' }}>📈</span> รายงาน
                                    </Link>
                                    <Link href="/admin/promotions" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                                        color: pathname === '/admin/promotions' ? '#166534' : '#374151',
                                        backgroundColor: pathname === '/admin/promotions' ? '#dcfce7' : 'transparent',
                                        fontWeight: pathname === '/admin/promotions' ? 500 : 400, textDecoration: 'none',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        <span style={{ fontSize: '1.25rem' }}>🏷️</span> จัดการโปรโมชัน
                                    </Link>
                                    <Link href="/admin/settings" style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem',
                                        color: pathname === '/admin/settings' ? '#166534' : '#374151',
                                        backgroundColor: pathname === '/admin/settings' ? '#dcfce7' : 'transparent',
                                        fontWeight: pathname === '/admin/settings' ? 500 : 400, textDecoration: 'none',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        <span style={{ fontSize: '1.25rem' }}>⚙️</span> ตั้งค่าหน้าเพจ
                                    </Link>
                                </>
                            )}
                        </nav>

                        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                            {user && (
                                <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem', fontSize: '0.875rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                                    Signed in as: <br /><strong>{user.firstName} {user.lastName}</strong>
                                </div>
                            )}
                            <Link href="/logout" style={{ textDecoration: 'none', display: 'block' }}>
                                <Button variant="outline" fullWidth>ออกจากระบบ</Button>
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content Wrapper */}
                <div className="admin-main-wrapper">
                    <div className="admin-top-bar">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            style={{
                                padding: '0.5rem',
                                marginRight: '1rem',
                                backgroundColor: 'white',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#374151',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                            className="hamburger-btn"
                        >
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>จัดการข้อมูล (Admin)</h1>
                    </div>
                    <main className="admin-main">
                        {children}
                    </main>
                </div>
            </div >
        </>
    );
}

