'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

interface FavoriteButtonProps {
    treeId: string;
    initialIsFavorite?: boolean;
    onToggle?: (isFavorite: boolean) => void;
    size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({
    treeId,
    initialIsFavorite = false,
    onToggle,
    size = 'md'
}: FavoriteButtonProps) {
    const { user } = useAuth();
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isLoading, setIsLoading] = useState(false);

    const sizeStyles = {
        sm: { fontSize: '1rem', padding: '0.25rem' },
        md: { fontSize: '1.25rem', padding: '0.5rem' },
        lg: { fontSize: '1.5rem', padding: '0.75rem' }
    };

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('กรุณาเข้าสู่ระบบเพื่อเพิ่มสิ่งที่ถูกใจ');
            return;
        }

        setIsLoading(true);

        try {
            if (isFavorite) {
                // Remove from favorites
                const res = await fetch(`/api/favorites?treeId=${treeId}`, {
                    method: 'DELETE',
                    headers: {
                        'x-user-id': user.id
                    }
                });

                if (res.ok) {
                    setIsFavorite(false);
                    onToggle?.(false);
                }
            } else {
                // Add to favorites
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-user-id': user.id
                    },
                    body: JSON.stringify({ treeId })
                });

                if (res.ok) {
                    setIsFavorite(true);
                    onToggle?.(true);
                } else {
                    const data = await res.json();
                    alert(data.error || 'เกิดข้อผิดพลาด');
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            alert('เกิดข้อผิดพลาด');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            style={{
                ...sizeStyles[size],
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '50%',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.6 : 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            title={isFavorite ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
            className="favorite-button"
        >
            {isFavorite ? '❤️' : '🤍'}
        </button>
    );
}
