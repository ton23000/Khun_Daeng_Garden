'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import StarRating from './StarRating';

interface ReviewModalProps {
    bookingId: string;
    treeId: string;
    treeName: string;
    userId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReviewModal({
    bookingId,
    treeId,
    treeName,
    userId,
    onClose,
    onSuccess
}: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId
                },
                body: JSON.stringify({
                    bookingId,
                    treeId,
                    rating,
                    comment: comment.trim() || undefined
                })
            });

            if (res.ok) {
                alert('ขอบคุณสำหรับรีวิว!');
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || 'เกิดข้อผิดพลาด');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
            }}
            onClick={onClose}
        >
            <Card
                style={{
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <CardTitle>รีวิวสินค้า</CardTitle>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        {treeName}
                    </p>
                </CardHeader>
                <CardContent style={{ padding: '1.5rem' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Rating */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                                คะแนน
                            </label>
                            <StarRating
                                rating={rating}
                                onRatingChange={setRating}
                                size="lg"
                            />
                        </div>

                        {/* Comment */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                                ความคิดเห็น (ไม่บังคับ)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="แบ่งปันประสบการณ์ของคุณ..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
