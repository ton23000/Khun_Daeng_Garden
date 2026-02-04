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
    deposit: z.number(),
    paymentType: z.enum(['deposit', 'full']).optional().default('deposit')
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
                        nickname: true,
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
        console.log('[Booking API] Received POST request');
        const body = await req.json();
        console.log('[Booking API] Request body:', JSON.stringify(body, null, 2));

        const validated = BookingSchema.parse(body);
        console.log('[Booking API] Validation passed');
        console.log('[Booking API] userId:', validated.userId);

        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { id: validated.userId }
        });

        if (!userExists) {
            console.error('[Booking API] User not found:', validated.userId);
            return NextResponse.json({
                error: 'User not found',
                message: `User with ID ${validated.userId} does not exist. Please log in again.`,
                userId: validated.userId
            }, { status: 400 });
        }
        console.log('[Booking API] User found:', userExists.name);

        // Check stock availability for all items
        console.log('[Booking API] Checking stock availability...');
        for (const item of validated.items) {
            const tree = await prisma.tree.findUnique({
                where: { id: item.treeId }
            });

            if (!tree) {
                return NextResponse.json({
                    error: `ไม่พบต้นไม้ "${item.treeName}"`
                }, { status: 400 });
            }

            const availableStock = tree.stock - tree.reserved;
            if (availableStock < item.quantity) {
                return NextResponse.json({
                    error: `ต้นไม้ "${item.treeName}" มีสต็อกไม่เพียงพอ (เหลือ ${availableStock} ต้น)`
                }, { status: 400 });
            }
        }
        console.log('[Booking API] Stock check passed');

        const refCode = `KD${Date.now().toString(36).toUpperCase()}`;
        console.log('[Booking API] Generated refCode:', refCode);

        console.log('[Booking API] Creating booking...');
        const booking = await prisma.booking.create({
            data: {
                userId: validated.userId,
                totalPrice: validated.totalPrice,
                deposit: validated.deposit,
                paymentType: validated.paymentType,
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
                },
                user: true
            }
        });
        console.log('[Booking API] Booking created:', booking.id);

        // Reserve stock for pending booking
        console.log('[Booking API] Reserving stock...');
        for (const item of validated.items) {
            await prisma.tree.update({
                where: { id: item.treeId },
                data: {
                    reserved: {
                        increment: item.quantity
                    }
                }
            });
        }
        console.log('[Booking API] Stock reserved');

        // Create admin notification
        console.log('[Booking API] Creating admin notification...');
        await prisma.adminNotification.create({
            data: {
                message: `🛒 ออเดอร์ใหม่ #${refCode} จาก ${validated.userName} - ฿${validated.totalPrice.toLocaleString()} (${validated.paymentType === 'full' ? 'เต็มจำนวน' : 'มัดจำ'})`,
                type: 'order',
                bookingId: booking.id
            }
        });
        console.log('[Booking API] Admin notification created');

        console.log('[Booking API] Returning success response');
        return NextResponse.json(booking, { status: 201 });
    } catch (error: any) {
        console.error('[Booking API] Error creating booking:', error);
        console.error('[Booking API] Error name:', error?.name);
        console.error('[Booking API] Error message:', error?.message);
        console.error('[Booking API] Error code:', error?.code);
        console.error('[Booking API] Error stack:', error?.stack);

        try {
            console.error('[Booking API] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        } catch (e) {
            console.error('[Booking API] Failed to stringify error:', e);
        }

        if (error instanceof z.ZodError) {
            console.error('[Booking API] Zod validation error');
            return NextResponse.json({ error: 'Invalid booking data', details: error.issues }, { status: 400 });
        }

        return NextResponse.json({
            error: 'Failed to create booking',
            message: error?.message || 'Unknown error',
            code: error?.code, // Prisma error code
            meta: error?.meta // Prisma error meta
        }, { status: 500 });
    }
}
