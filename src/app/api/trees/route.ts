import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';


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
        // Add caching headers
        const headers = {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        };

        const trees = await prisma.tree.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                sku: true,
                name: true,
                description: true,
                price: true,
                category: true,
                images: true,
                tags: true,
                growthTime: true,
                stock: true,
                reserved: true,
                sold: true,
                isPromotion: true,
                originalPrice: true,
                promotionName: true,
                promotionEndDate: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });

        // Optimize JSON parsing - parse only once per tree
        const formattedTrees = trees.map(tree => {
            try {
                return {
                    ...tree,
                    images: JSON.parse(tree.images || '[]'),
                    tags: tree.tags ? tree.tags.split(',').filter(t => t.trim()) : [],
                    stock: tree.stock || 0,
                    reserved: tree.reserved || 0,
                    sold: tree.sold || 0
                };
            } catch (parseError) {
                console.error('Error parsing tree data:', tree.id, parseError);
                return {
                    ...tree,
                    images: [],
                    tags: tree.tags ? tree.tags.split(',').filter(t => t.trim()) : [],
                    stock: tree.stock || 0,
                    reserved: tree.reserved || 0,
                    sold: tree.sold || 0
                };
            }
        });

        return NextResponse.json(formattedTrees, { headers });
    } catch (error) {
        console.error('Error fetching trees:', error);
        return NextResponse.json({ error: 'Failed to fetch trees' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validated = treeSchema.parse(body);
        

        const prefixMap: Record<string, string> = {
            '🌞 ไม้แดด': 'A',
            '🌤️ ไม้รำไร': 'B',
            '🌑 ไม้ร่ม': 'C',
            '🌺 ไม้ดอก': 'D',
        };
        const prefix = prefixMap[validated.category] || 'Z';
        
        // Find existing SKUs with this prefix to get the next number
        const existingTrees = await prisma.tree.findMany({
            where: { sku: { startsWith: prefix } },
            select: { sku: true }
        });

        let maxNum = 0;
        for (const t of existingTrees) {
            if (t.sku) {
                const num = parseInt(t.sku.slice(1));
                if (!isNaN(num) && num > maxNum) maxNum = num;
            }
        }
        
        const newSku = `${prefix}${String(maxNum + 1).padStart(3, '0')}`;

        const tree = await prisma.tree.create({
            data: {
                id: crypto.randomUUID(),
                sku: newSku,
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

        // Clear cache so changes appear immediately
        revalidatePath('/');
        revalidatePath('/shop');
        revalidatePath('/promotion');
        revalidatePath('/admin/trees');
        revalidatePath('/api/trees');

        return NextResponse.json(tree);
    } catch (error) {
        console.error('Error creating tree:', error);
        return NextResponse.json({ error: 'Failed to create tree' }, { status: 500 });
    }
}
