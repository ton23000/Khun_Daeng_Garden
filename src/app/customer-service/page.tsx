import { Card, CardContent } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

export const metadata = {
    title: 'บริการลูกค้า | Khun Daeng Garden',
};

export default function CustomerServicePage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
            <ScrollAnimation animation="fade-up">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ color: '#059669', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Customer Service
                    </span>
                    <h1 style={{ fontSize: '3rem', marginTop: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>
                        ศูนย์บริการลูกค้า
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '1rem', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto 0' }}>
                        เราพร้อมให้ความช่วยเหลือและตอบทุกข้อสงสัยของคุณเกี่ยวกับการสั่งซื้อ การดูแลต้นไม้ หรือบริการอื่นๆ
                    </p>
                </div>
            </ScrollAnimation>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
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
                        <a href="#" style={{ color: '#1e40af', fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none' }}>@khundaenggarden</a>
                    </Card>
                </ScrollAnimation>

                <ScrollAnimation animation="slide-in-right" delay={300}>
                    <Card style={{ textAlign: 'center', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }}>
                        <div style={{ width: '64px', height: '64px', backgroundColor: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#b45309' }}>
                            <Mail size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>อีเมล</h3>
                        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>ส่งข้อสงสัยหรือเอกสารได้ตลอด 24 ชม.</p>
                        <a href="mailto:support@khundaenggarden.com" style={{ color: '#b45309', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none' }}>support@khundaenggarden.com</a>
                    </Card>
                </ScrollAnimation>
            </div>

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
                        <div style={{ flex: '1 1 400px', padding: '3rem', backgroundColor: '#f9fafb' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>ส่งข้อความหาเรา</h2>
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 500 }}>ชื่อ - นามสกุล</label>
                                    <input type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }} placeholder="ระบุชื่อของคุณ" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 500 }}>อีเมลหรือเบอร์โทรติดต่อ</label>
                                    <input type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none' }} placeholder="example@email.com" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: 500 }}>ข้อความ / ปัญหาที่พบ</label>
                                    <textarea rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', outline: 'none', resize: 'vertical' }} placeholder="อธิบายปัญหาหรือข้อสงสัยที่ต้องการสอบถาม"></textarea>
                                </div>
                                <button type="button" style={{ backgroundColor: '#166534', color: 'white', fontWeight: 'bold', padding: '1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', marginTop: '1rem' }} className="hover:bg-green-800 transition-colors">
                                    ส่งข้อความ
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </ScrollAnimation>
        </div>
    );
}
