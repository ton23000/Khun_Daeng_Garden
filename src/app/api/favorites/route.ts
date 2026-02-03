import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch user's favorites
export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                tree: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }
}

// POST - Add tree to favorites
export async function POST(req: NextRequest) {
    try {
        const userId = req.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { treeId } = await req.json();

        if (!treeId) {
            return NextResponse.json({ error: 'Tree ID required' }, { status: 400 });
        }

        // Check if already favorited
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_treeId: {
                    userId,
                    treeId
                }
            }
        });

        if (existing) {
            return NextResponse.json({ message: 'Already in favorites', favorite: existing });
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId,
                treeId
            },
            include: {
                tree: true
            }
        });

        return NextResponse.json({ message: 'Added to favorites', favorite });
    } catch (error) {
        console.error('Error adding favorite:', error);
        return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }
}

// DELETE - Remove from favorites
export async function DELETE(req: NextRequest) {
    try {
        const userId = req.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const treeId = searchParams.get('treeId');

        if (!treeId) {
            return NextResponse.json({ error: 'Tree ID required' }, { status: 400 });
        }

        await prisma.favorite.delete({
            where: {
                userId_treeId: {
                    userId,
                    treeId
                }
            }
        });

        return NextResponse.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
    }
}
