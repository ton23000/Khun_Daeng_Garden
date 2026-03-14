import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { Phone, MessageCircle, MapPin, Clock, Leaf, ShoppingCart, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'บริการของเรา | สวนคุณแดง',
};

export default function ServicesPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Section */}
            <ScrollAnimation animation="fade-up">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ color: '#059669', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        บริการของสวนคุณแดง
                    </span>
                    <h1 style={{ fontSize: '3rem', marginTop: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>
                        สิ่งที่เราทำได้ให้คุณ
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '1rem', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto 0' }}>
                        คัดสรรต้นไม้คุณภาพ พร้อมคำปรึกษาการดูแลรักษา และบริการจองออนไลน์สะดวกง่ายดาย
                    </p>
                </div>
            </ScrollAnimation>

            {/* Service Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <ScrollAnimation animation="fade-up" delay={100}>
                    <Link href="/shop" style={{ textDecoration: 'none' }}>
                        <Card style={{ cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }} className="hover:shadow-xl hover:-translate-y-2">
                            <CardHeader>
                                <div style={{ width: '64px', height: '64px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
                                <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>รับต้นไม้คุณภาพ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>เลือกชมต้นไม้มงคล ไม้ดอก ไม้ประดับ คัดสรรจากสวนที่ได้มาตรฐาน มาที่หน้าร้านหรือจองออนไลน์ได้เลย</p>
                                <div style={{ marginTop: '1rem', color: '#166534', fontWeight: 'bold' }}>ดูสินค้าทั้งหมด →</div>
                            </CardContent>
                        </Card>
                    </Link>
                </ScrollAnimation>

                <ScrollAnimation animation="fade-up" delay={200}>
                    <Card style={{ height: '100%', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }}>
                        <CardHeader>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>🌱</div>
                            <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>คำปรึกษาการดูแลต้นไม้</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>ทีมงานพร้อมให้คำแนะนำวิธีดูแลรักษาต้นไม้แต่ละชนิดฟรี ทักมาถามได้ตลอด ทั้ง LINE และโทรศัพท์</p>
                        </CardContent>
                    </Card>
                </ScrollAnimation>

                <ScrollAnimation animation="fade-up" delay={300}>
                    <Link href="/faq" style={{ textDecoration: 'none' }}>
                        <Card style={{ cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }} className="hover:shadow-xl hover:-translate-y-2">
                            <CardHeader>
                                <div style={{ width: '64px', height: '64px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>❓</div>
                                <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>คำถามที่พบบ่อย</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>รวมคำถามเกี่ยวกับต้นไม้ การจอง การชำระเงิน และการดูแลรักษา</p>
                                <div style={{ marginTop: '1rem', color: '#166534', fontWeight: 'bold' }}>อ่านเพิ่มเติม →</div>
                            </CardContent>
                        </Card>
                    </Link>
                </ScrollAnimation>
            </div>

            {/* How it works */}
            <ScrollAnimation animation="fade-up">
                <div style={{ backgroundColor: '#f0fdf4', borderRadius: '1.5rem', padding: '3rem', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', textAlign: 'center', marginBottom: '2.5rem' }}>
                        <ShoppingCart size={28} style={{ display: 'inline', marginRight: '0.5rem', color: '#16a34a' }} />
                        วิธีการสั่งจองต้นไม้
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        {[
                            { step: '1', icon: '🔍', title: 'เลือกต้นไม้', desc: 'เลือกต้นไม้จากร้านค้าออนไลน์ หรือมาดูหน้าสวนโดยตรง' },
                            { step: '2', icon: '🛒', title: 'กดจอง', desc: 'เพิ่มลงตะกร้าและดำเนินการจอง กรอกข้อมูลที่ต้องการ' },
                            { step: '3', icon: '💳', title: 'ชำระเงิน', desc: 'โอนเงินผ่านบัญชีธนาคาร และส่งสลิปยืนยัน' },
                            { step: '4', icon: '🌿', title: 'รับต้นไม้', desc: 'นัดมารับต้นไม้ที่หน้าสวนได้เลย ทีมงานเตรียมพร้อมให้' },
                        ].map((item) => (
                            <div key={item.step} style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                                <div style={{ fontWeight: 'bold', color: '#166534', fontSize: '0.875rem', marginBottom: '0.25rem' }}>ขั้นที่ {item.step}</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.5rem' }}>{item.title}</div>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollAnimation>

            {/* Contact Cards */}
            <div style={{ padding: '3rem 0', borderTop: '1px solid #e5e7eb', marginBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>ช่องทางติดต่อ</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <ScrollAnimation animation="slide-in-left" delay={100}>
                        <Card style={{ textAlign: 'center', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#166534' }}>
                                <Phone size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>โทรศัพท์</h3>
                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>ทุกวัน 08:00 - 17:00 น.</p>
                            <a href="tel:0812345678" style={{ color: '#166534', fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none' }}>081-234-5678</a>
                        </Card>
                    </ScrollAnimation>

                    <ScrollAnimation animation="fade-up" delay={200}>
                        <Card style={{ textAlign: 'center', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#1e40af' }}>
                                <MessageCircle size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>LINE</h3>
                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>ตอบกลับรวดเร็ว</p>
                            <a href="https://line.me/ti/p/nananI009" target="_blank" rel="noopener noreferrer" style={{ color: '#1e40af', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none' }}>nananI009</a>
                        </Card>
                    </ScrollAnimation>

                    <ScrollAnimation animation="slide-in-right" delay={300}>
                        <Card style={{ textAlign: 'center', padding: '2rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', borderRadius: '1rem' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#166534' }}>
                                <MapPin size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>หน้าร้าน</h3>
                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>ยินดีต้อนรับทุกวัน</p>
                            <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '0.95rem', lineHeight: '1.6' }}>383 ถ.กาญจนวินิช ต.พะวง<br />อ.เมือง จ.สงขลา 90100</p>
                        </Card>
                    </ScrollAnimation>
                </div>
            </div>

            {/* Map + CTA */}
            <ScrollAnimation animation="fade-up">
                <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 400px', padding: '3rem', backgroundColor: '#059669', color: 'white' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', marginBottom: '1.5rem' }}>
                                เยี่ยมชมสวนของเรา
                            </h2>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <li style={{ display: 'flex', gap: '1rem' }}>
                                    <MapPin size={24} style={{ opacity: 0.8, flexShrink: 0 }} />
                                    <div>
                                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>สวนคุณแดง</p>
                                        <p style={{ opacity: 0.9, lineHeight: '1.5' }}>383 ถ.กาญจนวินิช ต.พะวง<br />อ.เมือง จ.สงขลา 90100</p>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', gap: '1rem' }}>
                                    <Clock size={24} style={{ opacity: 0.8, flexShrink: 0 }} />
                                    <div>
                                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>เวลาทำการ</p>
                                        <p style={{ opacity: 0.9, lineHeight: '1.5' }}>ทุกวัน 08:00 – 17:00 น.</p>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', gap: '1rem' }}>
                                    <Leaf size={24} style={{ opacity: 0.8, flexShrink: 0 }} />
                                    <div>
                                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>มารับต้นไม้ได้ที่สวน</p>
                                        <p style={{ opacity: 0.9, lineHeight: '1.5' }}>สั่งออนไลน์แล้วนัดมารับที่หน้าสวนได้เลย<br />ทีมงานเตรียมต้นไม้ให้พร้อม</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div style={{ flex: '1 1 400px', padding: '3rem', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
                            <HelpCircle size={48} color="#16a34a" />
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }}>ยังมีข้อสงสัย?</h2>
                            <p style={{ color: '#6b7280', maxWidth: '300px' }}>ทักหาเราได้ทุกช่องทาง ทีมงานพร้อมช่วยเหลือ</p>
                            <Link href="/contact" style={{ backgroundColor: '#166534', color: 'white', fontWeight: 'bold', padding: '1rem 2rem', borderRadius: '0.5rem', textDecoration: 'none' }}>
                                ติดต่อเรา
                            </Link>
                        </div>
                    </div>
                </div>
            </ScrollAnimation>
        </div>
    );
}
