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
