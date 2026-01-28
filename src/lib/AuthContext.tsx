'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
    name: string;
    nickname: string;
    phone: string;
    email: string;
    password?: string;
}

interface AuthContextType {
    user: User | null;
    login: (identifier: string, password: string) => boolean;
    register: (name: string, nickname: string, phone: string, email: string, password: string) => { success: boolean; error?: string };
    resetPassword: (identifier: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Check storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('khun_daeng_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (identifier: string, password: string) => {
        const db = localStorage.getItem('khun_daeng_db_users');
        let users: User[] = db ? JSON.parse(db) : [];

        // Check if identifier matches phone OR email
        const foundUser = users.find(u =>
            (u.phone === identifier || u.email === identifier) &&
            u.password === password
        );

        if (foundUser) {
            const { password, ...safeUser } = foundUser;
            setUser(safeUser as User);
            localStorage.setItem('khun_daeng_user', JSON.stringify(safeUser));
            return true;
        }
        return false;
    };

    const register = (name: string, nickname: string, phone: string, email: string, password: string) => {
        // Save to "Database"
        const db = localStorage.getItem('khun_daeng_db_users');
        let users: User[] = db ? JSON.parse(db) : [];

        // Check duplicates
        if (users.find(u => u.phone === phone)) {
            return { success: false, error: 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว' };
        }
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' };
        }
        if (users.find(u => u.nickname === nickname)) {
            return { success: false, error: 'ชื่อเล่นนี้ถูกใช้งานแล้ว' };
        }

        const newUser = { name, nickname, phone, email, password };
        users.push(newUser);
        localStorage.setItem('khun_daeng_db_users', JSON.stringify(users));

        // Auto login
        const { password: _, ...safeUser } = newUser;
        setUser(safeUser as User);
        localStorage.setItem('khun_daeng_user', JSON.stringify(safeUser));
        router.push('/');

        return { success: true };
    };

    const resetPassword = (identifier: string) => {
        const db = localStorage.getItem('khun_daeng_db_users');
        let users: User[] = db ? JSON.parse(db) : [];
        const foundUser = users.find(u => u.phone === identifier || u.email === identifier);
        return !!foundUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('khun_daeng_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, resetPassword, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
