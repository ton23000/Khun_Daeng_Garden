import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import Link from 'next/link';

export default function TechStackPage() {
    const techCategories = [
        {
            category: '🎨 Frontend',
            color: '#3b82f6',
            technologies: [
                { name: 'Next.js', version: '16.1.6', description: 'React Framework สำหรับ Full-Stack Development' },
                { name: 'React', version: '19.2.3', description: 'JavaScript Library สำหรับสร้าง UI' },
                { name: 'TypeScript', version: '5.x', description: 'JavaScript with Type Safety' },
                { name: 'Lucide React', version: '0.563.0', description: 'Modern Icon Library' },
            ]
        },
        {
            category: '⚙️ Backend',
            color: '#22c55e',
            technologies: [
                { name: 'Next.js API Routes', version: '16.1.6', description: 'Serverless API Endpoints' },
                { name: 'Prisma', version: '6.19.2', description: 'Modern ORM สำหรับจัดการ Database' },
                { name: 'Bcrypt.js', version: '3.0.3', description: 'Password Hashing & Security' },
                { name: 'Jose', version: '6.1.3', description: 'JWT Token Handling' },
                { name: 'JSON Web Token', version: '9.0.3', description: 'Authentication Tokens' },
                { name: 'Zod', version: '4.3.6', description: 'Type-Safe Schema Validation' },
                { name: 'Dotenv', version: '17.3.1', description: 'Environment Variable Management' },
            ]
        },
        {
            category: '🗄️ Database',
            color: '#f59e0b',
            technologies: [
                { name: 'MySQL', version: '8.x', description: 'Production Database' },
                { name: 'MySQL2', version: '3.18.2', description: 'MySQL Driver for Node.js' },
                { name: 'Prisma Client', version: '6.19.2', description: 'Type-safe Database Client' },
            ]
        },
        {
            category: '📧 Services & Communication',
            color: '#ef4444',
            technologies: [
                { name: 'SendGrid', version: '8.0.0', description: 'Email Service & Templates' },
                { name: 'Resend', version: '6.9.1', description: 'Modern Email Service' },
                { name: 'Basic FTP', version: '5.2.0', description: 'File Transfer Protocol' },
                { name: 'FTP Client', version: '0.3.10', description: 'Legacy FTP Support' },
            ]
        },
        {
            category: '🛠️ Development Tools',
            color: '#8b5cf6',
            technologies: [
                { name: 'ESLint', version: '9.x', description: 'Code Quality & Linting' },
                { name: 'TypeScript Compiler', version: '5.x', description: 'TypeScript Compilation' },
                { name: 'TS-Node', version: '10.9.2', description: 'TypeScript Execution' },
                { name: 'Webpack', version: 'Built-in', description: 'Module Bundler (Next.js)' },
            ]
        },
        {
            category: '🤖 Automated Testing',
            color: '#14b8a6',
            technologies: [
                { name: 'Playwright', version: '1.x', description: 'End-to-End (E2E) & UI Testing Agent' },
                { name: 'Jest', version: '29.x', description: 'Unit & Integration Testing Agent' },
                { name: 'React Testing Library', version: '16.x', description: 'React Component Testing' },
            ]
        },
        {
            category: '🔧 Type Definitions',
            color: '#06b6d4',
            technologies: [
                { name: '@types/node', version: '20.x', description: 'Node.js Type Definitions' },
                { name: '@types/react', version: '19.x', description: 'React Type Definitions' },
                { name: '@types/react-dom', version: '19.x', description: 'React DOM Type Definitions' },
                { name: '@types/bcryptjs', version: '2.4.6', description: 'Bcrypt.js Type Definitions' },
                { name: '@types/jsonwebtoken', version: '9.0.10', description: 'JWT Type Definitions' },
                { name: '@types/ftp', version: '0.3.36', description: 'FTP Type Definitions' },
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
                    <Card style={{ borderTop: '4px solid #8b5cf6', textAlign: 'center' }}>
                        <CardContent style={{ padding: '1.5rem' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                                {techCategories[4].technologies.length}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                Development Tools
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

            {/* Deployment & DevOps */}
            <ScrollAnimation animation="fade-up" delay={850}>
                <Card style={{ marginTop: '2rem', backgroundColor: '#eff6ff' }}>
                    <CardHeader>
                        <CardTitle style={{ color: '#1e40af' }}>🚀 Deployment & DevOps</CardTitle>
                    </CardHeader>
                    <CardContent style={{ lineHeight: '1.8' }}>
                        <ul style={{ color: '#374151', paddingLeft: '1.5rem' }}>
                            <li><strong>Production:</strong> Vercel Platform</li>
                            <li><strong>Database:</strong> MySQL Hosting</li>
                            <li><strong>File Deployment:</strong> FTP Upload Scripts</li>
                            <li><strong>Environment:</strong> Production & Development configs</li>
                            <li><strong>Build Process:</strong> Prisma Generate + Next.js Build</li>
                            <li><strong>Code Quality:</strong> ESLint configuration</li>
                        </ul>
                    </CardContent>
                </Card>
            </ScrollAnimation>

            {/* Architecture Overview */}
            <ScrollAnimation animation="fade-up" delay={800}>
                <Card style={{ marginTop: '2rem', backgroundColor: '#f0fdf4' }}>
                    <CardHeader>
                        <CardTitle style={{ color: '#166534' }}>🏗️ สถาปัตยกรรมระบบ</CardTitle>
                    </CardHeader>
                    <CardContent style={{ lineHeight: '1.8' }}>
                        <ul style={{ color: '#374151', paddingLeft: '1.5rem' }}>
                            <li><strong>Architecture:</strong> Full-Stack Application with Next.js 16.1.6</li>
                            <li><strong>Rendering:</strong> Server-Side Rendering (SSR) + Client-Side Rendering (CSR)</li>
                            <li><strong>API:</strong> RESTful API with Next.js API Routes</li>
                            <li><strong>Authentication:</strong> Custom Auth with JWT & Bcrypt.js</li>
                            <li><strong>State Management:</strong> React Context API</li>
                            <li><strong>Styling:</strong> Vanilla CSS with Custom Components</li>
                            <li><strong>Database:</strong> MySQL with Prisma ORM 6.19.2</li>
                            <li><strong>Email:</strong> Transactional emails via SendGrid & Resend</li>
                            <li><strong>File Transfer:</strong> FTP Support for deployment</li>
                            <li><strong>Type Safety:</strong> Full TypeScript implementation</li>
                            <li><strong>Automated Testing:</strong> End-to-End with Playwright & Unit Testing with Jest</li>
                            <li><strong>Validation:</strong> Zod schema validation</li>
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
                        <div style={{ fontSize: '0.875rem', color: '#78350f', marginBottom: '1rem' }}>
                            พัฒนาด้วย ❤️ โดยใช้เทคโนโลยีสมัยใหม่
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#92400e' }}>
                            Last Updated: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </CardContent>
                </Card>
            </ScrollAnimation>

            {/* Performance Metrics */}
            <ScrollAnimation animation="fade-up" delay={950}>
                <Card style={{ marginTop: '2rem', backgroundColor: '#f3e8ff' }}>
                    <CardHeader>
                        <CardTitle style={{ color: '#6b21a8' }}>📊 Performance & Features</CardTitle>
                    </CardHeader>
                    <CardContent style={{ lineHeight: '1.8' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6b21a8' }}>
                                    {techCategories.reduce((acc, cat) => acc + cat.technologies.length, 0)}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    Total Technologies
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6b21a8' }}>
                                    {techCategories.length}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    Tech Categories
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6b21a8' }}>
                                    100%
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    TypeScript Coverage
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ScrollAnimation>
        </div>
    );
}
