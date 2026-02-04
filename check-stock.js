const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStock() {
    const tree = await prisma.tree.findUnique({
        where: { id: 'f331a375-654c-4148-8abe-07f10e88f56b' },
        select: {
            id: true,
            name: true,
            stock: true,
            reserved: true,
            sold: true
        }
    });

    console.log('Tree Stock Info:');
    console.log(JSON.stringify(tree, null, 2));

    await prisma.$disconnect();
}

checkStock().catch(console.error);
