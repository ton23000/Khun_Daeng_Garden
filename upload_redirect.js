const ftp = require("basic-ftp");
const path = require("path");

async function uploadFile() {
    console.log("Connecting to FTP...");
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
        await client.access({
            host: "ftp.appviza.com",
            user: "suankhundaeng@appviza.com",
            password: "nQqV6c5s",
            port: 2002,
        });
        console.log("✅ ยืนยันรหัสผ่าน FTP สำเร็จ");

        // เข้าโฟลเดอร์รันเว็บ
        await client.cd("public_html");
        console.log("📂 เข้าสู่โฟลเดอร์ public_html สำเร็จ");

        // ลบไฟล์เก่าออกก่อน
        console.log("🗑 ลบไฟล์ index เก่า (ถ้ามี)...");
        try { await client.remove("index.php"); } catch (e) { }
        try { await client.remove("index.html"); } catch (e) { }

        // อัปโหลดไฟล์ใหม่
        console.log("🚀 กำลังอัปโหลดไฟล์ Redirect...");
        await client.uploadFrom("d:/Khun_Daeng_Garden/vercel_redirect/index.php", "index.php");
        await client.uploadFrom("d:/Khun_Daeng_Garden/vercel_redirect/index.html", "index.html");

        console.log("🎉 อัปโหลดขึ้น Server สำเร็จแล้ว!");
    }
    catch (err) {
        console.error("❌ เกิดข้อผิดพลาด:", err);
    }
    client.close();
}

uploadFile();
