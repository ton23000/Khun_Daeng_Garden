'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import FavoriteButton from '@/components/FavoriteButton';
import Link from 'next/link';

interface Tree {
    id: string;
    name: string;
    price: number;
    images: string;
    category: string;
    soldCount?: number;
}

export default function BestSellersPage() {
    const [trees, setTrees] = useState<Tree[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBestSellers();
    }, []);

    const fetchBestSellers = async () => {
        try {
            const response = await fetch('/api/trees/best-sellers');
            if (response.ok) {
                const data = await response.json();
                setTrees(data);
            }
        } catch (error) {
            console.error('Error fetching trees:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem' }}>
            {/* Header */}
            <ScrollAnimation animation="fade-up">
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/" style={{ color: '#166534', textDecoration: 'none' }}>
                        ← กลับหน้าหลัก
                    </Link>
                </div>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span style={{ color: '#f87171', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Best Sellers
                    </span>
                    <h1 style={{
                        fontSize: '3rem',
                        marginTop: '0.5rem',
                        fontWeight: 'bold',
                        fontFamily: 'var(--font-playfair), serif',
                        color: '#1f2937'
                    }}>
                        ต้นไม้ที่ขายดีที่สุด
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '1rem' }}>
                        ยอดนิยม อันดับหนึ่งของร้านเรา
                    </p>
                </div>
            </ScrollAnimation>

            {/* Category Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <ScrollAnimation animation="slide-in-left" delay={100}>
                    <Link href="/weekly-best-sellers" style={{ textDecoration: 'none' }}>
                        <div style={{
                            backgroundColor: '#1f2937',
                            borderRadius: '16px',
                            padding: '2rem',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            minHeight: '200px',
                            gap: '1.5rem',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                            className="hover:shadow-xl hover:-translate-y-1"
                        >
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '2rem', marginBottom: '0.5rem' }}>ขายดีสัปดาห์นี้</h3>
                                <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.5rem' }}>สินค้ายอดนิยมประจำสัปดาห์</p>
                                <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '1.5rem' }}>7 วันที่ผ่านมา</p>
                            </div>
                        </div>
                    </Link>
                </ScrollAnimation>
                <ScrollAnimation animation="slide-in-right" delay={100}>
                    <div style={{
                        backgroundColor: '#fef3c7',
                        borderRadius: '16px',
                        padding: '2rem',
                        color: '#433422',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        minHeight: '200px',
                        gap: '1.5rem'
                    }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '2rem', marginBottom: '0.5rem' }}>ต้นไม้ที่ขายดีที่สุด</h3>
                            <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.5rem' }}>ยอดนิยม อันดับหนึ่ง</p>
                            <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '1.5rem' }}>ของร้านเรา</p>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: '#6b7280' }}>กำลังโหลด...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {trees.map((tree, index) => {
                        // Parse images safely
                        let imageUrl = '/placeholder-tree.svg';
                        try {
                            const images = JSON.parse(tree.images);
                            if (images && images.length > 0) {
                                imageUrl = images[0];
                            }
                        } catch {
                            // Use placeholder if parsing fails
                        }

                        return (
                            <ScrollAnimation key={tree.id} animation="fade-up" delay={index * 100}>
                                <Link href={`/trees/${tree.id}`} className="group" style={{ textDecoration: 'none' }}>
                                    <Card style={{
                                        border: 'none',
                                        boxShadow: 'none',
                                        backgroundColor: '#f9fafb',
                                        overflow: 'hidden',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                        className="hover:shadow-xl hover:-translate-y-2"
                                    >
                                        <div style={{ position: 'relative', height: '320px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                                            <img
                                                src={imageUrl}
                                                alt={tree.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />

                                            {/* Hover Action Overlay */}
                                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            </div>

                                            {/* Favorite Button */}
                                            <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
                                                <FavoriteButton treeId={tree.id} size="md" />
                                            </div>

                                            {/* Best Seller Badge */}
                                            {index < 5 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '15px',
                                                    left: '15px',
                                                    backgroundColor: '#ef4444',
                                                    color: 'white',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    ขายดี #{index + 1}
                                                </div>
                                            )}
                                        </div>

                                        <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', marginBottom: '0.5rem', color: '#1f2937' }}>{tree.name}</h3>
                                            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</p>
                                            <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f87171' }}>฿{tree.price.toLocaleString()}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </ScrollAnimation>
                        );
                    })}
                </div>
            )}

            {trees.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>ไม่พบสินค้า</p>
                </div>
            )}
        </div>
    );
}
