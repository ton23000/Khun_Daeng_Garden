import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';


const treeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    category: z.string().min(1, "Category is required"),
    images: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    growthTime: z.string().optional(),
    stock: z.number().min(0, "Stock must be non-negative").default(0),
    isPromotion: z.boolean().default(false),
    originalPrice: z.number().optional(),
    promotionName: z.string().optional(),
    promotionEndDate: z.string().optional()
});

export async function GET() {


    try {
        const trees = await prisma.tree.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON strings back to arrays and include all fields
        const formattedTrees = trees.map(tree => ({
            ...tree,
            images: JSON.parse(tree.images),
            tags: tree.tags.split(',').filter(t => t),
            stock: tree.stock || 0,
            reserved: tree.reserved || 0,
            sold: tree.sold || 0
        }));

        return NextResponse.json(formattedTrees);
    } catch (error) {
        console.error('Error fetching trees:', error);
        return NextResponse.json({ error: 'Failed to fetch trees' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validated = treeSchema.parse(body);
        


        const tree = await prisma.tree.create({
            data: {
                name: validated.name,
                description: validated.description,
                price: validated.price,
                category: validated.category,
                status: 'AVAILABLE',
                images: JSON.stringify(validated.images),
                tags: validated.tags.join(','),
                growthTime: validated.growthTime || '1-2 อาทิตย์',
                stock: validated.stock,
                isPromotion: validated.isPromotion,
                originalPrice: validated.originalPrice || null,
                promotionName: validated.promotionName || null,
                promotionEndDate: validated.promotionEndDate ? new Date(validated.promotionEndDate) : null
            }
        });

        return NextResponse.json(tree);
    } catch (error) {
        console.error('Error creating tree:', error);
        return NextResponse.json({ error: 'Failed to create tree' }, { status: 500 });
    }
}
