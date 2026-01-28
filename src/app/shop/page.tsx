import { MOCK_TREES } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function ShopPage() {
    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>รายการต้นไม้ทั้งหมด</h1>
                <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', gap: '0.5rem' }}>
                    <Input placeholder="ค้นหาต้นไม้..." />
                    <Button>ค้นหา</Button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {MOCK_TREES.map((tree) => (
                    <Card key={tree.id}>
                        <div style={{ height: '200px', backgroundColor: '#e5e7eb', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                            รูปภาพ
                        </div>
                        <CardHeader>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <CardTitle>{tree.name}</CardTitle>
                                {tree.status === 'BOOKED' && (
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#d97706' }}>
                                        จองแล้ว
                                    </span>
                                )}
                            </div>
                            <CardDescription>{tree.category}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>
                                ฿ {tree.price.toLocaleString()}
                            </p>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {tree.description}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/trees/${tree.id}`} style={{ width: '100%' }}>
                                <Button fullWidth variant={tree.status === 'AVAILABLE' ? 'primary' : 'outline'} disabled={tree.status !== 'AVAILABLE'}>
                                    {tree.status === 'AVAILABLE' ? 'ดูรายละเอียด' : 'ถูกจองแล้ว'}
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
