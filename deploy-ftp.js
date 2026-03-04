const fs = require('fs');
const path = require('path');
const basicFtp = require('basic-ftp');

async function uploadToFTP() {
  const client = new basicFtp.Client();
  client.ftp.verbose = true;

  try {
    console.log('Connecting to FTP...');
    await client.access({
      host: 'ftp.appviza.com',
      port: 2002,
      user: 'suankhundaeng@appviza.com',
      password: 'nQqV6c5s'
    });

    console.log('Connected! Uploading files...');

    // ฟังก์ชันสำหรับอัปโหลดโฟลเดอร์
    async function uploadDirectory(localDir, remoteDir) {
      const files = fs.readdirSync(localDir);
      
      for (const file of files) {
        const localPath = path.join(localDir, file);
        const remotePath = path.posix.join(remoteDir, file);
        const stat = fs.statSync(localPath);

        if (stat.isDirectory()) {
          console.log(`Creating directory: ${remotePath}`);
          await client.ensureDir(remotePath);
          await uploadDirectory(localPath, remotePath);
        } else {
          console.log(`Uploading: ${localPath} -> ${remotePath}`);
          await client.uploadFrom(localPath, remotePath);
        }
      }
    }

    // อัปโหลดไฟล์จาก .next/static
    if (fs.existsSync('.next/static')) {
      await uploadDirectory('.next/static', 'public_html/_next/static');
    }

    // อัปโหลดไฟล์จาก public
    if (fs.existsSync('public')) {
      await uploadDirectory('public', 'public_html');
    }

    // อัปโหลดไฟล์จาก .next/server/app
    if (fs.existsSync('.next/server/app')) {
      await uploadDirectory('.next/server/app', 'public_html');
    }

    // อัปโหลด package.json และ package-lock.json
    await client.uploadFrom('package.json', 'public_html/package.json');
    await client.uploadFrom('package-lock.json', 'public_html/package-lock.json');

    // สร้างไฟล์ server.js สำหรับรันบน server
    const serverContent = `
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
`;
    
    await client.uploadFrom(Buffer.from(serverContent), 'public_html/server.js');

    console.log('Upload completed successfully!');
    
  } catch (err) {
    console.error('FTP Error:', err);
  } finally {
    client.close();
  }
}

uploadToFTP();
