'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScrollAnimation } from '@/components/ScrollAnimation';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setSubmitStatus('success');
            setIsSubmitting(false);
            setFormData({ name: '', email: '', phone: '', message: '' });

            setTimeout(() => setSubmitStatus('idle'), 3000);
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <ScrollAnimation animation="fade-up">
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#166534' }}>
                    ติดต่อเรา
                </h1>
                <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem', lineHeight: '1.6' }}>
                    มีคำถามหรือต้องการสอบถามข้อมูล? ติดต่อเราได้ตามช่องทางด้านล่าง
                </p>
            </ScrollAnimation>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Contact Information */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <ScrollAnimation animation="fade-up" delay={100}>
                        <Card>
                            <CardHeader>
                                <CardTitle>ข้อมูลติดต่อ</CardTitle>
                            </CardHeader>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>📞</span>
                                    <div>
                                        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>เบอร์โทรศัพท์</p>
                                        <a href="tel:0898762045" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                                            089-876-2045
                                        </a>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>✉️</span>
                                    <div>
                                        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>อีเมล</p>
                                        <a href="mailto:kittitusjuprajak@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                                            kittitusjuprajak@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>📱</span>
                                    <div>
                                        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Facebook</p>
                                        <a
                                            href="https://web.facebook.com/kittitusjupraja"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: 'var(--primary)', textDecoration: 'none' }}
                                        >
                                            สวนคุณแดง
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </ScrollAnimation>

                    <ScrollAnimation animation="fade-up" delay={200}>
                        <Card>
                            <CardHeader>
                                <CardTitle>เวลาทำการ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>จันทร์ - ศุกร์</span>
                                        <span style={{ fontWeight: 600 }}>9:00 - 18:00</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>เสาร์ - อาทิตย์</span>
                                        <span style={{ fontWeight: 600 }}>9:00 - 17:00</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </ScrollAnimation>
                </div>

                {/* Contact Form */}
                <ScrollAnimation animation="fade-up" delay={300}>
                    <Card>
                        <CardHeader>
                            <CardTitle>ส่งข้อความถึงเรา</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        ชื่อ-นามสกุล <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.875rem'
                                        }}
                                        placeholder="กรอกชื่อของคุณ"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        อีเมล <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.875rem'
                                        }}
                                        placeholder="example@email.com"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        เบอร์โทรศัพท์
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.875rem'
                                        }}
                                        placeholder="08X-XXX-XXXX"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        ข้อความ <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.875rem',
                                            resize: 'vertical'
                                        }}
                                        placeholder="เขียนข้อความของคุณที่นี่..."
                                    />
                                </div>

                                {submitStatus === 'success' && (
                                    <div style={{
                                        padding: '0.75rem',
                                        backgroundColor: '#d1fae5',
                                        color: '#065f46',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}>
                                        ✓ ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting}
                                    style={{ width: '100%' }}
                                >
                                    {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </ScrollAnimation>
            </div>
        </div>
    );
}
