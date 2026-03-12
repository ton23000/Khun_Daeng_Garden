// ทดสอบส่งอีเมลผ่าน Brevo Transactional API (REST)
// ต้องการ Brevo API Key (ไม่ใช่ SMTP Password)
// หาได้ที่ https://app.brevo.com > SMTP & API > API Keys

const https = require('https');

// ===== ใส่ Brevo API Key ตรงนี้ =====
// เอามาจาก https://app.brevo.com > Settings > SMTP & API > API Keys
const BREVO_API_KEY = process.env.BREVO_API_KEY || 'YOUR_BREVO_API_KEY_HERE';
const TO_EMAIL = 'fhjilyyjg@gmail.com';
const FROM_EMAIL = 'fhjilyyjg@gmail.com'; // ต้องเป็นอีเมลที่ยืนยันใน Brevo แล้ว

const body = JSON.stringify({
  sender: { name: 'Khun Daeng Garden', email: FROM_EMAIL },
  to: [{ email: TO_EMAIL }],
  subject: '🧪 ทดสอบ Brevo API',
  htmlContent: '<h1>สวัสดีครับ!</h1><p>อีเมลนี้ส่งผ่าน Brevo REST API ✅</p>'
});

const options = {
  hostname: 'api.brevo.com',
  port: 443,
  path: '/v3/smtp/email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'api-key': BREVO_API_KEY,
    'Content-Length': Buffer.byteLength(body)
  }
};

console.log('📧 กำลังส่งอีเมลผ่าน Brevo API...');
console.log('API Key:', BREVO_API_KEY.substring(0, 20) + '...');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    if (res.statusCode === 201) {
      console.log('✅ ส่งอีเมลสำเร็จ!');
    } else {
      console.log('❌ ส่งอีเมลไม่สำเร็จ - ดู Response ด้านบน');
    }
  });
});

req.on('error', (e) => console.error('❌ Error:', e.message));
req.write(body);
req.end();
