'use client';

import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import AdvancedFilters, { FilterState } from '@/components/AdvancedFilters';
import { useState, useEffect } from 'react';

interface Tree {
    id: string;
    name: string;
    price: number;
    category: string;
    status: string;
    images: string;
    tags: string;
    stock: number;
    reserved: number;
    rating: number;
    reviewCount: number;
}

export default function ShopPage() {
    const [trees, setTrees] = useState<Tree[]>([]);
    const [filteredTrees, setFilteredTrees] = useState<Tree[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTrees();
    }, []);

    const fetchTrees = async () => {
        try {
            const res = await fetch('/api/trees');
            if (res.ok) {
                const data = await res.json();
                setTrees(data);
                setFilteredTrees(data);

                // Extract unique categories
                const uniqueCategories = Array.from(new Set(data.map((t: Tree) => t.category))).filter(Boolean) as string[];
                setCategories(uniqueCategories);

                // Extract all tags
                const tagsSet = new Set<string>();
                data.forEach((t: Tree) => {
                    if (t.tags) {
                        // Handle both string and array types
                        const treeTags = Array.isArray(t.tags)
                            ? t.tags
                            : t.tags.split(',').map(tag => tag.trim()).filter(Boolean);
                        treeTags.forEach(tag => tagsSet.add(tag));
                    }
                });
                setAllTags(Array.from(tagsSet));
            }
        } catch (error) {
            console.error('Failed to fetch trees:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (filters: FilterState) => {
        let filtered = [...trees];

        // Filter by price
        if (filters.minPrice) {
            filtered = filtered.filter(t => t.price >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(t => t.price <= Number(filters.maxPrice));
        }

        // Filter by categories
        if (filters.selectedCategories.length > 0) {
            filtered = filtered.filter(t => filters.selectedCategories.includes(t.category));
        }

        // Filter by tags
        if (filters.selectedTags.length > 0) {
            filtered = filtered.filter(t => {
                // Handle both string and array types
                const treeTags = t.tags
                    ? (Array.isArray(t.tags) ? t.tags : t.tags.split(',').map(tag => tag.trim()))
                    : [];
                return filters.selectedTags.some(tag => treeTags.includes(tag));
            });
        }

        // Filter by stock
        if (filters.inStockOnly) {
            filtered = filtered.filter(t => (t.stock - t.reserved) > 0);
        }

        setFilteredTrees(filtered);
    };

    if (isLoading) {
        return (
            <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <p>กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <ScrollAnimation animation="fade-up">
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>Shop Collection</span>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontFamily: 'var(--font-playfair), serif', fontWeight: 'bold', color: 'var(--foreground)' }}>สินค้ามาใหม่</h1>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>เลือกชมและจองต้นไม้ที่คุณชื่นชอบ</p>
                </header>
            </ScrollAnimation>

            {/* Advanced Filters */}
            <AdvancedFilters
                categories={categories}
                allTags={allTags}
                onFilterChange={handleFilterChange}
            />

            {/* Results Count */}
            <div style={{ marginBottom: '1rem', color: '#6b7280' }}>
                แสดง {filteredTrees.length} จาก {trees.length} รายการ
            </div>

            {/* Product Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {filteredTrees.map((tree, index) => {
                    // Get first image from array
                    let imageUrl = '/placeholder-tree.jpg';
                    if (tree.images && Array.isArray(tree.images) && tree.images.length > 0) {
                        imageUrl = tree.images[0];
                    } else if (typeof tree.images === 'string') {
                        // Fallback: try to parse if it's a JSON string
                        try {
                            const images = JSON.parse(tree.images);
                            if (images && images.length > 0) {
                                imageUrl = images[0];
                            }
                        } catch (e) {
                            // Use placeholder if parsing fails
                        }
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
                                    cursor: 'pointer',
                                    opacity: tree.status === 'AVAILABLE' ? 1 : 0.7
                                }}
                                    className="hover:shadow-xl hover:-translate-y-2"
                                >
                                    <div style={{ position: 'relative', height: '320px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                                        <img
                                            src={imageUrl}
                                            alt={tree.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />

                                        {/* Status Badges */}
                                        <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {tree.status === 'BOOKED' && (
                                                <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                    จองแล้ว
                                                </div>
                                            )}
                                            {tree.stock - tree.reserved === 0 && (
                                                <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                    หมดสต็อก
                                                </div>
                                            )}
                                            {tree.stock - tree.reserved > 0 && tree.stock - tree.reserved < 5 && (
                                                <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                    เหลือน้อย ({tree.stock - tree.reserved})
                                                </div>
                                            )}
                                        </div>

                                        {/* Heart Icon */}
                                        <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'white', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </div>
                                    </div>

                                    <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', marginBottom: '0.5rem', color: '#1f2937' }}>{tree.name}</h3>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{tree.category}</p>
                                        {tree.rating > 0 && tree.reviewCount > 0 ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <span style={{ color: '#fbbf24', fontSize: '1rem' }}>⭐</span>
                                                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                                                    {tree.rating.toFixed(1)}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                    ({tree.reviewCount})
                                                </span>
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>ยังไม่มีรีวิว</p>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                            <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)' }}>฿{tree.price.toLocaleString()}</p>
                                            {tree.stock - tree.reserved > 0 && (
                                                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                    คงเหลือ: <span style={{ fontWeight: 600, color: tree.stock - tree.reserved < 5 ? '#f59e0b' : '#22c55e' }}>{tree.stock - tree.reserved}</span>
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </ScrollAnimation>
                    );
                })}
            </div>

            {filteredTrees.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <p style={{ fontSize: '1.125rem' }}>ไม่พบรายการต้นไม้ที่ตรงกับเงื่อนไข</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>ลองปรับตัวกรองหรือล้างการค้นหา</p>
                </div>
            )}
        </div>
    );
}
