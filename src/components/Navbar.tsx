'use client';

import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useNotification } from '@/lib/NotificationContext';
import { Button } from './ui/Button';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import styles from './navbar.module.css';

export function Navbar() {
    const { items } = useCart();
    const { user, logout } = useAuth();
    const { notifications, unreadCount, markAllAsRead } = useNotification();
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
        } catch (error) {
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setResending(false);
        }
    };

    return (
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
                    <div className={styles.topBarText}>ฟรีปุ๋ยหมักเมื่อสั่งซื้อเกิน 1,000 บาท</div>
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
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้า..."
                            className={styles.searchInput}
                        />
                        <button className={styles.searchButton}>
                            🔍
                        </button>
                    </div>

                    {/* Actions (User, Heart, Cart) */}
                    <div className={styles.actions}>
                        {/* User / Login */}
                        {user ? (
                            <div
                                className={styles.dropdownWrapper}
                                onMouseEnter={() => setShowUserMenu(true)}
                                onMouseLeave={() => setShowUserMenu(false)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1f2937', cursor: 'pointer' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
                                        👤
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
                            <Link href="/login" style={{ color: '#374151', fontSize: '1.5rem' }}>👤</Link>
                        )}

                        {/* Notifications */}
                        <div className={styles.dropdownWrapper}>
                            <div
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    if (unreadCount > 0) markAllAsRead();
                                }}
                                style={{ fontSize: '1.5rem', position: 'relative', cursor: 'pointer' }}
                            >
                                🔔
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
                        <Link href="/favorites" style={{ position: 'relative', color: '#374151', fontSize: '1.5rem', textDecoration: 'none' }} title="รายการโปรด">
                            ❤️
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" style={{ position: 'relative', color: '#374151', fontSize: '1.5rem' }}>
                            🛒
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
                                    <Link href="/about" className={styles.dropdownLink}>เรื่องราวของเรา</Link>
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
                            <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
                                <span style={{ backgroundColor: '#166534', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.875rem' }}>Admin Panel</span>
                            </Link>
                        )}
                        <span style={{ fontSize: '1.25rem', cursor: 'pointer' }}>fb</span>
                        <span style={{ fontSize: '1.25rem', cursor: 'pointer' }}>ig</span>
                        <span style={{ fontSize: '1.25rem', cursor: 'pointer' }}>tw</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
