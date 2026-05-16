import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatThaiDate } from "@/lib/dateUtils";

import CountdownTimer from "@/components/CountdownTimer";
import InlineEdit from "@/components/InlineEdit";
import { MOCK_TREES, MOCK_SITE_SETTINGS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function PromotionPage() {
  let promotionTrees, settingsMap;

  const dev = process.env.NODE_ENV !== "production";

  if (dev) {
    promotionTrees = MOCK_TREES.filter((t) => t.isPromotion);
    settingsMap = MOCK_SITE_SETTINGS as unknown as Record<string, string>;
  } else {
    try {
      // Fetch trees marked as promotions
      promotionTrees = await prisma.tree.findMany({
        where: {
          isPromotion: true,
          // Only show active promotions (not expired)
          OR: [
            { promotionEndDate: null },
            { promotionEndDate: { gte: new Date() } },
          ],
        },
        orderBy: { updatedAt: "desc" },
      });

      // Fetch Site Settings
      const settings = await prisma.siteSetting.findMany();
      settingsMap = settings.reduce(
        (acc: Record<string, string>, curr: { key: string; value: string }) => {
          acc[curr.key] = curr.value;
          return acc;
        },
        {},
      ) as Record<string, string>;
    } catch (error) {
      console.error("Database connection failed, using mock data:", error);
      // Use Mock Data
      promotionTrees = MOCK_TREES.filter((t) => t.isPromotion);
      settingsMap = MOCK_SITE_SETTINGS as unknown as Record<string, string>;
    }
  }

  // Find the nearest end date for countdown
  const nearestEndDate = promotionTrees
    .filter((t) => t.promotionEndDate)
    .sort(
      (a, b) =>
        new Date(a.promotionEndDate!).getTime() -
        new Date(b.promotionEndDate!).getTime(),
    )[0]?.promotionEndDate;

  const promotionTitle = settingsMap["promotion_title"] || "🔥 โปรโมชั่นพิเศษ";
  const promotionSubtitle =
    settingsMap["promotion_subtitle"] ||
    "ส่วนลดพิเศษ! ราคาดีที่สุดสำหรับต้นไม้คุณภาพ";

  return (
    <div className="container" style={{ padding: "2rem 1rem" }}>
      {/* Header */}
      <InlineEdit
        settingKey="promotion_banner"
        initialValue=""
        initialBgColor={
          settingsMap["promotion_banner_bgColor"] ||
          "linear-gradient(135deg, #dc2626, #f59e0b)"
        }
        renderAs="div"
        allowStyleEdit
        style={{
          background:
            settingsMap["promotion_banner_bgColor"] ||
            "linear-gradient(135deg, #dc2626, #f59e0b)",
          borderRadius: "1rem",
          padding: "3rem 2rem",
          marginBottom: "2rem",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\") repeat",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />
        <InlineEdit
          settingKey="promotion_title"
          initialValue={promotionTitle}
          initialBgColor={settingsMap["promotion_title_bgColor"]}
          renderAs="h1"
          allowStyleEdit
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: "0 0 0.5rem",
            position: "relative",
            background: settingsMap["promotion_title_bgColor"] || "transparent",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.5rem",
            display: "inline-block",
          }}
        />
        <br />
        <InlineEdit
          settingKey="promotion_subtitle"
          initialValue={promotionSubtitle}
          initialBgColor={settingsMap["promotion_subtitle_bgColor"]}
          renderAs="p"
          allowStyleEdit
          style={{
            fontSize: "1.25rem",
            opacity: 0.9,
            position: "relative",
            background:
              settingsMap["promotion_subtitle_bgColor"] || "transparent",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.5rem",
            display: "inline-block",
          }}
        />
        {nearestEndDate && (
          <div
            style={{
              marginTop: "1rem",
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CountdownTimer
              endDate={nearestEndDate.toISOString()}
              style={{ color: "white" }}
            />
          </div>
        )}
      </InlineEdit>

      {/* Promotion Grid */}
      {promotionTrees.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1rem",
            backgroundColor: "#f9fafb",
            borderRadius: "1rem",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌿</div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#374151",
              marginBottom: "0.5rem",
            }}
          >
            ยังไม่มีโปรโมชั่นในขณะนี้
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            ติดตามเราเพื่อรับข่าวสารโปรโมชั่นใหม่ๆ
          </p>
          <Link
            href="/shop"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              backgroundColor: "#059669",
              color: "white",
              borderRadius: "0.5rem",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            ดูสินค้าทั้งหมด →
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {promotionTrees.map((tree) => {
            let images: string[] = [];
            try {
              images = JSON.parse(tree.images);
            } catch {}
            const mainImage = images[0] || "/placeholder-tree.svg";
            const discount = tree.originalPrice
              ? Math.round(
                  ((tree.originalPrice - tree.price) / tree.originalPrice) *
                    100,
                )
              : 0;

            return (
              <Link
                key={tree.id}
                href={`/trees/${tree.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    borderRadius: "1rem",
                    overflow: "hidden",
                    backgroundColor: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  className="hover:scale-[1.02] hover:shadow-xl"
                >
                  {/* Discount badge */}
                  {discount > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        backgroundColor: "#dc2626",
                        color: "white",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                        zIndex: 2,
                        boxShadow: "0 2px 8px rgba(220,38,38,0.3)",
                      }}
                    >
                      -{discount}%
                    </div>
                  )}

                  {/* Promotion name badge */}
                  {tree.promotionName && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        backgroundColor: "#f59e0b",
                        color: "white",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        zIndex: 2,
                      }}
                    >
                      {tree.promotionName}
                    </div>
                  )}

                  {/* Image */}
                  <div
                    style={{
                      height: "220px",
                      overflow: "hidden",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    <img
                      src={mainImage}
                      alt={tree.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ padding: "1.25rem" }}>
                    <h3
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.125rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {tree.name}
                    </h3>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "0.875rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {tree.category
                        ? tree.category.split(",").filter(Boolean).join(", ")
                        : "-"}
                    </p>

                    {/* Price */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#dc2626",
                        }}
                      >
                        ฿{tree.price.toLocaleString()}
                      </span>
                      {tree.originalPrice &&
                        tree.originalPrice > tree.price && (
                          <span
                            style={{
                              fontSize: "1rem",
                              color: "#9ca3af",
                              textDecoration: "line-through",
                            }}
                          >
                            ฿{tree.originalPrice.toLocaleString()}
                          </span>
                        )}
                    </div>

                    {/* Promotion end date */}
                    {tree.promotionEndDate && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#dc2626",
                          marginTop: "0.5rem",
                          fontWeight: 500,
                        }}
                      >
                        ⏰ หมดเขต{" "}
                        {formatThaiDate(tree.promotionEndDate, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}

                    {/* Rating */}
                    {tree.rating > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        <span style={{ color: "#f59e0b" }}>★</span>
                        <span
                          style={{ fontSize: "0.875rem", color: "#374151" }}
                        >
                          {tree.rating.toFixed(1)}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                          ({tree.reviewCount} รีวิว)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      <div
        style={{
          textAlign: "center",
          marginTop: "3rem",
          padding: "2rem",
          backgroundColor: "#f0fdf4",
          borderRadius: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "1.125rem",
            color: "#374151",
            marginBottom: "1rem",
          }}
        >
          สนใจต้นไม้อื่นๆ? ดูสินค้าทั้งหมดของเรา
        </p>
        <Link
          href="/shop"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            backgroundColor: "#059669",
            color: "white",
            borderRadius: "0.5rem",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          🛒 ไปหน้าร้านค้า
        </Link>
      </div>
    </div>
  );
}
