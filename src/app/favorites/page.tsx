'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/CartContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import FavoriteButton from '@/components/FavoriteButton';
import Link from 'next/link';

interface Tree {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    status: string;
    images: string[];
    tags: string[];
    growthTime?: string | null;
}

interface Favorite {
    id: string;
    treeId: string;
    tree: Tree;
    createdAt: string;
}

export default function FavoritesPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const { addItem } = useCart();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchFavorites();
    }, [user, isAuthLoading, router]);

    const fetchFavorites = async () => {
        try {
            const res = await fetch('/api/favorites', {
                headers: {
                    'x-user-id': user?.id || ''
                }
            });
            if (res.ok) {
                const data = await res.json();
                setFavorites(data);
            }
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFavorite = async (treeId: string) => {
        try {
            const res = await fetch(`/api/favorites?treeId=${treeId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-id': user?.id || ''
                }
            });
            if (res.ok) {
                setFavorites(favorites.filter(f => f.treeId !== treeId));
            }
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    const handleAddToCart = (tree: Tree) => {
        addItem(tree, 1);
        alert('เพิ่มลงตะกร้าเรียบร้อย!');
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <p>กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                ❤️ รายการโปรดของฉัน
            </h1>

            {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '1rem' }}>
                        ยังไม่มีรายการโปรด
                    </p>
                    <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
                        คลิกไอคอนหัวใจที่สินค้าที่คุณชอบเพื่อบันทึกไว้ที่นี่
                    </p>
                    <Link href="/shop">
                        <Button variant="primary">ไปเลือกสินค้า</Button>
                    </Link>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {favorites.map(favorite => (
                        <Card key={favorite.id} style={{ position: 'relative' }}>
                            <CardContent style={{ padding: '1rem' }}>
                                {/* Favorite Button */}
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    zIndex: 10
                                }}>
                                    <FavoriteButton
                                        treeId={favorite.treeId}
                                        initialIsFavorite={true}
                                        onToggle={(isFav) => {
                                            if (!isFav) removeFavorite(favorite.treeId);
                                        }}
                                        size="md"
                                    />
                                </div>

                                {/* Image */}
                                <Link href={`/shop/${favorite.tree.id}`}>
                                    <div style={{
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '0.5rem',
                                        overflow: 'hidden',
                                        marginBottom: '1rem',
                                        aspectRatio: '1/1',
                                        cursor: 'pointer'
                                    }}>
                                        <img
                                            src={(() => {
                                                let imageUrl = '/placeholder-tree.jpg';
                                                if (favorite.tree.images) {
                                                    if (Array.isArray(favorite.tree.images)) {
                                                        imageUrl = favorite.tree.images[0] || '/placeholder-tree.jpg';
                                                    } else if (typeof favorite.tree.images === 'string') {
                                                        try {
                                                            const images = JSON.parse(favorite.tree.images);
                                                            imageUrl = images[0] || '/placeholder-tree.jpg';
                                                        } catch (e) {
                                                            imageUrl = '/placeholder-tree.jpg';
                                                        }
                                                    }
                                                }
                                                return imageUrl;
                                            })()}
                                            alt={favorite.tree.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                </Link>

                                {/* Details */}
                                <Link href={`/shop/${favorite.tree.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        {favorite.tree.name}
                                    </h3>
                                </Link>

                                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>
                                    ฿{favorite.tree.price.toLocaleString()}
                                </p>


                                {/* Tags */}
                                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                    {(() => {
                                        let tags: string[] = [];
                                        if (favorite.tree.tags) {
                                            if (Array.isArray(favorite.tree.tags)) {
                                                tags = favorite.tree.tags;
                                            } else if (typeof favorite.tree.tags === 'string') {
                                                try {
                                                    tags = JSON.parse(favorite.tree.tags);
                                                } catch (e) {
                                                    tags = [];
                                                }
                                            }
                                        }
                                        return tags.slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                style={{
                                                    backgroundColor: '#f3f4f6',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                #{tag}
                                            </span>
                                        ));
                                    })()}
                                </div>

                                {/* Add to cart button */}
                                {favorite.tree.status === 'AVAILABLE' ? (
                                    <Button
                                        fullWidth
                                        variant="primary"
                                        onClick={() => handleAddToCart(favorite.tree)}
                                    >
                                        เพิ่มลงตะกร้า
                                    </Button>
                                ) : (
                                    <Button fullWidth variant="outline" disabled>
                                        สินค้าถูกจองแล้ว
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
