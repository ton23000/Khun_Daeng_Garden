// fix_image_paths.js
// แก้ไข path รูปภาพใน Database จาก /images/products/{slug}/{slug}.jpg เป็น /images/products/{slug}.jpg
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Map จาก path เก่า (nested) -> ไฟล์ใหม่ (flat)
const pathFixes = [
  {
    old: "/images/products/udom-chok/udom-chok.jpg",
    newPath: "/images/products/udom-chok.jpg",
  },
  {
    old: "/images/products/nueng-jakawan/nueng-jakawan.jpg",
    newPath: "/images/products/nueng-jakawan.jpg",
  },
  {
    old: "/images/products/som-prattana/som-prattana.jpg",
    newPath: "/images/products/som-prattana.jpg",
  },
  {
    old: "/images/products/ruesi-phasom/ruesi-phasom.jpg",
    newPath: "/images/products/ruesi-phasom.jpg",
  },
  {
    old: "/images/products/ruay-sap/ruay-sap.jpg",
    newPath: "/images/products/ruay-sap.jpg",
  },
  {
    old: "/images/products/moradok-lok/moradok-lok.jpg",
    newPath: "/images/products/moradok-lok.jpg",
  },
  {
    old: "/images/products/phaya-kla-thong/phaya-kla-thong.jpg",
    newPath: "/images/products/phaya-kla-thong.jpg",
  },
  {
    old: "/images/products/prihang-krajok/prihang-krajok.jpg",
    newPath: "/images/products/prihang-krajok.jpg",
  },
  {
    old: "/images/products/dao-rueang/dao-rueang.jpg",
    newPath: "/images/products/dao-rueang.jpg",
  },
  {
    old: "/images/products/dok-get-thawa/dok-get-thawa.jpg",
    newPath: "/images/products/dok-get-thawa.jpg",
  },
  {
    old: "/images/products/chuan-chom/chuan-chom.jpg",
    newPath: "/images/products/chuan-chom.jpg",
  },
  {
    old: "/images/products/khum-phai/khum-phai.jpg",
    newPath: "/images/products/khum-phai.jpg",
  },
  {
    old: "/images/products/kwak-phra-phrom/kwak-phra-phrom.jpg",
    newPath: "/images/products/kwak-phra-phrom.jpg",
  },
  {
    old: "/images/products/kradum-thong/kradum-thong.jpg",
    newPath: "/images/products/kradum-thong.jpg",
  },
  {
    old: "/images/products/thai-huai-jai-dang/thai-huai-jai-dang.jpg",
    newPath: "/images/products/thai-huai-jai-dang.jpg",
  },
  {
    old: "/images/products/toei-thong/toei-thong.jpg",
    newPath: "/images/products/toei-thong.jpg",
  },
  {
    old: "/images/products/ngern-na/ngern-na.jpg",
    newPath: "/images/products/ngern-na.jpg",
  },
  {
    old: "/images/products/ngoen-na/ngoen-na.jpg",
    newPath: "/images/products/ngern-na.jpg",
  },
  {
    old: "/images/products/pud-son/pud-son.jpg",
    newPath: "/images/products/pud-son.jpg",
  },
  {
    old: "/images/products/phin-nak-dang/phin-nak-dang.jpg",
    newPath: "/images/products/phin-nak-dang.jpg",
  },
  {
    old: "/images/products/nueng-nai-jakrawan/nueng-nai-jakrawan.jpg",
    newPath: "/images/products/nueng-nai-jakrawan.jpg",
  },
  {
    old: "/images/products/som-prattana-premium/som-prattana-premium.jpg",
    newPath: "/images/products/som-prattana-premium.jpg",
  },
  {
    old: "/images/products/donya-queen-sirikit/donya-queen-sirikit.jpg",
    newPath: "/images/products/donya-queen-sirikit.jpg",
  },
];

async function main() {
  console.log("🔍 กำลังดึงข้อมูลต้นไม้ทั้งหมด...");
  const trees = await prisma.tree.findMany({
    select: { id: true, name: true, images: true },
  });
  console.log(`พบต้นไม้ทั้งหมด ${trees.length} รายการ\n`);

  let fixedCount = 0;
  for (const tree of trees) {
    let images;
    try {
      images = JSON.parse(tree.images);
    } catch {
      images = [tree.images];
    }

    let changed = false;
    const fixedImages = images.map((img) => {
      const fix = pathFixes.find(
        (f) =>
          f.old === img ||
          (img.includes("/images/products/") &&
            img.endsWith("/" + img.split("/").pop())),
      );
      if (fix && img !== fix.newPath) {
        console.log(`  ✅ ${tree.name}: ${img} → ${fix.newPath}`);
        changed = true;
        return fix.newPath;
      }
      // Auto-fix: ถ้าเป็น nested path เช่น /images/products/foo/foo.jpg → /images/products/foo.jpg
      const nestedMatch = img.match(/^(\/images\/products\/)([^/]+)\/\2\.jpg$/);
      if (nestedMatch) {
        const flatPath = `${nestedMatch[1]}${nestedMatch[2]}.jpg`;
        console.log(`  ✅ ${tree.name}: ${img} → ${flatPath}`);
        changed = true;
        return flatPath;
      }
      return img;
    });

    if (changed) {
      await prisma.tree.update({
        where: { id: tree.id },
        data: { images: JSON.stringify(fixedImages) },
      });
      fixedCount++;
    }
  }

  console.log(`\n✅ แก้ไขเสร็จสิ้น: ${fixedCount} รายการถูกอัปเดต`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Error:", e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
