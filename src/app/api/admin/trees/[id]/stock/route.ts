import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/trees/[id]/stock - Update stock quantity
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: treeId } = await params;
        const { stock } = await req.json();

        if (typeof stock !== 'number' || stock < 0) {
            return NextResponse.json({ error: 'สต็อกต้องเป็นตัวเลขที่ไม่ติดลบ' }, { status: 400 });
        }

        const tree = await prisma.tree.update({
            where: { id: treeId },
            data: { stock }
        });

        return NextResponse.json(tree);
    } catch (error) {
        console.error('Error updating stock:', error);
        return NextResponse.json({ error: 'ไม่สามารถอัปเดตสต็อกได้' }, { status: 500 });
    }
}
