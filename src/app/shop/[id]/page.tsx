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

  return <ProductDetail tree={tree} />;
}
