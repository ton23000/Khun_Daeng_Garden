const fs = require('fs');
const path = require('path');

const pubDir = path.join(__dirname, 'public');
const imgDir = path.join(pubDir, 'images', 'products');

const copyImage = (srcName, destFolder, destName) => {
    const srcPath = path.join(imgDir, srcName);
    const destPath = path.join(destFolder, destName);
    
    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${srcName} to ${destName}`);
    } else if (!fs.existsSync(srcPath)) {
        console.log(`Source ${srcName} not found!`);
    } else {
        console.log(`${destName} already exists.`);
    }
};

// 1. nueng-nai-jakrawan.jpg (was nueng-jakawan.jpg)
copyImage('nueng-jakawan.jpg', imgDir, 'nueng-nai-jakrawan.jpg');

// 2. ngoen-na.jpg (was ngern-na.jpg)
copyImage('ngern-na.jpg', imgDir, 'ngoen-na.jpg');

// 3. donya-queen-sirikit.jpg (use dao-rueang as fallback if no real image)
if (!fs.existsSync(path.join(imgDir, 'donya-queen-sirikit.jpg'))) {
    copyImage('dao-rueang.jpg', imgDir, 'donya-queen-sirikit.jpg');
}

// 4. som-prattana-premium.jpg (use som-prattana.jpg)
copyImage('som-prattana.jpg', imgDir, 'som-prattana-premium.jpg');

// 5. phin-nak-dang.jpg (use chuan-chom.jpg as fallback if no real image)
if (!fs.existsSync(path.join(imgDir, 'phin-nak-dang.jpg'))) {
    copyImage('chuan-chom.jpg', imgDir, 'phin-nak-dang.jpg');
}

// 6. placeholder-tree.jpg (in public/)
const files = fs.readdirSync(imgDir);
const anyJpg = files.find(f => f.endsWith('.jpg'));
if (anyJpg && !fs.existsSync(path.join(pubDir, 'placeholder-tree.jpg'))) {
    fs.copyFileSync(path.join(imgDir, anyJpg), path.join(pubDir, 'placeholder-tree.jpg'));
    console.log(`Copied ${anyJpg} to placeholder-tree.jpg`);
}

console.log("Finished missing image fix.");
