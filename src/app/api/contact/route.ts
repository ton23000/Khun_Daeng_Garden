import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, contactFormEmail } from '@/lib/email';
import { z } from 'zod';

const ContactSchema = z.object({
    name: z.string().min(1, 'กรุณากรอกชื่อ'),
    email: z.string().email('อีเมลไม่ถูกต้อง'),
    phone: z.string().optional(),
    subject: z.string().min(1, 'กรุณากรอกหัวข้อ'),
    message: z.string().min(1, 'กรุณากรอกข้อความ'),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validated = ContactSchema.parse(body);

        // Send email to admin
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@khundaenggarden.com';
        const html = contactFormEmail(
            validated.name,
            validated.email,
            validated.phone || '',
            validated.subject,
            validated.message
        );

        const result = await sendEmail({
            to: adminEmail,
            subject: `[ติดต่อจากเว็บ] ${validated.subject}`,
            html,
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็ว'
            });
        } else {
            // Even if email fails, still respond successfully for UX
            console.error('Email send failed:', result.error);
            return NextResponse.json({
                success: true,
                message: 'ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็ว'
            });
        }
    } catch (error) {
        console.error('Contact form error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        return NextResponse.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' }, { status: 500 });
    }
}
