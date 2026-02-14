import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { ParallaxSection } from '@/components/ParallaxSection';
import FavoriteButton from '@/components/FavoriteButton';

export const revalidate = 60; // Revalidate every 60 seconds instead of force-dynamic

export default async function Home() {
  const featuredTrees = await prisma.tree.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  // Get best-selling tree based on completed bookings
  const bestSellingData = await prisma.bookingItem.groupBy({
    by: ['treeId'],
    where: {
      booking: {
        status: 'COMPLETED'
      }
    },
    _sum: {
      quantity: true
    },
    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },
    take: 1
  });

  let bestSellingTree = null;
  if (bestSellingData.length > 0) {
    bestSellingTree = await prisma.tree.findUnique({
      where: { id: bestSellingData[0].treeId }
    });
  }

  // Get best-selling tree this week (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyBestSellingData = await prisma.bookingItem.groupBy({
    by: ['treeId'],
    where: {
      booking: {
        status: 'COMPLETED',
        updatedAt: {
          gte: sevenDaysAgo
        }
      }
    },
    _sum: {
      quantity: true
    },
    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },
    take: 1
  });

  let weeklyBestSellingTree = null;
  if (weeklyBestSellingData.length > 0) {
    weeklyBestSellingTree = await prisma.tree.findUnique({
      where: { id: weeklyBestSellingData[0].treeId }
    });
  }


  return (
    <main>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        backgroundColor: '#fefcf9',
        padding: '4rem 0 6rem',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Circle */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          backgroundColor: '#e6f5e6',
          borderRadius: '50%',
          zIndex: 0
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Text Content */}
          <ScrollAnimation animation="fade-up">
            <div style={{ gridColumn: 'span 1' }}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>
                #ต้นไม้คุณภาพ จากคุณแดง
              </span>
              <h1 style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: 'clamp(3rem, 8vw, 4.5rem)',
                fontWeight: '700',
                lineHeight: '1.2',
                color: 'var(--foreground)',
                marginBottom: '1.5rem'
              }}>
                สวนสวยเริ่มต้นที่ <br />
                <span style={{
                  fontStyle: 'italic',
                  fontWeight: '400',
                  color: 'var(--primary)',
                  display: 'inline-block',
                  whiteSpace: 'nowrap'
                }}>สวนคุณแดง</span>
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                ค้นพบความสุขในการปลูกต้นไม้กับเรา แหล่งรวมพันธุ์ไม้คัดพิเศษ <br />
                พร้อมคำแนะนำจากผู้เชี่ยวชาญ เพื่อสวนสวยในบ้านคุณ
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/shop">
                  <Button size="lg" style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    borderRadius: '50px',
                    padding: '0 2rem'
                  }}>
                    จองต้นไม้ →
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" style={{
                    borderRadius: '50px',
                    padding: '0 2rem',
                    borderColor: 'var(--foreground)',
                    color: 'var(--foreground)'
                  }}>
                    บริการของเรา →
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollAnimation>

          {/* Image Content with Parallax */}
          <ParallaxSection speed={0.3}>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '400px',
                height: '500px',
                backgroundColor: '#e5e7eb',
                borderRadius: '20px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=2449&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}></div>

              {/* Floating Cards simulating the template */}
              <div style={{
                position: 'absolute',
                bottom: '50px',
                left: '-20px',
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '8px', backgroundColor: '#dcfce7' }}></div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Alocasia</div>
                  <div style={{ fontSize: '0.8rem', color: '#166534' }}>$50.00</div>
                </div>
              </div>
            </div>
          </ParallaxSection>
        </div>
      </section>

      {/* Categories Cards */}
      <section className="container" style={{ margin: '-3rem auto 4rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <ScrollAnimation animation="slide-in-left" delay={100}>
            <Link href="/weekly-best-sellers" style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '16px',
                padding: '2rem',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: '200px',
                gap: '1.5rem',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
                className="hover:shadow-xl hover:-translate-y-1"
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '2rem', marginBottom: '0.5rem' }}>ขายดีสัปดาห์นี้</h3>
                  <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {weeklyBestSellingTree ? weeklyBestSellingTree.name : 'สินค้ายอดนิยม'}
                  </p>
                  <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    {weeklyBestSellingTree ? `฿${weeklyBestSellingTree.price.toLocaleString()}` : 'ของสัปดาห์นี้'}
                  </p>
                  <span style={{ color: 'white', textDecoration: 'underline' }}>ดูเลย</span>
                </div>
                {weeklyBestSellingTree && (() => {
                  let imageUrl = '/placeholder-tree.jpg';
                  try {
                    const images = JSON.parse(weeklyBestSellingTree.images);
                    if (images && images.length > 0) {
                      imageUrl = images[0];
                    }
                  } catch (e) {
                    // Use placeholder
                  }
                  return (
                    <div style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem'
                    }}>
                      <img
                        src={imageUrl}
                        alt={weeklyBestSellingTree.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  );
                })()}
              </div>
            </Link>
          </ScrollAnimation>
          <ScrollAnimation animation="slide-in-right" delay={100}>
            <Link href="/best-sellers" style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#fef3c7',
                borderRadius: '16px',
                padding: '2rem',
                color: '#433422',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: '200px',
                gap: '1.5rem',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
                className="hover:shadow-xl hover:-translate-y-1"
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '2rem', marginBottom: '0.5rem' }}>ต้นไม้ที่ขายดีที่สุด</h3>
                  <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '1.5rem' }}>ยอดนิยม อันดับหนึ่ง <br /> ของร้านเรา</p>
                  <span style={{ color: '#166534', textDecoration: 'underline', fontWeight: 'bold' }}>ดูเลย</span>
                </div>
                {bestSellingTree && (() => {
                  let imageUrl = '/placeholder-tree.jpg';
                  try {
                    const images = JSON.parse(bestSellingTree.images);
                    if (images && images.length > 0) {
                      imageUrl = images[0];
                    }
                  } catch (e) {
                    // Use placeholder
                  }
                  return (
                    <div style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem'
                    }}>
                      <img
                        src={imageUrl}
                        alt={bestSellingTree.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  );
                })()}
              </div>
            </Link>
          </ScrollAnimation>
        </div>
      </section>

      {/* Features Bar (Coral Pink) */}
      <ScrollAnimation animation="fade-in">
        <section style={{ padding: '4rem 0', backgroundColor: 'var(--primary)', color: 'white' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', border: '2px solid white', borderRadius: '50%' }}>
                <Leaf color="white" />
              </div>
              <div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'var(--font-playfair), serif', color: 'white' }}>คุณภาพที่เหนือกว่า</h4>
                <p style={{ fontSize: '0.875rem', color: 'white', opacity: 0.95 }}>คัดสรรต้นไม้เกรดพรีเมียมเพื่อคุณ</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', border: '2px solid white', borderRadius: '50%' }}>
                <Truck color="white" />
              </div>
              <div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'var(--font-playfair), serif', color: 'white' }}>จัดส่งถึงหน้าบ้าน</h4>
                <p style={{ fontSize: '0.875rem', color: 'white', opacity: 0.95 }}>แพ็คอย่างดี ส่งไว ปลอดภัย 100%</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', border: '2px solid white', borderRadius: '50%' }}>
                <ShieldCheck color="white" />
              </div>
              <div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'var(--font-playfair), serif', color: 'white' }}>บริการครบวงจร</h4>
                <p style={{ fontSize: '0.875rem', color: 'white', opacity: 0.95 }}>ให้คำปรึกษาและดูแลตลอดอายุ</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* New Arrivals (สินค้ามาใหม่) */}
      <section className="container" style={{ padding: '6rem 1rem' }}>
        <ScrollAnimation animation="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
            <div>
              <span style={{ color: '#f87171', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>New Arrivals</span>
              <h2 style={{ fontSize: '3rem', marginTop: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>สินค้ามาใหม่</h2>
            </div>
            <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: '600', textDecoration: 'none' }}>
              ดูสินค้าทั้งหมด <ArrowRight size={18} />
            </Link>
          </div>
        </ScrollAnimation>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {featuredTrees.map((tree, index) => {
            // Parse images safely
            let imageUrl = '/placeholder-tree.jpg';
            try {
              const images = JSON.parse(tree.images);
              if (images && images.length > 0) {
                imageUrl = images[0];
              }
            } catch (e) {
              // Use placeholder if parsing fails
            }

            return (
              <ScrollAnimation key={tree.id} animation="fade-up" delay={index * 100}>
                <Link href={`/trees/${tree.id}`} className="group" style={{ textDecoration: 'none' }}>
                  <Card style={{
                    border: 'none',
                    boxShadow: 'none',
                    backgroundColor: '#f9fafb',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                    className="hover:shadow-xl hover:-translate-y-2"
                  >
                    <div style={{ position: 'relative', height: '320px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                      <img
                        src={imageUrl}
                        alt={tree.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />

                      {/* Hover Action Overlay */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justifyContent-center">
                      </div>

                      {/* Favorite Button */}
                      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
                        <FavoriteButton treeId={tree.id} size="md" />
                      </div>
                    </div>

                    <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', marginBottom: '0.5rem', color: '#1f2937' }}>{tree.name}</h3>
                      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>⭐⭐⭐⭐⭐</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f87171' }}>฿{tree.price.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                </Link>
              </ScrollAnimation>
            );
          })}
        </div>
      </section>

      {/* Testimonials (รีวิวจากลูกค้า) */}
      <section style={{ backgroundColor: '#fff', padding: '6rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <ScrollAnimation animation="fade-up">
            <span style={{ color: '#9ca3af', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Our Testimonials</span>
            <h2 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '4rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>
              เสียงตอบรับจาก<span style={{ fontStyle: 'italic', fontWeight: '400' }}>ลูกค้าของเรา</span>
            </h2>
          </ScrollAnimation>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'left', padding: '2rem', backgroundColor: '#fefcf9', borderRadius: '16px', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ minWidth: '80px', height: '80px', backgroundColor: '#dcfce7', borderRadius: '50%' }}></div>
              <div>
                <div style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>★★★★★</div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', paddingBottom: '0.5rem' }}>คุณสมชาย ใจดี</h4>
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>"ต้นไม้สวยมากครับ แพ็คมาอย่างดีไม่มีเสียหายเลย ประทับใจบริการหลังการขายมากๆ"</p>
              </div>
            </div>
            <div style={{ textAlign: 'left', padding: '2rem', backgroundColor: '#fefcf9', borderRadius: '16px', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ minWidth: '80px', height: '80px', backgroundColor: '#ffedd5', borderRadius: '50%' }}></div>
              <div>
                <div style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>★★★★★</div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', paddingBottom: '0.5rem' }}>คุณหญิง</h4>
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>"หาต้นไม้หายากมานาน มาเจอที่นี่ราคาดี ต้นไม้แข็งแรง สั่งเพิ่มแน่นอนค่ะ"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Location Section */}
      <section style={{ backgroundColor: '#f0fdf4', padding: '5rem 1rem' }}>
        <div className="container">
          <ScrollAnimation animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{ color: '#4d7c0f', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Visit Us</span>
              <h2 style={{ fontSize: '3rem', marginTop: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>ที่ตั้งร้านของเรา</h2>
              <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1.125rem' }}>มาเยี่ยมชมสวนของเราได้ทุกวัน</p>
            </div>
          </ScrollAnimation>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <ScrollAnimation animation="slide-in-left">
              <div style={{
                borderRadius: '1rem', overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '2px solid #dcfce7'
              }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3795.4!2d99.49!3d18.29!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDE3JzI0LjAiTiA5OcKwMjknMjQuMCJF!5e0!3m2!1sth!2sth!4v1"
                  width="100%" height="350" style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                  title="Khun Daeng Garden Location"
                />
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="slide-in-right">
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>📍</div>
                    <div>
                      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>ที่อยู่</h3>
                      <p style={{ color: '#6b7280' }}>ต.บ้านเป้า อ.เมือง จ.ลำปาง 52100</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>📞</div>
                    <div>
                      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>โทรศัพท์</h3>
                      <p style={{ color: '#6b7280' }}>061-690-0908</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>🕐</div>
                    <div>
                      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>เวลาทำการ</h3>
                      <p style={{ color: '#6b7280' }}>จันทร์ - เสาร์: 08:00 - 17:00</p>
                      <p style={{ color: '#6b7280' }}>อาทิตย์: 09:00 - 15:00</p>
                    </div>
                  </div>
                </div>
                <a
                  href="https://maps.google.com/?q=18.29,99.49"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-block', marginTop: '2rem',
                    padding: '0.75rem 2rem', backgroundColor: '#059669',
                    color: 'white', borderRadius: '0.5rem',
                    fontWeight: 'bold', textDecoration: 'none',
                    transition: 'background 0.2s'
                  }}
                >
                  🗺️ นำทาง Google Maps
                </a>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Blog Section (บทความใหม่) */}
      <section className="container" style={{ padding: '6rem 1rem' }}>
        <ScrollAnimation animation="fade-up">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#4d7c0f', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Our Blog Posts</span>
            <h2 style={{ fontSize: '3rem', marginTop: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>บทความน่ารู้</h2>
          </div>
        </ScrollAnimation>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Fake Blog 1 */}
          <ScrollAnimation animation="fade-up" delay={100}>
            <div>
              <div style={{ height: '240px', backgroundColor: '#e5e7eb', borderRadius: '12px', marginBottom: '1.5rem' }}></div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem' }}>17 January 2024</div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-playfair), serif', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.3' }}>เทคนิคการดูแลไม้ด่าง<br />ให้สีสดตลอดปี</h3>
              <a href="#" style={{ color: '#4d7c0f', fontWeight: 'bold', textDecoration: 'none' }}>อ่านเพิ่มเติม ➔</a>
            </div>
          </ScrollAnimation>
          {/* Fake Blog 2 */}
          <ScrollAnimation animation="fade-up" delay={200}>
            <div>
              <div style={{ height: '240px', backgroundColor: '#e5e7eb', borderRadius: '12px', marginBottom: '1.5rem' }}></div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem' }}>23 March 2024</div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-playfair), serif', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.3' }}>5 ต้นไม้มงคล<br />ปลูกแล้วรวย</h3>
              <a href="#" style={{ color: '#4d7c0f', fontWeight: 'bold', textDecoration: 'none' }}>อ่านเพิ่มเติม ➔</a>
            </div>
          </ScrollAnimation>
          {/* Fake Blog 3 */}
          <ScrollAnimation animation="fade-up" delay={300}>
            <div>
              <div style={{ height: '240px', backgroundColor: '#e5e7eb', borderRadius: '12px', marginBottom: '1.5rem' }}></div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem' }}>12 February 2024</div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-playfair), serif', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.3' }}>มือใหม่หัดปลูก<br />เริ่มที่ต้นอะไรดี?</h3>
              <a href="#" style={{ color: '#4d7c0f', fontWeight: 'bold', textDecoration: 'none' }}>อ่านเพิ่มเติม ➔</a>
            </div>
          </ScrollAnimation>
        </div>
      </section>

    </main >
  );
}
