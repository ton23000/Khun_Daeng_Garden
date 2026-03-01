import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

interface PasswordResetEmailParams {
    email: string;
    resetLink: string;
    userName: string;
}

/**
 * Send password reset email with reset link
 */
export async function sendPasswordResetEmail({
    email,
    resetLink,
    userName
}: PasswordResetEmailParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Khun Daeng Garden <onboarding@resend.dev>',
            to: email,
            subject: 'รีเซ็ตรหัสผ่าน - Khun Daeng Garden',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background-color: #f9fafb;
                            border-radius: 8px;
                            padding: 30px;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo {
                            font-size: 24px;
                            font-weight: bold;
                            color: #059669;
                            margin-bottom: 10px;
                        }
                        .content {
                            background-color: white;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .button {
                            display: inline-block;
                            padding: 14px 28px;
                            background-color: #059669;
                            color: white !important;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .button:hover {
                            background-color: #047857;
                        }
                        .link-text {
                            word-break: break-all;
                            font-size: 12px;
                            color: #6b7280;
                            background-color: #f3f4f6;
                            padding: 10px;
                            border-radius: 4px;
                            margin-top: 20px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 12px;
                            color: #6b7280;
                        }
                        .warning {
                            background-color: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 12px;
                            margin-top: 20px;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">🌳 Khun Daeng Garden</div>
                        </div>
                        
                        <div class="content">
                            <h2 style="color: #111827; margin-top: 0;">รีเซ็ตรหัสผ่าน</h2>
                            
                            <p>เรียน คุณ${userName},</p>
                            
                            <p>คุณได้ร้องขอการรีเซ็ตรหัสผ่านสำหรับบัญชี Khun Daeng Garden</p>
                            
                            <p>กรุณาคลิกปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่:</p>
                            
                            <div style="text-align: center;">
                                <a href="${resetLink}" class="button">รีเซ็ตรหัสผ่าน</a>
                            </div>
                            
                            <div class="warning">
                                ⏰ ลิงก์นี้จะหมดอายุใน <strong>1 ชั่วโมง</strong>
                            </div>
                            
                            <p style="margin-top: 20px;">หากปุ่มด้านบนไม่ทำงาน คุณสามารถคัดลอกลิงก์ด้านล่างแล้ววางในเบราว์เซอร์:</p>
                            
                            <div class="link-text">${resetLink}</div>
                            
                            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                                <strong>หากคุณไม่ได้ร้องขอการรีเซ็ตรหัสผ่าน</strong> กรุณาเพิกเฉยต่ออีเมลนี้ บัญชีของคุณจะยังคงปลอดภัย
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p>อีเมลนี้ส่งจาก Khun Daeng Garden</p>
                            <p>กรุณาอย่าตอบกลับอีเมลนี้</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('❌ Resend error:', error);
            throw new Error(error.message || 'Failed to send email');
        }

        console.log('✅ Password reset email sent:', data);
        return { success: true, data };

    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw error;
    }
}

/**
 * Send a generic email using Resend
 */
export async function sendEmail({ to, subject, html }: { to: string | string[]; subject: string; html: string }) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Khun Daeng Garden <onboarding@resend.dev>',
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
        });

        if (error) {
            console.error('❌ Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Email sent:', data);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, error: 'Email service unavailable' };
    }
}

// Email Templates

export function orderConfirmationEmail(refCode: string, items: Array<{ name: string; quantity: number; price: number }>, total: number, deposit: number, pickupDate: string): string {
    const itemRows = items.map(item =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">฿${item.price.toLocaleString()}</td></tr>`
    ).join('');

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

export function orderStatusEmail(refCode: string, status: string, note?: string): string {
    const statusMap: Record<string, { text: string; color: string; icon: string }> = {
        'PAID': { text: 'ชำระเงินแล้ว', color: '#3b82f6', icon: '💰' },
        'PREPARING': { text: 'กำลังเตรียมต้นไม้', color: '#8b5cf6', icon: '🌱' },
        'READY': { text: 'พร้อมรับได้แล้ว', color: '#22c55e', icon: '✅' },
        'COMPLETED': { text: 'เสร็จสิ้น', color: '#6b7280', icon: '🎉' },
        'CANCELLED': { text: 'ยกเลิก', color: '#ef4444', icon: '❌' },
    };
    const s = statusMap[status] || { text: status, color: '#6b7280', icon: '📦' };

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
            ${note ? `<p style="color:#6b7280;background:#f9fafb;padding:12px;border-radius:8px;margin-top:16px">${note}</p>` : ''}
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:12px">
            © คุณแดงการ์เด้น | ต.บ้านเป้า อ.เมือง จ.ลำปาง
        </div>
    </div>`;
}

export function contactFormEmail(name: string, email: string, phone: string, subject: string, message: string): string {
    return `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#059669,#10b981);padding:32px;text-align:center;color:white">
            <h1 style="margin:0;font-size:24px">📩 ข้อความจากเว็บไซต์</h1>
        </div>
        <div style="padding:24px">
            <table style="width:100%">
                <tr><td style="padding:8px 0;color:#6b7280;width:100px">ชื่อ:</td><td style="padding:8px 0;font-weight:bold">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">อีเมล:</td><td style="padding:8px 0">${email}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280">โทรศัพท์:</td><td style="padding:8px 0">${phone || '-'}</td></tr>
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
export function verificationEmailTemplate(userName: string, verifyLink: string): string {
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
export async function sendVerificationEmail({ email, verifyLink, userName }: { email: string; verifyLink: string; userName: string }) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Khun Daeng Garden <onboarding@resend.dev>',
            to: email,
            subject: 'ยืนยันอีเมล - Khun Daeng Garden',
            html: verificationEmailTemplate(userName, verifyLink)
        });

        if (error) {
            console.error('❌ Verification email error:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Verification email sent to:', email);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error sending verification email:', error);
        return { success: false, error: 'Email service unavailable' };
    }
}

/**
 * Generate admin magic link email HTML template
 */
export function adminMagicLinkTemplate(userName: string, magicLink: string): string {
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
export async function sendAdminMagicLinkEmail({ email, magicLink, userName }: { email: string; magicLink: string; userName: string }) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Khun Daeng Garden <onboarding@resend.dev>',
            to: email,
            subject: 'ลิงก์การเข้าสู่ระบบสำหรับแอดมิน - Khun Daeng Garden',
            html: adminMagicLinkTemplate(userName, magicLink)
        });

        if (error) {
            console.error('❌ Admin magic link email error:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Admin magic link email sent to:', email);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error sending admin magic link email:', error);
        return { success: false, error: 'Email service unavailable' };
    }
}

