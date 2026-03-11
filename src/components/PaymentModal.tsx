'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (files: File[]) => void;
    maxFiles?: number;
}

export default function PaymentModal({ isOpen, onClose, onUpload, maxFiles = 3 }: PaymentModalProps) {
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).slice(0, maxFiles);
        if (files.length === 0) return;

        setSelectedFiles(files);
        const newPreviews: string[] = [];
        let loaded = 0;
        files.forEach((file, idx) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews[idx] = reader.result as string;
                loaded++;
                if (loaded === files.length) {
                    setPreviews([...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeFile = (idx: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== idx);
        const newPreviews = previews.filter((_, i) => i !== idx);
        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = () => {
        if (selectedFiles.length > 0) {
            onUpload(selectedFiles);
        }
    };

    const handleClose = () => {
        setSelectedFiles([]);
        setPreviews([]);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
            <Card style={{ width: '90%', maxWidth: '480px', backgroundColor: 'white' }}>
                <CardHeader>
                    <CardTitle>แนบสลิปการโอนเงิน</CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                            📎 แนบได้สูงสุด {maxFiles} รูป (JPG, PNG)
                        </p>

                        {/* Upload Area */}
                        <div style={{
                            border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '1.5rem',
                            textAlign: 'center', cursor: 'pointer', position: 'relative',
                            backgroundColor: '#f9fafb'
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    opacity: 0, cursor: 'pointer'
                                }}
                            />
                            <p style={{ marginBottom: '0.25rem', fontSize: '1.75rem' }}>📎</p>
                            <p style={{ color: '#4b5563', fontWeight: '500' }}>คลิกเพื่อเลือกรูปภาพ</p>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>เลือกได้สูงสุด {maxFiles} รูป</p>
                        </div>

                        {/* Preview Grid */}
                        {previews.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(previews.length, 3)}, 1fr)`, gap: '0.5rem' }}>
                                {previews.map((src, idx) => (
                                    <div key={idx} style={{ position: 'relative' }}>
                                        <img
                                            src={src}
                                            alt={`Slip ${idx + 1}`}
                                            style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}
                                        />
                                        <button
                                            onClick={() => removeFile(idx)}
                                            style={{
                                                position: 'absolute', top: '4px', right: '4px',
                                                width: '22px', height: '22px', borderRadius: '50%',
                                                backgroundColor: '#ef4444', color: 'white',
                                                border: 'none', cursor: 'pointer', fontSize: '0.75rem',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 'bold', lineHeight: 1
                                            }}
                                        >✕</button>
                                        <p style={{ fontSize: '0.7rem', color: '#6b7280', textAlign: 'center', marginTop: '0.25rem' }}>
                                            รูปที่ {idx + 1}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                            <Button variant="outline" onClick={handleClose}>ยกเลิก</Button>
                            <Button variant="primary" onClick={handleSubmit} disabled={previews.length === 0}>
                                ✅ ยืนยันการแนบสลิป ({previews.length} รูป)
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
