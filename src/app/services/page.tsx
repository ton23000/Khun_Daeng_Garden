import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ServicesPage() {
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#166534' }}>บริการของเรา (Services)</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* วิธีการสั่งซื้อ */}
                <Card id="ordering">
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.5rem' }}>วิธีการสั่งซื้อ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ lineHeight: '1.8' }}>
                            <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>ขั้นตอนง่ายๆ ในการเลือกซื้อต้นไม้ผ่านเว็บไซต์ และการชำระเงิน</h3>
                            <ol style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                                <li>เลือกต้นไม้ที่ต้องการจากหน้า "ค้นหาสินค้า"</li>
                                <li>คลิก "เพิ่มในตะกร้า" และตรวจสอบรายการในตะกร้าสินค้า</li>
                                <li>กรอกข้อมูลการจัดส่งและเลือกวันที่รับสินค้า</li>
                                <li>ชำระเงินผ่านการโอนเงิน และอัปโหลดหลักฐานการชำระเงิน</li>
                                <li>รอการยืนยันจากทางร้าน และเตรียมรับสินค้าตามวันที่นัดหมาย</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>

                {/* คำปรึกษาการปลูก */}
                <Card id="planting">
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.5rem' }}>คำปรึกษาการปลูก</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ lineHeight: '1.8' }}>
                            <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>บริการให้คำแนะนำวิธีการดูแลรักษาต้นไม้แต่ละชนิดให้เติบโตสวยงาม</h3>
                            <p style={{ marginTop: '1rem' }}>
                                ทีมงานผู้เชี่ยวชาญของเราพร้อมให้คำปรึกษาเกี่ยวกับ:
                            </p>
                            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                                <li>การเลือกต้นไม้ที่เหมาะสมกับสภาพแวดล้อม</li>
                                <li>วิธีการปลูกและการดูแลรักษา</li>
                                <li>การให้น้ำและปุ๋ยที่เหมาะสม</li>
                                <li>การป้องกันและกำจัดโรคแมลง</li>
                            </ul>
                            <p style={{ marginTop: '1rem', color: '#166534', fontWeight: 500 }}>
                                📞 ติดต่อสอบถาม: 081-234-5678 หรือ Line: @khundaeng
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* บริการจัดสวน */}
                <Card id="garden">
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.5rem' }}>บริการจัดสวน</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ lineHeight: '1.8' }}>
                            <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>รับออกแบบและจัดสวนตามงบประมาณ โดยทีมงานมืออาชีพ</h3>
                            <p style={{ marginTop: '1rem' }}>
                                เราให้บริการออกแบบและจัดสวนแบบครบวงจร ตั้งแต่การวางแผน การเลือกพันธุ์ไม้ ไปจนถึงการติดตั้งและดูแลรักษา
                            </p>
                            <div style={{ marginTop: '1rem', backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem' }}>
                                <p style={{ fontWeight: 'bold', color: '#166534' }}>บริการของเรา:</p>
                                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                                    <li>ออกแบบสวนตามสไตล์ที่ต้องการ</li>
                                    <li>จัดวางต้นไม้และตกแต่งสวน</li>
                                    <li>ติดตั้งระบบน้ำและไฟในสวน</li>
                                    <li>บริการดูแลรักษาสวนรายเดือน</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* FAQ */}
                <Card id="faq">
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.5rem' }}>บริการตอบคำถาม (FAQ)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ lineHeight: '1.8' }}>
                            <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>รวมคำถามที่พบบ่อยเกี่ยวกับการดูแลต้นไม้และการสั่งซื้อ</h3>

                            <div style={{ marginTop: '1.5rem' }}>
                                <p style={{ fontWeight: 'bold', color: '#166534' }}>Q: ต้นไม้ที่สั่งซื้อจะมีการรับประกันหรือไม่?</p>
                                <p style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>A: รับประกันต้นไม้ทุกต้น 7 วัน หากพบปัญหาสามารถเปลี่ยนได้ฟรี</p>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <p style={{ fontWeight: 'bold', color: '#166534' }}>Q: ใช้เวลานานแค่ไหนในการจัดส่ง?</p>
                                <p style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>A: จัดส่งภายใน 3-5 วันทำการ หรือตามวันที่นัดหมาย</p>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <p style={{ fontWeight: 'bold', color: '#166534' }}>Q: สามารถมารับสินค้าเองได้หรือไม่?</p>
                                <p style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>A: สามารถมารับได้ที่ร้าน โดยแจ้งล่วงหน้า 1 วัน</p>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <p style={{ fontWeight: 'bold', color: '#166534' }}>Q: ต้นไม้ที่ซื้อควรดูแลอย่างไร?</p>
                                <p style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>A: แต่ละชนิดมีวิธีดูแลแตกต่างกัน สามารถปรึกษาทีมงานได้ตลอดเวลา</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
