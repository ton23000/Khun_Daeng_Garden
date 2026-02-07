import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CategorySchema = z.object({
    name: z.string().min(1, "Name is required")
});

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validated = CategorySchema.parse(body);

        const category = await prisma.category.create({
            data: { name: validated.name }
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 400 });
        }
        // Handle unique constraint violation
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
