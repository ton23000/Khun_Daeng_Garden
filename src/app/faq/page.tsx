'use client';

import { useState } from 'react';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ShieldCheck, Truck, Leaf } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: React.ReactNode;
}

function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{
            marginBottom: '1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            backgroundColor: 'white',
            transition: 'box-shadow 0.2s ease',
            boxShadow: isOpen ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: isOpen ? '#166534' : '#1f2937',
                    fontWeight: isOpen ? 'bold' : '600',
                    fontSize: '1.125rem',
                    transition: 'color 0.2s ease, background-color 0.2s ease',
                    backgroundColor: isOpen ? '#f0fdf4' : 'transparent'
                }}
            >
                <span style={{ paddingRight: '1rem' }}>{question}</span>
                <ChevronDown
                    size={20}
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        flexShrink: 0,
                        color: isOpen ? '#166534' : '#9ca3af'
                    }}
                />
            </button>
            <div style={{
                maxHeight: isOpen ? '500px' : '0',
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
            }}>
                <div style={{
                    padding: '0 1.5rem 1.25rem 1.5rem',
                    color: '#4b5563',
                    lineHeight: '1.6',
                    backgroundColor: '#f0fdf4'
                }}>
                    <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #dcfce7' }}>
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FAQPage() {
    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <ScrollAnimation animation="fade-up">
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/services" style={{ color: '#166534', textDecoration: 'none', display: 'inline-block', transition: 'transform 0.2s', fontWeight: 500 }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                    >
                        ← กลับไปหน้าบริการ
                    </Link>
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: '#dcfce7', borderRadius: '50%', marginBottom: '1rem', color: '#16a34a' }}>
                        <HelpCircle size={32} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
                        คำถามที่พบบ่อย (FAQ)
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
                        รวบรวมข้อสงสัยเกี่ยวกับการบริการ การสั่งซื้อ และการดูแลต้นไม้จากสวนคุณแดง
                    </p>
                </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={100}>
                {/* Category: Ordering & Delivery */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Truck size={24} color="#16a34a" /> 
                        การสั่งซื้อและการจัดส่ง
                    </h2>
                    <FAQItem 
                        question="ใช้เวลานานแค่ไหนในการจัดส่ง?" 
                        answer={
                            <p>โดยปกติเราใช้เวลาในการเตรียมและจัดส่งสินค้าภายใน <strong>3-5 วันทำการ</strong> หรือตามวันที่คุณลูกค้านัดหมายล่วงหน้า สำหรับลูกค้าระยะไกลอาจใช้เวลาเพิ่มเติม 1-2 วันครับ</p>
                        } 
                    />
                    <FAQItem 
                        question="สามารถมารับสินค้าเองได้หรือไม่?" 
                        answer={
                            <p><strong>ได้แน่นอนครับ!</strong> คุณลูกค้าสามารถมารับต้นไม้ได้ที่หน้าสวนโดยตรง เพียงแค่แจ้งล่วงหน้าอย่างน้อย 1 วัน เพื่อให้ทางเราเตรียมต้นไม้และแพ็คให้พร้อมสำหรับการขนย้ายครับ</p>
                        } 
                    />
                    <FAQItem 
                        question="ค่าจัดส่งคิดอย่างไร?" 
                        answer={
                            <p>ค่าจัดส่งจะคำนวณตาม<strong>ระยะทางและขนาดของต้นไม้</strong> ในเขตกรุงเทพฯ และปริมณฑล เริ่มต้นที่ 300 บาท สำหรับต่างจังหวัดเราใช้บริการขนส่งเอกชนที่เชี่ยวชาญด้านต้นไม้โดยเฉพาะ สามารถตรวจสอบค่าส่งก่อนยืนยันการสั่งซื้อได้ครับ</p>
                        } 
                    />
                </div>

                {/* Category: Warranty & Plants */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={24} color="#16a34a" />
                        การรับประกันคุณภาพ
                    </h2>
                    <FAQItem 
                        question="ต้นไม้ที่สั่งซื้อจะมีการรับประกันหรือไม่?" 
                        answer={
                            <p>เรารับประกันต้นไม้ทุกต้น <strong>7 วัน</strong> หลังจากได้รับสินค้า หากพบว่าต้นไม้มีปัญหา เหี่ยวเฉา หรือชำรุดจากการขนส่ง สามารถแจ้งเราพร้อมแนบรูปถ่าย เรายินดีเปลี่ยนต้นใหม่ให้ฟรีไม่มีค่าใช้จ่ายครับ</p>
                        } 
                    />
                    <FAQItem 
                        question="ต้นไม้ที่ได้รับจะไม่ตรงปกใช่ไหม?" 
                        answer={
                            <p>สวนคุณแดงรับประกับความพึงพอใจ ต้นไม้ที่จัดส่งจะเป็นต้นเดียวกับที่คุณเห็นในรูปหรือมีขนาดและฟอร์มใกล้เคียงที่สุด เราคัดสเปคทีละต้นก่อนส่ง หากลูกค้าต้องการดูรูปต้นจริงก่อนส่ง สามารถแจ้งแอดมินได้เลยครับ</p>
                        } 
                    />
                </div>

                {/* Category: Care */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Leaf size={24} color="#16a34a" />
                        การดูแลรักษา
                    </h2>
                    <FAQItem 
                        question="ต้นไม้ที่ซื้อไปควรดูแลอย่างไร?" 
                        answer={
                            <p>ต้นไม้แต่ละชนิดมีความต้องการแสงแดดและน้ำที่แตกต่างกัน ทางเราจะมี <strong>การ์ดคู่มือการดูแลเบื้องต้น (Care Guide)</strong> แนบไปพร้อมกับต้นไม้ทุกออเดอร์ หากมีข้อสงสัยเพิ่มเติม สามารถทักแชทปรึกษาทีมงานได้ตลอดเวลาครับ</p>
                        } 
                    />
                </div>

                {/* Contact Box */}
                <div style={{
                    marginTop: '4rem',
                    padding: '2rem',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '1rem',
                    textAlign: 'center',
                    border: '1px solid #dcfce7',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                    <h3 style={{ fontWeight: 'bold', color: '#111827', fontSize: '1.5rem', marginBottom: '1rem' }}>
                        ยังไม่พบคำตอบที่คุณต้องการ?
                    </h3>
                    <p style={{ color: '#4b5563', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
                        ทีมงานสวนคุณแดงพร้อมตอบทุกข้อสงสัยของคุณเสมอ
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/contact" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '9999px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            transition: 'background-color 0.2s',
                            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                        >
                            ติดต่อเราโดยตรง
                        </Link>
                        <a href="tel:0898762045" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: 'white',
                            color: '#1f2937',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '9999px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'background-color 0.2s',
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            โทร: 089-876-2045
                        </a>
                    </div>
                </div>
            </ScrollAnimation>
        </div>
    );
}
