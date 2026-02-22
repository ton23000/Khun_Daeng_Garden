'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from './ui/Card';
import FavoriteButton from './FavoriteButton';

interface Tree {
    id: string;
    name: string;
    price: number;
    images: string; // JSON string
}

export function ImageSlider({ trees, title, subtitle }: { trees: Tree[], title: string, subtitle: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll
    useEffect(() => {
        if (trees.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % trees.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [trees.length]);

    if (!trees || trees.length === 0) return null;

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % trees.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + trees.length) % trees.length);

    return (
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '1rem', backgroundColor: '#f9fafb', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <span style={{ color: '#4d7c0f', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{subtitle}</span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginTop: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>{title}</h2>
            </div>

            <div style={{ display: 'flex', transition: 'transform 0.5s ease-in-out', transform: `translateX(-${currentIndex * 100}%)` }}>
                {trees.map((tree) => {
                    let imageUrl = '/placeholder-tree.jpg';
                    try {
                        const imgs = JSON.parse(tree.images);
                        if (imgs && imgs.length > 0) imageUrl = imgs[0];
                    } catch (e) { }

                    return (
                        <div key={tree.id} style={{ minWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
                            <Link href={`/trees/${tree.id}`} style={{ textDecoration: 'none', width: '100%', maxWidth: '600px' }}>
                                <Card style={{ overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }} className="hover:scale-105 transition-transform">
                                    <div style={{ position: 'relative', height: '300px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={imageUrl} alt={tree.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
                                    </div>
                                    <CardContent style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'white' }}>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', marginBottom: '0.5rem', color: '#1f2937' }}>{tree.name}</h3>
                                        <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f87171' }}>฿{tree.price.toLocaleString()}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {trees.length > 1 && (
                <>
                    <button onClick={prevSlide} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1f2937' }}>
                        &#10094;
                    </button>
                    <button onClick={nextSlide} style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1f2937' }}>
                        &#10095;
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        {trees.map((_, i) => (
                            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: i === currentIndex ? '#4d7c0f' : '#d1d5db', transition: 'background-color 0.3s' }} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
