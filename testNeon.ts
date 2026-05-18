import { PrismaClient } from '@prisma/client';

const neonPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_X8SjUaNfZsu5@ep-little-shape-aimr4jke-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function testConnection() {
  try {
    console.log("Testing connection to Neon database...");
    const trees = await neonPrisma.tree.count();
    console.log("Successfully connected! Tree count:", trees);
    
    const users = await neonPrisma.user.count();
    console.log("User count:", users);
    
    const bookings = await neonPrisma.booking.count();
    console.log("Booking count:", bookings);
  } catch (error) {
    console.error("Failed to connect to Neon:", error);
  } finally {
    await neonPrisma.$disconnect();
  }
}

testConnection();
