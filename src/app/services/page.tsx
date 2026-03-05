import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'บริการลูกค้าของเรา | Khun Daeng Garden',
};

export default function ServicesPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Section */}
            <ScrollAnimation animation="fade-up">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ color: '#059669', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Customer Services & Support
                    </span>
                    <h1 style={{ fontSize: '3rem', marginTop: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>
                        บริการและศูนย์ดูแลลูกค้า
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '1rem', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto 0' }}>
                        ครอบคลุมทุกบริการตั้งแต่การให้คำปรึกษา แนะนำวิธีการปลูก ไปจนถึงการรับประกันสินค้าและการติดต่อสอบถาม
                    </p>
                </div>
            </ScrollAnimation>

            {/* Top Row: Info Linking Cards (How-to, Consultation, FAQ) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <ScrollAnimation animation="fade-up" delay={100}>
                    <Link href="/how-to-order" style={{ textDecoration: 'none' }}>
                        <Card style={{ cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }} className="hover:shadow-xl hover:-translate-y-2">
                            <CardHeader>
                                <div style={{ width: '64px', height: '64px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>🛒</div>
                                <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>วิธีการสั่งซื้อ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>ขั้นตอนง่ายๆ ในการจองต้นไม้ผ่านเว็บไซต์ และการชำระเงิน</p>
                                <div style={{ marginTop: '1rem', color: '#166534', fontWeight: 'bold' }}>อ่านเพิ่มเติม →</div>
                            </CardContent>
                        </Card>
                    </Link>
                </ScrollAnimation>

                <ScrollAnimation animation="fade-up" delay={200}>
                    <Link href="/consultation" style={{ textDecoration: 'none' }}>
                        <Card style={{ cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }} className="hover:shadow-xl hover:-translate-y-2">
                            <CardHeader>
                                <div style={{ width: '64px', height: '64px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>🌱</div>
                                <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>คำปรึกษาการปลูก</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>บริการให้คำแนะนำวิธีการดูแลรักษาต้นไม้แต่ละชนิดให้เติบโตสวยงาม</p>
                                <div style={{ marginTop: '1rem', color: '#166534', fontWeight: 'bold' }}>อ่านเพิ่มเติม →</div>
                            </CardContent>
                        </Card>
                    </Link>
                </ScrollAnimation>

                <ScrollAnimation animation="fade-up" delay={300}>
                    <Link href="/faq" style={{ textDecoration: 'none' }}>
                        <Card style={{ cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }} className="hover:shadow-xl hover:-translate-y-2">
                            <CardHeader>
                                <div style={{ width: '64px', height: '64px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>❓</div>
                                <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>คำถามที่พบบ่อย</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>รวมคำถามที่พบบ่อยเกี่ยวกับการดูแลต้นไม้และการสั่งซื้อ</p>
                                <div style={{ marginTop: '1rem', color: '#166534', fontWeight: 'bold' }}>อ่านเพิ่มเติม →</div>
                            </CardContent>
                        </Card>
                    </Link>
                </ScrollAnimation>
            </div>

            <div style={{ padding: '3rem 0', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', margin: '4rem 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>ช่องทางการติดต่อฉับไว</h2>
                </div>
                {/* Contact Cards Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <ScrollAnimation animation="slide-in-left" delay={100}>
                        <Card style={{ textAlign: 'center', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#166534' }}>
                                <Phone size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>โทรศัพท์</h3>
                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>จันทร์ - เสาร์ 08:00 - 17:00 น.</p>
                            <a href="tel:0616900908" style={{ color: '#166534', fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none' }}>061-690-0908</a>
                        </Card>
                    </ScrollAnimation>

                    <ScrollAnimation animation="fade-up" delay={200}>
                        <Card style={{ textAlign: 'center', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#1e40af' }}>
                                <MessageCircle size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>แชทสด (LINE)</h3>
                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>ตอบกลับรวดเร็วที่สุด</p>
                            <a href="#" style={{ color: '#1e40af', fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none', wordBreak: 'break-word', display: 'block' }}>@khundaenggarden</a>
                        </Card>
                    </ScrollAnimation>

                    <ScrollAnimation animation="slide-in-right" delay={300}>
                        <Card style={{ textAlign: 'center', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#b45309' }}>
                                <Mail size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>อีเมล</h3>
                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>ส่งข้อสงสัยหรือเอกสารได้ตลอด 24 ชม.</p>
                            <a href="mailto:support@khundaenggarden.com" style={{ color: '#b45309', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none', wordBreak: 'break-word', display: 'block' }}>support@khundaenggarden.com</a>
                        </Card>
                    </ScrollAnimation>
                </div>
            </div>

            {/* Bottom Section: Address + Policy & Form Link */}
            <ScrollAnimation animation="fade-up">
                <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 400px', padding: '3rem', backgroundColor: '#059669', color: 'white' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', marginBottom: '1.5rem' }}>ที่อยู่สำหรับส่งเคลมสินค้า / เยี่ยมชมร้าน</h2>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <li style={{ display: 'flex', gap: '1rem' }}>
                                    <MapPin size={24} style={{ opacity: 0.8 }} />
                                    <div>
                                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>สวนคุณแดง</p>
                                        <p style={{ opacity: 0.9, lineHeight: '1.5' }}>383 ถ.กาญจนวินิช ต.พะวง<br />อ.เมือง จ.สงขลา 90100</p>
                                    </div>
                                </li>
                            </ul>
                            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>นโยบายการเคลมสินค้า</p>
                                <p style={{ opacity: 0.9, fontSize: '0.9rem', lineHeight: '1.6' }}>ทางร้านรับประกันความเสียหาย 100% หากเกิดจากการขนส่ง กรุณาถ่ายวิดีโอขณะเปิดกล่องเพื่อใช้เป็นหลักฐานในการเคลมภายใน 24 ชม.</p>
                            </div>
                        </div>
                        <div style={{ flex: '1 1 400px', padding: '3rem', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>หรือส่งข้อความหาเรา</h2>
                            <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '300px' }}>มีคำถามเพิ่มเติม ปัญหา หรือข้อสงสัย? ส่งข้อความถึงแอดมินโดยตรงได้ที่นี่</p>
                            <Link href="/contact" style={{ backgroundColor: '#166534', color: 'white', fontWeight: 'bold', padding: '1rem 2rem', borderRadius: '0.5rem', textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                                ไปหน้าฟอร์มติดต่อเรา
                            </Link>
                        </div>
                    </div>
                </div>
            </ScrollAnimation>
        </div>
    );
}
