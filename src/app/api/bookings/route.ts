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
                        firstName: true, lastName: true,
                        phone: true
                    }
                },
                reviews: {
                    select: {
                        id: true,
                        treeId: true
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
        console.log('[Booking API] User found:', userExists.firstName, userExists.lastName);

        // Check email verification
        if (!userExists.verified) {
            return NextResponse.json({
                error: 'EMAIL_NOT_VERIFIED',
                message: 'กรุณายืนยันอีเมลก่อนทำการจอง'
            }, { status: 403 });
        }

        // Check stock availability and determine if this is a pre-order
        console.log('[Booking API] Checking stock availability...');
        let isPreOrder = false;

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
                isPreOrder = true; // Mark order as pre-order
            }
        }
        console.log('[Booking API] Stock check complete. Is pre-order:', isPreOrder);

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
                status: isPreOrder ? 'PENDING_APPROVAL' : 'PENDING',
                isPreorder: isPreOrder, // Save pre-order status
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

        // Reserve stock ONLY if the entire order is in stock
        if (!isPreOrder) {
            console.log('[Booking API] Reserving stock for all items...');
            let reservedCount = 0;
            for (const item of validated.items) {
                await prisma.tree.update({
                    where: { id: item.treeId },
                    data: {
                        reserved: {
                            increment: item.quantity
                        }
                    }
                });
                reservedCount++;
            }
            console.log(`[Booking API] Stock reserved for ${reservedCount} items`);
        } else {
            console.log('[Booking API] This is a pre-order. Stock will be reserved upon Admin Approval.');
        }

        // Create admin notification
        console.log('[Booking API] Creating admin notification...');
        await prisma.adminNotification.create({
            data: {
                message: isPreOrder
                    ? `⚠️ ออเดอร์รอการอนุมัติ #${refCode} จาก ${validated.userName} - ฿${validated.totalPrice.toLocaleString()} (สินค้าบางรายการหมด)`
                    : `🛒 ออเดอร์ใหม่ #${refCode} จาก ${validated.userName} - ฿${validated.totalPrice.toLocaleString()} (${validated.paymentType === 'full' ? 'เต็มจำนวน' : 'มัดจำ'})`,
                type: isPreOrder ? 'alert' : 'order',
                bookingId: booking.id
            }
        });
        console.log('[Booking API] Admin notification created');

        console.log('[Booking API] Returning success response');
        return NextResponse.json(booking, { status: 201 });
    } catch (error: unknown) {
        console.error('[Booking API] Error creating booking:', error);
        const err = error as Error & { code?: string; meta?: unknown };
        console.error('[Booking API] Error name:', err?.name);
        console.error('[Booking API] Error message:', err?.message);
        console.error('[Booking API] Error code:', err?.code);
        console.error('[Booking API] Error stack:', err?.stack);

        try {
            console.error('[Booking API] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        } catch (e) {
            console.error('[Booking API] Failed to stringify error:', e);
        }

        if (error instanceof z.ZodError) {
            console.error('[Booking API] Zod validation error');
            return NextResponse.json({ error: 'Invalid booking data', details: error.issues }, { status: 400 });
        }

        const errObj = error as Error & { code?: string; meta?: unknown };
        return NextResponse.json({
            error: 'Failed to create booking',
            message: errObj?.message || 'Unknown error',
            code: errObj?.code, // Prisma error code
            meta: errObj?.meta // Prisma error meta
        }, { status: 500 });
    }
}
