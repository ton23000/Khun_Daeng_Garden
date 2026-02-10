'use client';

import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { Button } from './ui/Button';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    images: string | null;
    helpful: number;
    createdAt: string;
    user: {
        id: string;
        name: string;
    };
}

interface ReviewListProps {
    treeId: string;
    currentUserId?: string;
}

export default function ReviewList({ treeId, currentUserId }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'helpful'>('newest');

    useEffect(() => {
        fetchReviews();
    }, [treeId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?treeId=${treeId}&limit=50`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews || []);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleHelpful = async (reviewId: string) => {
        try {
            const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
                method: 'POST'
            });
            if (res.ok) {
                // Refresh reviews
                fetchReviews();
            }
        } catch (error) {
            console.error('Error marking helpful:', error);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm('ต้องการลบรีวิวนี้หรือไม่?')) return;

        try {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-id': currentUserId || '',
                    'x-user-role': 'user'
                }
            });

            if (res.ok) {
                alert('ลบรีวิวสำเร็จ');
                fetchReviews();
            } else {
                const data = await res.json();
                alert(data.error || 'ไม่สามารถลบรีวิวได้');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('เกิดข้อผิดพลาด');
        }
    };

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'highest') {
            return b.rating - a.rating;
        } else {
            return b.helpful - a.helpful;
        }
    });

    if (isLoading) {
        return <p>กำลังโหลดรีวิว...</p>;
    }

    if (reviews.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <p>ยังไม่มีรีวิว</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>เป็นคนแรกที่รีวิวสินค้านี้!</p>
            </div>
        );
    }

    return (
        <div>
            {/* Sort Options */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>เรียงตาม:</span>
                <button
                    onClick={() => setSortBy('newest')}
                    style={{
                        fontSize: '0.875rem',
                        fontWeight: sortBy === 'newest' ? 600 : 400,
                        color: sortBy === 'newest' ? 'var(--primary)' : '#6b7280',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: sortBy === 'newest' ? 'underline' : 'none'
                    }}
                >
                    ล่าสุด
                </button>
                <span style={{ color: '#d1d5db' }}>|</span>
                <button
                    onClick={() => setSortBy('highest')}
                    style={{
                        fontSize: '0.875rem',
                        fontWeight: sortBy === 'highest' ? 600 : 400,
                        color: sortBy === 'highest' ? 'var(--primary)' : '#6b7280',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: sortBy === 'highest' ? 'underline' : 'none'
                    }}
                >
                    คะแนนสูงสุด
                </button>
                <span style={{ color: '#d1d5db' }}>|</span>
                <button
                    onClick={() => setSortBy('helpful')}
                    style={{
                        fontSize: '0.875rem',
                        fontWeight: sortBy === 'helpful' ? 600 : 400,
                        color: sortBy === 'helpful' ? 'var(--primary)' : '#6b7280',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: sortBy === 'helpful' ? 'underline' : 'none'
                    }}
                >
                    มีประโยชน์สูงสุด
                </button>
            </div>

            {/* Reviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {sortedReviews.map((review) => {
                    const reviewImages = review.images ? JSON.parse(review.images) : [];

                    return (
                        <div
                            key={review.id}
                            style={{
                                backgroundColor: '#f9fafb',
                                padding: '1.5rem',
                                borderRadius: '0.75rem',
                                border: '1px solid #e5e7eb'
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div>
                                    <p style={{ fontWeight: 600 }}>{review.user.name}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                        {new Date(review.createdAt).toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                {currentUserId === review.user.id && (
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(review.id)}>
                                        ลบ
                                    </Button>
                                )}
                            </div>

                            {/* Rating */}
                            <StarRating rating={review.rating} readonly size="sm" />

                            {/* Comment */}
                            {review.comment && (
                                <p style={{ marginTop: '0.75rem', lineHeight: '1.6', color: '#374151' }}>
                                    {review.comment}
                                </p>
                            )}

                            {/* Images */}
                            {reviewImages.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', overflowX: 'auto' }}>
                                    {reviewImages.map((img: string, idx: number) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Review image ${idx + 1}`}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => window.open(img, '_blank')}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Helpful Button */}
                            <div style={{ marginTop: '1rem' }}>
                                <button
                                    onClick={() => handleHelpful(review.id)}
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#6b7280',
                                        background: 'none',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '9999px',
                                        padding: '0.25rem 0.75rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    className="hover:bg-gray-100"
                                >
                                    👍 มีประโยชน์ ({review.helpful})
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
