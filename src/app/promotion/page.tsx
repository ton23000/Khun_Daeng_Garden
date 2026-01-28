import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function PromotionPage() {
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#166534' }}>โปรโมชั่นพิเศษ (Promotion)</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <Card>
                    <CardHeader>
                        <CardTitle style={{ color: '#ef4444' }}>ลดราคาไม้ดอก 10%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>เมื่อซื้อต้นไม้ในหมวด "ไม้ดอก" ครบ 500 บาท</p>
                        <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>หมดเขต: 31 ธันวาคม 2569</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
