import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get the booking
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                items: true,
                user: true
            }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.status !== 'PENDING_APPROVAL') {
            return NextResponse.json({
                error: 'Only bookings with PENDING_APPROVAL status can be approved'
            }, { status: 400 });
        }

        // Check stock availability before approving
        for (const item of booking.items) {
            const tree = await prisma.tree.findUnique({
                where: { id: item.treeId }
            });

            if (!tree) {
                return NextResponse.json({
                    error: `Tree not found: ${item.treeId}`
                }, { status: 400 });
            }

            // Warn but allow approval for pre-orders
            const availableStock = tree.stock - tree.reserved;
            if (availableStock < item.quantity) {
                console.warn(`[Admin Action] Warning: Approving booking with insufficient stock for ${item.treeId} (Available: ${availableStock}, Required: ${item.quantity})`);
            }
        }

        // Update booking status to PENDING
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status: 'PENDING' },
            include: {
                items: {
                    include: {
                        tree: true
                    }
                },
                user: true
            }
        });

        // Reserve stock
        for (const item of booking.items) {
            await prisma.tree.update({
                where: { id: item.treeId },
                data: {
                    reserved: {
                        increment: item.quantity
                    }
                }
            });
        }

        // Create admin notification
        await prisma.adminNotification.create({
            data: {
                bookingId: booking.id,
                message: `คำสั่งจอง #${booking.refCode} ได้รับการอนุมัติแล้ว`,
                type: 'BOOKING_APPROVED'
            }
        });

        return NextResponse.json({
            success: true,
            booking: updatedBooking,
            message: `Booking approved successfully. Customer can now upload payment slip.`
        });
    } catch (error) {
        console.error('Error approving booking:', error);
        return NextResponse.json({ error: 'Failed to approve booking' }, { status: 500 });
    }
}
