import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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

        const updateData: any = {};
        if (validated.status) updateData.status = validated.status;
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
                        name: true,
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
            const allowedStatuses = ['PENDING', 'PAID'];
            if (!allowedStatuses.includes(currentBooking.status)) {
                return NextResponse.json(
                    { error: 'Cannot update slip for this booking status' },
                    { status: 400 }
                );
            }
        }

        const updateData: any = {};
        if (validated.status) updateData.status = validated.status;
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

        // Create notification if status changed and user exists
        if (validated.status && currentBooking.user && booking.userId) {
            let message = '';
            let type = 'info';

            switch (validated.status) {
                case 'PAID':
                    // Usually user action, but admin might set it manually
                    // message = 'การชำระเงินของคุณได้รับการยืนยันแล้ว';
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
                await prisma.notification.create({
                    data: {
                        userId: booking.user.phone, // Assuming phone is used as ID/Key often, or user actual ID if needed. Wait, schema says userId is String.
                        // Check User model in schema: id is uuid. Phone is unique.
                        // But notifications link by userId string usually.
                        // Let's use user's ID to be safe, or phone if your auth system relies on it.
                        // Based on NotificationContext, it filters by userId === user.phone || user.email.
                        // Let's try to match that.
                        userId: booking.user.phone, // Using phone as visual identifier/key for now as per Context logic
                        message,
                        type,
                        bookingId: booking.id
                    }
                });
            }
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}
