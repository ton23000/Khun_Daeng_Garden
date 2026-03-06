'use client';

import Link from 'next/link';
import { Card, CardContent } from './ui/Card';
import FavoriteButton from './FavoriteButton';

interface Tree {
    id: string;
    name: string;
    price: number;
    images: string; // JSON string
    soldCount?: number;
}

export function ImageSlider({ trees, title, subtitle }: { trees: Tree[], title: string, subtitle: string }) {
    if (!trees || trees.length === 0) return null;

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '1rem', backgroundColor: '#f9fafb', padding: '1.5rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span style={{ color: '#4d7c0f', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{subtitle}</span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginTop: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>{title}</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', padding: '0 1rem' }}>
                {trees.map((tree) => {
                    let imageUrl = '/placeholder-tree.svg';
                    try {
                        const imgs = JSON.parse(tree.images);
                        if (imgs && imgs.length > 0) imageUrl = imgs[0];
                    } catch { }

                    return (
                        <div key={tree.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
                            <Link href={`/trees/${tree.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                                <Card style={{
                                    border: 'none',
                                    boxShadow: 'none',
                                    backgroundColor: 'white',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%'
                                }} className="hover-card transition-transform hover:scale-105">
                                    <div style={{ position: 'relative', aspectRatio: '4/5', backgroundColor: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={imageUrl} alt={tree.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10 }}>
                                            <FavoriteButton treeId={tree.id} size="sm" />
                                        </div>
                                    </div>
                                    <CardContent style={{ padding: '0.75rem', textAlign: 'left', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-prompt), sans-serif', color: '#115e59', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tree.name}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 'normal', marginBottom: '0.5rem' }}>
                                            ฿ {tree.price.toLocaleString()}
                                        </p>
                                        
                                        {tree.soldCount !== undefined && tree.soldCount > 0 && (
                                            <div style={{ marginBottom: '1rem' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#4b5563', backgroundColor: '#f3f4f6', padding: '0.2rem 0.6rem', borderRadius: '9999px', display: 'inline-block' }}>
                                                    ขายแล้ว {tree.soldCount} ต้น
                                                </span>
                                            </div>
                                        )}

                                        <div style={{ marginTop: 'auto' }}>
                                            <div style={{ border: '1px solid #10b981', color: '#10b981', padding: '0.4rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold', width: '100%' }}>
                                                จองเลย
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
