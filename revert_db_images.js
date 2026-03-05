const { PrismaClient } = require('@prisma/client');
const path = require('path');
const prisma = new PrismaClient();

async function fixImages() {
    const trees = await prisma.tree.findMany();
    let updatedCount = 0;
    
    for (const tree of trees) {
        let images = [];
        try { 
            images = JSON.parse(tree.images); 
        } catch(e) { 
            continue; 
        }
        
        let newImages = [];
        let updated = false;
        
        for (const img of images) {
            const basename = path.basename(img);
            if (basename === 'placeholder-tree.jpg') {
                newImages.push('/placeholder-tree.jpg');
                if (img !== '/placeholder-tree.jpg') updated = true;
                continue;
            }
            
            const expectedPath = `/images/products/${basename}`;
            if (img !== expectedPath) {
                newImages.push(expectedPath);
                updated = true;
            } else {
                newImages.push(img);
            }
        }
        
        if (updated) {
            await prisma.tree.update({
                where: { id: tree.id },
                data: { images: JSON.stringify(newImages) }
            });
            console.log(`Updated tree: ${tree.name} with new images: ${JSON.stringify(newImages)}`);
            updatedCount++;
        }
    }
    console.log(`Finished reverting ${updatedCount} trees.`);
    await prisma.$disconnect();
}

fixImages().catch(console.error);
