const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function findImage(filename, dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const found = findImage(filename, fullPath);
            if (found) return found;
        } else if (file === filename) {
            return fullPath;
        }
    }
    return null;
}

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
            
            const startDir = path.join(__dirname, 'public', 'images', 'products');
            const foundPath = findImage(basename, startDir);
            
            if (foundPath) {
                const relativePath = '/' + path.relative(path.join(__dirname, 'public'), foundPath).replace(/\\/g, '/');
                if (relativePath !== img) {
                    newImages.push(relativePath);
                    updated = true;
                } else {
                    newImages.push(img);
                }
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
    console.log(`Finished updating ${updatedCount} trees.`);
    await prisma.$disconnect();
}

fixImages().catch(console.error);
