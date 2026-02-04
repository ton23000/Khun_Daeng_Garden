'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useState, useEffect } from 'react';
import ImageGallery from './ImageGallery';
import StarRating from './StarRating';
import ReviewList from './ReviewList';

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
    rating?: number;
    reviewCount?: number;
}

export default function ProductDetail({ tree }: { tree: Tree }) {
    const { addItem } = useCart();
    const { user } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isCheckingFavorite, setIsCheckingFavorite] = useState(true);

    // Calculate available stock
    const stock = (tree as any).stock || 0;
    const reserved = (tree as any).reserved || 0;
    const availableStock = Math.max(0, stock - reserved);
    const isOutOfStock = availableStock === 0;

    useEffect(() => {
        if (user) {
            checkFavorite();
        } else {
            setIsCheckingFavorite(false);
        }
    }, [user, tree.id]);

    const checkFavorite = async () => {
        if (!user) return;
        try {
            const res = await fetch('/api/favorites', {
                headers: { 'x-user-id': user.id }
            });
            if (res.ok) {
                const favorites = await res.json();
                setIsFavorite(favorites.some((f: any) => f.treeId === tree.id));
            }
        } catch (error) {
            console.error('Failed to check favorite:', error);
        } finally {
            setIsCheckingFavorite(false);
        }
    };

    const toggleFavorite = async () => {
        if (!user) {
            alert('กรุณาเข้าสู่ระบบเพื่อบันทึกรายการโปรด');
            return;
        }

        try {
            if (isFavorite) {
                const res = await fetch(`/api/favorites?treeId=${tree.id}`, {
                    method: 'DELETE',
                    headers: { 'x-user-id': user.id }
                });
                if (res.ok) {
                    setIsFavorite(false);
                }
            } else {
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-user-id': user.id
                    },
                    body: JSON.stringify({ treeId: tree.id })
                });
                if (res.ok) {
                    setIsFavorite(true);
                }
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        }
    };

    const handleAdd = () => {
        if (quantity > availableStock) {
            alert(`สินค้ามีจำนวนไม่เพียงพอ (เหลือ ${availableStock} ต้น)`);
            return;
        }
        addItem(tree, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <Link href="/shop" style={{ display: 'inline-block', marginBottom: '1rem', color: '#6b7280' }}>
                ← กลับไปหน้าร้านค้า
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Left: Image Gallery */}
                <div>
                    <ImageGallery images={tree.images} alt={tree.name} />
                </div>

                {/* Right: Details & Booking */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h1 style={{ fontSize: '2rem', flex: 1 }}>{tree.name}</h1>

                        {/* Favorite Button */}
                        {!isCheckingFavorite && (
                            <button
                                onClick={toggleFavorite}
                                style={{
                                    background: 'white',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    marginLeft: '1rem'
                                }}
                                title={isFavorite ? 'ลบออกจากรายการโปรด' : 'เพิ่มไปยังรายการโปรด'}
                            >
                                <img
                                    src={isFavorite ? '/uploaded_media_1_1770098764245.png' : '/uploaded_media_0_1770098764245.png'}
                                    alt={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                    style={{ width: '24px', height: '24px' }}
                                />
                            </button>
                        )}
                    </div>

                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>
                        ฿ {tree.price.toLocaleString()}
                    </p>

                    {tree.growthTime && (
                        <p style={{ marginBottom: '1rem', color: '#4b5563' }}>
                            <strong>ระยะเวลาเติบโต:</strong> {tree.growthTime}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        {tree.tags.map(tag => (
                            <span key={tag} style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
                        {tree.description}
                    </p>

                    <Card>
                        <CardHeader>
                            <CardTitle>สั่งจอง</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tree.status === 'AVAILABLE' && !isOutOfStock ? (
                                <div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <label style={{ fontSize: '0.875rem' }}>จำนวน</label>
                                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>มีสินค้า {availableStock} ต้น</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Button variant="outline" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>-</Button>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>{quantity}</span>
                                            <Button variant="outline" onClick={() => setQuantity(q => Math.min(availableStock, q + 1))} disabled={quantity >= availableStock}>+</Button>
                                        </div>
                                    </div>

                                    <Button fullWidth onClick={handleAdd} variant="primary" disabled={isOutOfStock}>
                                        {isAdded ? 'เพิ่มเรียบร้อย!' : `เพิ่มลงตะกร้า (${quantity} ต้น)`}
                                    </Button>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                    <p style={{ color: '#d97706', fontWeight: 'bold' }}>สินค้านี้ถูกจองแล้ว / สินค้าหมด</p>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>กรุณาเลือกดูรายการอื่น</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Reviews Section */}
            <div style={{ marginTop: '3rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        รีวิวและคะแนน
                    </h2>
                    {tree.rating !== undefined && tree.reviewCount !== undefined && tree.reviewCount > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <StarRating rating={tree.rating} readonly size="md" />
                            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151' }}>
                                {tree.rating.toFixed(1)}
                            </span>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                ({tree.reviewCount} รีวิว)
                            </span>
                        </div>
                    )}
                </div>

                <ReviewList treeId={tree.id} currentUserId={user?.id} />
            </div>
        </div>
    );
}
