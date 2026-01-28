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

    // Load notifications from local storage
    useEffect(() => {
        const saved = localStorage.getItem('khun_daeng_notifications');
        if (saved) {
            setNotifications(JSON.parse(saved));
        }
    }, []);

    // Save on change
    useEffect(() => {
        localStorage.setItem('khun_daeng_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const userNotifications = user
        ? notifications.filter(n => n.userId === user.phone || n.userId === user.email).reverse()
        : [];

    const unreadCount = userNotifications.filter(n => !n.read).length;

    const addNotification = (userId: string, message: string, type: Notification['type'] = 'info') => {
        const newNote: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            message,
            read: false,
            date: new Date().toISOString(),
            type
        };
        setNotifications(prev => [...prev, newNote]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        if (!user) return;
        setNotifications(prev => prev.map(n =>
            (n.userId === user.phone || n.userId === user.email) ? { ...n, read: true } : n
        ));
    };

    return (
        <NotificationContext.Provider value={{ notifications: userNotifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
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
