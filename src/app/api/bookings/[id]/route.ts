import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const maxDuration = 60; // Set timeout for API
export const dynamic = 'force-dynamic';

const UpdateBookingSchema = z.object({
    status: z.string().optional(),
    pickupDate: z.string().optional(),
    note: z.string().optional(),
    slipUrl: z.string().optional()
});

// PUT - Update booking
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const validated = UpdateBookingSchema.parse(body);

        // Get current booking to check status change
        const currentBooking = await prisma.booking.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!currentBooking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const updateData: Record<string, unknown> = {};
        if (validated.status) {
            updateData.status = validated.status;
            // Enable reviews when booking is completed
            if (validated.status === 'COMPLETED') {
                updateData.reviewable = true;
            }
        }
        if (validated.note !== undefined) updateData.note = validated.note;
        if (validated.slipUrl !== undefined) updateData.slipUrl = validated.slipUrl;
        if (validated.pickupDate) updateData.pickupDate = new Date(validated.pickupDate);

        const booking = await prisma.booking.update({
            where: { id },
            data: updateData,
            include: {
                items: {
                    include: {
                        tree: true
                    }
                },
                user: true
            }
        });

        // Update stock when order is completed
        if (validated.status === 'COMPLETED' && currentBooking.status !== 'COMPLETED') {
            console.log('[Booking Update] Order completed, updating stock...');
            const bookingItems = await prisma.bookingItem.findMany({
                where: { bookingId: id }
            });

            // Decrement stock and reserved, increment sold unconditionally
            for (const item of bookingItems) {
                const tree = await prisma.tree.findUnique({
                    where: { id: item.treeId }
                });

                if (tree) {
                    const decrementAmount = Math.min(item.quantity, tree.stock);
                    const reserveDecrement = Math.min(item.quantity, tree.reserved);

                    await prisma.tree.update({
                        where: { id: item.treeId },
                        data: {
                            stock: { decrement: decrementAmount },
                            sold: { increment: item.quantity },
                            reserved: { decrement: reserveDecrement }
                        }
                    });
                    console.log(`[Booking Update] Order completed - Tree ${item.treeId}: -${decrementAmount} stock, +${item.quantity} sold, -${reserveDecrement} reserved`);
                }
            }
        }

        // Create notification if status changed
        if (validated.status && currentBooking.user && booking.userId && validated.status !== currentBooking.status) {
            console.log('🔔 [PUT] Status changed from', currentBooking.status, 'to', validated.status);
            let message = '';
            let type = 'info';

            switch (validated.status) {
                case 'PAID':
                    message = `💰 ระบบได้รับยอดชำระเงินสำหรับคำสั่งซื้อ #${booking.refCode} แล้ว`;
                    type = 'success';
                    break;
                case 'PREPARING':
                    message = `✅ การจอง #${booking.refCode} ได้รับการอนุมัติแล้ว ทางร้านกำลังเตรียมสินค้า`;
                    type = 'success';
                    break;
                case 'READY':
                    message = `📦 การจอง #${booking.refCode} พร้อมให้รับแล้ว! กรุณามารับสินค้าตามเวลาที่นัดหมาย`;
                    type = 'success';
                    break;
                case 'COMPLETED':
                    message = `🎉 การจอง #${booking.refCode} เสร็จสมบูรณ์ ขอบคุณที่ใช้บริการ`;
                    type = 'success';
                    break;
                case 'CANCELLED':
                    message = `❌ การจอง #${booking.refCode} ถูกยกเลิก`;
                    type = 'error';
                    break;
            }

            if (message) {
                console.log('🔔 [PUT] Creating notification:', message, 'for user:', booking.userId);
                try {
                    await prisma.notification.create({
                        data: {
                            id: crypto.randomUUID(),
                            userId: booking.userId,
                            message,
                            type,
                            bookingId: booking.id
                        }
                    });
                    console.log('✅ [PUT] Notification created successfully');
                } catch (notiError) {
                    console.error('❌ [PUT] Failed to create notification:', notiError);
                }
            }
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}

// GET - Get single booking
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        tree: true
                    }
                },
                user: {
                    select: {
                        firstName: true, lastName: true,
                        phone: true,
                        email: true
                    }
                }
            }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
    }
}

// PATCH - Partial update (for slip upload)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const validated = UpdateBookingSchema.parse(body);

        // Check current booking status with user
        const currentBooking = await prisma.booking.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!currentBooking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // If trying to update slip, check if status allows it
        if (validated.slipUrl !== undefined) {
            const allowedStatuses = ['PENDING', 'PAID', 'PRE_ORDER'];
            if (!allowedStatuses.includes(currentBooking.status)) {
                return NextResponse.json(
                    { error: 'Cannot update slip for this booking status' },
                    { status: 400 }
                );
            }
        }

        const updateData: Record<string, unknown> = {};
        if (validated.status) {
            updateData.status = validated.status;
            // Enable reviews when booking is completed
            if (validated.status === 'COMPLETED') {
                updateData.reviewable = true;
            }
        }
        if (validated.note !== undefined) updateData.note = validated.note;
        if (validated.slipUrl !== undefined) {
            updateData.slipUrl = validated.slipUrl;
            // Auto-update status to PAID when slip is uploaded
            if (currentBooking.status === 'PENDING') {
                updateData.status = 'PAID';
            }
        }
        if (validated.pickupDate) updateData.pickupDate = new Date(validated.pickupDate);

        const booking = await prisma.booking.update({
            where: { id },
            data: updateData,
            include: {
                items: {
                    include: {
                        tree: true
                    }
                },
                user: true
            }
        });

        // Update stock when order is completed
        if (validated.status === 'COMPLETED' && currentBooking.status !== 'COMPLETED') {
            console.log('[Booking PATCH] Order completed, updating stock...');
            const bookingItems = await prisma.bookingItem.findMany({
                where: { bookingId: id }
            });

            // Decrement stock and reserved, increment sold unconditionally
            for (const item of bookingItems) {
                const tree = await prisma.tree.findUnique({
                    where: { id: item.treeId }
                });

                if (tree) {
                    const decrementAmount = Math.min(item.quantity, tree.stock);
                    const reserveDecrement = Math.min(item.quantity, tree.reserved);

                    await prisma.tree.update({
                        where: { id: item.treeId },
                        data: {
                            stock: { decrement: decrementAmount },
                            sold: { increment: item.quantity },
                            reserved: { decrement: reserveDecrement }
                        }
                    });
                    console.log(`[Booking PATCH] Order completed - Tree ${item.treeId}: -${decrementAmount} stock, +${item.quantity} sold, -${reserveDecrement} reserved`);
                }
            }
        }

        // Create notification if status changed and user exists
        if (validated.status && currentBooking.user && booking.userId) {
            console.log('🔔 Checking notification trigger for status:', validated.status);
            let message = '';
            let type = 'info';

            switch (validated.status) {
                case 'PAID':
                    message = `💰 ระบบได้รับยอดชำระเงินสำหรับคำสั่งซื้อ #${booking.refCode} แล้ว`;
                    type = 'success';
                    break;
                case 'PREPARING':
                    message = `✅ การจอง #${booking.refCode} ได้รับการอนุมัติแล้ว ทางร้านกำลังเตรียมสินค้า`;
                    type = 'success';
                    break;
                case 'READY':
                    message = `📦 การจอง #${booking.refCode} พร้อมให้รับแล้ว! กรุณามารับสินค้าตามเวลาที่นัดหมาย`;
                    type = 'success';
                    break;
                case 'COMPLETED':
                    message = `🎉 การจอง #${booking.refCode} เสร็จสมบูรณ์ ขอบคุณที่ใช้บริการ`;
                    type = 'success';
                    break;
                case 'CANCELLED':
                    message = `❌ การจอง #${booking.refCode} ถูกยกเลิก`;
                    type = 'error';
                    break;
            }

            if (message) {
                console.log('🔔 Creating notification:', message, 'for user:', booking.userId);
                try {
                    await prisma.notification.create({
                        data: {
                            id: crypto.randomUUID(),
                            userId: booking.userId,
                            message,
                            type,
                            bookingId: booking.id
                        }
                    });
                    console.log('✅ Notification created successfully');
                } catch (notiError) {
                    console.error('❌ Failed to create notification:', notiError);
                }
            } else {
                console.log('🔔 No message generated for status:', validated.status);
            }
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}

// DELETE - Delete booking
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Check if booking exists
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Prevent deletion of COMPLETED bookings
        if (booking.status === 'COMPLETED') {
            return NextResponse.json({ error: 'ไม่สามารถลบออเดอร์ที่เสร็จสิ้นแล้วได้' }, { status: 400 });
        }

        // Delete booking items first (foreign key constraint)
        await prisma.bookingItem.deleteMany({
            where: { bookingId: id }
        });

        // Delete related reviews (foreign key constraint)
        await prisma.review.deleteMany({
            where: { bookingId: id }
        });

        // Delete related notifications
        await prisma.notification.deleteMany({
            where: { bookingId: id }
        });

        // Release reserved stock if booking was active
        if (!['PENDING_APPROVAL', 'CANCELLED', 'COMPLETED'].includes(booking.status)) {
            for (const item of booking.items) {
                const tree = await prisma.tree.findUnique({
                    where: { id: item.treeId }
                });

                if (tree && tree.reserved > 0) {
                    const reserveToRelease = Math.min(item.quantity, tree.reserved);
                    await prisma.tree.update({
                        where: { id: item.treeId },
                        data: {
                            reserved: { decrement: reserveToRelease }
                        }
                    });
                }
            }
        }

        // Delete the booking
        await prisma.booking.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Booking deleted successfully',
            deletedBookingId: id
        });
    } catch (error) {
        console.error('Error deleting booking:', error);
        return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
    }
}
