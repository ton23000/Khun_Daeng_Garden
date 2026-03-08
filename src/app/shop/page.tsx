'use client';

import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import AdvancedFilters, { FilterState } from '@/components/AdvancedFilters';
import FavoriteButton from '@/components/FavoriteButton';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_TREES } from '@/lib/mock-data';
import { getFirstImageUrl } from '@/lib/imageUtils';

interface Tree {
    id: string;
    name: string;
    price: number;
    category: string;
    status: string;
    images: string;
    tags: string | string[];
    stock: number;
    reserved: number;
    rating: number;
    reviewCount: number;
    isPromotion?: boolean;
    originalPrice?: number | null;
}

function ShopContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [trees, setTrees] = useState<Tree[]>([]);
    const [filteredTrees, setFilteredTrees] = useState<Tree[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTrees = useCallback(async () => {
        try {
            const res = await fetch('/api/trees');
            if (res.ok) {
                const data = await res.json();
                setTrees(data);
                processTreeData(data);
            } else {
                throw new Error('API response not ok');
            }
        } catch (error) {
            console.error('Failed to fetch trees, using mock data:', error);
            // Fallback to mock data
            const mockData = MOCK_TREES.map(t => ({
                ...t,
                // Ensure tags is string[] or string as per interface
                tags: t.tags ? t.tags.split(',') : []
            })) as unknown as Tree[];
            
            setTrees(mockData);
            processTreeData(mockData);
        } finally {
            // Loading state will be managed after filtering
        }
    }, []);

    useEffect(() => {
        fetchTrees();
    }, [fetchTrees]);

    const handleSearch = useCallback((query: string) => {
        let filtered = [...trees];

        if (query) {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(lowerQuery) ||
                t.category.toLowerCase().includes(lowerQuery) ||
                (t.tags && (
                    typeof t.tags === 'string'
                        ? t.tags.toLowerCase().includes(lowerQuery)
                        : Array.isArray(t.tags) && t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
                ))
            );
        }

        setFilteredTrees(filtered);
        setIsLoading(false);
    }, [trees]);

    // Filter whenever query or trees change
    useEffect(() => {
        if (trees.length > 0) {
            handleSearch(initialQuery);
        }
    }, [trees, initialQuery, handleSearch]);

    
    const processTreeData = (data: Tree[]) => {
         // Extract unique categories - categories are simple strings, not comma-separated
         const uniqueCategories = Array.from(new Set(data.map((t: Tree) => t.category).filter(Boolean))).sort() as string[];
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
    };

    const handleFilterChange = (filters: FilterState) => {
        let filtered = [...trees];

        // Always apply URL search query first
        if (initialQuery) {
            const lowerQuery = initialQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(lowerQuery) ||
                t.category.toLowerCase().includes(lowerQuery) ||
                (t.tags &&
                    (typeof t.tags === 'string'
                        ? t.tags.toLowerCase().includes(lowerQuery)
                        : Array.isArray(t.tags) && t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))))
            );
        }

        // Filter by price
        if (filters.minPrice) {
            filtered = filtered.filter(t => t.price >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(t => t.price <= Number(filters.maxPrice));
        }

        // Filter by categories
        if (filters.selectedCategories.length > 0) {
            filtered = filtered.filter(t => {
                return filters.selectedCategories.includes(t.category);
            });
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
        setIsLoading(false);
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                {filteredTrees.map((tree, index) => {
                    // Get first image from array using utility
                    const imageUrl = getFirstImageUrl(tree.images);

                    return (
                        <ScrollAnimation key={tree.id} animation="fade-up" delay={index * 100} style={{ height: '100%' }}>
                            <Link href={`/trees/${tree.id}`} className="group" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                                <Card style={{
                                    border: 'none',
                                    boxShadow: 'none',
                                    backgroundColor: 'white',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    opacity: tree.status === 'AVAILABLE' ? 1 : 0.8,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%'
                                }}
                                    className="hover-card"
                                >
                                    <div style={{ position: 'relative', aspectRatio: '4/5', backgroundColor: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img
                                            src={imageUrl}
                                            alt={tree.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />

                                        {/* Low / Out of Stock Indicator */}
                                        {(tree.stock - tree.reserved <= 0) ? (
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                left: 0,
                                                backgroundColor: '#4b5563', // gray-600
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderTopRightRadius: '12px',
                                                borderBottomRightRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                zIndex: 5
                                            }}>
                                                สินค้าหมด
                                            </div>
                                        ) : ((tree.stock - tree.reserved > 0 && tree.stock - tree.reserved <= 3)) && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                left: 0,
                                                backgroundColor: '#ef4444', // red-500
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderTopRightRadius: '12px',
                                                borderBottomRightRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                zIndex: 5
                                            }}>
                                                สินค้ามีน้อย
                                            </div>
                                        )}

                                        {/* HOT Ribbon */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: '60px',
                                            height: '60px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '-20px',
                                                transform: 'rotate(45deg)',
                                                backgroundColor: '#f97316',
                                                background: 'linear-gradient(90deg, #ea580c 0%, #f97316 100%)',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                padding: '2px 30px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                HOT
                                            </div>
                                        </div>

                                        {/* Original Badges Context */}
                                        <div style={{ position: 'absolute', top: '40px', left: '10px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            {tree.status === 'BOOKED' && (
                                                <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>
                                                    จองแล้ว
                                                </div>
                                            )}
                                        </div>

                                        {/* Sale Badge */}
                                        {tree.isPromotion && tree.originalPrice && tree.originalPrice > tree.price && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '40px',
                                                left: 0,
                                                backgroundColor: '#dc2626',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderTopRightRadius: '12px',
                                                borderBottomRightRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                zIndex: 5,
                                                boxShadow: '0 2px 8px rgba(220,38,38,0.3)'
                                            }}>
                                                -{Math.round(((tree.originalPrice - tree.price) / tree.originalPrice) * 100)}%
                                            </div>
                                        )}

                                        {/* Favorite Button Overlay */}
                                        <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10 }}>
                                            <FavoriteButton treeId={tree.id} size="sm" />
                                        </div>
                                    </div>

                                    <CardContent style={{ padding: '0.75rem', textAlign: 'left', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-prompt), sans-serif', color: '#115e59', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tree.name}</h3>
                                        <p style={{ fontSize: '0.9rem', color: tree.isPromotion ? '#dc2626' : '#6b7280', fontWeight: tree.isPromotion ? 'bold' : 'normal', marginBottom: '0.75rem' }}>
                                            ฿ {tree.price.toLocaleString()}
                                            {tree.isPromotion && tree.originalPrice && tree.originalPrice > tree.price && (
                                                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textDecoration: 'line-through', marginLeft: '0.5rem', fontWeight: 'normal' }}>
                                                    ฿{tree.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </p>

                                        <div style={{ marginTop: 'auto' }}>
                                            <div style={{ border: '1px solid #10b981', color: '#10b981', padding: '0.4rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold', width: '100%' }}>
                                                จองเลย
                                            </div>
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

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}><p>กำลังโหลด...</p></div>}>
            <ShopContent />
        </Suspense>
    );
}
