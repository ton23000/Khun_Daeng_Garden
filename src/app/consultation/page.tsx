import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import Link from 'next/link';

export default function ConsultationPage() {
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <ScrollAnimation animation="fade-up">
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/services" style={{ color: '#166534', textDecoration: 'none' }}>
                        ← กลับไปหน้าบริการ
                    </Link>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#166534' }}>
                    คำปรึกษาการปลูก
                </h1>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={100}>
                <Card>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>
                            บริการให้คำแนะนำวิธีการดูแลรักษาต้นไม้แต่ละชนิดให้เติบโตสวยงาม
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ lineHeight: '1.8' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                                ทีมงานผู้เชี่ยวชาญของเราพร้อมให้คำปรึกษาเกี่ยวกับ:
                            </p>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{
                                    padding: '1.5rem',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '0.5rem',
                                    borderLeft: '4px solid #166534'
                                }}>
                                    <h3 style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                                        🌱 การเลือกต้นไม้ที่เหมาะสมกับสภาพแวดล้อม
                                    </h3>
                                    <p style={{ color: '#6b7280' }}>
                                        แนะนำต้นไม้ที่เหมาะกับแสง น้ำ และอุณหภูมิในพื้นที่ของคุณ
                                    </p>
                                </div>

                                <div style={{
                                    padding: '1.5rem',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '0.5rem',
                                    borderLeft: '4px solid #166534'
                                }}>
                                    <h3 style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                                        🌿 วิธีการปลูกและการดูแลรักษา
                                    </h3>
                                    <p style={{ color: '#6b7280' }}>
                                        เทคนิคการปลูก การตัดแต่ง และการดูแลให้ต้นไม้เติบโตแข็งแรง
                                    </p>
                                </div>

                                <div style={{
                                    padding: '1.5rem',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '0.5rem',
                                    borderLeft: '4px solid #166534'
                                }}>
                                    <h3 style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                                        💧 การให้น้ำและปุ๋ยที่เหมาะสม
                                    </h3>
                                    <p style={{ color: '#6b7280' }}>
                                        ความถี่ในการรดน้ำ ชนิดและปริมาณปุ๋ยที่เหมาะสมกับแต่ละชนิด
                                    </p>
                                </div>

                                <div style={{
                                    padding: '1.5rem',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '0.5rem',
                                    borderLeft: '4px solid #166534'
                                }}>
                                    <h3 style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                                        🐛 การป้องกันและกำจัดโรคแมลง
                                    </h3>
                                    <p style={{ color: '#6b7280' }}>
                                        วิธีป้องกันและแก้ไขปัญหาโรคพืชและแมลงศัตรูพืช
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                marginTop: '2rem',
                                padding: '2rem',
                                backgroundColor: '#166534',
                                borderRadius: '0.5rem',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                                    ติดต่อสอบถาม
                                </h3>
                                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                    📞 089-876-2045
                                </p>
                                <p style={{ opacity: 0.9 }}>
                                    เปิดให้บริการทุกวัน 08:00 - 18:00 น.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ScrollAnimation>
        </div>
    );
}
