// สคริปต์สำหรับตั้งค่า environment variables บน Vercel
// วิธีใช้: ตั้งค่าตัวแปรด้านล่างใน .env.local แล้วรัน: node scripts/set-brevo-env.js
// หา API Key ได้ที่: https://app.brevo.com > Settings > SMTP & API > API Keys

require("dotenv").config({ path: ".env.local" });
require("dotenv").config(); // Fallback to .env

const { execSync } = require("child_process");

// ===== ตั้งค่าตรงนี้ก่อนรัน =====
const BREVO_API_KEY = process.env.BREVO_API_KEY || ""; // ใส่ API Key ของ Brevo
const EMAIL_FROM = process.env.EMAIL_FROM || ""; // ใส่อีเมลผู้ส่งที่ verify แล้วบน Brevo
// ================================

if (!BREVO_API_KEY || !EMAIL_FROM) {
  console.error("❌ กรุณาตั้งค่า BREVO_API_KEY และ EMAIL_FROM ก่อนรัน");
  process.exit(1);
}

function addEnv(name, value, env) {
  try {
    execSync(`npx vercel env add ${name} ${env}`, {
      input: Buffer.from(value, "utf8"),
      stdio: ["pipe", "inherit", "inherit"],
    });
    console.log(`✅ Added ${name} to ${env}`);
  } catch (e) {
    console.error(`❌ Failed ${name} to ${env}:`, e.message);
  }
}

addEnv("BREVO_API_KEY", BREVO_API_KEY, "production");
addEnv("EMAIL_FROM", EMAIL_FROM, "production");
console.log("Done!");
