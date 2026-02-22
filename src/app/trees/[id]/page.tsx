import { prisma } from '@/lib/prisma';
import ProductDetail from '@/components/ProductDetail';
import { notFound } from 'next/navigation';

export default async function TreePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch from DB instead of Mock
    const treeData = await prisma.tree.findUnique({
        where: { id }
    });

    if (!treeData) {
        notFound();
    }

    // Adapt DB data to Component Props
    // Images are stored as JSON string in DB, need to parse
    let images: string[] = [];
    try {
        images = JSON.parse(treeData.images);
    } catch (e) {
        images = ['/placeholder-tree.jpg'];
    }

    // Tags are stored as comma-separated string
    const tags = treeData.tags ? treeData.tags.split(',').filter((t: string) => t) : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tree: any = {
        ...treeData,
        images,
        tags,
        createdAt: treeData.createdAt.toISOString(),
        updatedAt: treeData.updatedAt.toISOString(),
        promotionEndDate: treeData.promotionEndDate?.toISOString() || null
    };

    return <ProductDetail tree={tree} />;
}
