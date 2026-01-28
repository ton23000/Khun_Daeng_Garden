import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    category: z.string().optional(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    status: z.string().optional(),
    growthTime: z.string().optional()
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await request.json();
        const validated = updateSchema.parse(body);

        const updateData: any = { ...validated };

        if (validated.images) {
            updateData.images = JSON.stringify(validated.images);
        }
        if (validated.tags) {
            updateData.tags = validated.tags.join(',');
        }

        const tree = await prisma.tree.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(tree);
    } catch (error) {
        console.error('Error updating tree:', error);
        return NextResponse.json({ error: 'Failed to update tree' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        await prisma.tree.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting tree:', error);
        return NextResponse.json({ error: 'Failed to delete tree' }, { status: 500 });
    }
}
