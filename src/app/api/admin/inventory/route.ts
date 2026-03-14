import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Active booking statuses that count as "reserved"
// PENDING_APPROVAL = รอ admin อนุมัติ
// PENDING = อนุมัติแล้ว รอชำระเงิน
// CONFIRMED = ชำระเงินแล้ว รอรับของ
const ACTIVE_STATUSES = ['PENDING_APPROVAL', 'PENDING', 'CONFIRMED'];

// Pre-order statuses that count as "backorder / pre-order"
const PREORDER_STATUSES = ['PRE_ORDER'];

export async function GET() {
    try {
        const trees = await prisma.tree.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    where: {
                        booking: {
                            status: {
                                in: [...ACTIVE_STATUSES, ...PREORDER_STATUSES]
                            }
                        }
                    },
                    include: {
                        booking: {
                            select: { status: true, isPreorder: true }
                        }
                    }
                }
            }
        });

        const formattedTrees = trees.map(tree => {
            // Calculate reserved from active bookings
            const activeReserved = tree.items
                .filter(item => ACTIVE_STATUSES.includes(item.booking.status))
                .reduce((sum, item) => sum + item.quantity, 0);

            // Calculate pre-order / backorder quantity
            const preorderReserved = tree.items
                .filter(item => PREORDER_STATUSES.includes(item.booking.status) || item.booking.isPreorder)
                .reduce((sum, item) => sum + item.quantity, 0);

            // Total reservations across all active+preorder bookings (for backward compat)
            const totalReserved = activeReserved + preorderReserved;

            return {
                id: tree.id,
                name: tree.name,
                price: tree.price,
                stock: tree.stock,
                reserved: totalReserved,
                activeReserved,    // จอง base value
                preorderReserved,  // สั่งล่วงหน้า base value  
                sold: tree.sold,
                category: tree.category,
                status: tree.status,
                images: (() => { try { return JSON.parse(tree.images); } catch { return []; } })(),
                tags: tree.tags.split(',').filter(Boolean)
            };
        });

        return NextResponse.json(formattedTrees);
    } catch (error) {
        console.error('[Inventory API] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
    }
}
