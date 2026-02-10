import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import Link from 'next/link';

export default function FAQPage() {
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <ScrollAnimation animation="fade-up">
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/services" style={{ color: '#166534', textDecoration: 'none' }}>
                        ← กลับไปหน้าบริการ
                    </Link>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#166534' }}>
                    คำถามที่พบบ่อย
                </h1>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={100}>
                <Card>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>
                            รวมคำถามที่พบบ่อยเกี่ยวกับการดูแลต้นไม้และการสั่งซื้อ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ lineHeight: '1.8' }}>
                            {/* FAQ 1 */}
                            <div style={{
                                marginBottom: '2rem',
                                padding: '1.5rem',
                                backgroundColor: '#f9fafb',
                                borderRadius: '0.5rem'
                            }}>
                                <p style={{ fontWeight: 'bold', color: '#166534', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                                    Q: ต้นไม้ที่สั่งซื้อจะมีการรับประกันหรือไม่?
                                </p>
                                <p style={{ color: '#374151', paddingLeft: '1rem' }}>
                                    A: รับประกันต้นไม้ทุกต้น 7 วัน หากพบปัญหาสามารถเปลี่ยนได้ฟรี
                                </p>
                            </div>

                            {/* FAQ 2 */}
                            <div style={{
                                marginBottom: '2rem',
                                padding: '1.5rem',
                                backgroundColor: '#f9fafb',
                                borderRadius: '0.5rem'
                            }}>
                                <p style={{ fontWeight: 'bold', color: '#166534', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                                    Q: ใช้เวลานานแค่ไหนในการจัดส่ง?
                                </p>
                                <p style={{ color: '#374151', paddingLeft: '1rem' }}>
                                    A: จัดส่งภายใน 3-5 วันทำการ หรือตามวันที่นัดหมาย
                                </p>
                            </div>

                            {/* FAQ 3 */}
                            <div style={{
                                marginBottom: '2rem',
                                padding: '1.5rem',
                                backgroundColor: '#f9fafb',
                                borderRadius: '0.5rem'
                            }}>
                                <p style={{ fontWeight: 'bold', color: '#166534', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                                    Q: สามารถมารับสินค้าเองได้หรือไม่?
                                </p>
                                <p style={{ color: '#374151', paddingLeft: '1rem' }}>
                                    A: สามารถมารับได้ที่ร้าน โดยแจ้งล่วงหน้า 1 วัน
                                </p>
                            </div>

                            {/* FAQ 4 */}
                            <div style={{
                                marginBottom: '2rem',
                                padding: '1.5rem',
                                backgroundColor: '#f9fafb',
                                borderRadius: '0.5rem'
                            }}>
                                <p style={{ fontWeight: 'bold', color: '#166534', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                                    Q: ต้นไม้ที่ซื้อควรดูแลอย่างไร?
                                </p>
                                <p style={{ color: '#374151', paddingLeft: '1rem' }}>
                                    A: แต่ละชนิดมีวิธีดูแลแตกต่างกัน สามารถปรึกษาทีมงานได้ตลอดเวลา
                                </p>
                            </div>

                            {/* Contact Box */}
                            <div style={{
                                marginTop: '2rem',
                                padding: '1.5rem',
                                backgroundColor: '#f0fdf4',
                                borderRadius: '0.5rem',
                                borderLeft: '4px solid #166534',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                                    ❓ ยังมีคำถามอื่นๆ?
                                </p>
                                <p style={{ color: '#166534' }}>
                                    ติดต่อเราได้ที่ 089-876-2045 หรือ <Link href="/contact" style={{ color: '#166534', textDecoration: 'underline' }}>กรอกแบบฟอร์มติดต่อ</Link>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ScrollAnimation>
        </div>
    );
}
