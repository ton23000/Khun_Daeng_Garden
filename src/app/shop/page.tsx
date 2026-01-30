import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ShopControls } from '@/components/ShopControls';
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
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>รายการต้นไม้ทั้งหมด</h1>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>เลือกชมและจับจองต้นไม้ที่คุณชื่นชอบ</p>
            </header>

            <ShopControls categories={categories} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {trees.map((tree) => {
                    // Parse images safely
                    let images: string[] = [];
                    try {
                        images = JSON.parse(tree.images);
                    } catch (e) {
                        images = ['/placeholder-tree.jpg'];
                    }

                    return (
                        <Card key={tree.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div style={{ height: '220px', backgroundColor: '#f9fafb', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '1rem' }}>
                                <img
                                    src={images[0] || '/placeholder-tree.jpg'}
                                    alt={tree.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </div>
                            <CardHeader>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <CardTitle>{tree.name}</CardTitle>
                                    {tree.status === 'BOOKED' && (
                                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#d97706' }}>
                                            จองแล้ว
                                        </span>
                                    )}
                                </div>
                                <CardDescription>{tree.category}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>
                                    ฿ {tree.price.toLocaleString()}
                                </p>
                                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {tree.description}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/trees/${tree.id}`} style={{ width: '100%' }}>
                                    <Button fullWidth variant={tree.status === 'AVAILABLE' ? 'primary' : 'outline'} disabled={tree.status !== 'AVAILABLE'}>
                                        {tree.status === 'AVAILABLE' ? 'ดูรายละเอียด' : 'ถูกจองแล้ว'}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
            {trees.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    ยังไม่มีรายการต้นไม้ในขณะนี้
                </div>
            )}
        </div>
    );
}
