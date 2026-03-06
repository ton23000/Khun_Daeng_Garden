const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createMockData() {
  try {
    console.log("Setting up mock data for Staff Flow validation...");

    // 1. Create a Staff User
    const hashedPassword = await bcrypt.hash("password123", 10);
    const staff = await prisma.user.upsert({
      where: { email: "staff_test@example.com" },
      update: { role: "staff", password: hashedPassword },
      create: {
        firstName: "Test",
        lastName: "Staff",
        email: "staff_test@example.com",
        phone: "0822222222",
        password: hashedPassword,
        role: "staff",
        verified: true,
      },
    });
    console.log(
      `✅ Staff member created: ${staff.email} | Role: ${staff.role}`,
    );

    // 2. Create a Mock PENDING Order
    // Get the first available tree
    const tree = await prisma.tree.findFirst({
      where: { status: "AVAILABLE" },
    });

    if (tree) {
      const booking = await prisma.booking.create({
        data: {
          userId: staff.id, // Just use the staff id as the buyer for simplicity
          pickupDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          totalPrice: tree.price,
          deposit: tree.price * 0.3,
          refCode: `TEST-ORD-${Math.floor(Math.random() * 10000)}`,
          status: "PENDING",
          items: {
            create: [
              {
                treeId: tree.id,
                quantity: 1,
                price: tree.price,
              },
            ],
          },
        },
      });
      console.log(`✅ Pending Mock Order created: ${booking.refCode}`);
    } else {
      console.log("⚠️ No trees available to create a mock order.");
    }
  } catch (error) {
    console.error("❌ Error setting up mock data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createMockData();
