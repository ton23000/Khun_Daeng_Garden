'use client';

import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useNotification } from '@/lib/NotificationContext';
import { Button } from './ui/Button';
import { useState } from 'react';

export function Navbar() {
    const { items } = useCart();
    const { user, logout } = useAuth();
    const { notifications, unreadCount, markAllAsRead } = useNotification();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const [showNotifications, setShowNotifications] = useState(false);

    // Dropdown States
    const [showServices, setShowServices] = useState(false);
    const [showAbout, setShowAbout] = useState(false);

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

    return (
        <nav className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', position: 'relative' }}>
            <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                Khun Daeng Garden
            </Link>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link href="/"><Button variant="ghost">หน้าหลัก</Button></Link>
                <Link href="/promotion"><Button variant="ghost">โปรโมชั่น</Button></Link>
                <Link href="/shop"><Button variant="ghost">ค้นหาสินค้า</Button></Link>

                {/* Services Dropdown */}
                <div
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setShowServices(true)}
                    onMouseLeave={() => setShowServices(false)}
                >
                    <Link href="/services">
                        <Button variant="ghost">บริการของเรา ▾</Button>
                    </Link>
                    {showServices && (
                        <div style={dropdownStyle}>
                            <Link href="/services#ordering" style={linkStyle}>วิธีการสั่งซื้อ</Link>
                            <Link href="/services#planting" style={linkStyle}>คำปรึกษาการปลูก</Link>

                            <Link href="/services#faq" style={linkStyle}>บริการตอบคำถาม</Link>
                        </div>
                    )}
                </div>

                {/* About Dropdown */}
                <div
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setShowAbout(true)}
                    onMouseLeave={() => setShowAbout(false)}
                >
                    <Link href="/about">
                        <Button variant="ghost">เกี่ยวกับเรา ▾</Button>
                    </Link>
                    {showAbout && (
                        <div style={dropdownStyle}>
                            <Link href="/about#history" style={linkStyle}>ประวัติร้าน</Link>
                            <Link href="/about#contact" style={linkStyle}>ติดต่อเรา</Link>
                        </div>
                    )}
                </div>

                <Link href="/cart">
                    <Button variant="outline" style={{ position: 'relative' }}>
                        ตะกร้าสินค้า
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
                                justifyContent: 'center'
                            }}>
                                {itemCount}
                            </span>
                        )}
                    </Button>
                </Link>

                {/* Notifications Bell */}
                {user && (
                    <div style={{ position: 'relative' }}>
                        <Button variant="ghost" onClick={() => { setShowNotifications(!showNotifications); markAllAsRead(); }}>
                            🔔
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '0px',
                                    right: '0px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {unreadCount}
                                </span>
                            )}
                        </Button>

                        {showNotifications && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: '0',
                                width: '300px',
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                zIndex: 50,
                                padding: '1rem',
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}>
                                <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>การแจ้งเตือน</h3>
                                {notifications.length === 0 ? (
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>ไม่มีการแจ้งเตือน</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {notifications.map((note) => (
                                            <div key={note.id} style={{ padding: '0.5rem', backgroundColor: note.read ? 'white' : '#f0fdf4', borderRadius: '4px', borderBottom: '1px solid #f3f4f6' }}>
                                                <p style={{ fontSize: '0.875rem' }}>{note.message}</p>
                                                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                    {new Date(note.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1rem', borderLeft: '1px solid #e5e7eb' }}>
                        <Link href="/profile" style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            คุณ{user.nickname || user.name}
                        </Link>
                        {/* Admin Link if role is admin */}
                        {user.role === 'admin' && (
                            <Link href="/admin"><Button variant="ghost" size="sm" style={{ color: '#166534' }}>ระบบหลังบ้าน</Button></Link>
                        )}
                        <Button variant="ghost" size="sm" onClick={logout}>ออกจากระบบ</Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href="/login"><Button variant="ghost">เข้าสู่ระบบ</Button></Link>
                        <Link href="/register"><Button variant="primary">สมัครสมาชิก</Button></Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
