const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const imagesBaseDir = path.join(
  __dirname,
  "public",
  "images",
  "products",
  "รูปต้นไม้ลงในระบบ",
);

// Map folder names (with typos) to actual Database names
const nameMapping = {
  พยาคล้าทอง: "พญาคล้าทอง",
  ฤษีผสม: "ฤาษีผสม",
  สมปราถนา: "สมปรารถนา",
  สมปราถนา2: "สมปรารถนา (พรีเมียม)",
  หนึ่งในจักวาล: "หนึ่งจักรวาล",
};

async function main() {
  console.log("🌳 Start matching tree images (Round 2: Typos)...");

  if (!fs.existsSync(imagesBaseDir)) {
    console.log("❌ Image directory not found:", imagesBaseDir);
    return;
  }

  const folders = fs.readdirSync(imagesBaseDir);
  let matchCount = 0;

  for (const folder of folders) {
    if (!nameMapping[folder]) continue; // Only process mapped folders this time

    const folderPath = path.join(imagesBaseDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const dbName = nameMapping[folder];
    console.log(`\n📂 Processing folder: ${folder} -> mapping to ${dbName}`);

    // Find tree by exact name
    const trees = await prisma.tree.findMany({
      where: {
        name: dbName,
      },
    });

    if (trees.length === 0) {
      console.log(`❌ No tree found matching mapped name: ${dbName}`);
      continue;
    }

    const files = fs
      .readdirSync(folderPath)
      .filter((f) => f.match(/\.(jpg|jpeg|png|webp|gif)$/i));

    if (files.length === 0) {
      console.log(`⚠️ No images found in folder: ${folder}`);
      continue;
    }

    // Prepare image paths for DB
    const imagePaths = files.map(
      (file) => `/images/products/รูปต้นไม้ลงในระบบ/${folder}/${file}`,
    );

    // Update the matched tree
    for (const tree of trees) {
      console.log(`✅ Matched tree: ${tree.name} (ID: ${tree.id})`);

      const imagesJson = JSON.stringify(imagePaths);
      await prisma.tree.update({
        where: { id: tree.id },
        data: { images: imagesJson },
      });

      console.log(
        `   Added ${imagePaths.length} images: ${imagePaths.join(", ")}`,
      );
      matchCount++;
    }
  }

  console.log(`\n🎉 Finished! Fixed ${matchCount} typos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
