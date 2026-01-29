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
    login: (identifier: string, password: string) => Promise<boolean>;
    loginAdmin: (password: string) => Promise<boolean>;
    register: (name: string, nickname: string, phone: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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

    const login = async (identifier: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Login failed');
                return false;
            }

            setUser(data.user);
            localStorage.setItem('khun_daeng_user', JSON.stringify(data.user));
            return true;
        } catch (error) {
            console.error('Login error', error);
            alert('Internal Server Error');
            return false;
        }
    };

    const loginAdmin = async (password: string) => {
        // Re-use standard login for admin, relying on backend to check or keep special logic
        // But for minimal friction, let's just use the same login function
        return login('admin', password);
    };

    const register = async (name: string, nickname: string, phone: string, email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, nickname, phone, email, password })
            });

            const data = await res.json();
            if (!res.ok) {
                return { success: false, error: data.error };
            }

            // Auto login
            setUser(data.user);
            localStorage.setItem('khun_daeng_user', JSON.stringify(data.user));
            router.push('/');
            return { success: true };

        } catch (error) {
            console.error('Register error', error);
            return { success: false, error: 'Internal Server Error' };
        }
    };

    const resetPassword = (identifier: string) => {
        // TODO: Implement real reset password API
        alert('Feature not implemented yet (Mock: Password reset for ' + identifier + ')');
        return true;
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
