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
                <Card style={{ marginBottom: '2rem' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>
                            ขั้นตอนง่ายๆ ในการสั่งจองต้นไม้
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ lineHeight: '1.8' }}>
                            <ol style={{ marginLeft: '1.5rem', marginTop: '1rem', fontSize: '1.1rem' }}>
                                <li style={{ marginBottom: '1.5rem' }}>
                                    <strong>เลือกต้นไม้ที่คุณต้องการ</strong>
                                    <p style={{ color: '#6b7280', marginTop: '0.25rem', fontSize: '1rem' }}>
                                        ดูรายการต้นไม้ในหน้า &quot;ร้านค้า&quot; กดที่สินค้าเพื่อดูรายละเอียด แล้วกดยังปุ่ม &quot;เพิ่มลงตะกร้า&quot;
                                    </p>
                                </li>
                                <li style={{ marginBottom: '1.5rem' }}>
                                    <strong>ตรวจสอบตะกร้าสินค้า & ทำการสั่งซื้อ</strong>
                                    <p style={{ color: '#6b7280', marginTop: '0.25rem', fontSize: '1rem' }}>
                                        คุณสามารถตรวจสอบรายการที่ต้องการซื้อได้ในตะกร้า หากทุกอย่างถูกต้อง ให้กดปุ่ม &quot;ดำเนินการสั่งซื้อ&quot;
                                    </p>
                                </li>
                                <li style={{ marginBottom: '1.5rem' }}>
                                    <strong>เลือกวันที่สะดวกรับสินค้า</strong>
                                    <p style={{ color: '#6b7280', marginTop: '0.25rem', fontSize: '1rem' }}>
                                        กรอกข้อมูลชื่อ, เบอร์ติดต่อ, และเลือก &quot;วันที่มารับสินค้าที่สวน&quot; (Pickup Date) ระบบจะคำนวณยอดมัดจำที่ต้องชำระ (30% ของยอดทั้งหมด)
                                    </p>
                                </li>
                                <li style={{ marginBottom: '1.5rem' }}>
                                    <strong>สถานะการสั่งซื้อ & การชำระเงิน</strong>
                                    <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', marginTop: '0.5rem', color: '#6b7280', fontSize: '1rem' }}>
                                        <li style={{ marginBottom: '0.25rem' }}><strong>กรณีสินค้ามีในสต็อก:</strong> ระบบจะให้คุณสแกน QR Code แล้วทำการแจ้งโอนเงิน/แนบสลิปทันที</li>
                                        <li><strong>กรณีสินค้าหมด (Pre-Order):</strong> ระบบจะให้รอทางสวนยืนยันก่อน เมื่อได้รับการอนุมัติแล้ว ลูกค้าจึงจะสามารถแนบสลิปได้</li>
                                    </ul>
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <strong>ติดตามสถานะออเดอร์ และเข้ามารับสินค้า</strong>
                                    <p style={{ color: '#6b7280', marginTop: '0.25rem', fontSize: '1rem' }}>
                                        สถานะคำสั่งซื้อสามารถเช็คได้ที่หน้า &quot;การจองของฉัน&quot; เมื่อถึงวันรับสินค้า ให้แจ้งรหัสการสั่งซื้อต่อพนักงานที่สวนเพื่อรับต้นไม้ พร้อมชำระเงินส่วนที่เหลือ
                                    </p>
                                </li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={150}>
                <Card>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.5rem', color: '#166534' }}>
                            ความหมายของสถานะออเดอร์
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ borderLeft: '4px solid #6b7280', paddingLeft: '1rem' }}>
                                <span style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>PRE_ORDER</span>
                                <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>สินค้ารายการนี้เป็นแบบ Pre-Order หรือสินค้าในสวนมีน้อยกว่าจำนวนที่สั่ง <strong>ต้องรอแอดมินสวนอนุมัติก่อน</strong> จึงจะสามารถชำระเงินมัดจำและแนบสลิปได้</p>
                            </div>
                            <div style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '1rem' }}>
                                <span style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>รอชำระเงิน</span>
                                <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>คุณสามารถทำรายการโอนเงินมัดจำตามยอดที่ระบบแจ้ง และแนบสลิปในหน้า &quot;การจองของฉัน&quot; ได้เลย</p>
                            </div>
                            <div style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '1rem' }}>
                                <span style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>รอตรวจสอบ</span>
                                <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>ลูกค้าแนบสลิปมาแล้ว ทางสวนกำลังตรวจสอบยอดเงินในบัญชี หากเรียบร้อยจะเปลี่ยนสถานะออเดอร์</p>
                            </div>
                            <div style={{ borderLeft: '4px solid #8b5cf6', paddingLeft: '1rem' }}>
                                <span style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>กำลังเตรียมต้นไม้</span>
                                <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>ตรวจสอบการโอนเงินเรียบร้อย สวนกำลังเตรียมต้นไม้ หรือกำลังรอให้ต้นไม้โตได้ที่</p>
                            </div>
                            <div style={{ borderLeft: '4px solid #22c55e', paddingLeft: '1rem' }}>
                                <span style={{ backgroundColor: '#22c55e', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>พร้อมรับได้แล้ว</span>
                                <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>ต้นไม้ของคุณพร้อมให้มารับแล้ว คุณสามารถเข้ามารับต้นไม้ที่สวนได้ตามวันนัดหมายเลย</p>
                            </div>
                            <div style={{ borderLeft: '4px solid #ef4444', paddingLeft: '1rem' }}>
                                <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>ชำระเงินมีปัญหา / ยกเลิก</span>
                                <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>เกิดข้อผิดพลาดในการตรวจสอบสลิป หรือลูกค้ายกเลิกคำสั่งซื้อ กรุณาติดต่อแอดมินหากมีข้อสงสัย</p>
                            </div>

                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: '#f0fdf4',
                                borderRadius: '0.5rem',
                                borderLeft: '4px solid #166534'
                            }}>
                                <p style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                                    💡 ติดต่อเรา
                                </p>
                                <p style={{ color: '#166534' }}>
                                    หากมีข้อสงสัยเกี่ยวกับการสั่งซื้อ สามารถติดต่อเราได้ที่ช่องทางโซเชียลมีเดีย หรือโทร. 061-690-0908
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
