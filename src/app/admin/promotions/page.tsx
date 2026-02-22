'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface Tree {
    id: string;
    name: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    isPromotion: boolean;
    originalPrice: number | null;
    promotionName: string | null;
    promotionEndDate: string | null;
}

type DiscountType = 'percent' | 'fixed';

export default function AdminPromotionsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [trees, setTrees] = useState<Tree[]>([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showModal, setShowModal] = useState(false);
    const [isBulk, setIsBulk] = useState(false);
    const [editingTree, setEditingTree] = useState<Tree | null>(null);

    // Form state
    const [discountType, setDiscountType] = useState<DiscountType>('percent');
    const [discountValue, setDiscountValue] = useState<number>(0);
    const [promoName, setPromoName] = useState('');
    const [promoEndDate, setPromoEndDate] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push('/login');
        } else if (user?.role === 'admin') {
            fetchTrees();
        }
    }, [user, isLoading, router]);

    const fetchTrees = async () => {
        try {
            const res = await fetch('/api/trees');
            if (res.ok) {
                const data = await res.json();
                setTrees(data);
            }
        } catch (error) {
            console.error('Failed to fetch trees:', error);
        }
    };

    // Extract unique categories
    const categories = Array.from(new Set(trees.map(t => t.category))).sort();

    const filteredTrees = trees.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoryFilter === 'all' || t.category === categoryFilter;
        return matchSearch && matchCategory;
    });

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selected.size === filteredTrees.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filteredTrees.map(t => t.id)));
        }
    };

    const openSingleEdit = (tree: Tree) => {
        setEditingTree(tree);
        setIsBulk(false);
        setDiscountType('percent');
        setDiscountValue(tree.isPromotion && tree.originalPrice ? Math.round((1 - tree.price / tree.originalPrice) * 100) : 0);
        setPromoName(tree.promotionName || '');
        setPromoEndDate(tree.promotionEndDate ? tree.promotionEndDate.split('T')[0] : '');
        setShowModal(true);
    };

    const openBulkEdit = () => {
        if (selected.size === 0) return;
        setEditingTree(null);
        setIsBulk(true);
        setDiscountType('percent');
        setDiscountValue(0);
        setPromoName('');
        setPromoEndDate('');
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        const storedUser = localStorage.getItem('khun_daeng_user');
        const userId = storedUser ? JSON.parse(storedUser).id : null;

        const treeIds = isBulk ? Array.from(selected) : (editingTree ? [editingTree.id] : []);

        try {
            for (const id of treeIds) {
                const tree = trees.find(t => t.id === id);
                if (!tree) continue;

                const currentOriginalPrice = tree.isPromotion && tree.originalPrice ? tree.originalPrice : tree.price;
                let newPrice: number;

                if (discountType === 'percent') {
                    newPrice = Math.round(currentOriginalPrice * (1 - discountValue / 100));
                } else {
                    newPrice = discountValue;
                }

                await fetch(`/api/trees/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(userId ? { 'x-user-id': userId } : {})
                    },
                    body: JSON.stringify({
                        isPromotion: true,
                        originalPrice: currentOriginalPrice,
                        price: newPrice,
                        promotionName: promoName || null,
                        promotionEndDate: promoEndDate || null
                    })
                });
            }

            await fetchTrees();
            setShowModal(false);
            setSelected(new Set());
        } catch (error) {
            console.error('Error saving promotion:', error);
            alert('เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setSaving(false);
        }
    };

    const handleRemovePromotion = async (tree: Tree) => {
        if (!confirm(`ยกเลิกโปรโมชัน "${tree.name}" ?`)) return;

        const storedUser = localStorage.getItem('khun_daeng_user');
        const userId = storedUser ? JSON.parse(storedUser).id : null;

        try {
            await fetch(`/api/trees/${tree.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(userId ? { 'x-user-id': userId } : {})
                },
                body: JSON.stringify({
                    isPromotion: false,
                    price: tree.originalPrice || tree.price,
                    originalPrice: null,
                    promotionName: null,
                    promotionEndDate: null
                })
            });
            await fetchTrees();
        } catch (error) {
            console.error('Error removing promotion:', error);
        }
    };

    const handleBulkRemovePromotion = async () => {
        if (selected.size === 0) return;
        if (!confirm(`ยกเลิกโปรโมชันสำหรับ ${selected.size} รายการ?`)) return;

        const storedUser = localStorage.getItem('khun_daeng_user');
        const userId = storedUser ? JSON.parse(storedUser).id : null;

        for (const id of selected) {
            const tree = trees.find(t => t.id === id);
            if (!tree || !tree.isPromotion) continue;

            await fetch(`/api/trees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(userId ? { 'x-user-id': userId } : {})
                },
                body: JSON.stringify({
                    isPromotion: false,
                    price: tree.originalPrice || tree.price,
                    originalPrice: null,
                    promotionName: null,
                    promotionEndDate: null
                })
            });
        }

        await fetchTrees();
        setSelected(new Set());
    };

    const getDiscountPercent = (tree: Tree) => {
        if (!tree.isPromotion || !tree.originalPrice || tree.originalPrice <= tree.price) return null;
        return Math.round((1 - tree.price / tree.originalPrice) * 100);
    };

    if (isLoading || !user) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>จัดการโปรโมชัน</h1>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selected.size > 0 && (
                        <>
                            <Button onClick={openBulkEdit} style={{ backgroundColor: '#dc2626', color: 'white' }}>
                                🏷️ ตั้งโปรโมชัน {selected.size} รายการ
                            </Button>
                            <Button onClick={handleBulkRemovePromotion} variant="outline" style={{ borderColor: '#dc2626', color: '#dc2626' }}>
                                ยกเลิกโปร {selected.size} รายการ
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Search + Category Filter */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="🔍 ค้นหาต้นไม้..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        flex: '1 1 200px',
                        maxWidth: '300px',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                    }}
                />
                <select
                    value={categoryFilter}
                    onChange={e => { setCategoryFilter(e.target.value); setSelected(new Set()); }}
                    style={{
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        minWidth: '180px'
                    }}
                >
                    <option value="all">📦 ทุกหมวดหมู่</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat} ({trees.filter(t => t.category === cat).length})</option>
                    ))}
                </select>
                {categoryFilter !== 'all' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => {
                                const catTrees = filteredTrees.map(t => t.id);
                                setSelected(new Set(catTrees));
                            }}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#e0f2fe',
                                color: '#0369a1',
                                border: '1px solid #7dd3fc',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}
                        >
                            ☑️ เลือกทั้งหมวด หมู่{categoryFilter}
                        </button>
                    </div>
                )}
            </div>

            {/* Summary */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '1rem 1.5rem', backgroundColor: '#dcfce7', borderRadius: '0.5rem', flex: '1 1 150px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>{trees.length}</div>
                    <div style={{ fontSize: '0.75rem', color: '#166534' }}>สินค้าทั้งหมด</div>
                </div>
                <div style={{ padding: '1rem 1.5rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', flex: '1 1 150px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#991b1b' }}>{trees.filter(t => t.isPromotion).length}</div>
                    <div style={{ fontSize: '0.75rem', color: '#991b1b' }}>กำลังลดราคา</div>
                </div>
                <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', flex: '1 1 150px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151' }}>{trees.filter(t => !t.isPromotion).length}</div>
                    <div style={{ fontSize: '0.75rem', color: '#374151' }}>ราคาปกติ</div>
                </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '0.75rem', textAlign: 'center', width: '40px' }}>
                                <input type="checkbox" checked={selected.size === filteredTrees.length && filteredTrees.length > 0} onChange={toggleSelectAll} />
                            </th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>รูป</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>ชื่อ</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>หมวดหมู่</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>ราคาเดิม</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>ราคาขาย</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center' }}>ส่วนลด</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center' }}>สถานะ</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center' }}>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrees.map(tree => {
                            const discount = getDiscountPercent(tree);
                            let imageUrl = '/placeholder-tree.jpg';
                            try {
                                if (tree.images && tree.images.length > 0) imageUrl = tree.images[0];
                            } catch { }

                            return (
                                <tr key={tree.id} style={{
                                    borderBottom: '1px solid #e5e7eb',
                                    backgroundColor: selected.has(tree.id) ? '#fef3c7' : 'transparent'
                                }}>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <input type="checkbox" checked={selected.has(tree.id)} onChange={() => toggleSelect(tree.id)} />
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                                            <img src={imageUrl} alt={tree.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{tree.name}</td>
                                    <td style={{ padding: '0.75rem', color: '#6b7280' }}>{tree.category}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right', color: '#6b7280', textDecoration: tree.isPromotion ? 'line-through' : 'none' }}>
                                        ฿{(tree.isPromotion && tree.originalPrice ? tree.originalPrice : tree.price).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: tree.isPromotion ? '#dc2626' : '#1f2937' }}>
                                        ฿{tree.price.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        {discount ? (
                                            <span style={{
                                                backgroundColor: '#fee2e2',
                                                color: '#dc2626',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}>-{discount}%</span>
                                        ) : (
                                            <span style={{ color: '#9ca3af' }}>—</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            backgroundColor: tree.isPromotion ? '#16a34a' : '#d1d5db',
                                            marginRight: '0.25rem'
                                        }}></span>
                                        <span style={{ fontSize: '0.75rem', color: tree.isPromotion ? '#166534' : '#9ca3af' }}>
                                            {tree.isPromotion ? 'เปิดโปร' : 'ปกติ'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => openSingleEdit(tree)}
                                                style={{
                                                    padding: '0.375rem 0.75rem',
                                                    backgroundColor: '#dc2626',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.375rem',
                                                    cursor: 'pointer',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                🏷️ ตั้งโปร
                                            </button>
                                            {tree.isPromotion && (
                                                <button
                                                    onClick={() => handleRemovePromotion(tree)}
                                                    style={{
                                                        padding: '0.375rem 0.75rem',
                                                        backgroundColor: '#f3f4f6',
                                                        color: '#6b7280',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '0.375rem',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    ยกเลิก
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setShowModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            {isBulk ? `🏷️ ตั้งโปรโมชัน ${selected.size} รายการ` : `🏷️ ตั้งโปรโมชัน: ${editingTree?.name}`}
                        </h2>

                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            {/* Discount Type */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>ประเภทส่วนลด</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => { setDiscountType('percent'); setDiscountValue(0); }}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: discountType === 'percent' ? '2px solid #dc2626' : '1px solid #d1d5db',
                                            backgroundColor: discountType === 'percent' ? '#fee2e2' : 'white',
                                            color: discountType === 'percent' ? '#dc2626' : '#374151',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ลดเป็น %
                                    </button>
                                    <button
                                        onClick={() => { setDiscountType('fixed'); setDiscountValue(0); }}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: discountType === 'fixed' ? '2px solid #dc2626' : '1px solid #d1d5db',
                                            backgroundColor: discountType === 'fixed' ? '#fee2e2' : 'white',
                                            color: discountType === 'fixed' ? '#dc2626' : '#374151',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ราคาต่อชิ้น (฿)
                                    </button>
                                </div>
                            </div>

                            {/* Discount Value */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    {discountType === 'percent' ? 'ส่วนลด (%)' : 'ราคาขาย (บาท)'}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        value={discountValue || ''}
                                        onChange={e => setDiscountValue(Number(e.target.value))}
                                        min={0}
                                        max={discountType === 'percent' ? 99 : undefined}
                                        placeholder={discountType === 'percent' ? 'เช่น 20' : 'เช่น 250'}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            paddingRight: '3rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#6b7280',
                                        fontWeight: 'bold',
                                        fontSize: '1.25rem'
                                    }}>
                                        {discountType === 'percent' ? '%' : '฿'}
                                    </span>
                                </div>

                                {/* Preview */}
                                {!isBulk && editingTree && discountValue > 0 && (
                                    <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                                        {discountType === 'percent' ? (
                                            <>ราคาเดิม ฿{(editingTree.originalPrice || editingTree.price).toLocaleString()} → <strong style={{ color: '#dc2626' }}>฿{Math.round((editingTree.originalPrice || editingTree.price) * (1 - discountValue / 100)).toLocaleString()}</strong></>
                                        ) : (
                                            <>ราคาเดิม ฿{(editingTree.originalPrice || editingTree.price).toLocaleString()} → <strong style={{ color: '#dc2626' }}>฿{discountValue.toLocaleString()}</strong> (ลด {Math.round((1 - discountValue / (editingTree.originalPrice || editingTree.price)) * 100)}%)</>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Promotion Name */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>ชื่อโปรโมชัน (ไม่บังคับ)</label>
                                <input
                                    type="text"
                                    value={promoName}
                                    onChange={e => setPromoName(e.target.value)}
                                    placeholder="เช่น Valentine Sale, ลดกระหน่ำ"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>วันหมดอายุโปร (ไม่บังคับ)</label>
                                <input
                                    type="date"
                                    value={promoEndDate}
                                    onChange={e => setPromoEndDate(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                            <Button variant="outline" onClick={() => setShowModal(false)} disabled={saving}>ยกเลิก</Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving || discountValue <= 0}
                                style={{ backgroundColor: '#dc2626', color: 'white' }}
                            >
                                {saving ? 'กำลังบันทึก...' : '✅ บันทึกโปรโมชัน'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
