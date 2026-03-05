const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public', 'images', 'products');

function flatten(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            flatten(fullPath);
        } else if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
            const destPath = path.join(targetDir, file);
            if (fullPath !== destPath && !fs.existsSync(destPath)) {
                try {
                    fs.copyFileSync(fullPath, destPath);
                    console.log(`Copied ${file} from ${path.relative(targetDir, fullPath)}`);
                } catch(e) {
                    console.error(`Failed to copy ${file}:`, e);
                }
            } else if (fullPath !== destPath) {
                // Also overwrite if exists to be safe
                try {
                    fs.copyFileSync(fullPath, destPath);
                    // console.log(`Overwrited ${file} from ${path.relative(targetDir, fullPath)}`);
                } catch(e) {}
            }
        }
    }
}

flatten(targetDir);
console.log("Done copying product images to the root folder.");
