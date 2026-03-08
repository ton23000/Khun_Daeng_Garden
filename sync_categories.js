const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Get all categories from trees (no where filter)
  const trees = await prisma.tree.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  const categoriesInTrees = [
    ...new Set(
      trees.map((t) => t.category).filter((c) => c && c.trim() !== ""),
    ),
  ];
  console.log("Categories found in trees:", categoriesInTrees);

  // Get existing categories
  const existingCategories = await prisma.category.findMany({
    select: { name: true },
  });
  const existingNames = new Set(existingCategories.map((c) => c.name));

  // Add missing categories
  let added = 0;
  for (const name of categoriesInTrees) {
    if (!existingNames.has(name)) {
      await prisma.category.create({
        data: { id: require("crypto").randomUUID(), name },
      });
      console.log(`✅ Added: ${name}`);
      added++;
    } else {
      console.log(`⏭️  Already exists: ${name}`);
    }
  }

  const allCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  console.log(`\nDone! Added ${added} new categories.`);
  console.log(
    "All categories now:",
    allCategories.map((c) => c.name),
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
