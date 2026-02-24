import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Find booking first to check status
        const booking = await prisma.booking.findUnique({
            where: { id }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Only allow cancellation if status is PENDING or VERIFYING_PAYMENT
        // PENDING = waiting for payment
        // VERIFYING_PAYMENT = uploaded slip, waiting for admin verification
        // PAYMENT_ISSUE = payment has issues

        const allowedStatuses = ['PENDING', 'VERIFYING_PAYMENT', 'PAYMENT_ISSUE'];

        if (!allowedStatuses.includes(booking.status)) {
            return NextResponse.json({
                error: 'Cannot cancel booking in this status',
                currentStatus: booking.status
            }, { status: 400 });
        }

        const updated = await prisma.booking.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                note: 'User cancelled'
            },
            include: {
                items: true
            }
        });

        // Release reserved stock safely
        for (const item of updated.items) {
            const tree = await prisma.tree.findUnique({
                where: { id: item.treeId }
            });

            if (tree && tree.reserved > 0) {
                const reserveToRelease = Math.min(item.quantity, tree.reserved);
                await prisma.tree.update({
                    where: { id: item.treeId },
                    data: {
                        reserved: {
                            decrement: reserveToRelease
                        }
                    }
                });
            }
        }
        console.log('[Booking Cancel] Reserved stock conditionally released');

        // Create notification for admin
        await prisma.adminNotification.create({
            data: {
                message: `❌ ออเดอร์ #${booking.refCode} ถูกยกเลิกโดยลูกค้า`,
                type: 'alert',
                bookingId: id
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
    }
}
