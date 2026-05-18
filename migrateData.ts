import { PrismaClient } from '@prisma/client';

const neonPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_X8SjUaNfZsu5@ep-little-shape-aimr4jke-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

const supabasePrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.droekqenuvxjnbplabfp:onemanT23%402332@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?connection_limit=1"
    }
  }
});

async function migrate() {
  console.log("Starting data migration from Neon to Supabase...");
  
  try {
    // 1. Migrate Users
    console.log("Fetching users...");
    const users = await neonPrisma.user.findMany();
    console.log(`Found ${users.length} users. Inserting to Supabase...`);
    for (const user of users) {
      await supabasePrisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user
      });
    }
    console.log("Users migrated.");

    // 2. Migrate Trees
    console.log("Fetching trees...");
    const trees = await neonPrisma.tree.findMany();
    console.log(`Found ${trees.length} trees. Inserting to Supabase...`);
    for (const tree of trees) {
      await supabasePrisma.tree.upsert({
        where: { id: tree.id },
        update: tree,
        create: tree
      });
    }
    console.log("Trees migrated.");

    // 3. Migrate Bookings
    console.log("Fetching bookings...");
    const bookings = await neonPrisma.booking.findMany();
    console.log(`Found ${bookings.length} bookings. Inserting to Supabase...`);
    for (const booking of bookings) {
      await supabasePrisma.booking.upsert({
        where: { id: booking.id },
        update: booking,
        create: booking
      });
    }
    console.log("Bookings migrated.");

    // 4. Migrate BookingItems
    console.log("Fetching booking items...");
    const bookingItems = await neonPrisma.bookingItem.findMany();
    console.log(`Found ${bookingItems.length} booking items. Inserting to Supabase...`);
    for (const item of bookingItems) {
      await supabasePrisma.bookingItem.upsert({
        where: { id: item.id },
        update: item,
        create: item
      });
    }
    console.log("Booking items migrated.");

    // 5. Migrate Reviews
    console.log("Fetching reviews...");
    const reviews = await neonPrisma.review.findMany();
    console.log(`Found ${reviews.length} reviews. Inserting to Supabase...`);
    for (const review of reviews) {
      await supabasePrisma.review.upsert({
        where: { id: review.id },
        update: review,
        create: review
      });
    }
    console.log("Reviews migrated.");

    // 6. Migrate AdminNotifications
    console.log("Fetching notifications...");
    const notifications = await neonPrisma.adminNotification.findMany();
    console.log(`Found ${notifications.length} notifications. Inserting to Supabase...`);
    for (const notif of notifications) {
      await supabasePrisma.adminNotification.upsert({
        where: { id: notif.id },
        update: notif,
        create: notif
      });
    }
    console.log("Notifications migrated.");

    console.log("🎉 All data migrated successfully!");
  } catch (e) {
    console.error("Error during migration:", e);
  } finally {
    await neonPrisma.$disconnect();
    await supabasePrisma.$disconnect();
  }
}

migrate();
