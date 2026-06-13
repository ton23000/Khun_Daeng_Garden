import { prisma } from "@/lib/prisma";
import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";
import { MOCK_TREES } from "@/lib/mock-data";
import { getAllImageUrls } from "@/lib/imageUtils";

export const dynamic = "force-dynamic";

export default async function TreePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch from DB instead of Mock
  let treeData;

  try {
    treeData = await prisma.tree.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Database connection failed, checking mock data:", error);
  }

  // Fallback to mock data if DB fails or returns null
  if (!treeData) {
    const mockTree = MOCK_TREES.find((t) => t.id === id);
    if (mockTree) {
      treeData = mockTree;
    }
  }

  if (!treeData) {
    notFound();
  }

  // Adapt DB data to Component Props
  // Images are stored as JSON string in DB, need to parse
  const images = getAllImageUrls(treeData.images);

  // Tags are stored as comma-separated string
  const tags = treeData.tags
    ? treeData.tags.split(",").filter((t: string) => t)
    : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tree: any = {
    ...treeData,
    images,
    tags,
    createdAt: treeData.createdAt.toISOString(),
    updatedAt: treeData.updatedAt.toISOString(),
    promotionEndDate: treeData.promotionEndDate?.toISOString() || null,
  };

  return <ProductDetail tree={tree} />;
}
