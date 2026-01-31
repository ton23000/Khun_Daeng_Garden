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

        // Check current booking status
        const currentBooking = await prisma.booking.findUnique({
            where: { id }
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

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}
