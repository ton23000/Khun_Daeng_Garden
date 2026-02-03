import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all admin notifications
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        const where = unreadOnly ? { read: false } : {};

        const notifications = await prisma.adminNotification.findMany({
            where,
            include: {
                booking: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: [
                { read: 'asc' },  // Unread first
                { createdAt: 'desc' }
            ],
            take: 50 // Limit to recent 50
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error('Error fetching admin notifications:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

// PATCH - Mark notification(s) as read
export async function PATCH(req: NextRequest) {
    try {
        const { notificationIds, markAllRead } = await req.json();

        if (markAllRead) {
            // Mark all as read
            await prisma.adminNotification.updateMany({
                where: { read: false },
                data: { read: true }
            });
            return NextResponse.json({ message: 'All notifications marked as read' });
        }

        if (!notificationIds || !Array.isArray(notificationIds)) {
            return NextResponse.json({ error: 'Notification IDs required' }, { status: 400 });
        }

        await prisma.adminNotification.updateMany({
            where: {
                id: { in: notificationIds }
            },
            data: { read: true }
        });

        return NextResponse.json({ message: 'Notifications marked as read' });
    } catch (error) {
        console.error('Error updating notifications:', error);
        return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
    }
}

// DELETE - Clear old read notifications
export async function DELETE(req: NextRequest) {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        await prisma.adminNotification.deleteMany({
            where: {
                read: true,
                createdAt: {
                    lt: thirtyDaysAgo
                }
            }
        });

        return NextResponse.json({ message: 'Old notifications cleared' });
    } catch (error) {
        console.error('Error deleting notifications:', error);
        return NextResponse.json({ error: 'Failed to delete notifications' }, { status: 500 });
    }
}
