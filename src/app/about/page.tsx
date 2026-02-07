import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';

export default function AboutPage() {
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <ScrollAnimation animation="fade-up">
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#166534' }}>เกี่ยวกับร้านสวนคุณแดง</h1>
            </ScrollAnimation>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <ScrollAnimation animation="fade-up" delay={100}>
                    <section>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>ประวัติร้าน</h2>
                        <p style={{ lineHeight: '1.6', color: '#374151' }}>
                            ร้านสวนคุณแดง เริ่มต้นจากความรักในการปลูกต้นไม้ และสะสมพันธุ์ไม้สวยงาม ทั้งไม้มงคล ไม้ดอก และไม้ประดับ
                            เราคัดสรรต้นไม้คุณภาพดี แข็งแรง เพื่อส่งต่อความสุขสีเขียวให้กับลูกค้าทุกท่าน
                            ด้วยประสบการณ์กว่า 10 ปี เราพร้อมให้คำแนะนำในการดูแลรักษา เพื่อให้ต้นไม้ของคุณเติบโตอย่างสวยงาม
                        </p>
                    </section>
                </ScrollAnimation>

                <section>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>ติดต่อเรา</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        <Card>
                            <CardHeader>
                                <CardTitle>ช่องทางการติดต่อ</CardTitle>
                            </CardHeader>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <p><strong>เบอร์โทรศัพท์:</strong> 089-876-2045</p>
                                <p><strong>อีเมล:</strong> kittitusjuprajak@gmail.com</p>
                                <p><strong>Facebook:</strong> <a href="https://web.facebook.com/kittitusjupraja" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>สวนคุณแดง</a></p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>แผนที่ร้าน</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{
                                    width: '100%',
                                    height: '250px',
                                    backgroundColor: '#e5e7eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '0.5rem'
                                }}>
                                    <span style={{ color: '#6b7280' }}>Google Maps Placeholder</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
}
