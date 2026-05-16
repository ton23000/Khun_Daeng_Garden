import nodemailer from "nodemailer";

// Nodemailer transporter (Brevo SMTP - for other emails)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FROM_EMAIL = process.env.EMAIL_FROM || "fhjilyyjg@gmail.com";
const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

interface PasswordResetEmailParams {
  email: string;
  resetLink: string;
  userName: string;
}

/**
 * Generate password reset HTML template
 */
export function passwordResetEmailTemplate(
  userName: string,
  resetLink: string,
): string {
  return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#059669,#10b981);padding:32px;text-align:center;color:white">
            <h1 style="margin:0;font-size:24px">🌿 คุณแดงการ์เด้น</h1>
            <p style="margin:8px 0 0">รีเซ็ตรหัสผ่านของคุณ</p>
        </div>
        <div style="padding:24px">
            <p style="color:#374151">สวัสดีค่ะ คุณ${userName} 🙏</p>
            <p style="color:#374151">เราได้รับคำขอให้เปลี่ยนรหัสผ่านสำหรับบัญชีของคุณ</p>
            <p style="color:#374151">กรุณากดปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่:</p>
            <div style="text-align:center;margin:24px 0">
                <a href="${resetLink}" style="display:inline-block;padding:14px 32px;background-color:#059669;color:white!important;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px">
                    🔓 รีเซ็ตรหัสผ่าน
                </a>
            </div>
            <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px;margin-top:20px;font-size:14px;border-radius:0 8px 8px 0">
                ⏰ ลิงก์นี้จะหมดอายุใน <strong>1 ชั่วโมง</strong>
            </div>
            <p style="margin-top:20px;color:#6b7280;font-size:13px">หากปุ่มไม่ทำงาน คัดลอกลิงก์นี้ไปวางในเบราว์เซอร์:</p>
            <div style="word-break:break-all;font-size:12px;color:#6b7280;background:#f3f4f6;padding:10px;border-radius:4px">${resetLink}</div>
            <p style="margin-top:20px;color:#6b7280;font-size:13px">หากคุณไม่ได้ทำการขอเปลี่ยนรหัสผ่าน สามารถเพิกเฉยต่ออีเมลฉบับนี้ได้เลย</p>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:12px">
            © คุณแดงการ์เด้น | ต.บ้านเป้า อ.เมือง จ.ลำปาง
        </div>
    </div>`;
}

/**
 * Send password reset email using Brevo REST API
 */
export async function sendPasswordResetEmail({
  email,
  resetLink,
  userName,
}: PasswordResetEmailParams) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "คุณแดงการ์เด้น", email: FROM_EMAIL },
      to: [{ email }],
      subject: "รีเซ็ตรหัสผ่าน - Khun Daeng Garden",
      htmlContent: passwordResetEmailTemplate(userName, resetLink),
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("❌ Error sending email via Brevo API:", err);
    throw new Error(err.message || "Failed to send email via Brevo");
  }

  const data = await response.json();
  console.log("✅ Password reset email sent via Brevo API:", data.messageId);
  return { success: true, data };
}

/**
 * Send a generic email using SendGrid
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  try {
    const mailOptions = {
      to: Array.isArray(to) ? to : [to],
      from: FROM_EMAIL,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent via Resend");
    return { success: true, data: mailOptions };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: "Email service unavailable" };
  }
}

// Email Templates

export function orderConfirmationEmail(
  refCode: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  deposit: number,
  pickupDate: string,
): string {
  const itemRows = items
    .map(
      (item) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">฿${item.price.toLocaleString()}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#059669,#10b981);padding:32px;text-align:center;color:white">
            <h1 style="margin:0;font-size:24px">🌿 คุณแดงการ์เด้น</h1>
            <p style="margin:8px 0 0">ยืนยันการสั่งจอง</p>
        </div>
        <div style="padding:24px">
            <p style="color:#374151">สวัสดีค่ะ 🙏</p>
            <p style="color:#374151">ออเดอร์ <strong>#${refCode}</strong> ถูกสร้างเรียบร้อยแล้ว</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
                <thead><tr style="background:#f9fafb"><th style="padding:8px;text-align:left">สินค้า</th><th style="padding:8px;text-align:center">จำนวน</th><th style="padding:8px;text-align:right">ราคา</th></tr></thead>
                <tbody>${itemRows}</tbody>
            </table>
            <div style="background:#f0fdf4;padding:16px;border-radius:8px;margin:16px 0">
                <p style="margin:4px 0"><strong>ยอดรวม:</strong> ฿${total.toLocaleString()}</p>
                <p style="margin:4px 0"><strong>มัดจำ (30%):</strong> ฿${deposit.toLocaleString()}</p>
                <p style="margin:4px 0"><strong>วันรับของ:</strong> ${pickupDate}</p>
            </div>
            <p style="color:#6b7280;font-size:14px">กรุณาชำระเงินมัดจำภายใน 24 ชั่วโมง</p>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:12px">
            © คุณแดงการ์เด้น | ต.บ้านเป้า อ.เมือง จ.ลำปาง
        </div>
    </div>`;
}

export function orderStatusEmail(
  refCode: string,
  status: string,
  note?: string,
): string {
  const statusMap: Record<
    string,
    { text: string; color: string; icon: string }
  > = {
    PAID: { text: "ชำระเงินแล้ว", color: "#3b82f6", icon: "💰" },
    PREPARING: { text: "กำลังเตรียมต้นไม้", color: "#8b5cf6", icon: "🌱" },
    READY: { text: "พร้อมรับได้แล้ว", color: "#22c55e", icon: "✅" },
    COMPLETED: { text: "เสร็จสิ้น", color: "#6b7280", icon: "🎉" },
    CANCELLED: { text: "ยกเลิก", color: "#ef4444", icon: "❌" },
  };
  const s = statusMap[status] || { text: status, color: "#6b7280", icon: "📦" };

  return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#059669,#10b981);padding:32px;text-align:center;color:white">
            <h1 style="margin:0;font-size:24px">🌿 คุณแดงการ์เด้น</h1>
            <p style="margin:8px 0 0">อัปเดตสถานะออเดอร์</p>
        </div>
        <div style="padding:24px;text-align:center">
            <div style="font-size:48px;margin-bottom:16px">${s.icon}</div>
            <h2 style="color:${s.color};margin:0 0 8px">${s.text}</h2>
            <p style="color:#374151">ออเดอร์ <strong>#${refCode}</strong></p>
            ${note ? `<p style="color:#6b7280;background:#f9fafb;padding:12px;border-radius:8px;margin-top:16px">${note}</p>` : ""}
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:12px">
            © คุณแดงการ์เด้น | ต.บ้านเป้า อ.เมือง จ.ลำปาง
        </div>
    </div>`;
}

export function contactFormEmail(
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
): string {
  return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#059669,#10b981);padding:32px;text-align:center;color:white">
            <h1 style="margin:0;font-size:24px">📩 ข้อความจากเว็บไซต์</h1>
        </div>
        <div style="padding:24px">
            <table style="width:100%">
                <tr><td style="padding:8px 0;color:#6b7280;width:100px">ชื่อ:</td><td style="padding:8px 0;font-weight:bold">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">อีเมล:</td><td style="padding:8px 0">${email}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">โทรศัพท์:</td><td style="padding:8px 0">${phone || "-"}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">เรื่อง:</td><td style="padding:8px 0;font-weight:bold">${subject}</td></tr>
            </table>
            <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px;border-left:4px solid #059669">
                <p style="white-space:pre-line;margin:0;color:#374151">${message}</p>
            </div>
        </div>
    </div>`;
}

/**
 * Generate email verification HTML template
 */
export function verificationEmailTemplate(
  userName: string,
  verifyLink: string,
): string {
  return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#059669,#10b981);padding:32px;text-align:center;color:white">
            <h1 style="margin:0;font-size:24px">🌿 คุณแดงการ์เด้น</h1>
            <p style="margin:8px 0 0">ยืนยันการสมัครสมาชิก</p>
        </div>
        <div style="padding:24px">
            <p style="color:#374151">สวัสดีค่ะ คุณ${userName} 🙏</p>
            <p style="color:#374151">ขอบคุณที่สมัครสมาชิกกับคุณแดงการ์เด้น!</p>
            <p style="color:#374151">กรุณากดปุ่มด้านล่างเพื่อยืนยันอีเมลของคุณ:</p>
            <div style="text-align:center;margin:24px 0">
                <a href="${verifyLink}" style="display:inline-block;padding:14px 32px;background-color:#059669;color:white!important;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px">
                    ✅ ยืนยันอีเมล
                </a>
            </div>
            <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px;margin-top:20px;font-size:14px;border-radius:0 8px 8px 0">
                ⏰ ลิงก์นี้จะหมดอายุใน <strong>24 ชั่วโมง</strong>
            </div>
            <p style="margin-top:20px;color:#6b7280;font-size:13px">หากปุ่มไม่ทำงาน คัดลอกลิงก์นี้ไปวางในเบราว์เซอร์:</p>
            <div style="word-break:break-all;font-size:12px;color:#6b7280;background:#f3f4f6;padding:10px;border-radius:4px">${verifyLink}</div>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:12px">
            © คุณแดงการ์เด้น | ต.บ้านเป้า อ.เมือง จ.ลำปาง
        </div>
    </div>`;
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail({
  email,
  verifyLink,
  userName,
}: {
  email: string;
  verifyLink: string;
  userName: string;
}) {
  try {
    const mailOptions = {
      to: email,
      from: FROM_EMAIL,
      subject: "ยืนยันอีเมล - Khun Daeng Garden",
      html: verificationEmailTemplate(userName, verifyLink),
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent via Resend");
    return { success: true, data: mailOptions };
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    return { success: false, error: "Email service unavailable" };
  }
}

/**
 * Generate admin magic link email HTML template
 */
export function adminMagicLinkTemplate(
  userName: string,
  magicLink: string,
): string {
  return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#059669,#10b981);padding:32px;text-align:center;color:white">
            <h1 style="margin:0;font-size:24px">🌿 คุณแดงการ์เด้น</h1>
            <p style="margin:8px 0 0">การเข้าสู่ระบบสำหรับ Admin/Staff</p>
        </div>
        <div style="padding:24px">
            <p style="color:#374151">สวัสดีค่ะ คุณ${userName} 🙏</p>
            <p style="color:#374151">ได้มีการร้องขอให้เข้าสู่ระบบสำหรับบัญชีผู้ดูแลระบบด้วยอีเมลนี้</p>
            <p style="color:#374151">กรุณากดปุ่มด้านล่างเพื่อเข้าสู่ระบบ:</p>
            <div style="text-align:center;margin:24px 0">
                <a href="${magicLink}" style="display:inline-block;padding:14px 32px;background-color:#d97706;color:white!important;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px">
                    🔑 เข้าสู่ระบบ
                </a>
            </div>
            <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px;margin-top:20px;font-size:14px;border-radius:0 8px 8px 0">
                ⏰ ลิงก์นี้จะหมดอายุใน <strong>15 นาที</strong>
            </div>
            <p style="margin-top:20px;color:#6b7280;font-size:13px">หากปุ่มไม่ทำงาน คัดลอกลิงก์นี้ไปวางในเบราว์เซอร์:</p>
            <div style="word-break:break-all;font-size:12px;color:#6b7280;background:#f3f4f6;padding:10px;border-radius:4px">${magicLink}</div>
            <p style="margin-top:20px;color:#ef4444;font-size:14px;font-weight:bold">
                ⚠️ คำเตือน: หากคุณไม่ได้ทำการเข้าสู่ระบบ กรุณาเพิกเฉยต่ออีเมลฉบับนี้และห้ามส่งต่อให้บุคคลอื่นเด็ดขาด
            </p>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:12px">
            © คุณแดงการ์เด้น | ต.บ้านเป้า อ.เมือง จ.ลำปาง
        </div>
    </div>`;
}

/**
 * Send admin magic link email
 */
export async function sendAdminMagicLinkEmail({
  email,
  magicLink,
  userName,
}: {
  email: string;
  magicLink: string;
  userName: string;
}) {
  try {
    const mailOptions = {
      to: email,
      from: FROM_EMAIL,
      subject: "ลิงก์การเข้าสู่ระบบสำหรับแอดมิน - Khun Daeng Garden",
      html: adminMagicLinkTemplate(userName, magicLink),
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Admin magic link email sent via Resend");
    return { success: true, data: mailOptions };
  } catch (error) {
    console.error("❌ Error sending admin magic link email:", error);
    return { success: false, error: "Email service unavailable" };
  }
}
