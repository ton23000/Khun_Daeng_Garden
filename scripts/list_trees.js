const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const trees = await prisma.tree.findMany({
    select: { id: true, name: true },
  });

  console.log("--- All Tree Names in DB ---");
  trees.forEach((t) => console.log(`- ${t.name}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
