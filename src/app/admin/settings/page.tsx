'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<Record<string, string>>({
        hero_title: 'สวนสวยเริ่มต้นที่ | สวนคุณแดง',
        hero_subtitle: 'ค้นพบความสุขในการปลูกต้นไม้กับเรา แหล่งรวมพันธุ์ไม้คัดพิเศษ พร้อมคำแนะนำจากผู้เชี่ยวชาญ เพื่อสวนสวยในบ้านคุณ',
        hero_tag: '#ต้นไม้คุณภาพ จากคุณแดง',
        valentine_heading: '💖 Valentine\'s Special',
        valentine_title: 'มอบความรัก\nส่งต่อต้นไม้',
        valentine_subtitle: 'หลงรักต้นไม้มงคล ที่พร้อมเบ่งบานในฤดูกาลนี้'
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push('/login');
        } else if (user?.role === 'admin') {
            fetchSettings();
        }
    }, [user, isLoading, router]);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                if (Object.keys(data).length > 0) {
                    setSettings(prev => ({ ...prev, ...data }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const storedUser = localStorage.getItem('khun_daeng_user');
            const userId = storedUser ? JSON.parse(storedUser).id : null;

            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(userId ? { 'x-user-id': userId } : {})
                },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setMessage({ text: 'บันทึกการตั้งค่าสำเร็จ', type: 'success' });
            } else {
                setMessage({ text: 'ไม่สามารถบันทึกได้', type: 'error' });
            }
        } catch {
            setMessage({ text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ', type: 'error' });
        } finally {
            setIsSaving(false);
            window.scrollTo(0, 0);
        }
    };

    if (isLoading || !user) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>ตั้งค่าหน้าเพจ (Page Settings)</h1>
                <Button onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </Button>
            </div>

            {message.text && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '2rem',
                    borderRadius: '0.5rem',
                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b'
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
                {/* Hero Section */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                        ส่วนบนสุด (Hero Section)
                    </h2>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>แท็กไลน์ (Tagline)</label>
                            <input
                                type="text"
                                name="hero_tag"
                                value={settings.hero_tag}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>หัวเรื่องหลัก (Main Title) [ใช้ | เพื่อเน้นสีคำข้างหลัง]</label>
                            <input
                                type="text"
                                name="hero_title"
                                value={settings.hero_title}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>คำอธิบาย (Subtitle)</label>
                            <textarea
                                name="hero_subtitle"
                                value={settings.hero_subtitle}
                                onChange={handleChange}
                                rows={3}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Valentine's Banner */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                        ป้ายแบนเนอร์พิเศษ (Special Banner)
                    </h2>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>ป้ายหัวข้อเล็ก (เช่น 💖 Valentine's Special)</label>
                            <input
                                type="text"
                                name="valentine_heading"
                                value={settings.valentine_heading}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>หัวเรื่องแบนเนอร์ (ใช้ \n เพื่อขึ้นบรรทัดใหม่)</label>
                            <textarea
                                name="valentine_title"
                                value={settings.valentine_title}
                                onChange={handleChange}
                                rows={2}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem' }}>คำอธิบายแบนเนอร์</label>
                            <input
                                type="text"
                                name="valentine_subtitle"
                                value={settings.valentine_subtitle}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
