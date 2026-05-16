import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch bookings from the last 7 days that are not cancelled
    const recentBookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        status: {
          notIn: ["CANCELLED", "PAYMENT_ISSUE"],
        },
      },
      include: {
        items: true,
      },
    });

    // Tally up items
    const itemCounts: Record<string, number> = {};
    recentBookings.forEach((booking) => {
      booking.items.forEach((item) => {
        itemCounts[item.treeId] =
          (itemCounts[item.treeId] || 0) + item.quantity;
      });
    });

    // Sort by highest quantity and get top 5
    const topTreeIds = Object.entries(itemCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([treeId]) => treeId);

    return NextResponse.json({ hotTreeIds: topTreeIds });
  } catch (error) {
    console.error("Error fetching weekly hot trees:", error);
    return NextResponse.json({ hotTreeIds: [] });
  }
}
