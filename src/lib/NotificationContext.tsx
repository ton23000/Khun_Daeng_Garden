'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

    // Fetch notifications from API
    const fetchNotifications = async () => {
        if (!user || !user.id) return;
        try {
            const userId = user.id;
            const res = await fetch(`/api/notifications?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            // Suppress network errors during polling to avoid console spam
            // console.error('Failed to fetch notifications', error);
        }
    };

    // Initial load and polling
    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Polling interval reduced to 5s for testing
            const interval = setInterval(fetchNotifications, 5000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
        }
    }, [user]);

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
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, all: true })
            });
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
