
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTree() {
    try {
        const trees = await prisma.tree.findMany({
            where: {
                name: {
                    contains: 'คุ้มภัย'
                }
            }
        });
        console.log('Trees found:', JSON.stringify(trees, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkTree();
