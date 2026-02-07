const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fetching existing trees...');
    const trees = await prisma.tree.findMany({ select: { category: true } });

    const categories = [...new Set(trees.map(t => t.category).filter(Boolean))];
    console.log(`Found ${categories.length} unique categories:`, categories);

    for (const cat of categories) {
        try {
            await prisma.category.upsert({
                where: { name: cat },
                update: {},
                create: { name: cat }
            });
            console.log(`Synced category: ${cat}`);
        } catch (e) {
            console.error(`Failed to sync ${cat}:`, e);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
