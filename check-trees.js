const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTrees() {
    try {
        const count = await prisma.tree.count();
        console.log(`Total trees in database: ${count}`);

        if (count > 0) {
            const trees = await prisma.tree.findMany({
                select: {
                    id: true,
                    name: true,
                    price: true,
                    category: true,
                    stock: true
                }
            });
            console.log('\nTrees:');
            trees.forEach(tree => {
                console.log(`- ${tree.name} (${tree.category}) - ฿${tree.price} - Stock: ${tree.stock}`);
            });
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkTrees();
