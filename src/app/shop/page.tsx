import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ShopControls } from '@/components/ShopControls';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const category = params.category as string | undefined;
    const sort = params.sort as string | undefined;
    const q = params.q as string | undefined;

    // Filter Logic
    const where: Prisma.TreeWhereInput = {
        status: { not: 'SOLD' } // Optional: Hide sold items? Or keep them. Let's show everything for now but user can filter.
    };

    if (category) {
        where.category = category;
    }

    if (q) {
        where.name = { contains: q }; // Case insensitive usually requires mode: 'insensitive' if DB supports it. 
        // Prisma SQLite default collision is case-sensitive, but often configured otherwise. 
        // For simplicity we just use contains.
    }

    // Sort Logic
    let orderBy: Prisma.TreeOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') {
        orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
        orderBy = { price: 'desc' };
    } else if (sort === 'newest') {
        orderBy = { createdAt: 'desc' };
    }

    // Fetch Data
    const trees = await prisma.tree.findMany({
        where,
        orderBy
    });

    // Get all categories for filter
    const categoriesData = await prisma.tree.findMany({
        select: { category: true },
        distinct: ['category']
    });
    const categories = categoriesData.map(c => c.category).filter(Boolean);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <ScrollAnimation animation="fade-up">
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>Shop Collection</span>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontFamily: 'var(--font-playfair), serif', fontWeight: 'bold', color: 'var(--foreground)' }}>สินค้ามาใหม่</h1>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>เลือกชมและจองต้นไม้ที่คุณชื่นชอบ</p>
                </header>
            </ScrollAnimation>

            <ShopControls categories={categories} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {trees.map((tree, index) => {
                    // Parse images safely
                    let imageUrl = '/placeholder-tree.jpg';
                    try {
                        const images = JSON.parse(tree.images);
                        if (images && images.length > 0) {
                            imageUrl = images[0];
                        }
                    } catch (e) {
                        // Use placeholder if parsing fails
                    }

                    return (
                        <ScrollAnimation key={tree.id} animation="fade-up" delay={index * 100}>
                            <Link href={`/trees/${tree.id}`} className="group" style={{ textDecoration: 'none' }}>
                                <Card style={{
                                    border: 'none',
                                    boxShadow: 'none',
                                    backgroundColor: '#f9fafb',
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'pointer',
                                    opacity: tree.status === 'AVAILABLE' ? 1 : 0.7
                                }}
                                    className="hover:shadow-xl hover:-translate-y-2"
                                >
                                    <div style={{ position: 'relative', height: '320px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                                        <img
                                            src={imageUrl}
                                            alt={tree.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />

                                        {/* Status Badge */}
                                        {tree.status === 'BOOKED' && (
                                            <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#fef3c7', color: '#d97706', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                จองแล้ว
                                            </div>
                                        )}

                                        {/* Heart Icon */}
                                        <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'white', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}>
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </div>
                                    </div>

                                    <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', marginBottom: '0.5rem', color: '#1f2937' }}>{tree.name}</h3>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{tree.category}</p>
                                        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)' }}>฿{tree.price.toLocaleString()}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </ScrollAnimation>
                    );
                })}
            </div>
            {trees.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <p style={{ fontSize: '1.125rem' }}>ยังไม่มีรายการต้นไม้ในขณะนี้</p>
                </div>
            )}
        </div>
    );
}
