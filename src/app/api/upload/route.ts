import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const files = data.getAll('file') as unknown as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Convert to base64 data URI
            const base64Data = buffer.toString('base64');
            const mimeType = file.type || 'image/jpeg';
            const dataUri = `data:${mimeType};base64,${base64Data}`;

            uploadedUrls.push(dataUri);
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
