import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch notifications for a user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Limit to latest 20
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

// POST - Create a notification (Internal use generally, but good to have)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, message, type, bookingId } = body;

    const notification = await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        message,
        type: type || "info",
        bookingId,
      },
    });

    return NextResponse.json(notification);
  } catch {
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 },
    );
  }
}

// PATCH - Mark as read
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, read, all, userId } = body;

    if (all && userId) {
      // Mark all for user
      await prisma.notification.updateMany({
        where: { userId },
        data: { read: true },
      });
      return NextResponse.json({ success: true });
    } else if (id) {
      // Mark single
      const notification = await prisma.notification.update({
        where: { id },
        data: { read: read !== undefined ? read : true },
      });
      return NextResponse.json(notification);
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 },
    );
  }
}
