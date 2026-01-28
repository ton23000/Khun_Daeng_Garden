import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const treeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    category: z.string().min(1, "Category is required"),
    images: z.array(z.string()).default([]), // Accept array, convert to string for DB
    tags: z.array(z.string()).default([]),   // Accept array, convert to string
    growthTime: z.string().optional()
});

export async function GET() {
    try {
        const trees = await prisma.tree.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON strings back to arrays
        const formattedTrees = trees.map(tree => ({
            ...tree,
            images: JSON.parse(tree.images),
            tags: tree.tags.split(',').filter(t => t)
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
                growthTime: validated.growthTime || '1-2 อาทิตย์'
            }
        });

        return NextResponse.json(tree);
    } catch (error) {
        console.error('Error creating tree:', error);
        return NextResponse.json({ error: 'Failed to create tree' }, { status: 500 });
    }
}
