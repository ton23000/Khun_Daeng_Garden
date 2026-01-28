import { MOCK_TREES } from '@/data/mockData';
import ProductDetail from '@/components/ProductDetail';
import { notFound } from 'next/navigation';

export default async function TreePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tree = MOCK_TREES.find((t) => t.id === id);

    if (!tree) {
        notFound();
    }

    return <ProductDetail tree={tree} />;
}
