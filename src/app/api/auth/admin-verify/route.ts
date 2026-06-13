import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const getJwtSecretKey = () => {
  const secret =
    process.env.JWT_SECRET || "fallback_secret_for_development_only_12345";
  return new TextEncoder().encode(secret);
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "ไม่พบ Token" }, { status: 400 });
    }

    // Verify the magic link token
    let payload;
    try {
      const result = await jwtVerify(token, getJwtSecretKey());
      payload = result.payload;
    } catch {
      return NextResponse.json(
        { error: "ลิงก์หมดอายุหรือไม่ถูกต้อง" },
        { status: 401 },
      );
    }

    // Ensure this is a magic link token
    if (!payload.magic) {
      return NextResponse.json({ error: "Token ไม่ถูกต้อง" }, { status: 401 });
    }

    // Create the actual auth token (valid for 24h)
    const authData = {
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      email: payload.email,
      role: (payload.role as string).toLowerCase(),
    };

    const authToken = await new SignJWT(authData)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getJwtSecretKey());

    const response = NextResponse.json({
      success: true,
      user: authData,
    });

    // Set the auth cookie
    response.cookies.set({
      name: "khun_daeng_token",
      value: authToken,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Admin verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
