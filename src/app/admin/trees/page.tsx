'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TagInput } from '@/components/TagInput';

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
}

export default function AdminTreesPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [trees, setTrees] = useState<Tree[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTree, setEditingTree] = useState<Tree | null>(null);

    // Derived state for suggestions
    const allTags = Array.from(new Set(trees.flatMap(t => t.tags || [])));
    const allCategories = Array.from(new Set(trees.map(t => t.category)));

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        images: '', // Comma separated for simplicity in this demo
        tags: [] as string[],
        growthTime: ''
    });

    useEffect(() => {
        if (isAuthLoading) return; // Wait for auth to load
        if (!user || user.role !== 'admin') {
            router.push('/admin/login');
            return;
        }
        fetchTrees();
    }, [user, isAuthLoading, router]);

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
        if (!confirm('Are you sure you want to delete this tree?')) return;

        try {
            const res = await fetch(`/api/trees/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchTrees();
            }
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            images: formData.images.split(',').map(s => s.trim()).filter(s => s),
            tags: formData.tags // Already an array
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
        setFormData({ name: '', description: '', price: 0, category: '', images: '', tags: [], growthTime: '' });
    };

    const openEdit = (tree: Tree) => {
        setEditingTree(tree);
        setFormData({
            name: tree.name,
            description: tree.description,
            price: tree.price,
            category: tree.category,
            images: tree.images.join(','),
            tags: tree.tags || [],
            growthTime: tree.growthTime || ''
        });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingTree(null);
        resetForm();
        setIsModalOpen(true);
    };

    // Show loading state while checking auth
    if (isAuthLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>จัดการต้นไม้ (Manage Trees)</h1>
                <Button variant="primary" onClick={openAdd}>+ เพิ่มต้นไม้ใหม่</Button>
            </div>

            <Card>
                <CardContent style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>รูปภาพ</th>
                                <th style={{ padding: '1rem' }}>ชื่อ</th>
                                <th style={{ padding: '1rem' }}>หมวดหมู่</th>
                                <th style={{ padding: '1rem' }}>Tags</th>
                                <th style={{ padding: '1rem' }}>ระยะเวลา</th>
                                <th style={{ padding: '1rem' }}>ราคา</th>
                                <th style={{ padding: '1rem' }}>สถานะ</th>
                                <th style={{ padding: '1rem' }}>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
                            ) : trees.length === 0 ? (
                                <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center' }}>ไม่มีข้อมูลต้นไม้</td></tr>
                            ) : (
                                trees.map(tree => (
                                    <tr key={tree.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <img src={tree.images[0] || '/placeholder-tree.jpg'} alt={tree.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{tree.name}</td>
                                        <td style={{ padding: '1rem' }}>{tree.category}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div className="flex flex-wrap gap-1">
                                                {tree.tags?.slice(0, 3).map(t => (
                                                    <span key={t} className="text-xs bg-gray-100 px-1 rounded">{t}</span>
                                                ))}
                                                {tree.tags?.length > 3 && <span className="text-xs text-gray-500">+{tree.tags.length - 3}</span>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{tree.growthTime || '-'}</td>
                                        <td style={{ padding: '1rem' }}>฿{tree.price.toLocaleString()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem',
                                                backgroundColor: tree.status === 'AVAILABLE' ? '#dcfce7' : '#f3f4f6',
                                                color: tree.status === 'AVAILABLE' ? '#166534' : '#374151'
                                            }}>
                                                {tree.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
                }}>
                    <Card style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
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
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <Input label="ราคา (บาท)" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />

                                    <div>
                                        <label className="block text-sm font-medium mb-1">หมวดหมู่</label>
                                        <input
                                            list="categories"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="เลือกหรือพิมพ์หมวดหมู่ใหม่"
                                            required
                                        />
                                        <datalist id="categories">
                                            {allCategories.map(cat => (
                                                <option key={cat} value={cat} />
                                            ))}
                                        </datalist>
                                    </div>
                                </div>
                                <Input label="ระยะเวลาเติบโต (เช่น 1-2 อาทิตย์)" value={formData.growthTime} onChange={e => setFormData({ ...formData, growthTime: e.target.value })} />
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">รูปภาพ</label>
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
                                            style={{ display: 'none' }}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const uploadFormData = new FormData();
                                                uploadFormData.append('file', file);

                                                try {
                                                    // Show loading state if possible (optional here for simplicity)
                                                    const res = await fetch('/api/upload', {
                                                        method: 'POST',
                                                        body: uploadFormData
                                                    });
                                                    if (res.ok) {
                                                        const data = await res.json();
                                                        setFormData(prev => ({ ...prev, images: data.url }));
                                                    } else {
                                                        alert('Upload failed');
                                                    }
                                                } catch (error) {
                                                    console.error('Error uploading:', error);
                                                    alert('Error uploading file');
                                                }
                                            }}
                                        />

                                        {formData.images ? (
                                            <div className="relative">
                                                <img
                                                    src={formData.images.split(',')[0]}
                                                    alt="Preview"
                                                    style={{
                                                        maxHeight: '150px',
                                                        margin: '0 auto',
                                                        borderRadius: '0.5rem',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                />
                                                <div style={{ marginTop: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                                                    <span style={{ fontWeight: 'bold' }}>คลิกเพื่อเปลี่ยนรูป</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                                                <p className="text-sm text-gray-500 font-medium">คลิกเพื่ออัปโหลดรูปภาพ</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Tags</label>
                                    <TagInput
                                        value={formData.tags}
                                        onChange={tags => setFormData({ ...formData, tags })}
                                        suggestions={allTags}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
                                    <Button type="submit" variant="primary">บันทึก</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
