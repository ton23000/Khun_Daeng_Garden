'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from './ui/Button';
import StarRating from './StarRating';
import ImageUpload from './ImageUpload';

interface ReviewFormProps {
    bookingId: string;
    treeId: string;
    treeName: string;
    onSubmitSuccess?: () => void;
}

export default function ReviewForm({ bookingId, treeId, treeName, onSubmitSuccess }: ReviewFormProps) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('กรุณาให้คะแนน');
            return;
        }

        if (!user) {
            setError('กรุณาเข้าสู่ระบบ');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId,
                    treeId,
                    rating,
                    comment: comment.trim() || null,
                    images: images.length > 0 ? images : null
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert('ส่งรีวิวสำเร็จ! ขอบคุณสำหรับความคิดเห็น');
                setRating(0);
                setComment('');
                setImages([]);
                if (onSubmitSuccess) {
                    onSubmitSuccess();
                }
            } else {
                setError(data.error || 'เกิดข้อผิดพลาด');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('ไม่สามารถส่งรีวิวได้');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb'
        }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                เขียนรีวิว: {treeName}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Rating */}
                <div>
                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        คะแนน *
                    </label>
                    <StarRating rating={rating} onRatingChange={setRating} size="lg" />
                </div>

                {/* Comment */}
                <div>
                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
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
                            borderRadius: '0.5rem',
                            resize: 'vertical'
                        }}
                    />
                </div>

                {/* Images */}
                <div>
                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        รูปภาพ (ไม่บังคับ)
                    </label>
                    <ImageUpload
                        onUploadComplete={setImages}
                        maxFiles={3}
                        currentImages={images}
                    />
                </div>

                {/* Error */}
                {error && (
                    <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
                )}

                {/* Submit */}
                <Button type="submit" disabled={isSubmitting} fullWidth>
                    {isSubmitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                </Button>
            </form>
        </div>
    );
}
