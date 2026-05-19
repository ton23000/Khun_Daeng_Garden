import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret =
    process.env.JWT_SECRET || "fallback_secret_for_development_only_12345";
  return new TextEncoder().encode(secret);
};

export async function verifyAdminOrStaff(req: NextRequest | Request) {
  try {
    let token: string | undefined;

    if ("cookies" in req && typeof req.cookies.get === "function") {
      token = (req as NextRequest).cookies.get("khun_daeng_token")?.value;
    } else {
      // Manual cookie parsing for standard Request objects
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/khun_daeng_token=([^;]+)/);
      token = match ? decodeURIComponent(match[1]) : undefined;
    }

    if (!token) return null;

    const verified = await jwtVerify(token, getJwtSecretKey());
    const payload = verified.payload;
    const role = (payload.role as string || "").toLowerCase();

    if (role === "admin" || role === "staff") {
      return {
        id: payload.id as string,
        email: payload.email as string,
        role,
      };
    }
    return null;
  } catch (error) {
    console.error("verifyAdminOrStaff authorization check failed:", error);
    return null;
  }
}
