import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing admin account...");

  // Fix existing user with phone 0999999999
  await prisma.user.update({
    where: { phone: "0999999999" },
    data: {
      firstName: "Admin",
      lastName: "System",
      role: "admin", // Needs to be lowercase for the UI
    },
  });

  // Create a brand new distinct admin user just in case
  const bcrypt = require("bcryptjs");
  const adminPassword = await bcrypt.hash("admin1234", 10);

  await prisma.user.upsert({
    where: { phone: "0988888888" },
    update: {
      password: adminPassword,
      role: "admin",
      email: "admin.master@khundaeng.com",
      firstName: "Master",
      lastName: "Admin",
      verified: true,
    },
    create: {
      firstName: "Master",
      lastName: "Admin",
      phone: "0988888888",
      email: "admin.master@khundaeng.com",
      password: adminPassword,
      role: "admin",
      verified: true,
    },
  });

  console.log("Fixed and created fresh admin account.");
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
