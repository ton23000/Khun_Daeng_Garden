import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Creating new Admin account...");

  const adminPassword = await bcrypt.hash("admin1234", 10);

  const adminUser = await prisma.user.upsert({
    where: { phone: "0999999999" },
    update: {
      password: adminPassword,
      role: "ADMIN",
      email: "admin.new@khundaeng.com",
      verified: true,
    },
    create: {
      firstName: "Admin",
      lastName: "System",
      phone: "0999999999",
      email: "admin.new@khundaeng.com",
      password: adminPassword,
      role: "ADMIN",
      verified: true,
    },
  });

  console.log("");
  console.log("✅ สร้างบัญชี Admin ใหม่เรียบร้อยแล้ว!");
  console.log("─────────────────────────────────────────────────────────");
  console.log("👑 Admin (Database):");
  console.log(`   ชื่อ     : ${adminUser.firstName} ${adminUser.lastName}`);
  console.log(`   Email    : ${adminUser.email}`);
  console.log(`   Phone    : ${adminUser.phone}`);
  console.log(`   Password : admin1234`);
  console.log(`   Role     : ${adminUser.role}`);
  console.log("─────────────────────────────────────────────────────────");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
