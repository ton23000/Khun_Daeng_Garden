import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('images') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'ไม่พบไฟล์รูปภาพ' }, { status: 400 });
        }

        const uploadedUrls: string[] = [];
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'trees');

        // Create directory if it doesn't exist
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        for (const file of files) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                return NextResponse.json({ error: 'อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น' }, { status: 400 });
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                return NextResponse.json({ error: 'ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB' }, { status: 400 });
            }

            // Generate unique filename
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 8);
            const extension = file.name.split('.').pop();
            const filename = `tree_${timestamp}_${randomStr}.${extension}`;

            // Convert file to buffer and save
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filepath = join(uploadDir, filename);
            await writeFile(filepath, buffer);

            // Store the public URL
            uploadedUrls.push(`/uploads/trees/${filename}`);
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
