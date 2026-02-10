import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import Link from 'next/link';

export default function HowToOrderPage() {
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <ScrollAnimation animation="fade-up">
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/services" style={{ color: '#166534', textDecoration: 'none' }}>
                        ← กลับไปหน้าบริการ
                    </Link>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#166534' }}>
                    วิธีการสั่งซื้อ
                </h1>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={100}>
                <Card>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>
                            ขั้นตอนง่ายๆ ในการจองต้นไม้ผ่านเว็บไซต์ และการชำระเงิน
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ lineHeight: '1.8' }}>
                            <ol style={{ marginLeft: '1.5rem', marginTop: '1rem', fontSize: '1.1rem' }}>
                                <li style={{ marginBottom: '1rem' }}>
                                    <strong>เลือกต้นไม้ที่ต้องการ</strong>
                                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                                        จากหน้า "ค้นหาสินค้า" เลือกต้นไม้ที่คุณชื่นชอบ
                                    </p>
                                </li>
                                <li style={{ marginBottom: '1rem' }}>
                                    <strong>คลิก "เพิ่มในตะกร้า"</strong>
                                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                                        และตรวจสอบรายการในตะกร้าสินค้า
                                    </p>
                                </li>
                                <li style={{ marginBottom: '1rem' }}>
                                    <strong>กรอกข้อมูลการจัดส่ง</strong>
                                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                                        และเลือกวันที่รับสินค้า
                                    </p>
                                </li>
                                <li style={{ marginBottom: '1rem' }}>
                                    <strong>ชำระเงินผ่านการโอนเงิน</strong>
                                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                                        และอัปโหลดหลักฐานการชำระเงิน
                                    </p>
                                </li>
                                <li style={{ marginBottom: '1rem' }}>
                                    <strong>รอการยืนยันจากทางร้าน</strong>
                                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                                        และเตรียมรับสินค้าตามวันที่นัดหมาย
                                    </p>
                                </li>
                            </ol>

                            <div style={{
                                marginTop: '2rem',
                                padding: '1.5rem',
                                backgroundColor: '#f0fdf4',
                                borderRadius: '0.5rem',
                                borderLeft: '4px solid #166534'
                            }}>
                                <p style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                                    💡 เคล็ดลับ
                                </p>
                                <p style={{ color: '#166534' }}>
                                    หากมีข้อสงสัยเกี่ยวกับการสั่งซื้อ สามารถติดต่อเราได้ที่ 089-876-2045
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={200}>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link href="/shop">
                        <button style={{
                            backgroundColor: '#166534',
                            color: 'white',
                            padding: '1rem 2rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}>
                            เริ่มเลือกซื้อสินค้า →
                        </button>
                    </Link>
                </div>
            </ScrollAnimation>
        </div>
    );
}
