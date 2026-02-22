import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Truck, Percent, Heart } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { ParallaxSection } from '@/components/ParallaxSection';
import FavoriteButton from '@/components/FavoriteButton';
import { ImageSlider } from '@/components/ImageSlider';
import InlineEdit from '@/components/InlineEdit';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const featuredTrees = await prisma.tree.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  // Top 5 best sellers
  const bestSellingData = await prisma.bookingItem.groupBy({
    by: ['treeId'],
    where: { booking: { status: 'COMPLETED' } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5
  });

  const bestSellingTreeIds = bestSellingData.map((d: { treeId: string }) => d.treeId);
  const bestSellingTrees = await prisma.tree.findMany({
    where: { id: { in: bestSellingTreeIds } }
  });

  // Fallback if no sales
  const displayBestSellers = bestSellingTrees.length > 0 ? bestSellingTrees : featuredTrees;

  // Promotional trees
  const promotionalTrees = await prisma.tree.findMany({
    where: { isPromotion: true, stock: { gt: 0 } },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  // Seasonal/Festival trees (e.g. Valentine's / Rose)
  const seasonalTrees = await prisma.tree.findMany({
    where: {
      OR: [
        { tags: { contains: 'วาเลนไทน์' } },
        { name: { contains: 'กุหลาบ' } },
        { tags: { contains: 'เทศกาล' } }
      ],
      stock: { gt: 0 }
    },
    take: 4
  });

  // Get Kwak Phra Phrom for Hero Section
  const heroTree = await prisma.tree.findFirst({
    where: { name: 'กวักพระพรหม' }
  });

  // Fetch Site Settings
  const settings = await prisma.siteSetting.findMany();
  const settingsMap = settings.reduce((acc: Record<string, string>, curr: { key: string, value: string }) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const heroTitle = settingsMap['hero_title'] || 'สวนสวยเริ่มต้นที่ สวนคุณแดง';
  const heroSubtitle = settingsMap['hero_subtitle'] || 'ค้นพบความสุขในการปลูกต้นไม้กับเรา แหล่งรวมพันธุ์ไม้คัดพิเศษ\nพร้อมคำแนะนำจากผู้เชี่ยวชาญ เพื่อสวนสวยในบ้านคุณ';
  const heroTag = settingsMap['hero_tag'] || '#ต้นไม้คุณภาพ จากคุณแดง';

  const valTitle = settingsMap['valentine_title'] || 'มอบความรัก\nส่งต่อต้นไม้';
  const valSubtitle = settingsMap['valentine_subtitle'] || 'หลงรักต้นไม้มงคล ที่พร้อมเบ่งบานในฤดูกาลนี้';

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

        <div className="container grid-hero" style={{ position: 'relative', zIndex: 1 }}>
          {/* Text Content */}
          <ScrollAnimation animation="fade-up">
            <div style={{ gridColumn: 'span 1', position: 'relative' }}>
              <InlineEdit
                settingKey="hero_tag"
                initialValue={heroTag}
                renderAs="span"
                style={{ color: '#6b7280', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}
              />
              <InlineEdit
                settingKey="hero_title"
                initialValue={heroTitle}
                renderAs="h1"
                useSpecialTitleFormat
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: 'clamp(1.75rem, 8vw, 4.5rem)',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  color: 'var(--foreground)',
                  marginBottom: '1rem',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              />
              <InlineEdit
                settingKey="hero_subtitle"
                initialValue={heroSubtitle}
                renderAs="p"
                multiline
                style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: '#6b7280', marginBottom: '2.5rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}
              />
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
                width: '100%',
                maxWidth: '400px',
                height: 'min(500px, 100vw)',
                backgroundColor: '#e5e7eb',
                borderRadius: '20px',
                backgroundImage: 'url("/images/products/kwak-phra-phrom.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}></div>

              {/* Floating Cards simulating the template */}
              <Link href={heroTree ? `/trees/${heroTree.id}` : "/shop?q=กวักพระพรหม"} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  position: 'absolute',
                  bottom: '10%',
                  left: '0',
                  transform: 'translateX(-10px)',
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                  className="hover:scale-105"
                >
                  <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src="/images/products/kwak-phra-phrom.jpg" alt="กวักพระพรหม" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>กวักพระพรหม</div>
                    <div style={{ fontSize: '0.8rem', color: '#166534' }}>฿350.00</div>
                  </div>
                </div>
              </Link>
            </div>
          </ParallaxSection>
        </div>
      </section>

      {/* Best Sellers Slider */}
      <section className="container" style={{ margin: '-3rem auto 4rem', position: 'relative', zIndex: 10 }}>
        <ScrollAnimation animation="fade-up" delay={100}>
          {displayBestSellers.length > 0 && (
            <ImageSlider trees={displayBestSellers} title="ขายดีที่สุด" subtitle="Best Sellers" />
          )}
        </ScrollAnimation>
      </section>

      {/* Features Bar (Coral Pink) */}
      <ScrollAnimation animation="fade-in">
        <section style={{ padding: '4rem 0', backgroundColor: 'var(--primary)', color: 'white' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(2rem, 4vw, 4rem)', flexWrap: 'wrap' }}>
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

      {/* Festival Banner */}
      <section className="container" style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        <ScrollAnimation animation="fade-up">
          <Link href="/shop" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '100%',
              borderRadius: '1rem',
              overflow: 'hidden',
              position: 'relative',
              background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
              padding: 'clamp(1.5rem, 5vw, 3rem)',
              color: '#7f1d1d',
              display: 'flex',
              flexWrap: 'wrap-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }} className="hover:scale-[1.01] transition-transform">
              <div style={{ flex: '1 1 300px', zIndex: 1 }}>
                <span style={{ fontSize: 'clamp(0.875rem, 3vw, 1.25rem)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>💖 Valentine&apos;s Special</span>
                <InlineEdit
                  settingKey="valentine_title"
                  initialValue={valTitle}
                  renderAs="h2"
                  multiline
                  style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 'bold', marginTop: '0.5rem', fontFamily: 'var(--font-playfair), serif', lineHeight: 1.1, whiteSpace: 'pre-line' }}
                />
                <InlineEdit
                  settingKey="valentine_subtitle"
                  initialValue={valSubtitle}
                  renderAs="p"
                  style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', marginTop: '0.75rem', opacity: 0.9 }}
                />
                <Button style={{ marginTop: '1.5rem', backgroundColor: '#7f1d1d', color: 'white', borderRadius: '9999px', padding: '0 2rem' }}>
                  ช้อปเลย →
                </Button>
              </div>
              <div style={{ flex: '1 1 100px', display: 'flex', justifyContent: 'flex-end', fontSize: 'clamp(3rem, 15vw, 6rem)', opacity: 0.8, zIndex: 0 }}>
                🌹🌿
              </div>
            </div>
          </Link>
        </ScrollAnimation>
      </section>

      {/* Seasonal Products Section */}
      {seasonalTrees.length > 0 && (
        <section className="container" style={{ padding: '4rem 1rem 2rem' }}>
          <ScrollAnimation animation="fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
              <div>
                <span style={{ color: '#ec4899', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={16} /> Seasonal Specials
                </span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginTop: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>ต้อนรับเทศกาล</h2>
              </div>
              <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', fontWeight: '600', textDecoration: 'none' }}>
                ดูทั้งหมด <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollAnimation>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {seasonalTrees.map((tree: { id: string; images: string; name: string; price: number }, index: number) => {
              let imageUrl = '/placeholder-tree.jpg';
              try {
                const images = JSON.parse(tree.images);
                if (images && images.length > 0) imageUrl = images[0];
              } catch { }
              return (
                <ScrollAnimation key={tree.id} animation="fade-up" delay={index * 100}>
                  <Link href={`/trees/${tree.id}`} className="group" style={{ textDecoration: 'none' }}>
                    <Card style={{ border: '1px solid #fce7f3', backgroundColor: '#fff', overflow: 'hidden', cursor: 'pointer' }} className="hover:shadow-xl hover:-translate-y-1 transition-all">
                      <div style={{ position: 'relative', height: '280px', backgroundColor: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <img src={imageUrl} alt={tree.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
                          <FavoriteButton treeId={tree.id} size="md" />
                        </div>
                      </div>
                      <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', marginBottom: '0.5rem', color: '#1f2937' }}>{tree.name}</h3>
                        <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ec4899' }}>฿{tree.price.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollAnimation>
              );
            })}
          </div>
        </section>
      )}

      {/* Promotions Section */}
      {promotionalTrees.length > 0 && (
        <section className="container" style={{ padding: '2rem 1rem 4rem' }}>
          <ScrollAnimation animation="fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
              <div>
                <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Percent size={16} /> Hot Deals
                </span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginTop: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>โปรโมชั่นพิเศษ</h2>
              </div>
              <Link href="/promotion" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontWeight: '600', textDecoration: 'none' }}>
                ดูโปรโมชั่นทั้งหมด <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollAnimation>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {promotionalTrees.map((tree: { id: string; images: string; name: string; price: number; originalPrice: number | null }, index: number) => {
              let imageUrl = '/placeholder-tree.jpg';
              try {
                const images = JSON.parse(tree.images);
                if (images && images.length > 0) imageUrl = images[0];
              } catch { }

              return (
                <ScrollAnimation key={tree.id} animation="fade-up" delay={index * 100}>
                  <Link href={`/trees/${tree.id}`} className="group" style={{ textDecoration: 'none' }}>
                    <Card style={{ border: '2px solid #fee2e2', backgroundColor: '#fff', overflow: 'hidden', cursor: 'pointer' }} className="hover:shadow-xl hover:-translate-y-1 transition-all">
                      <div style={{ position: 'relative', height: '280px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <img src={imageUrl} alt={tree.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
                          <FavoriteButton treeId={tree.id} size="md" />
                        </div>
                        {tree.originalPrice && tree.originalPrice > tree.price && (
                          <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#dc2626', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            Sale!
                          </div>
                        )}
                      </div>
                      <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', marginBottom: '0.5rem', color: '#1f2937' }}>{tree.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#dc2626' }}>฿{tree.price.toLocaleString()}</p>
                          {tree.originalPrice && tree.originalPrice > tree.price && (
                            <p style={{ fontSize: '0.9rem', color: '#9ca3af', textDecoration: 'line-through' }}>฿{tree.originalPrice.toLocaleString()}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollAnimation>
              );
            })}
          </div>
        </section>
      )}

      {/* New Arrivals (สินค้ามาใหม่) */}
      <section className="container" style={{ padding: '6rem 1rem' }}>
        <ScrollAnimation animation="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
            <div>
              <span style={{ color: '#f87171', fontWeight: 'bold', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>New Arrivals</span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)', marginTop: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>สินค้ามาใหม่</h2>
            </div>
            <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: '600', textDecoration: 'none' }}>
              ดูสินค้าทั้งหมด <ArrowRight size={18} />
            </Link>
          </div>
        </ScrollAnimation>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem' }}>
          {featuredTrees.map((tree: { id: string; images: string; name: string; price: number }, index: number) => {
            // Parse images safely
            let imageUrl = '/placeholder-tree.jpg';
            try {
              const images = JSON.parse(tree.images);
              if (images && images.length > 0) {
                imageUrl = images[0];
              }
            } catch {
              // Use placeholder if parsing fails
            }

            return (
              <ScrollAnimation key={tree.id} animation="fade-up" delay={index * 100}>
                <Link href={`/trees/${tree.id}`} className="group" style={{ textDecoration: 'none' }}>
                  <Card style={{
                    border: 'none',
                    boxShadow: 'none',
                    backgroundColor: '#fdfaf6',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                    className="hover-card"
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
            <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)', marginTop: '0.5rem', marginBottom: 'clamp(2rem, 6vw, 4rem)', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>
              เสียงตอบรับจาก<span style={{ fontStyle: 'italic', fontWeight: '400' }}>ลูกค้าของเรา</span>
            </h2>
          </ScrollAnimation>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'left', padding: '2rem', backgroundColor: '#fefcf9', borderRadius: '16px', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ minWidth: '80px', height: '80px', backgroundColor: '#dcfce7', borderRadius: '50%' }}></div>
              <div>
                <div style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>★★★★★</div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', paddingBottom: '0.5rem' }}>คุณสมชาย ใจดี</h4>
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>&quot;ต้นไม้สวยมากครับ แพ็คมาอย่างดีไม่มีเสียหายเลย ประทับใจบริการหลังการขายมากๆ&quot;</p>
              </div>
            </div>
            <div style={{ textAlign: 'left', padding: '2rem', backgroundColor: '#fefcf9', borderRadius: '16px', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ minWidth: '80px', height: '80px', backgroundColor: '#ffedd5', borderRadius: '50%' }}></div>
              <div>
                <div style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>★★★★★</div>
                <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', paddingBottom: '0.5rem' }}>คุณหญิง</h4>
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>&quot;หาต้นไม้หายากมานาน มาเจอที่นี่ราคาดี ต้นไม้แข็งแรง สั่งเพิ่มแน่นอนค่ะ&quot;</p>
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
              <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)', marginTop: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>ที่ตั้งร้านของเรา</h2>
              <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1.125rem' }}>มาเยี่ยมชมสวนของเราได้ทุกวัน</p>
            </div>
          </ScrollAnimation>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '2rem', alignItems: 'center' }}>
            <ScrollAnimation animation="slide-in-left">
              <div style={{
                borderRadius: '1rem', overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '2px solid #dcfce7'
              }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d989.7839558138357!2d100.56942377049576!3d7.110254269525753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d2d12b2a7590d%3A0x54372dfd81d5955b!2z4Lij4LmJ4Liy4LiZ4LiV4LmJ4LiZ4LmE4Lih4LmJIOC4quC4p-C4meC4hOC4uOC4k-C5geC4lOC4hw!5e0!3m2!1sth!2sth!4v1771097324381!5m2!1sth!2sth"
                  width="100%" height="350" style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
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
                      <p style={{ color: '#6b7280' }}>383 ถ.กาญจนวินิช ต.พะวง อ.เมือง จ.สงขลา 90100</p>
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
                  href="https://maps.app.goo.gl/r5xobpbgAoqpiH4r9"
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
            <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)', marginTop: '0.5rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair), serif', color: '#1f2937' }}>บทความน่ารู้</h2>
          </div>
        </ScrollAnimation>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
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
