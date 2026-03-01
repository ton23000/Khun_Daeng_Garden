const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

// FTP Credentials from your email
const config = {
    host: 'ftp.appviza.com',
    port: 2002,
    user: 'suankhundaeng@appviza.com',
    password: 'nQqV6c5s'
};

async function deployRedirect() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log('Connecting to FTP server...');
        await client.access({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            secure: false
        });

        console.log('Connected! Preparing to upload redirect file...');

        // Go to public_html
        await client.cd('/public_html');

        // Check if index_redirect.html exists
        const localFile = path.join(__dirname, 'index_redirect.html');
        if (!fs.existsSync(localFile)) {
            throw new Error('File index_redirect.html not found!');
        }

        // Upload as index.html (overwriting the existing one)
        console.log('Uploading index_redirect.html as index.html...');
        await client.uploadFrom(localFile, 'index.html');

        console.log('------------------------------------------------');
        console.log('✅ Upload Successful!');
        console.log('Now accessing http://suankhundaeng.appviza.com/ will redirect to your Vercel app.');
        console.log('------------------------------------------------');

    } catch (err) {
        console.error('❌ Deployment failed:', err);
    } finally {
        client.close();
    }
}

deployRedirect();
