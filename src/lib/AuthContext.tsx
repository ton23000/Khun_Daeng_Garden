'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


export interface User {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
    password?: string;
    role?: 'user' | 'admin';
    image?: string;
    verified?: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (identifier: string, password: string) => Promise<boolean>;
    loginAdmin: (password: string) => Promise<boolean>;
    register: (firstName: string, lastName: string, phone: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    resetPassword: (identifier: string) => boolean;
    logout: () => void;
    refreshUser: () => Promise<void>;
    deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check localStorage for local auth on mount
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

    const register = async (firstName: string, lastName: string, phone: string, email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, phone, email, password })
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

    const logout = async () => {
        try {
            // Call logout API to clear server-side cookie
            await fetch('/api/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        // Clear client-side state
        setUser(null);
        localStorage.removeItem('khun_daeng_user');
        router.push('/');
        router.refresh();
    };

    const refreshUser = async () => {
        if (!user) return;

        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                localStorage.setItem('khun_daeng_user', JSON.stringify(data.user));
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const deleteAccount = async () => {
        if (!user) return { success: false, error: 'Not logged in' };
        try {
            const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                return { success: false, error: data.error || 'ลบบัญชีไม่สำเร็จ' };
            }
            // Clear auth state
            setUser(null);
            localStorage.removeItem('khun_daeng_user');
            try { await fetch('/api/logout', { method: 'POST' }); } catch (e) { }
            router.push('/');
            return { success: true };
        } catch (error) {
            console.error('Delete account error:', error);
            return { success: false, error: 'เกิดข้อผิดพลาด' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, loginAdmin, register, resetPassword, logout, refreshUser, deleteAccount }}>
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
