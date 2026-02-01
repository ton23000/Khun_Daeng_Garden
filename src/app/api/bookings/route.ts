import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const BookingItemSchema = z.object({
    treeId: z.string(),
    treeName: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
    pickupDate: z.string()
});

const BookingSchema = z.object({
    userId: z.string(),
    userName: z.string(),
    items: z.array(BookingItemSchema),
    totalPrice: z.number(),
    deposit: z.number()
});

// GET - Fetch bookings
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        const where = userId ? { userId } : {};

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                items: {
                    include: {
                        tree: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        phone: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

// POST - Create new booking
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validated = BookingSchema.parse(body);

        const refCode = `KD${Date.now().toString(36).toUpperCase()}`;

        const booking = await prisma.booking.create({
            data: {
                userId: validated.userId,
                totalPrice: validated.totalPrice,
                deposit: validated.deposit,
                refCode,
                pickupDate: new Date(validated.items[0].pickupDate),
                status: 'PENDING',
                items: {
                    create: validated.items.map(item => ({
                        treeId: item.treeId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        tree: true
                    }
                }
            }
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error('Error creating booking:', error);
        console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid booking data', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({
            error: 'Failed to create booking',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
