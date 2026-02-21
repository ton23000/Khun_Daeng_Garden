import { Card, CardContent } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import Link from 'next/link';

export const metadata = {
    title: 'บทความน่ารู้ | Khun Daeng Garden',
    description: 'ทริคและเทคนิคการดูแลต้นไม้',
};

const articles = [
    {
        id: 1,
        title: '5 ต้นไม้มงคล ปลูกแล้วรวย รับทรัพย์ตลอดปี',
        excerpt: 'รวบรวมต้นไม้มงคลยอดฮิตที่ควรมีติดบ้าน นอกจากจะช่วยฟอกอากาศแล้ว ยังมีความเชื่อว่าช่วยเสริมดวงการเงินและการงานให้รุ่งเรือง...',
        image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&auto=format&fit=crop',
        date: '20 กุมภาพันธ์ 2024',
        category: 'ต้นไม้มงคล',
        link: '/shop?q=มงคล'
    },
    {
        id: 2,
        title: 'เทคนิคการดูแล "ไม้ด่าง" ให้สีสด ลายสวย ไม่กลับเขียว',
        excerpt: 'ไม้ด่างดูแลยากจริงหรือ? มาดูเคล็ดลับตากแดดรำไรและการรดน้ำที่พอดี เพื่อรักษาสีสันและลวดลายของใบให้อยู่กับเราไปนานๆ...',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop',
        date: '15 กุมภาพันธ์ 2024',
        category: 'ทริคการดูแล',
        link: '/shop'
    },
    {
        id: 3,
        title: 'มือใหม่หัดปลูก เริ่มต้นด้วยต้นไม้อะไรดีที่ตายยาก?',
        excerpt: 'สำหรับคนที่เพิ่งเริ่มเข้าสู่วงการคนรักต้นไม้ เราขอแนะนำ 10 ต้นไม้ที่อึด ทน ถึก รดน้ำสัปดาห์ละครั้งก็ยังรอด เหมาะกับคนตารางงานแน่น...',
        image: 'https://images.unsplash.com/photo-1416879598446-ce5def786df7?w=800&auto=format&fit=crop',
        date: '10 กุมภาพันธ์ 2024',
        category: 'ไลฟ์สไตล์',
        link: '/shop'
    }
];

export default function ArticlesPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <ScrollAnimation animation="fade-up">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ color: '#4d7c0f', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Knowledge Hub
                    </span>
                    <h1 style={{ fontSize: '3.5rem', marginTop: '1rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>
                        บทความน่ารู้
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '1rem', fontSize: '1.25rem', maxWidth: '600px', margin: '1rem auto 0' }}>
                        เทคนิคดีๆ และไอเดียการจัดสวน เพื่อให้ต้นไม้ของคุณสวยงามและเติบโตอย่างแข็งแรง
                    </p>
                </div>
            </ScrollAnimation>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
                {articles.map((article, index) => (
                    <ScrollAnimation key={article.id} animation="fade-up" delay={index * 100}>
                        <Card style={{ overflow: 'hidden', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', backgroundColor: '#fff', borderRadius: '1rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                    className="hover:scale-110"
                                />
                                <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    {article.category}
                                </div>
                            </div>
                            <CardContent style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>{article.date}</div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', marginBottom: '1rem', lineHeight: '1.4', color: '#1f2937' }}>
                                    {article.title}
                                </h3>
                                <p style={{ color: '#6b7280', lineHeight: '1.6', flex: 1 }}>
                                    {article.excerpt}
                                </p>
                                <div style={{ marginTop: '2rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Link href={article.link} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 'bold', textDecoration: 'none' }}>
                                        เลือกซื้อต้นไม้กลุ่มนี้ 🌿
                                    </Link>
                                    <button style={{ backgroundColor: '#f3f4f6', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: '#4b5563', cursor: 'pointer', fontWeight: 600 }}>
                                        อ่านต่อ
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </ScrollAnimation>
                ))}
            </div>

            <ScrollAnimation animation="fade-in">
                <div style={{ marginTop: '5rem', backgroundColor: '#f0fdf4', borderRadius: '1.5rem', padding: '4rem 2rem', textAlign: 'center', border: '1px solid #dcfce7' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#166534', marginBottom: '1rem' }}>
                        กำลังมองหาต้นไม้ต้นใหม่อยู่ใช่ไหม?
                    </h2>
                    <p style={{ color: '#374151', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                        ให้เราช่วยเลือกต้นไม้ที่เหมาะกับไลฟ์สไตล์และพื้นที่ของคุณ เพื่อคืนความสดชื่นให้กับบ้าน
                    </p>
                    <Link href="/shop" style={{ display: 'inline-block', backgroundColor: '#166534', color: 'white', padding: '1rem 3rem', borderRadius: '9999px', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 4px 6px -1px rgba(22, 101, 52, 0.2)' }} className="hover:bg-green-800 transition-colors">
                        ชมสินค้าทั้งหมด
                    </Link>
                </div>
            </ScrollAnimation>
        </div>
    );
}
