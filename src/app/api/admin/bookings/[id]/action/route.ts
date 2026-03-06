import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ActionSchema = z.object({
    action: z.enum(['approve', 'reject']),
    note: z.string().optional()
});

// POST /api/admin/bookings/[id]/action - Approve or Reject a PENDING_APPROVAL booking
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: bookingId } = await params;
        const body = await req.json();
        const { action, note } = ActionSchema.parse(body);

        console.log(`[Admin Action] ${action} on booking ${bookingId}`);

        // Get booking with items
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                items: {
                    include: { tree: true }
                },
                user: true
            }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.status !== 'PENDING_APPROVAL' && booking.status !== 'PRE_ORDER') {
            return NextResponse.json({
                error: 'Only PENDING_APPROVAL and PRE_ORDER bookings can be approved/rejected'
            }, { status: 400 });
        }

        if (action === 'approve') {
            // Check stock again before approval
            for (const item of booking.items) {
                const tree = await prisma.tree.findUnique({
                    where: { id: item.treeId }
                });

                if (!tree) {
                    return NextResponse.json({
                        error: `ไม่พบต้นไม้ \"${item.tree.name}\"`
                    }, { status: 400 });
                }

                // Check stock again (just for logging/warning, allow negative stock)
                const available = tree.stock - tree.reserved;
                if (available < item.quantity) {
                    console.warn(`[Admin Action] Warning: Approving booking with insufficient stock for ${item.tree.name} (Available: ${available}, Required: ${item.quantity})`);
                    // We allow approval even if stock is negative as per user requirement
                }
            }

            // Approve: Change status to PENDING and reserve stock
            await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: 'PENDING',
                    note: note || 'อนุมัติโดย Admin'
                }
            });

            // Reserve stock ONLY if it's NOT a pre-order 
            // (Pre-orders shouldn't deduct from "Ready to sell" since stock is 0)
            if (!booking.isPreorder) {
                for (const item of booking.items) {
                    await prisma.tree.update({
                        where: { id: item.treeId },
                        data: {
                            reserved: { increment: item.quantity }
                        }
                    });
                }
                console.log('[Admin Action] Booking approved - Stock reserved');
            } else {
                console.log('[Admin Action] Pre-order approved - NO stock reserved (to prevent negative ready-to-sell)');
            }

            // Notify customer
            await prisma.notification.create({
                data: {
                    userId: booking.userId,
                    message: `✅ ออเดอร์ #${booking.refCode} ได้รับการอนุมัติแล้ว กรุณาชำระเงินมัดจำภายใน 24 ชม.`,
                    type: 'success',
                    bookingId: booking.id
                }
            });

            console.log(`[Admin Action] Approved booking ${bookingId}, reserved stock`);
            return NextResponse.json({
                success: true,
                message: 'อนุมัติออเดอร์เรียบร้อย',
                newStatus: 'PENDING'
            });

        } else if (action === 'reject') {
            // Reject: Change status to CANCELLED
            await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: 'CANCELLED',
                    note: note || 'ปฏิเสธโดย Admin - สต๊อกไม่เพียงพอ'
                }
            });

            // Notify customer
            await prisma.notification.create({
                data: {
                    userId: booking.userId,
                    message: `❌ ขออภัย ออเดอร์ #${booking.refCode} ถูกยกเลิก เนื่องจากสินค้าไม่เพียงพอ`,
                    type: 'error',
                    bookingId: booking.id
                }
            });

            console.log(`[Admin Action] Rejected booking ${bookingId}`);
            return NextResponse.json({
                success: true,
                message: 'ปฏิเสธออเดอร์เรียบร้อย',
                newStatus: 'CANCELLED'
            });
        }

    } catch (error) {
        console.error('[Admin Action] Error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid request', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to process action' }, { status: 500 });
    }
}
