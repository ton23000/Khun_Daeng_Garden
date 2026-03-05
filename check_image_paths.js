const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImagePaths() {
  try {
    const trees = await prisma.tree.findMany({ 
      select: { name: true, images: true } 
    });
    
    console.log('=== Image Paths in Database ===');
    trees.forEach(tree => {
      const images = JSON.parse(tree.images || '[]');
      console.log(`${tree.name}:`, images);
    });
    
    console.log('\n=== Checking for problematic paths ===');
    const problematicPaths = [];
    trees.forEach(tree => {
      const images = JSON.parse(tree.images || '[]');
      images.forEach(img => {
        if (img.includes('/products/') && img.split('/').length > 4) {
          problematicPaths.push({ tree: tree.name, path: img });
        }
      });
    });
    
    if (problematicPaths.length > 0) {
      console.log('Found nested paths that need fixing:');
      problematicPaths.forEach(p => console.log(`- ${p.tree}: ${p.path}`));
    } else {
      console.log('No problematic nested paths found.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImagePaths();
