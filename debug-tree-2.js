
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTree() {
    try {
        const trees = await prisma.tree.findMany({
            where: {
                name: { contains: 'คุ้มภัย' }
            },
            select: {
                id: true,
                name: true,
                stock: true,
                reserved: true,
                status: true
            }
        });
        console.log(JSON.stringify(trees, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkTree();
