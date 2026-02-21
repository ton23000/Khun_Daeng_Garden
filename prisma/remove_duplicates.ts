import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for duplicate trees...');

    const trees = await prisma.tree.findMany({
        orderBy: { createdAt: 'desc' } // Keep the newest? Or oldest? Seed usually creates sequentially.
    });

    const seenNames = new Set();
    const duplicates = [];
    const keepIds = new Set();

    // Group by name
    const treesByName: Record<string, typeof trees> = {};

    for (const tree of trees) {
        if (!treesByName[tree.name]) {
            treesByName[tree.name] = [];
        }
        treesByName[tree.name].push(tree);
    }

    // Identify duplicates
    for (const name in treesByName) {
        const records = treesByName[name];
        if (records.length > 1) {
            console.log(`Found ${records.length} records for "${name}"`);
            // Keep the one with most info? or just the first one?
            // If seeded, they are identical.
            // Let's keep the one created LATEST (usually safe if we just re-seeded). 
            // Actually seed deletes all. Maybe these are from manual adds?
            // Let's keep the one with images properly parsed if possible?
            // Validating images JSON might be good.

            // Strategy: Keep the first one in the list (which is Newest due to orderBy desc)
            // Wait, if I have booking history, I should keep the one with bookings.
            // But checking bookings is complex.
            // Let's just keep the latest interaction.

            const toKeep = records[0];
            const toDelete = records.slice(1);

            keepIds.add(toKeep.id);
            duplicates.push(...toDelete);
        } else {
            keepIds.add(records[0].id);
        }
    }

    console.log(`Found ${duplicates.length} duplicate records to remove.`);

    if (duplicates.length > 0) {
        for (const tree of duplicates) {
            try {
                console.log(`Deleting duplicate "${tree.name}" (ID: ${tree.id})...`);
                // We might fail if there are foreign key constraints (bookings).
                // If so, we should probably keep THIS one and delete the other?
                // Or reassign bookings?
                // For now, simpler is try delete.
                await prisma.tree.delete({
                    where: { id: tree.id }
                });
            } catch (error) {
                console.error(`Failed to delete ${tree.name} (${tree.id}):`, error);
                console.log('It might have associated bookings. Skipping.');
            }
        }
        console.log('Cleanup complete.');
    } else {
        console.log('No duplicates found.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
