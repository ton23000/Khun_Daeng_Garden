// สคริปต์ทดสอบ SMTP - ใช้ environment variables แทนการใส่ credentials ตรงๆ
// วิธีใช้: ตั้งค่าใน .env.local แล้วรัน: node scripts/test-smtp.js

require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Fallback to .env

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function run() {
    try {
        console.log("Verifying SMTP connection...");
        const result = await transporter.verify();
        console.log("✅ Connection verified:", result);
    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}
run();
