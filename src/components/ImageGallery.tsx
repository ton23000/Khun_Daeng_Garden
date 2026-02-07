'use client';

import { useState } from 'react';
import { Button } from './ui/Button';

interface ImageGalleryProps {
    images: string[] | string;
    alt?: string;
}

export default function ImageGallery({ images: imagesProp = [], alt = 'Product image' }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    // Parse images if it's a JSON string
    let images: string[] = [];
    if (imagesProp) {
        if (Array.isArray(imagesProp)) {
            images = imagesProp;
        } else if (typeof imagesProp === 'string') {
            try {
                images = JSON.parse(imagesProp);
            } catch (e) {
                // If parsing fails, treat as single image URL
                images = [imagesProp];
            }
        }
    }

    if (!images || images.length === 0) {
        return (
            <div style={{
                width: '100%',
                height: '500px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.5rem'
            }}>
                <span style={{ color: '#6b7280' }}>ไม่มีรูปภาพ</span>
            </div>
        );
    }

    const currentImage = images[currentIndex];

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };

    const handleImageClick = () => {
        setIsZoomed(true);
    };

    const closeZoom = () => {
        setIsZoomed(false);
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Main Image */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        paddingBottom: '75%', // 4:3 aspect ratio
                        backgroundColor: '#f3f4f6',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        cursor: 'zoom-in'
                    }}
                    onClick={handleImageClick}
                >
                    <img
                        src={currentImage}
                        alt={`${alt} - ${currentIndex + 1}`}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            transition: 'transform 0.3s ease'
                        }}
                    />

                    {/* Image Counter */}
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: 600
                    }}>
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevious();
                                }}
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    transition: 'all 0.2s'
                                }}
                                className="hover:scale-110"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    transition: 'all 0.2s'
                                }}
                                className="hover:scale-110"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(auto-fill, minmax(80px, 1fr))`,
                    gap: '0.5rem',
                    maxWidth: '100%',
                    overflowX: 'auto'
                }}>
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            style={{
                                position: 'relative',
                                paddingBottom: '100%',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '0.5rem',
                                overflow: 'hidden',
                                border: currentIndex === index ? '3px solid var(--primary)' : '2px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                opacity: currentIndex === index ? 1 : 0.6
                            }}
                            className="hover:opacity-100"
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Zoom Modal */}
            {isZoomed && (
                <div
                    onClick={closeZoom}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        cursor: 'zoom-out'
                    }}
                >
                    <button
                        onClick={closeZoom}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#333'
                        }}
                    >
                        ×
                    </button>
                    <img
                        src={currentImage}
                        alt={`${alt} - zoomed`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
