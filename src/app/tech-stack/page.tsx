import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import Link from 'next/link';

export default function TechStackPage() {
    const techCategories = [
        {
            category: '🎨 Frontend',
            color: '#3b82f6',
            technologies: [
                { name: 'Next.js', version: '16.1.6', description: 'React Framework สำหรับ Server-Side Rendering' },
                { name: 'React', version: '19.2.3', description: 'JavaScript Library สำหรับสร้าง UI' },
                { name: 'TypeScript', version: '5.x', description: 'JavaScript with Type Safety' },
                { name: 'CSS', version: 'Vanilla', description: 'Styling แบบ Custom' },
            ]
        },
        {
            category: '⚙️ Backend',
            color: '#22c55e',
            technologies: [
                { name: 'Next.js API Routes', version: '16.1.6', description: 'Serverless API Endpoints' },
                { name: 'Prisma', version: '6.19.2', description: 'ORM สำหรับจัดการ Database' },
                { name: 'Bcrypt.js', version: '3.0.3', description: 'Password Hashing' },
                { name: 'Zod', version: '4.3.6', description: 'Schema Validation' },
            ]
        },
        {
            category: '🗄️ Database',
            color: '#f59e0b',
            technologies: [
                { name: 'SQLite', version: '3.x', description: 'Lightweight Database' },
                { name: 'Prisma Client', version: '6.19.2', description: 'Type-safe Database Client' },
            ]
        },
        {
            category: '📧 Services',
            color: '#ef4444',
            technologies: [
                { name: 'Resend', version: '6.9.1', description: 'Email Service สำหรับส่งอีเมล' },
                { name: 'PromptPay QR', version: 'Custom', description: 'QR Code สำหรับชำระเงิน' },
            ]
        },
        {
            category: '🛠️ Development Tools',
            color: '#8b5cf6',
            technologies: [
                { name: 'ESLint', version: '9.x', description: 'Code Linting' },
                { name: 'ts-node', version: '10.9.2', description: 'TypeScript Execution' },
                { name: 'Lucide React', version: '0.563.0', description: 'Icon Library' },
            ]
        }
    ];

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <ScrollAnimation animation="fade-up">
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/" style={{ color: '#166534', textDecoration: 'none' }}>
                        ← กลับหน้าหลัก
                    </Link>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#166534' }}>
                    เทคโนโลยีที่ใช้พัฒนา
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem' }}>
                    รายการโปรแกรมและภาษาที่ใช้ในการพัฒนาเว็บไซต์ Khun Daeng Garden
                </p>
            </ScrollAnimation>

            {/* Overview Stats */}
            <ScrollAnimation animation="fade-up" delay={100}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '3rem'
                }}>
                    <Card style={{ borderTop: '4px solid #3b82f6', textAlign: 'center' }}>
                        <CardContent style={{ padding: '1.5rem' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                                {techCategories[0].technologies.length}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                Frontend Technologies
                            </div>
                        </CardContent>
                    </Card>
                    <Card style={{ borderTop: '4px solid #22c55e', textAlign: 'center' }}>
                        <CardContent style={{ padding: '1.5rem' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#22c55e' }}>
                                {techCategories[1].technologies.length}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                Backend Technologies
                            </div>
                        </CardContent>
                    </Card>
                    <Card style={{ borderTop: '4px solid #f59e0b', textAlign: 'center' }}>
                        <CardContent style={{ padding: '1.5rem' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                                {techCategories[2].technologies.length}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                Database Technologies
                            </div>
                        </CardContent>
                    </Card>
                    <Card style={{ borderTop: '4px solid #ef4444', textAlign: 'center' }}>
                        <CardContent style={{ padding: '1.5rem' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                                {techCategories[3].technologies.length}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                External Services
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ScrollAnimation>

            {/* Tech Categories */}
            {techCategories.map((cat, idx) => (
                <ScrollAnimation key={cat.category} animation="fade-up" delay={200 + (idx * 100)}>
                    <Card style={{ marginBottom: '2rem' }}>
                        <CardHeader style={{ borderBottom: '2px solid #f3f4f6' }}>
                            <CardTitle style={{ fontSize: '1.75rem', color: cat.color }}>
                                {cat.category}
                            </CardTitle>
                        </CardHeader>
                        <CardContent style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {cat.technologies.map((tech) => (
                                    <div
                                        key={tech.name}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '0.5rem',
                                            borderLeft: `4px solid ${cat.color}`,
                                            transition: 'all 0.2s'
                                        }}
                                        className="hover:shadow-md"
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937' }}>
                                                    {tech.name}
                                                </span>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    color: 'white',
                                                    backgroundColor: cat.color,
                                                    padding: '0.125rem 0.5rem',
                                                    borderRadius: '0.25rem',
                                                    fontWeight: 600
                                                }}>
                                                    v{tech.version}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                {tech.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </ScrollAnimation>
            ))}

            {/* Architecture Overview */}
            <ScrollAnimation animation="fade-up" delay={800}>
                <Card style={{ marginTop: '2rem', backgroundColor: '#f0fdf4' }}>
                    <CardHeader>
                        <CardTitle style={{ color: '#166534' }}>🏗️ สถาปัตยกรรมระบบ</CardTitle>
                    </CardHeader>
                    <CardContent style={{ lineHeight: '1.8' }}>
                        <ul style={{ color: '#374151', paddingLeft: '1.5rem' }}>
                            <li><strong>Architecture:</strong> Full-Stack Application with Next.js</li>
                            <li><strong>Rendering:</strong> Server-Side Rendering (SSR) + Client-Side Rendering (CSR)</li>
                            <li><strong>API:</strong> RESTful API with Next.js API Routes</li>
                            <li><strong>Authentication:</strong> Custom Auth with Bcrypt.js</li>
                            <li><strong>State Management:</strong> React Context API</li>
                            <li><strong>Styling:</strong> Vanilla CSS with Custom Components</li>
                            <li><strong>Database:</strong> SQLite with Prisma ORM</li>
                            <li><strong>Email:</strong> Transactional emails via Resend</li>
                            <li><strong>Payment:</strong> PromptPay QR Code Integration</li>
                        </ul>
                    </CardContent>
                </Card>
            </ScrollAnimation>

            {/* Project Info */}
            <ScrollAnimation animation="fade-up" delay={900}>
                <Card style={{ marginTop: '2rem', backgroundColor: '#fef3c7' }}>
                    <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#92400e', marginBottom: '0.5rem' }}>
                            📦 Khun Daeng Garden v0.1.0
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#78350f' }}>
                            พัฒนาด้วย ❤️ โดยใช้เทคโนโลยีสมัยใหม่
                        </div>
                    </CardContent>
                </Card>
            </ScrollAnimation>
        </div>
    );
}
