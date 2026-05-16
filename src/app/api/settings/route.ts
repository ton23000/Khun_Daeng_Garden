import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { MOCK_SITE_SETTINGS } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) return new TextEncoder().encode("fallback_for_build");
  return new TextEncoder().encode(secret);
};

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();

    // Convert array to key-value object
    const settingsMap = settings.reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Fallback to mock data only if database fails
    return NextResponse.json(MOCK_SITE_SETTINGS);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("khun_daeng_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const verified = await jwtVerify(token, getJwtSecretKey());
      if (
        verified.payload.role !== "admin" &&
        verified.payload.role !== "staff"
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();

    // Body should be an object of key-value pairs { "hero_title": "New Title", ... }
    const updates = Object.entries(body).map(([key, value]) => {
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value), updatedAt: new Date() },
      });
    });

    await prisma.$transaction(updates);

    // Force Next.js to re-render the layout with fresh settings
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
