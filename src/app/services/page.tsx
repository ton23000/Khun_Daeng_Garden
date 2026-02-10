import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import Link from 'next/link';

export default function ServicesPage() {
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <ScrollAnimation animation="fade-up">
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#166534' }}>
                    บริการของเรา
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem' }}>
                    เลือกบริการที่คุณต้องการเพื่อดูรายละเอียดเพิ่มเติม
                </p>
            </ScrollAnimation>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* วิธีการสั่งซื้อ */}
                <ScrollAnimation animation="fade-up" delay={100}>
                    <Link href="/how-to-order" style={{ textDecoration: 'none' }}>
                        <Card style={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            height: '100%'
                        }} className="hover:shadow-xl hover:-translate-y-2">
                            <CardHeader>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                                <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>
                                    วิธีการสั่งซื้อ
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                                    ขั้นตอนง่ายๆ ในการจองต้นไม้ผ่านเว็บไซต์ และการชำระเงิน
                                </p>
                                <div style={{ marginTop: '1rem', color: '#166534', fontWeight: 'bold' }}>
                                    อ่านเพิ่มเติม →
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </ScrollAnimation>

                {/* คำปรึกษาการปลูก */}
                <ScrollAnimation animation="fade-up" delay={200}>
                    <Link href="/consultation" style={{ textDecoration: 'none' }}>
                        <Card style={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            height: '100%'
                        }} className="hover:shadow-xl hover:-translate-y-2">
                            <CardHeader>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
                                <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>
                                    คำปรึกษาการปลูก
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                                    บริการให้คำแนะนำวิธีการดูแลรักษาต้นไม้แต่ละชนิดให้เติบโตสวยงาม
                                </p>
                                <div style={{ marginTop: '1rem', color: '#166534', fontWeight: 'bold' }}>
                                    อ่านเพิ่มเติม →
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </ScrollAnimation>

                {/* FAQ */}
                <ScrollAnimation animation="fade-up" delay={300}>
                    <Link href="/faq" style={{ textDecoration: 'none' }}>
                        <Card style={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            height: '100%'
                        }} className="hover:shadow-xl hover:-translate-y-2">
                            <CardHeader>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❓</div>
                                <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>
                                    คำถามที่พบบ่อย
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                                    รวมคำถามที่พบบ่อยเกี่ยวกับการดูแลต้นไม้และการสั่งซื้อ
                                </p>
                                <div style={{ marginTop: '1rem', color: '#166534', fontWeight: 'bold' }}>
                                    อ่านเพิ่มเติม →
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </ScrollAnimation>
            </div>

            {/* Contact Section */}
            <ScrollAnimation animation="fade-up" delay={400}>
                <div style={{
                    marginTop: '3rem',
                    padding: '2rem',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '0.5rem',
                    textAlign: 'center'
                }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534', marginBottom: '1rem' }}>
                        ต้องการความช่วยเหลือเพิ่มเติม?
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                        ติดต่อเราได้ทุกวัน 08:00 - 18:00 น.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="tel:0898762045" style={{
                            backgroundColor: '#166534',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}>
                            📞 089-876-2045
                        </a>
                        <Link href="/contact" style={{
                            backgroundColor: 'white',
                            color: '#166534',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            border: '2px solid #166534'
                        }}>
                            ติดต่อเรา
                        </Link>
                    </div>
                </div>
            </ScrollAnimation>
        </div>
    );
}
