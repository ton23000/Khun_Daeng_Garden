const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function test() {
  const currentBooking = await prisma.booking.findFirst({
    include: { items: { include: { tree: true } }, user: true },
  });
  console.log("Found booking:", currentBooking.id, currentBooking.refCode);

  const updateData = {
    status: "COMPLETED",
    pickupDate: new Date("2026-05-27"),
  };
  try {
    const res = await prisma.booking.update({
      where: { id: currentBooking.id },
      data: updateData,
    });
    console.log("Update success", res.id);
  } catch (e) {
    console.error("Update failed:", e.message);
  }
}
test()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
