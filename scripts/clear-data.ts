import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_X8SjUaNfZsu5@ep-little-shape-aimr4jke-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function clearData() {
  console.log('Starting data cleanup...');

  try {
    // 1. Clear Bookings and related data (Order & Order Management)
    console.log('Clearing bookings, items, and notifications...');
    await prisma.adminNotification.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.bookingItem.deleteMany();
    await prisma.booking.deleteMany();
    
    // 2. Clear reviews and favorites (Report/User data)
    console.log('Clearing reviews and favorites...');
    await prisma.reviewHelpful.deleteMany();
    await prisma.review.deleteMany();
    await prisma.favorite.deleteMany();

    // 3. Clear contact messages
    console.log('Clearing contact messages...');
    await prisma.contactMessage.deleteMany();
    
    // 4. Clear PasswordResets
    console.log('Clearing password reset tokens...');
    await prisma.passwordReset.deleteMany();

    // 5. Reset Tree stats (Report data for products)
    // Keep the product data but reset the sales/reservations/reviews counts to 0
    console.log('Resetting tree statistics (sold, reserved, rating, reviewCount)...');
    await prisma.tree.updateMany({
      data: {
        sold: 0,
        reserved: 0,
        rating: 0,
        reviewCount: 0
      }
    });

    // 6. Delete users EXCEPT ADMIN
    // Keep 'ADMIN' role so the system owner can still log in
    console.log('Clearing user accounts (excluding ADMINs)...');
    const deleteUsersResult = await prisma.user.deleteMany({
      where: {
        role: {
          not: 'ADMIN' // Only delete non-admin users
        }
      }
    });
    console.log(`Deleted ${deleteUsersResult.count} user accounts.`);

    console.log('Data cleared successfully!');
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearData();
