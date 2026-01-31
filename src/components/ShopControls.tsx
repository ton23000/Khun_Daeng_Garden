'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState, useEffect } from 'react';

interface ShopControlsProps {
    categories: string[];
}

export function ShopControls({ categories }: ShopControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('q') || '');
    const currentCategory = searchParams.get('category') || '';
    const currentSort = searchParams.get('sort') || 'newest';

    const handleSearch = () => {
        updateParams({ q: search });
    };

    const updateParams = (newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            {/* Sort and Category Filters on Same Line */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {/* Sort Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--foreground)' }}>เรียงตาม:</label>
                    <select
                        value={currentSort}
                        onChange={(e) => updateParams({ sort: e.target.value })}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            border: '1px solid var(--border)',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            color: 'var(--foreground)'
                        }}
                    >
                        <option value="newest">มาใหม่ล่าสุด</option>
                        <option value="price_asc">ราคา: ต่ำ - สูง</option>
                        <option value="price_desc">ราคา: สูง - ต่ำ</option>
                    </select>
                </div>

                {/* Category Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexGrow: 1 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--foreground)' }}>หมวดหมู่:</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => updateParams({ category: null })}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                border: '1px solid',
                                borderColor: currentCategory === '' ? 'var(--primary)' : '#e5e7eb',
                                backgroundColor: currentCategory === '' ? 'var(--primary)' : 'white',
                                color: currentCategory === '' ? 'white' : '#374151',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.875rem'
                            }}
                        >
                            ทั้งหมด
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => updateParams({ category: cat })}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '9999px',
                                    border: '1px solid',
                                    borderColor: currentCategory === cat ? 'var(--primary)' : '#e5e7eb',
                                    backgroundColor: currentCategory === cat ? 'var(--primary)' : 'white',
                                    color: currentCategory === cat ? 'white' : '#374151',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
