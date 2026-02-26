
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const files = data.getAll('file') as unknown as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        const uploadedUrls: string[] = [];

        // Ensure uploads directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch {
            // Ignore if exists
        }

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create unique filename
            const timestamp = Date.now();
            // Add a random suffix to avoid collisions with same-time uploads
            const randomSuffix = Math.round(Math.random() * 1000);
            const cleanName = file.name.replace(/\s+/g, '-').toLowerCase();
            const filename = `${timestamp}-${randomSuffix}-${cleanName}`;

            const path = join(uploadDir, filename);

            await writeFile(path, buffer);
            console.log(`Saved file to ${path}`);

            // Return direct path to public folder
            uploadedUrls.push(`/uploads/${filename}`);
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
