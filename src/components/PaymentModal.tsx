'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (fileData: string) => void;
}

export default function PaymentModal({ isOpen, onClose, onUpload }: PaymentModalProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (preview) {
            onUpload(preview);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
            <Card style={{ width: '90%', maxWidth: '400px', backgroundColor: 'white' }}>
                <CardHeader>
                    <CardTitle>แนบสลิปการโอนเงิน</CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '2rem',
                            textAlign: 'center', cursor: 'pointer', position: 'relative'
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    opacity: 0, cursor: 'pointer'
                                }}
                            />
                            {preview ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img src={preview} alt="Slip Preview" style={{ maxHeight: '200px', objectFit: 'contain', marginBottom: '0.5rem' }} />
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{fileName}</p>
                                </div>
                            ) : (
                                <div>
                                    <p style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>📎</p>
                                    <p style={{ color: '#4b5563' }}>คลิกเพื่อเลือกรูปภาพ</p>
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>JPG, PNG (Max 5MB)</p>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
                            <Button variant="primary" onClick={handleSubmit} disabled={!preview}>ยืนยันการแนบสลิป</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
