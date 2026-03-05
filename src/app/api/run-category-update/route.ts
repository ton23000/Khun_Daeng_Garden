import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('API: Syncing all tree categories into the Category table and fixing tags...');
        const results = [];

        // Fetch all trees
        const trees = await prisma.tree.findMany();

        const uniqueCategories = new Set<string>();
        for (const tree of trees) {
            // 1. Collect Categories
            if (tree.category) {
                const parts = tree.category.split(',').map(c => c.trim()).filter(Boolean);
                for (const p of parts) uniqueCategories.add(p);
            }

            // 2. Fix Tags spacing "มาใหม่ไม้มงคล" -> ["มาใหม่", "ไม้มงคล"]
            let needsTagUpdate = false;
            const newTags: string[] = [];
            if (tree.tags && tree.tags.length > 0) {
                for (const tag of tree.tags) {
                    if (tag === 'มาใหม่ไม้มงคล') {
                        newTags.push('มาใหม่');
                        newTags.push('ไม้มงคล');
                        needsTagUpdate = true;
                    } else if (tag === 'มาใหม่ ไม้มงคล') {
                        newTags.push('มาใหม่');
                        newTags.push('ไม้มงคล');
                        needsTagUpdate = true;
                    } else if (tag.includes(',')) {
                        // Sometimes users type comma in the tag input
                        const splitTags = tag.split(',').map(t => t.trim()).filter(Boolean);
                        newTags.push(...splitTags);
                        needsTagUpdate = true;
                    } else {
                        newTags.push(tag);
                    }
                }
            }

            if (needsTagUpdate) {
                const finalTags = Array.from(new Set(newTags));
                await prisma.tree.update({
                    where: { id: tree.id },
                    data: { tags: finalTags.join(',') }
                });
                results.push(`Fixed tags for ${tree.name}`);
            }
        }

        // 3. Create missing Categories (without 'description' field)
        for (const catName of uniqueCategories) {
            const existing = await prisma.category.findUnique({ where: { name: catName } }).catch(() => null);
            if (!existing) {
                await prisma.category.create({
                    data: { name: catName }
                }).catch(() => { });
                results.push(`Added category: ${catName}`);
            }
        }

        return NextResponse.json({ success: true, message: "Synced categories and fixed tags successfully", logs: results, totalUnique: uniqueCategories.size });
    } catch (error: unknown) {
        console.error('API: Database update error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
