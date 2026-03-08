import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('images') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'ไม่พบไฟล์รูปภาพ' }, { status: 400 });
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                return NextResponse.json({ error: 'อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น' }, { status: 400 });
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                return NextResponse.json({ error: 'ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB' }, { status: 400 });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Convert to base64 data URI
            const base64Data = buffer.toString('base64');
            const mimeType = file.type || 'image/jpeg';
            const dataUri = `data:${mimeType};base64,${base64Data}`;

            uploadedUrls.push(dataUri);
        }

        return NextResponse.json({
            message: 'อัปโหลดสำเร็จ',
            urls: uploadedUrls
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปโหลด' }, { status: 500 });
    }
}
