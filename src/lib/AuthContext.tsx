'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
    name: string;
    nickname: string;
    phone: string;
    email: string;
    password?: string;
    role?: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (identifier: string, password: string) => boolean;
    loginAdmin: (password: string) => boolean;
    register: (name: string, nickname: string, phone: string, email: string, password: string) => { success: boolean; error?: string };
    resetPassword: (identifier: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('khun_daeng_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('khun_daeng_user');
            }
        }
        setIsLoading(false);
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
            // Default role is user for normal login
            const userWithRole = { ...safeUser, role: 'user' as const };
            setUser(userWithRole);
            localStorage.setItem('khun_daeng_user', JSON.stringify(userWithRole));
            return true;
        }
        return false;
    };

    const loginAdmin = (password: string) => {
        // Hardcoded admin for demo
        if (password === 'admin1234') {
            const adminUser: User = {
                name: 'Admin',
                nickname: 'Admin',
                phone: '0000000000',
                email: 'admin@khundaeng.com',
                role: 'admin'
            };
            setUser(adminUser);
            localStorage.setItem('khun_daeng_user', JSON.stringify(adminUser));
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
        <AuthContext.Provider value={{ user, isLoading, login, loginAdmin, register, resetPassword, logout }}>
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
