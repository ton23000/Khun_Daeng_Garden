import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const tree = await prisma.tree.findUnique({
    where: { id }
  });

  if (!tree) {
    notFound();
  }

  let images: string[] = [];
  try {
    images = JSON.parse(tree.images);
  } catch (e) {
    images = ['/placeholder-tree.jpg'];
  }

  const tags = tree.tags ? tree.tags.split(',').filter(t => t) : [];

  const treeProps: any = {
    ...tree,
    images,
    tags,
    createdAt: tree.createdAt.toISOString(),
    updatedAt: tree.updatedAt.toISOString(),
    promotionEndDate: tree.promotionEndDate?.toISOString() || null
  };

  return <ProductDetail tree={treeProps} />;
}
