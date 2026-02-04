'use client';

import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useNotification } from '@/lib/NotificationContext';
import { Button } from './ui/Button';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

    const dropdownStyle: React.CSSProperties = {
        position: 'absolute',
        top: '100%',
        left: 0,
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 50,
        minWidth: '200px',
        padding: '0.5rem 0'
    };

    const linkStyle: React.CSSProperties = {
        display: 'block',
        padding: '0.5rem 1rem',
        color: '#374151',
        textDecoration: 'none',
        fontSize: '0.875rem'
    };

    const topBarStyle: React.CSSProperties = {
        backgroundColor: '#433422', // Dark Brown from image
        color: '#ffffff',
        fontSize: '0.75rem',
        padding: '0.5rem 0'
    };

    const middleBarStyle: React.CSSProperties = {
        backgroundColor: '#e6f5e6', // Light Green hint from image
        padding: '1.5rem 0',
        borderBottom: '1px solid #e5e7eb'
    };

    const bottomBarStyle: React.CSSProperties = {
        backgroundColor: '#f6d896', // Pastel Orange/Yellow from image
        padding: '0.75rem 0'
    };

    // ... (Keep existing dropdown styles)

    return (
        <header>
            {/* 1. Top Bar */}
            <div style={topBarStyle}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>จัดส่งฟรีทั่วไทยเมื่อสั่งซื้อเกิน 1,000 บาท</div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <span>สายด่วน : +66 81 234 5678</span>
                        <Link href="/services#faq" style={{ color: 'white', textDecoration: 'none' }}>คำถามที่พบบ่อย</Link>
                        <Link href="/about" style={{ color: 'white', textDecoration: 'none' }}>เกี่ยวกับเรา</Link>
                        <Link href="/contact" style={{ color: 'white', textDecoration: 'none' }}>ติดต่อ</Link>
                    </div>
                </div>
            </div>

            {/* 2. Middle Bar */}
            <div style={middleBarStyle}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
                    {/* Logo */}
                    <Link href="/" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>🌿</span> Khun Daeng Garden
                    </Link>

                    {/* Search Bar */}
                    <div style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้า..."
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                paddingRight: '3rem',
                                borderRadius: '9999px',
                                border: '1px solid #d1fae5',
                                backgroundColor: '#f0fdf4',
                                outline: 'none'
                            }}
                        />
                        <button style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#166534' }}>
                            🔍
                        </button>
                    </div>

                    {/* Actions (User, Heart, Cart) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {/* User / Login */}
                        {user ? (
                            <div
                                style={{ position: 'relative', cursor: 'pointer' }}
                                onMouseEnter={() => setShowUserMenu(true)}
                                onMouseLeave={() => setShowUserMenu(false)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1f2937' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
                                        👤
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ยินดีต้อนรับ</div>
                                        <div style={{ fontWeight: 'bold', lineHeight: 1 }}>{user.nickname || user.name}</div>
                                    </div>
                                </div>

                                {showUserMenu && (
                                    <div style={{ ...dropdownStyle, top: '100%', right: 0, left: 'auto' }}>
                                        <Link href="/profile" style={linkStyle}>โปรไฟล์</Link>
                                        <Link href="/profile/bookings" style={linkStyle}>การจองของฉัน</Link>
                                        <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                                        <Link href="/logout" style={{ ...linkStyle, color: '#ef4444', fontWeight: 'bold' }}>ออกจากระบบ</Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" style={{ color: '#374151', fontSize: '1.5rem' }}>👤</Link>
                        )}

                        {/* Notifications */}
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <div
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    if (unreadCount > 0) markAllAsRead();
                                }}
                                style={{ fontSize: '1.5rem', position: 'relative' }}
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

                        {/* Wishlist (Static for now) */}
                        <div style={{ position: 'relative', cursor: 'pointer', color: '#374151', fontSize: '1.5rem' }}>
                            ❤️
                        </div>

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
                    </div>
                </div>
            </div>

            {/* 3. Bottom Bar */}
            <div style={bottomBarStyle}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Main Nav Links */}
                    <div style={{ display: 'flex', gap: '2rem', fontWeight: 'bold', color: '#4b3b28' }}>
                        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>หน้าหลัก</Link>

                        {/* Dropdown: Shop */}
                        <div style={{ position: 'relative', cursor: 'pointer' }} onMouseEnter={() => setShowServices(true)} onMouseLeave={() => setShowServices(false)}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                ร้านค้า ▾
                            </span>
                            {showServices && (
                                <div style={{ ...dropdownStyle, top: '100%', left: 0 }}>
                                    <Link href="/shop" style={linkStyle}>สินค้าทั้งหมด</Link>
                                    <Link href="/promotion" style={linkStyle}>โปรโมชั่น</Link>
                                    <Link href="/shop?category=indoor" style={linkStyle}>ไม้ในร่ม</Link>
                                    <Link href="/shop?category=outdoor" style={linkStyle}>ไม้กลางแจ้ง</Link>
                                </div>
                            )}
                        </div>

                        {/* Dropdown: About */}
                        <div style={{ position: 'relative', cursor: 'pointer' }} onMouseEnter={() => setShowAbout(true)} onMouseLeave={() => setShowAbout(false)}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                เกี่ยวกับเรา ▾
                            </span>
                            {showAbout && (
                                <div style={{ ...dropdownStyle, top: '100%', left: 0 }}>
                                    <Link href="/about" style={linkStyle}>เรื่องราวของเรา</Link>
                                    <Link href="/services" style={linkStyle}>บริการ</Link>
                                    <Link href="/contact" style={linkStyle}>ติดต่อเรา</Link>
                                </div>
                            )}
                        </div>

                        <Link href="/profile/bookings" style={{ textDecoration: 'none', color: 'inherit' }}>การจองของฉัน</Link>
                    </div>

                    {/* Social Icons & Admin */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
