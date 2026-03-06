const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const oldBaseDir = path.join(
  __dirname,
  "public",
  "images",
  "products",
  "รูปต้นไม้ลงในระบบ",
);

const newBaseDir = path.join(
  __dirname,
  "public",
  "images",
  "products",
  "system_plants",
);

// Mapping from Thai folder/db name to English folder name
const englishNames = {
  กระดุมทอง: "kradum_thong",
  กวักพระพรหม: "kwak_phra_phrom",
  คุ้มภัย: "khum_phai",
  ชวนชม: "chuan_chom",
  ดอกเก็ดตะหวา: "dok_ket_ta_wa",
  ดาวเรือง: "dao_rueang",
  ปริหางกระจอก: "pri_hang_krajok",
  พยาคล้าทอง: "phaya_khla_thong",
  มรดกโลก: "moradok_lok",
  รวยทรัพย์: "ruai_sap",
  ฤษีผสม: "ruesi_phasom",
  สมปราถนา: "som_pratthana",
  สมปราถนา2: "som_pratthana_premium",
  หนึ่งในจักวาล: "nueng_nai_chakkrawan",
  อุดมโชค: "udom_chok",
  เงินหนา: "ngoen_na",
  เตยทอง: "toei_thong",
  ไทรหัวใจด่าง: "sai_huajai_dang",
  พญาคล้าทอง: "phaya_khla_thong",
  ฤาษีผสม: "ruesi_phasom",
  สมปรารถนา: "som_pratthana",
  "สมปรารถนา (พรีเมียม)": "som_pratthana_premium",
  หนึ่งจักรวาล: "nueng_chakkrawan",
};

async function main() {
  console.log("🌳 Starting image path normalization to avoid Vercel 404s...");

  if (!fs.existsSync(newBaseDir)) {
    fs.mkdirSync(newBaseDir, { recursive: true });
  }

  // Iterate over DB trees to find those with /images/products/รูปต้นไม้ลงในระบบ/ paths
  const trees = await prisma.tree.findMany();
  let updatedCount = 0;

  for (const tree of trees) {
    if (!tree.images) continue;
    try {
      const imagesList = JSON.parse(tree.images);
      const isAffected = imagesList.some((img) =>
        img.includes("รูปต้นไม้ลงในระบบ"),
      );

      if (isAffected) {
        // We find the english mapping for this tree
        const enName = englishNames[tree.name] || `tree_${tree.id.slice(0, 8)}`;
        const treeNewDir = path.join(newBaseDir, enName);

        if (!fs.existsSync(treeNewDir)) {
          fs.mkdirSync(treeNewDir, { recursive: true });
        }

        let newImagesList = [];
        for (let i = 0; i < imagesList.length; i++) {
          const imgUrl = imagesList[i];
          if (!imgUrl.includes("รูปต้นไม้ลงในระบบ")) {
            newImagesList.push(imgUrl);
            continue;
          }

          // Old path on disk might be encoded in various ways, let's just find the actual file if it exists, but the easiest is decoding the URL
          const decodedPath = decodeURIComponent(imgUrl);
          const parts = decodedPath.split("/");
          const oldFileName = parts[parts.length - 1];
          const oldFolderName = parts[parts.length - 2];

          const oldFilePath = path.join(oldBaseDir, oldFolderName, oldFileName);

          const newFileName = `${enName}_${i + 1}${path.extname(oldFileName)}`;
          const newFilePath = path.join(treeNewDir, newFileName);

          if (fs.existsSync(oldFilePath)) {
            // copy file
            fs.copyFileSync(oldFilePath, newFilePath);
            newImagesList.push(
              `/images/products/system_plants/${enName}/${newFileName}`,
            );
          } else {
            console.log(`⚠️ File not found locally to copy: ${oldFilePath}`);
            // If we can't find it, we keep the old path just in case, or we try another heuristic
            newImagesList.push(imgUrl);
          }
        }

        // Update DB
        await prisma.tree.update({
          where: { id: tree.id },
          data: { images: JSON.stringify(newImagesList) },
        });

        console.log(`✅ Updated DB and copied files for tree: ${tree.name}`);
        updatedCount++;
      }
    } catch (e) {
      console.log(`Error parsing images for ${tree.name}`, e);
    }
  }

  console.log(`\n🎉 Normalized ${updatedCount} trees to English paths!`);
  console.log(`Don't forget to push the new 'system_plants' folder to git!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
