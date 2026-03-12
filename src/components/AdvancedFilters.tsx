'use client';

import { useState } from 'react';
import { Button } from './ui/Button';

interface AdvancedFiltersProps {
    categories: string[];
    allTags: string[];
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    minPrice: string;
    maxPrice: string;
    selectedCategories: string[];
    selectedTags: string[];
    inStockOnly: boolean;
}

export default function AdvancedFilters({ categories, allTags, onFilterChange }: AdvancedFiltersProps) {
    const [filters, setFilters] = useState<FilterState>({
        minPrice: '',
        maxPrice: '',
        selectedCategories: [],
        selectedTags: [],
        inStockOnly: false
    });

    const [isExpanded, setIsExpanded] = useState(false);

    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);
        onFilterChange(updated);
    };

    const handleCategoryToggle = (category: string) => {
        const updated = filters.selectedCategories.includes(category)
            ? filters.selectedCategories.filter(c => c !== category)
            : [...filters.selectedCategories, category];
        handleFilterChange({ selectedCategories: updated });
    };

    const handleTagToggle = (tag: string) => {
        const updated = filters.selectedTags.includes(tag)
            ? filters.selectedTags.filter(t => t !== tag)
            : [...filters.selectedTags, tag];
        handleFilterChange({ selectedTags: updated });
    };

    const clearAllFilters = () => {
        const emptyFilters: FilterState = {
            minPrice: '',
            maxPrice: '',
            selectedCategories: [],
            selectedTags: [],
            inStockOnly: false
        };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.selectedCategories.length > 0 || filters.selectedTags.length > 0 || filters.inStockOnly;

    return (
        <div style={{ marginBottom: '2rem' }}>
            {/* Filter Toggle Button (Mobile) */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    fontWeight: 500
                }}
                className="md:hidden"
            >
                🔍 ตัวกรอง {hasActiveFilters && `(${filters.selectedCategories.length + filters.selectedTags.length + (filters.inStockOnly ? 1 : 0)})`}
            </button>

            {/* Filters Container */}
            <div
                style={{
                    display: isExpanded ? 'block' : 'none',
                    backgroundColor: '#f9fafb',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb'
                }}
                className="md:block"
            >
                {/* Header with Clear Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>ตัวกรอง</h3>
                    {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={clearAllFilters}>
                            ล้างทั้งหมด
                        </Button>
                    )}
                </div>

                {/* Price Range */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        ช่วงราคา (บาท)
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            type="number"
                            placeholder="ต่ำสุด"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem'
                            }}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="สูงสุด"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem'
                            }}
                        />
                    </div>
                </div>

                {/* Stock Availability */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}>
                        <input
                            type="checkbox"
                            checked={filters.inStockOnly}
                            onChange={(e) => handleFilterChange({ inStockOnly: e.target.checked })}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        แสดงเฉพาะสินค้าที่มีสต็อก
                    </label>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            ประเภท
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {categories.map(category => (
                                <label
                                    key={category}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.selectedCategories.includes(category)}
                                        onChange={() => handleCategoryToggle(category)}
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                    {category}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {allTags.length > 0 && (
                    <div>
                        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            Tags
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    style={{
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '9999px',
                                        border: '1px solid',
                                        borderColor: filters.selectedTags.includes(tag) ? 'var(--primary)' : '#d1d5db',
                                        backgroundColor: filters.selectedTags.includes(tag) ? 'var(--primary)' : 'white',
                                        color: filters.selectedTags.includes(tag) ? 'white' : '#4b5563',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
                <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {filters.minPrice && (
                        <span style={{
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            ราคาต่ำสุด: ฿{filters.minPrice}
                            <button onClick={() => handleFilterChange({ minPrice: '' })} style={{ cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                        </span>
                    )}
                    {filters.maxPrice && (
                        <span style={{
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            ราคาสูงสุด: ฿{filters.maxPrice}
                            <button onClick={() => handleFilterChange({ maxPrice: '' })} style={{ cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                        </span>
                    )}
                    {filters.inStockOnly && (
                        <span style={{
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            มีสต็อก
                            <button onClick={() => handleFilterChange({ inStockOnly: false })} style={{ cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                        </span>
                    )}
                    {filters.selectedCategories.map(cat => (
                        <span key={cat} style={{
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            {cat}
                            <button onClick={() => handleCategoryToggle(cat)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                        </span>
                    ))}
                    {filters.selectedTags.map(tag => (
                        <span key={tag} style={{
                            backgroundColor: '#e0e7ff',
                            color: '#3730a3',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            #{tag}
                            <button onClick={() => handleTagToggle(tag)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
