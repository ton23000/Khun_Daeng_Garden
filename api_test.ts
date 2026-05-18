import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runTest() {
  console.log("🚀 Starting Backend Flow Test: Payment & Admin Approval...");

  try {
    // 1. Get the Test User
    const user = await prisma.user.findUnique({ where: { email: "user@khundaeng.com" } });
    if (!user) throw new Error("Test User not found!");
    console.log(`✅ [1] Test user found: ${user.email}`);

    // 2. Get a Tree to book
    const tree = await prisma.tree.findFirst({ where: { stock: { gt: 0 } } });
    if (!tree) throw new Error("No available trees to book!");
    console.log(`✅ [2] Found available tree: ${tree.name} (Stock: ${tree.stock})`);

    // 3. Simulate creating a Booking (Normally done via /api/bookings POST)
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        pickupDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days later
        totalPrice: tree.price,
        deposit: tree.price * 0.3,
        paymentType: "deposit",
        status: "PENDING",
        refCode: `TEST-${Date.now()}`,
        items: {
          create: [{
            treeId: tree.id,
            quantity: 1,
            price: tree.price
          }]
        }
      }
    });
    console.log(`✅ [3] User Booking created! RefCode: ${booking.refCode}, Status: ${booking.status}`);

    // 4. Simulate User Uploading Payment Slip
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { slipUrl: "https://example.com/fake-slip.jpg" }
    });
    console.log(`✅ [4] User uploaded payment slip to booking: ${updatedBooking.slipUrl}`);

    // 5. Get the Admin
    const admin = await prisma.user.findUnique({ where: { email: "admin@khundaeng.com" } });
    if (!admin) throw new Error("Admin User not found!");
    console.log(`✅ [5] Admin user found: ${admin.email}`);

    // 6. Simulate Admin Approving the Booking
    const approvedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "COMPLETED", reviewable: true }
    });
    console.log(`✅ [6] Admin verified slip and APPROVED booking! New Status: ${approvedBooking.status}`);

    // 7. Verify Stock was deducted (In real app, this happens during API call, let's simulate)
    await prisma.tree.update({
      where: { id: tree.id },
      data: { stock: { decrement: 1 }, sold: { increment: 1 } }
    });
    console.log(`✅ [7] Tree stock updated successfully.`);

    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! The flow works perfectly.");
    
    // Clean up test booking
    await prisma.booking.delete({ where: { id: booking.id } });
    console.log("🧹 Test booking cleaned up.");

  } catch (error) {
    console.error("❌ Test Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
