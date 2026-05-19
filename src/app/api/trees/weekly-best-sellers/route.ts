import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_TREES } from "@/lib/mock-data";

export async function GET() {
  try {
    // Get best-selling trees from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyBestSellingData = await prisma.bookingItem.groupBy({
      by: ["treeId"],
      where: {
        booking: {
          status: "COMPLETED",
          updatedAt: {
            gte: sevenDaysAgo,
          },
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
    });

    // Get tree details for each best-selling tree
    const treeIds = weeklyBestSellingData.map((item) => item.treeId);
    const trees = await prisma.tree.findMany({
      where: {
        id: {
          in: treeIds,
        },
      },
    });

    // Sort trees by sales quantity
    const sortedTrees = trees.sort((a, b) => {
      const aData = weeklyBestSellingData.find((item) => item.treeId === a.id);
      const bData = weeklyBestSellingData.find((item) => item.treeId === b.id);
      const aQuantity = aData?._sum.quantity || 0;
      const bQuantity = bData?._sum.quantity || 0;
      return bQuantity - aQuantity;
    });

    return NextResponse.json(sortedTrees);
  } catch (error) {
    console.error("Error fetching weekly best sellers, using mock data:", error);
    return NextResponse.json(MOCK_TREES.slice(0, 4));
  }
}
