import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.user.upsert({
    where: { phone: "0800000000" },
    update: {
      email: "admin@khundaeng.com",
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      firstName: "Admin",
      lastName: "System",
      phone: "0800000000",
      email: "admin@khundaeng.com",
      password: hashedPassword,
      role: "ADMIN",
      verified: true,
    },
  });

  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { phone: "0811111111" },
    update: {
      email: "user@khundaeng.com",
      password: userPassword,
      role: "USER",
    },
    create: {
      firstName: "Test",
      lastName: "User",
      phone: "0811111111",
      email: "user@khundaeng.com",
      password: userPassword,
      role: "USER",
      verified: true,
    },
  });

  console.log("Admin created:", admin.email);
  console.log("User created:", user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
