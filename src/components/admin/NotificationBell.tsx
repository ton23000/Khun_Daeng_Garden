'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdminNotification {
    id: string;
    message: string;
    type: string;
    read: boolean;
    bookingId: string | null;
    createdAt: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/admin/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: AdminNotification) => !n.read).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markAsRead = async (ids: string[]) => {
        try {
            await fetch('/api/admin/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationIds: ids })
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/admin/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllRead: true })
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'relative',
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.25rem'
                }}
                title="การแจ้งเตือน"
            >
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '9999px',
                        width: '20px',
                        height: '20px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 10
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '52px',
                        right: 0,
                        width: '360px',
                        maxHeight: '480px',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        zIndex: 20,
                        overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '1rem',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ fontWeight: 'bold', fontSize: '1rem' }}>การแจ้งเตือน</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--primary)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    อ่านทั้งหมด
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {notifications.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                                    ไม่มีการแจ้งเตือน
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        onClick={() => {
                                            if (!notif.read) markAsRead([notif.id]);
                                        }}
                                        style={{
                                            padding: '1rem',
                                            borderBottom: '1px solid #f3f4f6',
                                            backgroundColor: notif.read ? 'white' : '#eff6ff',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                            {!notif.read && (
                                                <div style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: '#3b82f6',
                                                    marginTop: '0.5rem',
                                                    flexShrink: 0
                                                }} />
                                            )}
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                    {notif.message}
                                                </p>
                                                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                    {new Date(notif.createdAt).toLocaleString('th-TH')}
                                                </p>
                                                {notif.bookingId && (
                                                    <Link
                                                        href="/admin/dashboard"
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            color: 'var(--primary)',
                                                            textDecoration: 'underline',
                                                            marginTop: '0.25rem',
                                                            display: 'inline-block'
                                                        }}
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        ดูออเดอร์
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
