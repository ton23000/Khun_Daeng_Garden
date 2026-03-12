const { execSync } = require('child_process');

function addEnv(name, value, env) {
    try {
        execSync(`npx vercel env add ${name} ${env}`, {
            input: Buffer.from(value, 'utf8'),
            stdio: ['pipe', 'inherit', 'inherit']
        });
        console.log(`✅ Added ${name} to ${env}`);
    } catch (e) {
        console.error(`❌ Failed ${name} to ${env}:`, e.message);
    }
}

addEnv('EMAIL_FROM', 'fhjilyyjg@gmail.com', 'production');
console.log('Done!');
