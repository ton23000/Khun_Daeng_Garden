'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
    id: string;
    userId: string;
    message: string;
    read: boolean;
    date: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (userId: string, message: string, type?: Notification['type']) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const lastDataRef = useRef<string>('');

    // Fetch notifications from API
    const fetchNotifications = useCallback(async () => {
        if (!user || !user.id) return;
        try {
            let url = `/api/notifications?userId=${user.id}`;

            // If admin, fetch admin notifications
            if (user.role === 'admin') {
                url = '/api/admin/notifications';
            }

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();

                let newData: Notification[];
                // Map admin notifications if needed
                if (user.role === 'admin') {
                    newData = data.map((n: any) => ({
                        id: n.id,
                        userId: 'admin',
                        message: n.message,
                        read: n.read,
                        date: n.createdAt,
                        type: n.type || 'info'
                    }));
                } else {
                    newData = data;
                }

                // Only update state if data actually changed to prevent unnecessary re-renders
                const newDataStr = JSON.stringify(newData);
                if (newDataStr !== lastDataRef.current) {
                    lastDataRef.current = newDataStr;
                    setNotifications(newData);
                }
            }
        } catch (error) {
            // Suppress network errors during polling to avoid console spam
        }
    }, [user]);

    // Initial load and polling
    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            lastDataRef.current = '';
        }
    }, [user, fetchNotifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = async (userId: string, message: string, type: Notification['type'] = 'info') => {
        // Optimistic update
        const newNote: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            message,
            read: false,
            date: new Date().toISOString(),
            type
        };
        setNotifications(prev => [newNote, ...prev]);

        // Persist to API
        try {
            await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, message, type })
            });
            fetchNotifications(); // Refresh to get real ID
        } catch (error) {
            console.error('Failed to save notification', error);
        }
    };

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, read: true })
            });
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user || !user.id) return;
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

        try {
            if (user.role === 'admin') {
                // Admin notifications use different endpoint and payload
                await fetch('/api/admin/notifications', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ markAllRead: true })
                });
            } else {
                // User notifications
                await fetch('/api/notifications', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, all: true })
                });
            }
            // Refresh notifications from server to ensure count is correct
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
