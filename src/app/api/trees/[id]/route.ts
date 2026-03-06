import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const updateSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    category: z.string().optional(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    status: z.string().optional(),
    growthTime: z.string().optional(),
    stock: z.number().optional(),
    isPromotion: z.boolean().optional(),
    originalPrice: z.number().nullable().optional(),
    promotionName: z.string().nullable().optional(),
    promotionEndDate: z.string().nullable().optional()
});

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const id = params.id;
        const body = await request.json();
        const validated = updateSchema.parse(body);

        const updateData: Record<string, unknown> = { ...validated };

        if (validated.images) {
            updateData.images = JSON.stringify(validated.images);
        }
        if (validated.tags) {
            updateData.tags = validated.tags.join(',');
        }
        if (validated.promotionEndDate !== undefined) {
            updateData.promotionEndDate = validated.promotionEndDate ? new Date(validated.promotionEndDate) : null;
        }

        const tree = await prisma.tree.update({
            where: { id },
            data: updateData
        });

        // Clear cache so changes appear immediately
        revalidatePath('/');
        revalidatePath('/shop');
        revalidatePath('/promotion');
        revalidatePath(`/trees/${id}`);

        return NextResponse.json(tree);
    } catch (error) {
        console.error('Error updating tree:', error);
        return NextResponse.json({ error: 'Failed to update tree' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const id = params.id;

        // Check if tree is referenced in any bookings
        const bookingItems = await prisma.bookingItem.findMany({
            where: { treeId: id }
        });

        if (bookingItems.length > 0) {
            return NextResponse.json({ 
                error: 'ไม่สามารถลบต้นไม้นี้ได้เนื่องจากมีการสั่งจองแล้ว',
                details: `ต้นไม้นี้มีในคำสั่งซื้อ ${bookingItems.length} รายการ`
            }, { status: 400 });
        }

        await prisma.tree.delete({
            where: { id }
        });

        // Clear cache so changes appear immediately
        revalidatePath('/');
        revalidatePath('/shop');
        revalidatePath('/promotion');
        revalidatePath(`/trees/${id}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting tree:', error);
        return NextResponse.json({ error: 'Failed to delete tree' }, { status: 500 });
    }
}
