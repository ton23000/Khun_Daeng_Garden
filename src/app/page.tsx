import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { MOCK_TREES } from '@/data/mockData';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
  const featuredTrees = MOCK_TREES.slice(0, 3);

  return (
    <main>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        backgroundColor: 'var(--primary)',
        color: 'white',
        padding: '6rem 0',
        overflow: 'hidden'
      }}>
        {/* Abstract Pattern overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)' }}></div>

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1', color: 'white' }}>
            สวนคุณแดง <span style={{ color: 'var(--secondary)' }}>พรีเมียม</span>
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem', opacity: 0.9 }}>
            ศูนย์รวมพันธุ์ไม้มงคล ไม้ด่าง และไม้เศรษฐกิจคัดพิเศษ <br />
            เลี้ยงดูด้วยใจ ส่งมอบให้คุณด้วยคุณภาพ
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/shop">
              <Button size="lg" style={{ backgroundColor: 'var(--accent)', color: 'var(--primary-foreground)', border: 'none' }}>
                เลือกชมต้นไม้ทั้งหมด
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" style={{ borderColor: 'white', color: 'white' }}>
                สมัครสมาชิก
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ padding: '3rem 0', backgroundColor: '#f0fdf4' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
              <Leaf color="var(--primary)" />
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold' }}>รับประกันคุณภาพ</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>คัดเกรดพรีเมียมทุกต้น</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
              <ShieldCheck color="var(--primary)" />
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold' }}>ดูแลหลังการขาย</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>ปรึกษาฟรีตลอดอายุการปลูก</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
              <Truck color="var(--primary)" />
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold' }}>นัดรับสะดวก</h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>จองวันนี้ รับของใน 2 สัปดาห์</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trees */}
      <section className="container" style={{ padding: '4rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem' }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured Collection</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 'bold' }}>ต้นไม้แนะนำ</h2>
          </div>
          <Link href="/shop">
            <Button variant="ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ดูทั้งหมด <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {featuredTrees.map((tree) => (
            <Card key={tree.id}>
              <div style={{ height: '220px', backgroundColor: '#e5e7eb', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Image Placeholder */}
                <span style={{ color: '#9ca3af' }}>รูปภาพสินค้า</span>
              </div>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <CardTitle>{tree.name}</CardTitle>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>฿ {tree.price.toLocaleString()}</span>
                </div>
                <CardDescription>{tree.category}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={`/trees/${tree.id}`} style={{ width: '100%' }}>
                  <Button fullWidth variant="outline">ดูรายละเอียด</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section style={{ backgroundColor: '#2d6a4f', color: 'white', padding: '5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>เรื่องราวของสวนคุณแดง</h2>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', opacity: 0.9, marginBottom: '2rem' }}>
              จากความรักในธรรมชาติและการสะสมพันธุ์ไม้หายากมากว่า 20 ปี สู่การแบ่งปันความสุขให้คนรักต้นไม้
              เราคัดสรรเฉพาะต้นไม้ที่มีฟอร์มสวย แข็งแรง และมีความหมายมงคล เพื่อให้สวนของคุณเป็นมากกว่าพื้นที่สีเขียว
              แต่เป็นพื้นที่แห่งความสุขและความสำเร็จ
            </p>
            <Link href="/shop">
              <Button style={{ backgroundColor: 'white', color: '#2d6a4f' }} size="lg">เริ่มต้นจัดสวนของคุณ</Button>
            </Link>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: '400px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>ภาพบรรยากาศสวน</span>
          </div>
        </div>
      </section>
    </main>
  );
}
