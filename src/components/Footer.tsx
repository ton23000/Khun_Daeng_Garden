'use client';

import Link from 'next/link';

export function Footer() {
    const footerStyle: React.CSSProperties = {
        backgroundColor: '#2d3e2d', // Dark green from image
        color: '#ffffff',
        padding: '3rem 0 1rem'
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '1.125rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#ffffff'
    };

    const linkStyle: React.CSSProperties = {
        display: 'block',
        color: '#d1d5db',
        textDecoration: 'none',
        marginBottom: '0.5rem',
        fontSize: '0.875rem',
        transition: 'color 0.2s'
    };

    const bottomBarStyle: React.CSSProperties = {
        backgroundColor: '#7fb069', // Light green from image
        color: '#2d3e2d',
        padding: '1rem 0',
        marginTop: '2rem',
        fontSize: '0.875rem'
    };

    return (
        <footer style={footerStyle}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Column 1: About */}
                    <div>
                        <h3 style={{
                            fontSize: '1.75rem',
                            fontFamily: 'var(--font-playfair), serif',
                            fontStyle: 'italic',
                            marginBottom: '1rem',
                            color: '#ffffff'
                        }}>
                            Khun Daeng Garden
                        </h3>
                        <p style={{
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                            color: '#d1d5db',
                            marginBottom: '1.5rem'
                        }}>
                            เราจำหน่ายไม้ประดับและไม้ดอกไม้ประดับ<br />
                            ในเมืองไทยมาอย่างยาวนาน
                        </p>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                                อีเมล: <a href="mailto:kittitusjuprajak@gmail.com" style={{ color: '#7fb069', textDecoration: 'none' }}>kittitusjuprajak@gmail.com</a>
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.5rem' }}>
                                โทรศัพท์: <span style={{ color: '#7fb069' }}>089-876-2045</span>
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                                Facebook: <a href="https://web.facebook.com/kittitusjupraja" target="_blank" rel="noopener noreferrer" style={{ color: '#7fb069', textDecoration: 'none' }}>สวนคุณแดง</a>
                            </div>
                        </div>
                        {/* Payment Icons */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: '#1a1f71'
                            }}>VISA</div>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: '#eb001b'
                            }}>Mastercard</div>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: '#003087'
                            }}>PayPal</div>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>💳</div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 style={sectionTitleStyle}>เมนูข้อมูล</h4>
                        <Link href="/about" style={linkStyle}>เกี่ยวกับเรา</Link>
                        <Link href="/services" style={linkStyle}>บริการของเรา</Link>
                        <Link href="/services#order" style={linkStyle}>วิธีการสั่งซื้อ</Link>
                        <Link href="/services#planting" style={linkStyle}>คำปรึกษาการปลูก</Link>
                        <Link href="/faq" style={linkStyle}>คำถามที่พบบ่อย</Link>
                    </div>

                    {/* Column 3: Shop */}
                    <div>
                        <h4 style={sectionTitleStyle}>ร้านค้า</h4>
                        <Link href="/shop" style={linkStyle}>สินค้าทั้งหมด</Link>
                        <Link href="/shop?category=cactus" style={linkStyle}>กระบองเพชร</Link>
                        <Link href="/promotion" style={linkStyle}>โปรโมชั่น</Link>
                    </div>

                    {/* Column 4: Account */}
                    <div>
                        <h4 style={sectionTitleStyle}>บัญชีของฉัน</h4>
                        <Link href="/profile" style={linkStyle}>ข้อมูลส่วนตัว</Link>
                        <Link href="/cart" style={linkStyle}>ตะกร้าสินค้า</Link>
                        <Link href="/profile/bookings" style={linkStyle}>ประวัติการจอง</Link>
                        <Link href="/login" style={linkStyle}>เข้าสู่ระบบ</Link>
                        <Link href="/register" style={linkStyle}>สมัครสมาชิก</Link>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={bottomBarStyle}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ fontSize: '0.875rem' }}>
                        สงวนลิขสิทธิ์ © 2026 สวนคุณแดง สงวนสิทธิ์ทั้งหมด
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
                        <Link href="/privacy" style={{ color: '#2d3e2d', textDecoration: 'none' }}>นโยบายความเป็นส่วนตัว</Link>
                        <Link href="/terms" style={{ color: '#2d3e2d', textDecoration: 'none' }}>ข้อกำหนดการใช้งาน</Link>
                        <Link href="/about" style={{ color: '#2d3e2d', textDecoration: 'none' }}>เกี่ยวกับเรา</Link>
                        <Link href="/tech-stack" style={{ color: '#2d3e2d', textDecoration: 'none' }}>เทคโนโลยี</Link>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#4a5a4a' }}>
                        Made with 🌿 by Khun Daeng Garden
                    </div>
                </div>
            </div>
        </footer>
    );
}
