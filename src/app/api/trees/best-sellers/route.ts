import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MOCK_TREES } from '@/lib/mock-data';

export async function GET() {
    const dev = process.env.NODE_ENV !== 'production';
    if (dev) {
        return NextResponse.json(MOCK_TREES);
    }

    try {
        // Get best-selling trees of all time based on completed bookings
        const bestSellingData = await prisma.bookingItem.groupBy({
            by: ['treeId'],
            where: {
                booking: {
                    status: 'COMPLETED'
                }
            },
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            }
        });

        // Get tree details for each best-selling tree
        const treeIds = bestSellingData.map(item => item.treeId);
        const trees = await prisma.tree.findMany({
            where: {
                id: {
                    in: treeIds
                }
            }
        });

        // Sort trees by sales quantity
        const sortedTrees = trees.sort((a, b) => {
            const aData = bestSellingData.find(item => item.treeId === a.id);
            const bData = bestSellingData.find(item => item.treeId === b.id);
            const aQuantity = aData?._sum.quantity || 0;
            const bQuantity = bData?._sum.quantity || 0;
            return bQuantity - aQuantity;
        });

        return NextResponse.json(sortedTrees);
    } catch (error) {
        console.error('Error fetching overall best sellers:', error);
        return NextResponse.json({ error: 'Failed to fetch overall best sellers' }, { status: 500 });
    }
}
