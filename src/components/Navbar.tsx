'use client';

import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useNotification } from '@/lib/NotificationContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Home, Package, ShoppingCart, Bell, User, Heart, Search } from 'lucide-react';
import styles from './navbar.module.css';
import InlineEdit from './InlineEdit';

export function Navbar({ topBarText = 'ฟรีปุ๋ยหมักเมื่อสั่งซื้อเกิน 1,000 บาท', topBarBgColor = '' }: { topBarText?: string, topBarBgColor?: string }) {
    const { items } = useCart();
    const { user } = useAuth();
    const { notifications, unreadCount, markAllAsRead } = useNotification();

    const router = useRouter();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const [showNotifications, setShowNotifications] = useState(false);

    // Dropdown States
    const [showServices, setShowServices] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const [resending, setResending] = useState(false);

    const handleResendVerification = async () => {
        setResending(true);
        try {
            const res = await fetch('/api/auth/verify', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                alert('ส่งอีเมลยืนยันใหม่แล้ว! กรุณาตรวจสอบอีเมลของคุณ');
            } else {
                alert(data.error || 'ไม่สามารถส่งอีเมลได้');
            }
        } catch {
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setResending(false);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/shop');
        }
    };

    return (
        <>
            <header className={`${styles.header} glass`}>
                {/* Verification Banner */}
                {user && user.role !== 'admin' && user.verified === false && (
                    <div className={styles.verificationBanner}>
                        <span>📧 กรุณายืนยันอีเมลของคุณเพื่อใช้งานได้เต็มรูปแบบ</span>
                        <button
                            onClick={handleResendVerification}
                            disabled={resending}
                            className={styles.verifyButton}
                        >
                            {resending ? 'กำลังส่ง...' : 'ส่งอีเมลยืนยันอีกครั้ง'}
                        </button>
                    </div>
                )}

                {/* 1. Top Bar */}
                <div className={`${styles.topBar} hidden-mobile`}>
                    <div className={`container ${styles.topBarContainer}`}>
                        <InlineEdit
                            settingKey="top_bar_text"
                            initialValue={topBarText}
                            initialBgColor={topBarBgColor}
                            allowStyleEdit
                            renderAs="div"
                            className={styles.topBarText}
                            style={{ background: topBarBgColor || 'transparent', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
                        />
                        <div className={styles.topBarLinks}>
                            <span>สายด่วน : +66 81 234 5678</span>
                            <Link href="/faq" className={styles.topBarLink}>คำถามที่พบบ่อย</Link>
                            <Link href="/about" className={styles.topBarLink}>เกี่ยวกับเรา</Link>
                            <Link href="/contact" className={styles.topBarLink}>ติดต่อ</Link>
                        </div>
                    </div>
                </div>

                {/* 2. Middle Bar */}
                <div className={styles.middleBar}>
                    <div className={`container ${styles.middleBarContainer}`}>
                        {/* Logo */}
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoIcon}>🌿</span> Khun Daeng Garden
                        </Link>

                        {/* Search Bar */}
                        <form className={styles.searchWrapper} onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="ค้นหาสินค้า..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchButton}>
                                <Search size={20} />
                            </button>
                        </form>

                        {/* Actions (User, Heart, Cart) */}
                        <div className={styles.actions}>
                            {/* User / Login */}
                            {user ? (
                                <div
                                    className={`${styles.dropdownWrapper} hidden-mobile`}
                                    onMouseEnter={() => setShowUserMenu(true)}
                                    onMouseLeave={() => setShowUserMenu(false)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1f2937', cursor: 'pointer' }}>
                                        <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            <User size={20} />
                                        </div>
                                        <div className="hidden-mobile">
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ยินดีต้อนรับ</div>
                                            <div style={{ fontWeight: 'bold', lineHeight: 1 }}>{user.firstName} {user.lastName}</div>
                                        </div>
                                    </div>

                                    {showUserMenu && (
                                        <div className={`${styles.dropdownMenu} ${styles.dropdownMenuRight}`}>
                                            <Link href="/profile" className={styles.dropdownLink}>โปรไฟล์</Link>
                                            <Link href="/profile/bookings" className={styles.dropdownLink}>การจองของฉัน</Link>
                                            <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                                            <Link href="/logout" className={styles.dropdownLink} style={{ color: '#ef4444', fontWeight: 'bold' }}>ออกจากระบบ</Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href="/login" style={{ color: '#374151' }} className="hidden-mobile"><User size={24} /></Link>
                            )}

                            {/* Notifications */}
                            <div className={`${styles.dropdownWrapper} hidden-mobile`}>
                                <div
                                    onClick={() => {
                                        setShowNotifications(!showNotifications);
                                        if (unreadCount > 0) markAllAsRead();
                                    }}
                                    style={{ position: 'relative', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center' }}
                                >
                                    <Bell size={24} />
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            fontSize: '11px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid white'
                                        }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>

                                {showNotifications && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '120%',
                                        right: '-50px',
                                        width: '320px',
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        zIndex: 100,
                                        maxHeight: '400px',
                                        overflowY: 'auto'
                                    }}>
                                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>การแจ้งเตือน</span>
                                            {notifications.length > 0 && (
                                                <Link
                                                    href="/notifications"
                                                    style={{
                                                        color: '#166534',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        textDecoration: 'none'
                                                    }}
                                                    onClick={() => setShowNotifications(false)}
                                                >
                                                    ดูทั้งหมด →
                                                </Link>
                                            )}
                                        </div>
                                        {notifications.length === 0 ? (
                                            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                                ไม่มีการแจ้งเตือน
                                            </div>
                                        ) : (
                                            <div>
                                                {notifications.map(note => (
                                                    <div
                                                        key={note.id}
                                                        style={{
                                                            padding: '0.75rem 1rem',
                                                            borderBottom: '1px solid #f3f4f6',
                                                            backgroundColor: note.read ? 'white' : '#f0fdf4',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                    >
                                                        <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem', color: '#1f2937' }}>
                                                            {note.message}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                            {new Date(note.date).toLocaleString('th-TH')}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>

                            {/* Favorites/Wishlist */}
                            <Link href="/favorites" style={{ position: 'relative', color: '#374151', textDecoration: 'none', display: 'flex', alignItems: 'center' }} title="รายการโปรด">
                                <Heart size={24} />
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" style={{ position: 'relative', color: '#374151', display: 'flex', alignItems: 'center' }} className="hidden-mobile">
                                <ShoppingCart size={24} />
                                {itemCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid white'
                                    }}>
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Hamburger Menu Toggle (Mobile Only) */}
                            <button
                                className="hidden-desktop"
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                style={{ border: 'none', background: 'none', padding: '0.5rem', color: 'var(--foreground)' }}
                            >
                                {showMobileMenu ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Bar */}
                <div className={`${styles.bottomBar} ${showMobileMenu ? styles.showMobileMenu : ''}`}>
                    <div className={`container ${styles.bottomBarContainer}`}>
                        {/* Main Nav Links */}
                        <div className={styles.mainNav}>
                            <Link href="/" className={styles.navLink}>หน้าหลัก</Link>

                            {/* Dropdown: Shop */}
                            <div className={styles.dropdownWrapper} onMouseEnter={() => setShowServices(true)} onMouseLeave={() => setShowServices(false)}>
                                <span className={styles.dropdownTitle}>
                                    ร้านค้า ▾
                                </span>
                                {showServices && (
                                    <div className={styles.dropdownMenu}>
                                        <Link href="/shop" className={styles.dropdownLink}>สินค้าทั้งหมด</Link>
                                        <Link href="/promotion" className={styles.dropdownLink}>โปรโมชั่น</Link>
                                    </div>
                                )}
                            </div>

                            {/* Dropdown: About */}
                            <div className={styles.dropdownWrapper} onMouseEnter={() => setShowAbout(true)} onMouseLeave={() => setShowAbout(false)}>
                                <span className={styles.dropdownTitle}>
                                    บริการของเรา ▾
                                </span>
                                {showAbout && (
                                    <div className={styles.dropdownMenu}>
                                        <Link href="/about" className={styles.dropdownLink}>เกี่ยวกับเรา</Link>
                                        <Link href="/services" className={styles.dropdownLink}>บริการ</Link>
                                        <Link href="/articles" className={styles.dropdownLink}>บทความน่ารู้</Link>
                                        <Link href="/customer-service" className={styles.dropdownLink}>บริการลูกค้า</Link>
                                        <Link href="/faq" className={styles.dropdownLink}>FAQ คำถามที่พบบ่อย</Link>
                                        <Link href="/contact" className={styles.dropdownLink}>ติดต่อเรา</Link>
                                    </div>
                                )}
                            </div>

                            {user && (
                                <Link href="/profile/bookings" className={styles.navLink}>การจองของฉัน</Link>
                            )}
                        </div>

                        {/* Social Icons & Admin */}
                        <div className={styles.socialAdmin}>
                            {user?.role === 'admin' && (
                                <Link href="/admin" style={{ textDecoration: 'none' }}>
                                    <span style={{ backgroundColor: '#166534', color: 'white', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>Admin Panel</span>
                                </Link>
                            )}
                            {user?.role === 'staff' && (
                                <Link href="/staff/orders" style={{ textDecoration: 'none' }}>
                                    <span style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>Staff Panel</span>
                                </Link>
                            )}
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} title="Facebook">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} title="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} title="X (Twitter)">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation */}
            <div className={styles.mobileBottomNav}>
                <Link href="/" className={styles.mobileNavLink}>
                    <Home size={24} />
                    <span>หน้าแรก</span>
                </Link>
                <Link href="/shop" className={styles.mobileNavLink}>
                    <Package size={24} />
                    <span>สินค้า</span>
                </Link>
                <Link href="/cart" className={styles.mobileNavLink}>
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                        <ShoppingCart size={24} />
                        {itemCount > 0 && (
                            <span className={styles.mobileNavBadge}>{itemCount}</span>
                        )}
                    </div>
                    <span>รถเข็น</span>
                </Link>
                <Link href="/notifications" className={styles.mobileNavLink}>
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                        <Bell size={24} />
                        {unreadCount > 0 && (
                            <span className={styles.mobileNavBadge}>{unreadCount}</span>
                        )}
                    </div>
                    <span>แจ้งเตือน</span>
                </Link>
                <Link href={user ? "/profile" : "/login"} className={styles.mobileNavLink}>
                    <User size={24} />
                    <span>บัญชี</span>
                </Link>
            </div>
        </>
    );
}
