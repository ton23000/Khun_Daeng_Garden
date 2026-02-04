'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ImageUploadProps {
    onUploadComplete: (urls: string[]) => void;
    maxFiles?: number;
    currentImages?: string[];
}

export default function ImageUpload({ onUploadComplete, maxFiles = 5, currentImages = [] }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState<string[]>(currentImages);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length + previews.length > maxFiles) {
            alert(`สามารถอัปโหลดได้สูงสุด ${maxFiles} รูป`);
            return;
        }

        setSelectedFiles(files);

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert('กรุณาเลือกรูปภาพ');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('images', file);
            });

            const res = await fetch('/api/upload/images', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                onUploadComplete([...currentImages, ...data.urls]);
                setSelectedFiles([]);
            } else {
                alert(data.error || 'เกิดข้อผิดพลาด');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลด');
        } finally {
            setUploading(false);
        }
    };

    const handleRemovePreview = (index: number) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        const newFiles = selectedFiles.filter((_, i) => i !== index - currentImages.length);

        setPreviews(newPreviews);
        setSelectedFiles(newFiles);

        // Update parent if removing existing image
        if (index < currentImages.length) {
            onUploadComplete(newPreviews.filter((_, i) => i < currentImages.length));
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                รูปภาพต้นไม้ (สูงสุด {maxFiles} รูป)
            </label>

            {/* Preview Grid */}
            {previews.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {previews.map((preview, index) => (
                        <div key={index} style={{ position: 'relative', paddingBottom: '100%', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', overflow: 'hidden' }}>
                            <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                                onClick={() => handleRemovePreview(index)}
                                style={{
                                    position: 'absolute',
                                    top: '0.25rem',
                                    right: '0.25rem',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* File Input */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    disabled={previews.length >= maxFiles}
                    style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        flex: 1
                    }}
                />
                {selectedFiles.length > 0 && (
                    <Button onClick={handleUpload} disabled={uploading}>
                        {uploading ? 'กำลังอัปโหลด...' : `อัปโหลด (${selectedFiles.length})`}
                    </Button>
                )}
            </div>

            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                รองรับไฟล์ .jpg, .png, .webp ขนาดไม่เกิน 5MB ต่อไฟล์
            </p>
        </div>
    );
}
