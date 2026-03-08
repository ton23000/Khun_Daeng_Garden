'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TagInput } from '@/components/TagInput';
import { SearchBar } from '@/components/admin/SearchBar';
import { SortableTableHeader } from '@/components/admin/SortableTableHeader';

interface Tree {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    status: string;
    images: string[];
    tags: string[];
    growthTime?: string;
    stock?: number;
    reserved?: number;
    sold?: number;
    isPromotion?: boolean;
    originalPrice?: number | null;
    promotionName?: string | null;
    promotionEndDate?: string | null;
}

export default function AdminTreesPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [trees, setTrees] = useState<Tree[]>([]);
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Category Modal State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [editingTree, setEditingTree] = useState<Tree | null>(null);

    // Derived state for suggestions
    const allTags = Array.from(new Set(trees.flatMap(t => t.tags || [])));
    // allCategories is now replaced by 'categories' state

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        images: [] as string[],
        tags: [] as string[],
        growthTime: '',
        isPromotion: false,
        originalPrice: 0,
        promotionName: '',
        promotionEndDate: '',
        stock: 0
    });

    // Promotion specific UI states
    const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
    const [discountValue, setDiscountValue] = useState<number>(0);

    useEffect(() => {
        if (isAuthLoading) return;
        if (!user || user.role !== 'admin') {
            router.push('/login');
            return;
        }
        fetchTrees();
        fetchCategories();
    }, [user, isAuthLoading, router]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName })
            });

            if (res.ok) {
                const newCat = await res.json();
                setCategories([...categories, newCat]);
                setFormData({ ...formData, category: formData.category ? formData.category + ',' + newCat.name : newCat.name });
                setIsCategoryModalOpen(false);
                setNewCategoryName('');
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to add category');
            }
        } catch (error) {
            console.error('Failed to add category', error);
            alert('Error adding category');
        }
    };

    // ... (rest of the file content until render)

    // Inside the Form render in Modal:
    /*
                                    <div>
                                        <label className="block text-sm font-medium mb-1">หมวดหมู่</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            >
                                                <option value="">-- เลือกหมวดหมู่ --</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                            <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(true)} title="เพิ่มหมวดหมู่ใหม่">+</Button>
                                        </div>
                                    </div>
    */

    // ...

    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filteredTrees, setFilteredTrees] = useState<Tree[]>([]);
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });

    useEffect(() => {
        filterAndSortTrees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trees, searchQuery, sortConfig, priceFilter]);

    const filterAndSortTrees = () => {
        let result = [...trees];

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.category.toLowerCase().includes(query) ||
                t.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Filter by price range
        if (priceFilter.min) {
            result = result.filter(t => t.price >= Number(priceFilter.min));
        }
        if (priceFilter.max) {
            result = result.filter(t => t.price <= Number(priceFilter.max));
        }

        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                let aValue: string | number = 0;
                let bValue: string | number = 0;

                switch (sortConfig.key) {
                    case 'name':
                        aValue = a.name;
                        bValue = b.name;
                        break;
                    case 'category':
                        aValue = a.category;
                        bValue = b.category;
                        break;
                    case 'price':
                        aValue = a.price;
                        bValue = b.price;
                        break;
                    case 'status':
                        // Sort by status priority: Out (0) < Low (1) < Available (2)
                        const aAvail = (a.stock || 0) - (a.reserved || 0);
                        const bAvail = (b.stock || 0) - (b.reserved || 0);

                        const getStatusValue = (avail: number) => {
                            if (avail <= 0) return 0; // Out of stock
                            if (avail < 5) return 1;  // Low stock
                            return 2;                 // Available
                        };

                        aValue = getStatusValue(aAvail);
                        bValue = getStatusValue(bAvail);
                        break;
                    case 'stock':
                        aValue = a.stock || 0;
                        bValue = b.stock || 0;
                        break;
                    default:
                        return 0;
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredTrees(result);
    };

    const handleSort = (key: string) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const fetchTrees = async () => {
        try {
            const res = await fetch('/api/trees');
            if (res.ok) {
                const data = await res.json();
                setTrees(data);
            }
        } catch (error) {
            console.error('Failed to fetch trees', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบต้นไม้นี้?')) return;

        try {
            const res = await fetch(`/api/trees/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchTrees();
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'ไม่สามารถลบต้นไม้ได้');
            }
        } catch (error) {
            console.error('Failed to delete', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation for promotion
        if (formData.isPromotion) {
            if (formData.price <= 0) {
                alert('ราคาปัจจุบันต้องมากกว่า 0');
                return;
            }
            
            if (!formData.originalPrice || formData.originalPrice <= 0) {
                alert('ราคาเดิมต้องมากกว่า 0 ในโปรโมชั่น');
                return;
            }
            
            if (formData.originalPrice <= formData.price) {
                alert('ราคาเดิมต้องมากกว่าราคาปัจจุบันในโปรโมชั่น');
                return;
            }
        }
        
        const payload = {
            ...formData,
            images: formData.images, // Already an array
            tags: formData.tags
        };

        try {
            let res;
            if (editingTree) {
                res = await fetch(`/api/trees/${editingTree.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('/api/trees', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                alert(editingTree ? 'แก้ไขข้อมูลต้นไม้เรียบร้อยแล้ว' : 'เพิ่มต้นไม้ใหม่เรียบร้อยแล้ว');
                setIsModalOpen(false);
                setEditingTree(null);
                resetForm();
                fetchTrees();
            } else {
                const errorData = await res.json();
                alert(`เกิดข้อผิดพลาด: ${errorData.error || 'ไม่สามารถบันทึกข้อมูลได้'}`);
            }
        } catch (error) {
            console.error('Failed to save', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: 0, category: '', images: [], tags: [], growthTime: '', isPromotion: false, originalPrice: 0, promotionName: '', promotionEndDate: '', stock: 0 });
    };

    const openEdit = (tree: Tree) => {
        setEditingTree(tree);
        setFormData({
            name: tree.name,
            description: tree.description,
            price: tree.price,
            category: tree.category,
            images: tree.images || [],
            tags: tree.tags || [],
            growthTime: tree.growthTime || '',
            isPromotion: tree.isPromotion || false,
            originalPrice: tree.originalPrice || 0,
            promotionName: tree.promotionName || '',
            promotionEndDate: tree.promotionEndDate ? new Date(tree.promotionEndDate).toISOString().split('T')[0] : '',
            stock: tree.stock || 0
        });

        // Initialize promotion UI states
        if (tree.isPromotion && tree.originalPrice && tree.originalPrice > 0) {
            setDiscountType('percent');
            setDiscountValue(Math.round((1 - tree.price / tree.originalPrice) * 100));
        } else {
            setDiscountType('percent');
            setDiscountValue(0);
        }

        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingTree(null);
        resetForm();
        setDiscountType('percent');
        setDiscountValue(0);
        setIsModalOpen(true);
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    // Show loading state while checking auth
    if (isAuthLoading) {
        return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>จัดการต้นไม้ (Manage Trees)</h1>
                <Button variant="primary" onClick={openAdd}>+ เพิ่มต้นไม้ใหม่</Button>
            </div>

            {/* Search and Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <SearchBar
                        placeholder="ค้นหาชื่อต้นไม้, หมวดหมู่, tags..."
                        onSearch={setSearchQuery}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="number"
                        placeholder="ราคาต่ำสุด"
                        value={priceFilter.min}
                        onChange={(e) => setPriceFilter({ ...priceFilter, min: e.target.value })}
                        style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', width: '120px' }}
                    />
                    <input
                        type="number"
                        placeholder="ราคาสูงสุด"
                        value={priceFilter.max}
                        onChange={(e) => setPriceFilter({ ...priceFilter, max: e.target.value })}
                        style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', width: '120px' }}
                    />
                </div>
            </div>

            <Card>
                <CardContent style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>รูปภาพ</th>
                                <SortableTableHeader
                                    label="ชื่อ"
                                    sortKey="name"
                                    currentSort={sortConfig}
                                    onSort={handleSort}
                                />
                                <SortableTableHeader
                                    label="หมวดหมู่"
                                    sortKey="category"
                                    currentSort={sortConfig}
                                    onSort={handleSort}
                                />
                                <th style={{ padding: '1rem' }}>Tags</th>
                                <th style={{ padding: '1rem' }}>ระยะเวลา</th>
                                <SortableTableHeader
                                    label="ราคา"
                                    sortKey="price"
                                    currentSort={sortConfig}
                                    onSort={handleSort}
                                />
                                <th style={{ padding: '1rem' }}>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>กำลังโหลด...</td></tr>
                            ) : filteredTrees.length === 0 ? (
                                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>ไม่พบข้อมูลต้นไม้</td></tr>
                            ) : (
                                filteredTrees.map(tree => (
                                    <tr key={tree.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <img src={tree.images[0] || '/placeholder-tree.svg'} alt={tree.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                                            {tree.images.length > 1 && <span className="text-xs text-gray-500 ml-1">+{tree.images.length - 1}</span>}
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{tree.name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div className="flex flex-wrap gap-1">
                                                {tree.category?.split(',').map(c => c.trim()).filter(Boolean).map((c, i) => (
                                                    <span key={i} style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '9999px', display: 'inline-block' }}>{c}</span>
                                                ))}
                                                {!tree.category && <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</span>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                                {tree.tags?.flatMap(t => t.split(',')).map(t => t.trim()).filter(Boolean).slice(0, 3).map((t, i) => (
                                                    <span key={i} style={{ fontSize: '0.75rem', backgroundColor: '#f3f4f6', color: '#374151', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>{t}</span>
                                                ))}
                                                {tree.tags?.flatMap(t => t.split(',')).filter(Boolean).length > 3 && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>+{tree.tags.flatMap(t => t.split(',')).filter(Boolean).length - 3}</span>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{tree.growthTime || '-'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>฿{tree.price.toLocaleString()}</span>
                                                {tree.isPromotion && (
                                                    <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.125rem 0.375rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: 'bold' }}>SALE</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <Button size="sm" variant="outline" onClick={() => openEdit(tree)}>แก้ไข</Button>
                                                <Button size="sm" variant="outline" onClick={() => handleDelete(tree.id)} style={{ borderColor: '#ef4444', color: '#ef4444' }}>ลบ</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <Card style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <CardHeader>
                            <CardTitle>{editingTree ? 'แก้ไขต้นไม้' : 'เพิ่มต้นไม้ใหม่'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Input label="ชื่อต้นไม้" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>รายละเอียด</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                        rows={3}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <Input 
                                        label="ราคา (บาท)" 
                                        type="number" 
                                        value={formData.price} 
                                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} 
                                        min="0"
                                        required 
                                    />
                                    <Input label="สต็อกสินค้า" type="number" value={formData.stock || 0} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} required />

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                            <label className="block text-sm font-medium">หมวดหมู่</label>
                                            <Button type="button" variant="outline" size="sm" onClick={() => setIsCategoryModalOpen(true)} title="เพิ่มหมวดหมู่ใหม่" style={{ fontSize: '1rem', padding: '0 0.5rem', height: 'auto' }}>+</Button>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                                            {Array.from(new Set([...categories.map(c => c.name), ...(formData.category ? formData.category.split(',').map(c => c.trim()).filter(Boolean) : [])])).sort().map(catName => {
                                                const currentCats = formData.category ? formData.category.split(',').map(c => c.trim()).filter(Boolean) : [];
                                                const isSelected = currentCats.includes(catName);
                                                return (
                                                    <label key={catName} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: isSelected ? '#dcfce7' : '#f3f4f6', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.875rem' }} title={catName}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => {
                                                                if (isSelected) {
                                                                    setFormData({ ...formData, category: currentCats.filter(c => c !== catName).join(',') });
                                                                } else {
                                                                    setFormData({ ...formData, category: [...currentCats, catName].join(',') });
                                                                }
                                                            }}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <span style={{ color: isSelected ? '#166534' : '#374151', fontWeight: isSelected ? 'bold' : 'normal' }}>{catName}</span>
                                                    </label>
                                                );
                                            })}
                                            {categories.length === 0 && <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>ยังไม่มีหมวดหมู่</span>}
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">ระยะเวลาเติบโต</label>
                                    <select
                                        value={formData.growthTime}
                                        onChange={e => setFormData({ ...formData, growthTime: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">-- ไม่ระบุ --</option>
                                        <optgroup label="เป็นอาทิตย์">
                                            <option value="1 อาทิตย์">1 อาทิตย์</option>
                                            <option value="2 อาทิตย์">2 อาทิตย์</option>
                                            <option value="3 อาทิตย์">3 อาทิตย์</option>
                                            <option value="4 อาทิตย์">4 อาทิตย์</option>
                                        </optgroup>
                                        <optgroup label="เป็นเดือน">
                                            <option value="1 เดือน">1 เดือน</option>
                                            <option value="2 เดือน">2 เดือน</option>
                                            <option value="3 เดือน">3 เดือน</option>
                                            <option value="4 เดือน">4 เดือน</option>
                                            <option value="5 เดือน">5 เดือน</option>
                                            <option value="6 เดือน">6 เดือน</option>
                                            <option value="7 เดือน">7 เดือน</option>
                                            <option value="8 เดือน">8 เดือน</option>
                                            <option value="9 เดือน">9 เดือน</option>
                                            <option value="10 เดือน">10 เดือน</option>
                                            <option value="11 เดือน">11 เดือน</option>
                                            <option value="12 เดือน">12 เดือน</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">รูปภาพ ({formData.images.length} รูป)</label>
                                    <label
                                        style={{
                                            border: '2px dashed #d1d5db',
                                            borderRadius: '0.5rem',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            display: 'block',
                                            cursor: 'pointer',
                                            backgroundColor: '#f9fafb',
                                            transition: 'all 0.2s'
                                        }}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            style={{ display: 'none' }}
                                            onChange={async (e) => {
                                                const files = e.target.files;
                                                if (!files || files.length === 0) return;

                                                const uploadFormData = new FormData();
                                                for (let i = 0; i < files.length; i++) {
                                                    uploadFormData.append('images', files[i]);
                                                }

                                                try {
                                                    const res = await fetch('/api/upload/images', {
                                                        method: 'POST',
                                                        body: uploadFormData
                                                    });
                                                    if (res.ok) {
                                                        const data = await res.json();
                                                        if (data.urls) {
                                                            setFormData(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
                                                        } else if (data.url) {
                                                            // Fallback for single file response just in case
                                                            setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
                                                        }
                                                    } else {
                                                        alert('Upload failed');
                                                    }
                                                } catch (error) {
                                                    console.error('Error uploading:', error);
                                                    alert('Error uploading file');
                                                }
                                            }}
                                        />
                                        <div>
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                                            <p className="text-sm text-gray-500 font-medium">คลิกเพื่อเพิ่มรูปภาพ (เลือกได้หลายรูป)</p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                        </div>
                                    </label>

                                    {/* Image Previews */}
                                    {formData.images.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2 mt-4">
                                            {formData.images.map((imgUrl, index) => (
                                                <div key={index} className="relative group" style={{ width: '100px', height: '100px', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
                                                    <img
                                                        src={imgUrl}
                                                        alt={`Preview ${index}`}
                                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="ลบรูปนี้"
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Tags</label>
                                    <TagInput
                                        value={formData.tags}
                                        onChange={tags => setFormData({ ...formData, tags })}
                                        suggestions={allTags}
                                    />
                                </div>

                                {/* Promotion Section */}
                                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.isPromotion}
                                                onChange={e => setFormData({ ...formData, isPromotion: e.target.checked })}
                                                style={{ width: '18px', height: '18px', accentColor: '#dc2626' }}
                                            />
                                            <span style={{ fontWeight: 'bold', color: '#dc2626', fontSize: '1rem' }}>🔥 เปิดโปรโมชั่น</span>
                                        </label>

                                        {formData.isPromotion && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#059669' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }}></div>
                                                <span>กำลังตั้งโปรโมชั่น</span>
                                            </div>
                                        )}
                                    </div>

                                    {formData.isPromotion && (
                                        <div style={{ display: 'grid', gap: '1.25rem', padding: '1.5rem', backgroundColor: '#fef2f2', borderRadius: '0.75rem', border: '1px solid #fecaca' }}>
                                            {/* Discount Type Selection */}
                                            <div>
                                                <label style={{ display: 'block', fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '0.5rem' }}>ประเภทส่วนลด</label>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        type="button"
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
                                                        type="button"
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

                                            {/* Discount Value Input */}
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
                                                            fontWeight: 'bold',
                                                            backgroundColor: 'white'
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
                                            </div>

                                            {/* Promotion Details */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <Input
                                                    label="ราคาเดิม (บาท)"
                                                    type="number"
                                                    value={formData.originalPrice}
                                                    onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                                                    min="0"
                                                    required={formData.isPromotion}
                                                    style={{ backgroundColor: 'white' }}
                                                />
                                                <Input
                                                    label="ราคาขาย (บาท)"
                                                    type="number"
                                                    value={formData.price}
                                                    readOnly
                                                    style={{ backgroundColor: '#f9fafb' }}
                                                />
                                            </div>

                                            <div>
                                                <Input
                                                    label="ชื่อโปรโมชั่น (ไม่บังคับ)"
                                                    value={formData.promotionName}
                                                    onChange={e => setFormData({ ...formData, promotionName: e.target.value })}
                                                    placeholder="เช่น Valentine Sale, ลดกระหน่ำ"
                                                    style={{ backgroundColor: 'white' }}
                                                />
                                            </div>

                                            <div>
                                                <Input
                                                    label="วันหมดอายุโปร (ไม่บังคับ)"
                                                    type="date"
                                                    value={formData.promotionEndDate}
                                                    onChange={e => setFormData({ ...formData, promotionEndDate: e.target.value })}
                                                    style={{ backgroundColor: 'white' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
                                    <Button type="submit" variant="primary">บันทึก</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )
            }

            {/* Category Modal */}
            {
                isCategoryModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60
                    }}>
                        <Card style={{ width: '90%', maxWidth: '400px', backgroundColor: 'white' }}>
                            <CardHeader>
                                <CardTitle>เพิ่มหมวดหมู่ใหม่</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <Input
                                        label="ชื่อหมวดหมู่"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        placeholder="เช่น ไม้มงคล, ไม้ประดับ"
                                        required
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)}>ยกเลิก</Button>
                                        <Button type="submit" variant="primary">บันทึก</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )
            }
        </div >
    );
}
