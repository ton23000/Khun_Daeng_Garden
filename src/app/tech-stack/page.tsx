import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import Link from 'next/link';
import { Code2, Database, ShieldCheck, Mail, Wrench, FileSearch, Server, Layout } from 'lucide-react';

export default function TechStackPage() {
    const techCategories = [
        {
            category: '💻 ภาษาที่ใช้ในการพัฒนา',
            subtitle: 'Programming Languages',
            color: '#3b82f6',
            icon: <Code2 className="w-6 h-6" style={{ color: '#3b82f6' }} />,
            technologies: [
                { name: 'TypeScript', version: '5.x', description: 'ภาษาหลักที่ใช้เขียนคำสั่งควบคุมการทำงานทั้งหมด ช่วยให้โค้ดมีระเบียบ ตรวจสอบง่าย และลดข้อผิดพลาดได้มาก' },
                { name: 'HTML / CSS', version: '-', description: 'ใช้วางโครงสร้างหน้าเว็บไซต์ และตกแต่งสีสันการจัดรูปแบบให้สวยงาม' },
                { name: 'SQL', version: '-', description: 'ภาษาในการจัดการและสื่อสารกับระบบฐานข้อมูล' },
            ]
        },
        {
            category: '🎨 โครงสร้างหลักหน้าบ้านและหลังบ้าน',
            subtitle: 'Core Framework & UI',
            color: '#8b5cf6',
            icon: <Layout className="w-6 h-6" style={{ color: '#8b5cf6' }} />,
            technologies: [
                { name: 'Next.js', version: '16.1', description: 'โครงสร้างหลักที่ครอบคลุมการทำงาน สร้างหน้าเว็บและระบบหลังบ้านให้อยู่ในที่เดียวกันอย่างสมบูรณ์' },
                { name: 'React', version: '19', description: 'เครื่องมือสร้างส่วนติดต่อผู้ใช้ (UI) เช่น ปุ่มกด ฟอร์มต่างๆ ช่วยให้เชื่อมต่อและลื่นไหลโดยไม่ต้องรีเฟรช' },
                { name: 'Lucide React', version: '-', description: 'ชุดไอคอนสวยงามทันสมัยที่นำมาใช้ประดับเมนูและส่วนประกอบต่างๆบนเว็บไซต์' },
            ]
        },
        {
            category: '🗄️ ระบบเก็บข้อมูล',
            subtitle: 'Database & ORM',
            color: '#f59e0b',
            icon: <Database className="w-6 h-6" style={{ color: '#f59e0b' }} />,
            technologies: [
                { name: 'MySQL', version: '8.x', description: 'ระบบฐานข้อมูลหลัก ที่ใช้เก็บข้อมูลทุกอย่าง เช่น รายการต้นไม้ โปรโมชั่น คำสั่งซื้อ และพนักงาน' },
                { name: 'Prisma', version: '6.19', description: 'เครื่องมือตัวกลาง (ORM) แปลคำสั่งไปดึงโชว์หรือบันทึกข้อมูลลงฐานข้อมูลได้รวดเร็วและปลอดภัย' },
            ]
        },
        {
            category: '🔒 ระบบความปลอดภัยและการเข้าถึง',
            subtitle: 'Security & Auth',
            color: '#10b981',
            icon: <ShieldCheck className="w-6 h-6" style={{ color: '#10b981' }} />,
            technologies: [
                { name: 'JWT (JSON Web Token)', version: '9.0', description: 'ระบบสร้างป้ายชื่อจำลอง (Token) เพื่อให้ระบบจำได้ว่าใครกำลังใช้งานอยู่ โดยไม่ต้องล็อคอินซ้ำบ่อยๆ' },
                { name: 'Bcrypt.js', version: '3.0', description: 'กลไกเข้ารหัสผ่าน (Hashing) แปลงรหัสผ่านให้อ่านไม่ออกเพื่อความปลอดภัยสูงสุดก่อนบันทึกลงระบบ' },
            ]
        },
        {
             category: '📧 ระบบแจ้งเตือนทางอีเมล',
             subtitle: 'Email Services',
             color: '#ef4444',
             icon: <Mail className="w-6 h-6" style={{ color: '#ef4444' }} />,
             technologies: [
                 { name: 'Resend / SendGrid', version: '-', description: 'บริการส่งอีเมลอัตโนมัติ ติดต่อลูกค้า หรือส่งลิงก์ตั้งรหัสผ่านใหม่ทางอีเมล (Forgot Password)' },
                 { name: 'Nodemailer', version: '8.0.2', description: 'เครื่องมือจัดการระบบส่งมอบอีเมลที่อยู่เบื้องหลัง' },
             ]
        },
        {
            category: '🛠️ ตัวช่วยทำงานข้อมูล',
            subtitle: 'Utilities & Helpers',
            color: '#06b6d4',
            icon: <Wrench className="w-6 h-6" style={{ color: '#06b6d4' }} />,
            technologies: [
                { name: 'Zod', version: '4.3', description: 'ตัวช่วยคัดกรองเนื้อหา ตรวจสอบความถูกต้องของข้อมูลที่ลูกค้ากรอกมา (เช่น รูปแบบอีเมล) ก่อนจะให้บันทึก' },
                { name: 'QRCode.react', version: '4.2', description: 'ระบบช่วยวาดภาพ QR Code ให้ปรากฏออกมาอัตโนมัติบนหน้าเว็บเพื่อสแกนหรือแชร์' },
                { name: 'FTP (basic-ftp)', version: '5.2', description: 'ระบบหลังบ้านส่งต่อและอัปโหลดไฟล์รูปภาพไปเก็บไว้ในเซิร์ฟเวอร์หลัก' },
            ]
        },
        {
            category: '🤖 ระบบตรวจสอบและทดสอบคุณภาพเว็บ',
            subtitle: 'Testing & QA',
            color: '#14b8a6',
            icon: <FileSearch className="w-6 h-6" style={{ color: '#14b8a6' }} />,
            technologies: [
                { name: 'Playwright', version: '1.58', description: 'บอทจำลองเสมือนคนจริงๆ เข้ามากดคลิกใช้งานเว็บ เพื่อทดสอบว่าใช้งานได้ครบถ้วน' },
                { name: 'Jest', version: '30.2', description: 'ตรวจสอบเช็คฟังก์ชันคำนวณหลังบ้านว่าได้ผลลัพธ์ที่ถูกต้องตามที่ตั้งไว้' },
            ]
        },
        {
            category: '☁️ เซิร์ฟเวอร์และระบบออนไลน์',
            subtitle: 'Hosting & Deployment',
            color: '#0ea5e9',
            icon: <Server className="w-6 h-6" style={{ color: '#0ea5e9' }} />,
            technologies: [
                { name: 'Vercel', version: 'Cloud Platform', description: 'แพลตฟอร์มคลาวด์ฝากเว็บไซต์ ทำให้เว็บออนไลน์เสถียร โหลดเร็ว และเปิดได้จากทุกที่' },
            ]
        }
    ];

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <ScrollAnimation animation="fade-up">
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/" style={{ color: '#166534', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>← กลับหน้าหลัก</span>
                    </Link>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#166534' }}>
                    ระบบและเทคโนโลยีที่ใช้พัฒนา 🚀
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '3rem', maxWidth: '800px', lineHeight: '1.6' }}>
                    ข้อมูลสรุปเครื่องมือและภาษาทั้งหมดที่ขับเคลื่อนระบบของร้าน <b>สวนคุณแดงการ์เด้น (Khun Daeng Garden)</b> โดยแบ่งหมวดหมู่ให้อ่านและทำความเข้าใจได้ง่ายที่สุด
                </p>
            </ScrollAnimation>

            {/* Tech Categories Grid - Better layout for Thai descriptions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr)),', gap: '1.5rem', marginBottom: '4rem' }}>
                {techCategories.map((cat, idx) => (
                    <ScrollAnimation key={cat.category} animation="fade-up" delay={100 + (idx * 50)}>
                        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: `4px solid ${cat.color}`, transition: 'transform 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} className="hover:shadow-lg hover:-translate-y-1">
                            <CardHeader style={{ paddingBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                    {cat.icon}
                                    <CardTitle style={{ fontSize: '1.4rem', color: '#1f2937' }}>
                                        {cat.category}
                                    </CardTitle>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: cat.color, fontWeight: '500', paddingLeft: '2.25rem' }}>
                                    {cat.subtitle}
                                </div>
                            </CardHeader>
                            <CardContent style={{ flexGrow: 1, paddingTop: '0' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {cat.technologies.map((tech) => (
                                        <div key={tech.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>
                                                    {tech.name}
                                                </span>
                                                {tech.version !== '-' && (
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        color: cat.color,
                                                        backgroundColor: `${cat.color}15`,
                                                        padding: '0.125rem 0.5rem',
                                                        borderRadius: '1rem',
                                                        fontWeight: 600
                                                    }}>
                                                        {tech.version}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '1rem', color: '#4b5563', lineHeight: '1.5' }}>
                                                {tech.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </ScrollAnimation>
                ))}
            </div>

            {/* Project Info Footer */}
            <ScrollAnimation animation="fade-up" delay={500}>
                <Card style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '1rem' }}>
                    <CardContent style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#166534', marginBottom: '0.75rem' }}>
                            🌱 Khun Daeng Garden System
                        </div>
                        <div style={{ fontSize: '1.1rem', color: '#15803d', marginBottom: '1rem' }}>
                            พัฒนาระบบด้วยเทคโนโลยีสมัยใหม่ เพื่อประสบการณ์ใช้งานที่ดีที่สุดของคุณลูกค้าและทีมงาน
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#166534', opacity: 0.8 }}>
                            อัปเดตข้อมูลล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </CardContent>
                </Card>
            </ScrollAnimation>
        </div>
    );
}
