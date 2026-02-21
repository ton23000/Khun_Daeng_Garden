const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Create a dummy user
        const user = await prisma.user.create({
            data: {
                firstName: 'Test',
                lastName: 'Delete',
                phone: '0999999999',
                password: 'hash',
                role: 'USER',
                verified: true,
            }
        });
        console.log('Created user:', user.id);

        // 2. Add some relations that a normal user would have (Booking, Notification)
        const tree = await prisma.tree.findFirst();
        let bookingId = null;
        if (tree) {
            const booking = await prisma.booking.create({
                data: {
                    userId: user.id,
                    pickupDate: new Date(),
                    totalPrice: 100,
                    deposit: 50,
                    refCode: 'DEL' + Date.now(),
                    items: {
                        create: [{ treeId: tree.id, quantity: 1, price: 100 }]
                    }
                }
            });
            bookingId = booking.id;
            console.log('Created booking:', bookingId);
        } // else ignore

        // 3. Try deleting the user
        console.log('Attempting deletion...');
        await prisma.user.delete({ where: { id: user.id } });
        console.log('SUCCESS: User deleted');
    } catch (e) {
        console.error('ERROR during test:', e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
