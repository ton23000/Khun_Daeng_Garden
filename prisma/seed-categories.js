const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Check existing categories
  const existing = await prisma.category.findMany();
  console.log("Existing categories:", existing);

  // Check existing tree categories
  const trees = await prisma.$queryRaw`SELECT DISTINCT category FROM Tree`;
  console.log("Tree categories in use:", trees);

  // Categories to add
  const categoriesToAdd = ["ไม้แดด", "ไม้รำไร"];

  for (const name of categoriesToAdd) {
    const exists = existing.find((c) => c.name === name);
    if (!exists) {
      const cat = await prisma.category.create({ data: { name } });
      console.log(`Added category: ${cat.name}`);
    } else {
      console.log(`Category already exists: ${name}`);
    }
  }

  // Also add any categories used by trees but missing from Category table
  for (const row of trees) {
    const catName = row.category;
    if (!catName) continue;
    const existsInDb = existing.find((c) => c.name === catName);
    const existsInNew = categoriesToAdd.includes(catName);
    if (!existsInDb && !existsInNew) {
      const cat = await prisma.category.create({ data: { name: catName } });
      console.log(`Added missing tree category: ${cat.name}`);
    }
  }

  // Final result
  const all = await prisma.category.findMany({ orderBy: { name: "asc" } });
  console.log(
    "\nAll categories now:",
    all.map((c) => c.name),
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
