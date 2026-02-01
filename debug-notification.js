const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Starting Notification Debug...');

    // 1. Get a recent booking
    const booking = await prisma.booking.findFirst({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    if (!booking) {
        console.log('❌ No bookings found to test.');
        return;
    }

    console.log(`✅ Found booking: ${booking.refCode} (ID: ${booking.id})`);
    console.log(`👤 User: ${booking.user.name} (ID: ${booking.user.id}, Phone: ${booking.user.phone})`);
    console.log(`📄 Current Status: ${booking.status}`);

    // 2. Check existing notifications for this user
    const notifications = await prisma.notification.findMany({
        where: { userId: booking.user.id } // DB uses UUID
    });

    console.log(`\n📬 Existing Notifications for User ID ${booking.user.id}: ${notifications.length}`);
    notifications.forEach(n => console.log(`   - [${n.type}] ${n.message} (Read: ${n.read})`));

    // 3. Simulate Logic Check (Logic from route.ts)
    console.log('\n🧠 Testing Logic Simulation:');
    const validatedStatus = 'PREPARING'; // Simulate changing to PREPARING

    // Check condition: if (validated.status && currentBooking.user && booking.userId)
    const condition = !!validatedStatus && !!booking.user && !!booking.userId;
    console.log(`   Condition Check: ${condition}`);
    console.log(`   - validated.status: ${validatedStatus}`);
    console.log(`   - currentBooking.user exists: ${!!booking.user}`);
    console.log(`   - booking.userId: ${booking.userId}`);

    // 4. Try creating a notification manually to see if it works
    console.log('\n🧪 Attempting to create a TEST notification manually...');
    try {
        const newNoti = await prisma.notification.create({
            data: {
                userId: booking.user.id, // Using UUID
                message: "🔔 ทดสอบระบบแจ้งเตือน (Test Notification)",
                type: 'info',
                bookingId: booking.id
            }
        });
        console.log('✅ Manually created notification successfully:', newNoti);
    } catch (e) {
        console.error('❌ Failed to create manual notification:', e);
    }

    console.log('\n🏁 Debug Complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
