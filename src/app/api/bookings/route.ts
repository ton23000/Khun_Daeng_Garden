import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendEmail, orderConfirmationEmail } from '@/lib/email';

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



        // Check if user exists (production mode only)
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

        // Email verification check removed - all users can book

        // Check stock availability and determine if this is a pre-order
        console.log('[Booking API] Checking stock availability...');
        let isPreOrder = false;

        for (const item of validated.items) {
            const tree = await prisma.tree.findUnique({
                where: { id: item.treeId }
            });

            if (!tree) {
                return NextResponse.json({
                    error: 'Tree not found',
                    message: `Tree with ID ${item.treeId} does not exist`,
                    treeId: item.treeId
                }, { status: 400 });
            }

            if (tree.stock < item.quantity) {
                isPreOrder = true;
                console.log('[Booking API] Pre-order detected for tree:', item.treeName);
            }
        }
        console.log('[Booking API] Stock check complete. Is pre-order:', isPreOrder);

        // Create booking and update tree reserved stock in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create booking
            const newBooking = await tx.booking.create({
                data: {
                    id: crypto.randomUUID(),
                    userId: validated.userId,
                    status: isPreOrder ? 'PRE_ORDER' : 'PENDING',
                    totalPrice: validated.totalPrice,
                    deposit: validated.deposit,
                    paymentType: validated.paymentType,
                    pickupDate: validated.items[0]?.pickupDate ? new Date(validated.items[0].pickupDate).toISOString() : new Date().toISOString(),
                    refCode: `BK${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1000)}`,
                    items: {
                        create: validated.items.map(item => ({
                            id: crypto.randomUUID(),
                            treeId: item.treeId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                },
                include: {
                    items: true,
                    user: {
                        select: {
                            firstName: true, lastName: true,
                            phone: true, email: true
                        }
                    }
                }
            });

            // 2. Increment reserved stock for each tree
            for (const item of validated.items) {
                await tx.tree.update({
                    where: { id: item.treeId },
                    data: {
                        reserved: {
                            increment: item.quantity
                        }
                    }
                });
            }

            return newBooking;
        });

        const booking = result;
        console.log('[Booking API] Booking created and stock reserved successfully:', booking.id);

        // Send confirmation email (only in production)
        if (process.env.NODE_ENV === 'production' && userExists.email) {
            try {
                const emailItems = validated.items.map(item => ({
                    name: item.treeName,
                    quantity: item.quantity,
                    price: item.price
                }));
                const formattedDate = new Date(booking.pickupDate).toLocaleDateString('th-TH', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });

                await sendEmail({
                    to: userExists.email,
                    subject: 'ยืนยันการจองสินค้า - สวนคุณแดง',
                    html: orderConfirmationEmail(
                        booking.refCode,
                        emailItems,
                        booking.totalPrice,
                        booking.deposit,
                        formattedDate
                    )
                });
                console.log('[Booking API] Confirmation email sent to:', userExists.email);
            } catch (emailError) {
                console.error('[Booking API] Failed to send confirmation email:', emailError);
                // Don't fail the booking if email fails
            }
        }

        return NextResponse.json(booking);
    } catch (error: unknown) {
        console.error('[Booking API] Error creating booking:', error);

        if (error instanceof z.ZodError) {
            console.error('[Booking API] Validation error:', error.issues);
            return NextResponse.json({
                error: 'Invalid booking data',
                details: error.issues
            }, { status: 400 });
        }

        const err = error as Error;
        return NextResponse.json({
            error: 'Failed to create booking',
            message: err.message || 'Unknown error'
        }, { status: 500 });
    }
}
