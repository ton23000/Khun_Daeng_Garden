const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Category prefix mapping
const categoryPrefixes = {
  "🌞 ไม้แดด": "A",
  "🌤️ ไม้รำไร": "B",
  "🌑 ไม้ร่ม": "C",
  "🌺 ไม้ดอก": "D",
};

async function generateSku(category) {
  const prefix = categoryPrefixes[category] || "Z";

  // Find existing SKUs with this prefix, get max number
  const existing = await prisma.tree.findMany({
    where: { sku: { startsWith: prefix } },
    select: { sku: true },
  });

  let maxNum = 0;
  for (const t of existing) {
    const num = parseInt(t.sku.slice(1));
    if (!isNaN(num) && num > maxNum) maxNum = num;
  }

  return `${prefix}${String(maxNum + 1).padStart(3, "0")}`;
}

async function main() {
  // Get all trees without SKU, grouped by category
  const trees = await prisma.tree.findMany({
    where: { sku: null },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${trees.length} trees without SKU...`);

  // Group by category
  const byCategory = {};
  for (const tree of trees) {
    if (!byCategory[tree.category]) byCategory[tree.category] = [];
    byCategory[tree.category].push(tree);
  }

  for (const [category, catTrees] of Object.entries(byCategory)) {
    const prefix = categoryPrefixes[category] || "Z";
    console.log(
      `\nAssigning SKUs for category: ${category} (prefix: ${prefix})`,
    );

    let counter = 1;
    for (const tree of catTrees) {
      const sku = `${prefix}${String(counter).padStart(3, "0")}`;
      await prisma.tree.update({
        where: { id: tree.id },
        data: { sku },
      });
      console.log(`  ${tree.name} -> ${sku}`);
      counter++;
    }
  }

  console.log("\nDone! All trees have SKU codes now.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
