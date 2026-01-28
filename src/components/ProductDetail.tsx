'use client';

import { Tree } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useState } from 'react';

export default function ProductDetail({ tree }: { tree: Tree }) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        addItem(tree, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <Link href="/shop" style={{ display: 'inline-block', marginBottom: '1rem', color: '#6b7280' }}>
                ← กลับไปหน้าร้านค้า
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '2rem' }}>
                {/* Left: Image */}
                <div style={{ backgroundColor: '#e5e7eb', borderRadius: '0.5rem', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    รูปภาพขนาดใหญ่
                </div>

                {/* Right: Details & Booking */}
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{tree.name}</h1>
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
                            {tree.status === 'AVAILABLE' ? (
                                <div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>จำนวน</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Button variant="outline" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>-</Button>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>{quantity}</span>
                                            <Button variant="outline" onClick={() => setQuantity(q => q + 1)}>+</Button>
                                        </div>
                                    </div>

                                    <Button fullWidth onClick={handleAdd} variant="primary">
                                        {isAdded ? 'เพิ่มเรียบร้อย!' : `เพิ่มลงตะกร้า (${quantity} ต้น)`}
                                    </Button>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                    <p style={{ color: '#d97706', fontWeight: 'bold' }}>สินค้านี้ถูกจองแล้ว</p>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>กรุณาเลือกดูรายการอื่น</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
