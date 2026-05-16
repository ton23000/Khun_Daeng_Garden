const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

const pubDir = path.join(__dirname, "public");
const imgDir = path.join(pubDir, "images", "products");

async function createMissingImages() {
  const trees = await prisma.tree.findMany();
  let missingImages = new Set();

  for (const tree of trees) {
    let images = [];
    try {
      images = JSON.parse(tree.images);
    } catch (e) {
      continue;
    }
    for (const img of images) {
      missingImages.add(img);
    }
  }

  const files = fs.readdirSync(imgDir);
  const fallbackSource = path.join(
    imgDir,
    files.find((f) => f.endsWith(".jpg")),
  );

  let createdCount = 0;
  for (const imgPath of missingImages) {
    let targetPath;
    if (imgPath.startsWith("/images/products/")) {
      targetPath = path.join(imgDir, path.basename(imgPath));
    } else if (imgPath === "/placeholder-tree.jpg") {
      targetPath = path.join(pubDir, "placeholder-tree.jpg");
    } else {
      console.log("Unrecognized path format:", imgPath);
      continue;
    }

    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(fallbackSource, targetPath);
      console.log(`Created fallback for ${imgPath}`);
      createdCount++;
    }
  }

  // Explicitly handle ones from 404s the user gave if anything else is missing
  const explicitlyMissing = [
    "moradok-lok.jpg",
    "khum-phai.jpg",
    "udom-chok.jpg",
    "kradum-thong.jpg",
    "ruesi-phasom.jpg",
    "kwak-phra-phrom.jpg",
  ];
  for (const name of explicitlyMissing) {
    const dest = path.join(imgDir, name);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(fallbackSource, dest);
      console.log(`Created fallback for explicit 404 ${name}`);
      createdCount++;
    }
  }

  console.log(`Created ${createdCount} missing images.`);
  await prisma.$disconnect();
}

createMissingImages().catch(console.error);
