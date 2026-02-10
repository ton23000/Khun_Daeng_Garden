import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const UpdateUserSchema = z.object({
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits').optional(),
    name: z.string().min(1).optional()
});

// PATCH - Update user profile
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        console.log('[User Update] Received update request for user:', id);
        console.log('[User Update] Update data:', body);

        const validated = UpdateUserSchema.parse(body);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check email uniqueness if email is being changed
        if (validated.email && validated.email !== '' && validated.email !== existingUser.email) {
            const emailExists = await prisma.user.findFirst({
                where: {
                    email: validated.email,
                    NOT: { id }
                }
            });

            if (emailExists) {
                return NextResponse.json({
                    error: 'อีเมลนี้ถูกใช้งานแล้ว'
                }, { status: 400 });
            }
        }

        // Check phone uniqueness if phone is being changed
        if (validated.phone && validated.phone !== existingUser.phone) {
            const phoneExists = await prisma.user.findFirst({
                where: {
                    phone: validated.phone,
                    NOT: { id }
                }
            });

            if (phoneExists) {
                return NextResponse.json({
                    error: 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว'
                }, { status: 400 });
            }
        }

        // Prepare update data
        const updateData: any = {};
        if (validated.name !== undefined) updateData.name = validated.name;
        if (validated.email !== undefined) {
            updateData.email = validated.email === '' ? null : validated.email;
        }
        if (validated.phone !== undefined) updateData.phone = validated.phone;

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true
            }
        });

        console.log('[User Update] User updated successfully:', updatedUser.id);

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.error('[User Update] Error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'ข้อมูลไม่ถูกต้อง',
                details: error.issues
            }, { status: 400 });
        }

        return NextResponse.json({
            error: 'Failed to update user',
            message: error?.message
        }, { status: 500 });
    }
}
