const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        console.log('Running final script...');
        const trees = await prisma.tree.findMany();

        const uniqueCategories = new Set();
        for (const tree of trees) {
            // 1. Collect Categories
            if (tree.category) {
                const parts = tree.category.split(',').map(c => c.trim()).filter(Boolean);
                for (const p of parts) uniqueCategories.add(p);
            }

            // 2. Fix Tags spacing "มาใหม่ไม้มงคล" -> "มาใหม่,ไม้มงคล"
            // tags is a comma separated string
            let needsTagUpdate = false;
            let newTags = [];

            if (tree.tags && typeof tree.tags === 'string') {
                const currentTags = tree.tags.split(',').map(t => t.trim()).filter(Boolean);

                for (let tag of currentTags) {
                    if (tag === 'มาใหม่ไม้มงคล' || tag === 'มาใหม่ ไม้มงคล') {
                        newTags.push('มาใหม่');
                        newTags.push('ไม้มงคล');
                        needsTagUpdate = true;
                    } else {
                        newTags.push(tag);
                    }
                }
            }

            if (needsTagUpdate) {
                const finalTags = Array.from(new Set(newTags)).join(',');
                await prisma.tree.update({
                    where: { id: tree.id },
                    data: { tags: finalTags }
                });
                console.log(`Fixed tags for ${tree.name}`);
            }
        }

        // 3. Create missing Categories (without 'description' field)
        for (const catName of uniqueCategories) {
            const existing = await prisma.category.findUnique({ where: { name: catName } }).catch(() => null);
            if (!existing) {
                await prisma.category.create({
                    data: { name: catName }
                }).catch(() => { });
                console.log(`Added category: ${catName}`);
            }
        }

        console.log("Success!");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
