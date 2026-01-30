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
            {/* Search and Sort */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexGrow: 1, maxWidth: '400px' }}>
                    <Input
                        placeholder="ค้นหาชื่อต้นไม้..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>ค้นหา</Button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>เรียงตาม:</label>
                    <select
                        value={currentSort}
                        onChange={(e) => updateParams({ sort: e.target.value })}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #d1d5db',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="newest">มาใหม่ล่าสุด</option>
                        <option value="price_asc">ราคา: ต่ำ - สูง</option>
                        <option value="price_desc">ราคา: สูง - ต่ำ</option>
                    </select>
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>หมวดหมู่:</h3>
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
    );
}
