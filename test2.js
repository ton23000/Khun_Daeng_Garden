const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.tree.findMany({ select: { name: true, tags: true } }).then(res => { console.dir(res, { depth: null, maxArrayLength: null }); p.$disconnect() })
