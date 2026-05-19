import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Percent, Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { ParallaxSection } from "@/components/ParallaxSection";
import FavoriteButton from "@/components/FavoriteButton";
import { ImageSlider } from "@/components/ImageSlider";
import InlineEdit from "@/components/InlineEdit";
import { User } from "lucide-react";
import { MOCK_TREES, MOCK_REVIEWS, MOCK_SITE_SETTINGS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  let featuredTrees,
    bestSellingTreesWithCount,
    displayBestSellers,
    weeklyBestSellingTreesWithCount,
    promotionalTrees,
    seasonalTrees,
    heroTree,
    settingsMap,
    topReviews;

  try {
    featuredTrees = await prisma.tree.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    // Top 5 best sellers
    const bestSellingData = await prisma.bookingItem.groupBy({
      by: ["treeId"],
      where: { booking: { status: "COMPLETED" } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const bestSellingTreeIds = bestSellingData.map(
      (d: { treeId: string }) => d.treeId,
    );
    const bestSellingTrees = await prisma.tree.findMany({
      where: { id: { in: bestSellingTreeIds } },
    });

    bestSellingTreesWithCount = bestSellingTrees
      .map((tree) => {
        const saleData = bestSellingData.find(
          (d: { treeId: string; _sum: { quantity: number | null } }) =>
            d.treeId === tree.id,
        );
        return {
          ...tree,
          soldCount: saleData?._sum?.quantity || 0,
        };
      })
      .sort((a, b) => b.soldCount - a.soldCount);

    // Fallback if no sales
    displayBestSellers =
      bestSellingTreesWithCount.length > 0
        ? bestSellingTreesWithCount
        : featuredTrees;

    // Weekly Best Sellers
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get completed bookings in the last 7 days
    const completedBookings = await prisma.booking.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: sevenDaysAgo },
      },
      select: { id: true },
    });

    const bookingIds = completedBookings.map((b) => b.id);

    const weeklyBestSellingData = await prisma.bookingItem.groupBy({
      by: ["treeId"],
      where: {
        bookingId: { in: bookingIds },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const weeklyBestSellingTreeIds = weeklyBestSellingData.map(
      (d: { treeId: string }) => d.treeId,
    );
    const weeklyBestSellingTrees = await prisma.tree.findMany({
      where: { id: { in: weeklyBestSellingTreeIds } },
    });

    weeklyBestSellingTreesWithCount = weeklyBestSellingTrees
      .map((tree) => {
        const saleData = weeklyBestSellingData.find(
          (d) => d.treeId === tree.id,
        );
        return {
          ...tree,
          soldCount: saleData?._sum?.quantity || 0,
        };
      })
      .sort((a, b) => b.soldCount - a.soldCount);

    // Promotional trees
    promotionalTrees = await prisma.tree.findMany({
      where: {
        isPromotion: true,
        OR: [
          { promotionEndDate: null },
          { promotionEndDate: { gte: new Date() } },
        ],
      },
      take: 4,
      orderBy: { updatedAt: "desc" },
    });

    // Seasonal/Festival trees (e.g. Valentine's / Rose)
    seasonalTrees = await prisma.tree.findMany({
      where: {
        OR: [
          { tags: { contains: "วาเลนไทน์" } },
          { name: { contains: "กุหลาบ" } },
          { tags: { contains: "เทศกาล" } },
        ],
        stock: { gt: 0 },
      },
      take: 4,
    });

    // Hero Section Tree: Promotional > Best Seller > Fallback
    if (promotionalTrees && promotionalTrees.length > 0) {
      heroTree = promotionalTrees[0];
    } else if (displayBestSellers && displayBestSellers.length > 0) {
      heroTree = displayBestSellers[0];
    } else {
      heroTree = await prisma.tree.findFirst();
    }

    // Fetch Site Settings
    const settings = await prisma.siteSetting.findMany();
    settingsMap = settings.reduce(
      (acc: Record<string, string>, curr: { key: string; value: string }) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {},
    ) as Record<string, string>;

    topReviews = await prisma.review.findMany({
      where: {
        isFeatured: true,
        hidden: false,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    // Fallback if no featured reviews
    if (topReviews.length === 0) {
      topReviews = await prisma.review.findMany({
        where: {
          rating: { gte: 4 }, // 4 or 5 stars
          hidden: false,
          comment: { not: null, notIn: [""] },
        },
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 4, // Max 4 reviews displayed on the homepage
      });
    }
  } catch (error) {
    console.error("Database connection failed, using mock data:", error);
    // Use Mock Data
    featuredTrees = MOCK_TREES.slice(0, 4);
    displayBestSellers = MOCK_TREES.slice(0, 4).map((t) => ({
      ...t,
      soldCount: 10,
    }));
    weeklyBestSellingTreesWithCount = MOCK_TREES.slice(0, 4).map((t) => ({
      ...t,
      soldCount: 5,
    }));
    promotionalTrees = MOCK_TREES.filter((t) => t.isPromotion);
    seasonalTrees = MOCK_TREES.slice(0, 2);
    heroTree = MOCK_TREES[0];
    settingsMap = MOCK_SITE_SETTINGS as unknown as Record<string, string>;
    topReviews = MOCK_REVIEWS;
  }

  const heroTitle = settingsMap["hero_title"] || "สวนสวยเริ่มต้นที่ สวนคุณแดง";
  const heroTitleColor = settingsMap["hero_title_color"] || "var(--foreground)";
  const heroTitleSize =
    settingsMap["hero_title_fontSize"] || "clamp(1.75rem, 8vw, 4.5rem)";

  const heroSubtitle =
    settingsMap["hero_subtitle"] ||
    "ค้นพบความสุขในการปลูกต้นไม้กับเรา แหล่งรวมพันธุ์ไม้คัดพิเศษ\nพร้อมคำแนะนำจากผู้เชี่ยวชาญ เพื่อสวนสวยในบ้านคุณ";
  const heroSubtitleColor = settingsMap["hero_subtitle_color"] || "#6b7280";
  const heroSubtitleSize =
    settingsMap["hero_subtitle_fontSize"] || "clamp(0.9rem, 3vw, 1.1rem)";

  const heroTag = settingsMap["hero_tag"] || "#ต้นไม้คุณภาพ จากคุณแดง";
  const heroTagColor = settingsMap["hero_tag_color"] || "#6b7280";
  const heroTagSize = settingsMap["hero_tag_fontSize"] || "0.9rem";

  const valTitle = settingsMap["valentine_title"] || "มอบความรัก\nส่งต่อต้นไม้";
  const valTitleColor = settingsMap["valentine_title_color"] || "#991b1b";
  const valTitleSize =
    settingsMap["valentine_title_fontSize"] || "clamp(1.75rem, 5vw, 3.5rem)";

  const valSubtitle =
    settingsMap["valentine_subtitle"] ||
    "หลงรักต้นไม้มงคล ที่พร้อมเบ่งบานในฤดูกาลนี้";
  const valSubtitleColor = settingsMap["valentine_subtitle_color"] || "#b91c1c";
  const valSubtitleSize =
    settingsMap["valentine_subtitle_fontSize"] || "clamp(0.9rem, 2vw, 1.25rem)";

  const valHeading =
    settingsMap["valentine_heading"] || "💖 Valentine's Special";
  const valHeadingColor = settingsMap["valentine_heading_color"] || "#7f1d1d";
  const valHeadingSize =
    settingsMap["valentine_heading_fontSize"] ||
    "clamp(0.875rem, 3vw, 1.25rem)";

  return (
    <main>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          backgroundColor: "#fefcf9",
          padding: "4rem 0 6rem",
          overflow: "hidden",
        }}
      >
        {/* Background Decorative Circle */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "600px",
            height: "600px",
            backgroundColor: "#e6f5e6",
            borderRadius: "50%",
            zIndex: 0,
          }}
        ></div>

        <div
          className="container grid-hero"
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Text Content */}
          <ScrollAnimation animation="fade-up">
            <div style={{ gridColumn: "span 1", position: "relative" }}>
              <InlineEdit
                settingKey="hero_tag"
                initialValue={heroTag}
                allowStyleEdit
                initialColor={heroTagColor}
                initialBgColor={settingsMap["hero_tag_bgColor"]}
                initialFontSize={heroTagSize}
                renderAs="span"
                style={{
                  color: heroTagColor,
                  background: settingsMap["hero_tag_bgColor"] || "transparent",
                  fontSize: heroTagSize,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                }}
              />
              <InlineEdit
                settingKey="hero_title"
                initialValue={heroTitle}
                allowStyleEdit
                initialColor={heroTitleColor}
                initialBgColor={settingsMap["hero_title_bgColor"]}
                initialFontSize={heroTitleSize}
                renderAs="h1"
                useSpecialTitleFormat
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: heroTitleSize,
                  fontWeight: "700",
                  lineHeight: "1.2",
                  color: heroTitleColor,
                  background:
                    settingsMap["hero_title_bgColor"] || "transparent",
                  marginBottom: "1rem",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.5rem",
                }}
              />
              <InlineEdit
                settingKey="hero_subtitle"
                initialValue={heroSubtitle}
                allowStyleEdit
                initialColor={heroSubtitleColor}
                initialBgColor={settingsMap["hero_subtitle_bgColor"]}
                initialFontSize={heroSubtitleSize}
                renderAs="p"
                multiline
                style={{
                  fontSize: heroSubtitleSize,
                  color: heroSubtitleColor,
                  background:
                    settingsMap["hero_subtitle_bgColor"] || "transparent",
                  marginBottom: "2.5rem",
                  lineHeight: "1.6",
                  whiteSpace: "pre-line",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.5rem",
                  display: "inline-block",
                }}
              />
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/shop">
                  <Button
                    size="lg"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "white",
                      borderRadius: "50px",
                      padding: "0 2rem",
                    }}
                  >
                    จองต้นไม้ →
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="outline"
                    style={{
                      borderRadius: "50px",
                      padding: "0 2rem",
                      borderColor: "var(--foreground)",
                      color: "var(--foreground)",
                    }}
                  >
                    บริการของเรา →
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollAnimation>

          {/* Image Content with Parallax */}
          <ParallaxSection speed={0.3}>
            {heroTree &&
              (() => {
                let displayImage = "/placeholder-tree.svg";
                try {
                  const parsedImages = JSON.parse(heroTree.images);
                  if (parsedImages.length > 0) {
                    displayImage = parsedImages[0];
                  }
                } catch {
                  // Ignore parse errors
                }

                return (
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "400px",
                        height: "min(500px, 100vw)",
                        backgroundColor: "#e5e7eb",
                        borderRadius: "20px",
                        backgroundImage: `url("${displayImage}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        overflow: "hidden",
                      }}
                    >
                      {/* Overlay Title inside the image */}
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          textAlign: "center",
                          width: "100%",
                          padding: "1rem",
                        }}
                      >
                        <div
                          style={{
                            color: "white",
                            fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                            fontWeight: "bold",
                            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                            fontFamily: "var(--font-playfair), serif",
                          }}
                        >
                          {heroTree.name}{" "}
                          {heroTree.isPromotion && heroTree.originalPrice
                            ? heroTree.price
                            : heroTree.price}
                          .-
                        </div>
                      </div>
                    </div>

                    {/* Floating Cards simulating the template */}
                    <Link
                      href={`/trees/${heroTree.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10%",
                          left: "0",
                          transform: "translateX(-10px)",
                          backgroundColor: "white",
                          padding: "1rem",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                        }}
                        className="hover:scale-105"
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={displayImage}
                            alt={heroTree.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div>
                          <div
                            style={{ fontWeight: "bold", fontSize: "0.9rem" }}
                          >
                            {heroTree.name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "#166534",
                              display: "flex",
                              gap: "0.5rem",
                              alignItems: "center",
                            }}
                          >
                            {heroTree.isPromotion && heroTree.originalPrice && (
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "#9ca3af",
                                  fontSize: "0.75rem",
                                }}
                              >
                                ฿{heroTree.originalPrice.toLocaleString()}
                              </span>
                            )}
                            ฿{heroTree.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })()}
          </ParallaxSection>
        </div>
      </section>

      {/* Best Sellers Slider */}
      <section
        className="container"
        style={{
          margin: "-3rem auto 0",
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
          gap: "2rem",
          paddingBottom: "4rem",
        }}
      >
        {weeklyBestSellingTreesWithCount.length > 0 && (
          <ScrollAnimation
            animation="fade-up"
            delay={100}
            style={{ height: "100%" }}
          >
            <ImageSlider
              trees={weeklyBestSellingTreesWithCount}
              title="ขายดีสัปดาห์นี้"
              subtitle="Weekly Best Sellers"
            />
          </ScrollAnimation>
        )}
        <ScrollAnimation
          animation="fade-up"
          delay={150}
          style={{ height: "100%" }}
        >
          {displayBestSellers.length > 0 && (
            <ImageSlider
              trees={displayBestSellers}
              title="ขายดีตลอดกาล"
              subtitle="All Time Best Sellers"
            />
          )}
        </ScrollAnimation>
      </section>

      {/* Features Bar (Coral Pink) */}
      <ScrollAnimation animation="fade-in">
        <section
          style={{
            padding: "4rem 0",
            backgroundColor: "var(--primary)",
            color: "white",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(2rem, 4vw, 4rem)",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "1rem",
                  border: "2px solid white",
                  borderRadius: "50%",
                }}
              >
                <Leaf color="white" />
              </div>
              <div>
                <h4
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    fontFamily: "var(--font-playfair), serif",
                    color: "white",
                  }}
                >
                  คุณภาพที่เหนือกว่า
                </h4>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "white",
                    opacity: 0.95,
                  }}
                >
                  คัดสรรต้นไม้เกรดพรีเมียมเพื่อคุณ
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "1rem",
                  border: "2px solid white",
                  borderRadius: "50%",
                }}
              >
                <ShieldCheck color="white" />
              </div>
              <div>
                <h4
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    fontFamily: "var(--font-playfair), serif",
                    color: "white",
                  }}
                >
                  บริการครบวงจร
                </h4>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "white",
                    opacity: 0.95,
                  }}
                >
                  ให้คำปรึกษาและดูแลตลอดอายุ
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Festival Banner */}
      <section
        className="container"
        style={{ marginTop: "4rem", marginBottom: "2rem" }}
      >
        <ScrollAnimation animation="fade-up">
          <InlineEdit
            settingKey="valentine_banner"
            initialValue="" // No text content for the wrapper itself
            initialBgColor={
              settingsMap["valentine_banner_bgColor"] ||
              "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)"
            }
            allowStyleEdit
            renderAs="div"
            className="hover:scale-[1.01] transition-transform"
            style={{
              width: "100%",
              borderRadius: "1rem",
              position: "relative",
              background:
                settingsMap["valentine_banner_bgColor"] ||
                "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
              padding: "clamp(1.5rem, 5vw, 3rem)",
              color: "#7f1d1d",
              display: "flex",
              flexWrap: "wrap-reverse",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                flex: "1 1 300px",
                zIndex: 10,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div>
                <InlineEdit
                  settingKey="valentine_heading"
                  initialValue={valHeading}
                  allowStyleEdit
                  initialColor={valHeadingColor}
                  initialBgColor={settingsMap["valentine_heading_bgColor"]}
                  initialFontSize={valHeadingSize}
                  renderAs="span"
                  style={{
                    fontSize: valHeadingSize,
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: valHeadingColor,
                    background:
                      settingsMap["valentine_heading_bgColor"] || "transparent",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "0.25rem",
                    display: "inline-block",
                  }}
                />
              </div>
              <div>
                <InlineEdit
                  settingKey="valentine_title"
                  initialValue={valTitle}
                  allowStyleEdit
                  initialColor={valTitleColor}
                  initialBgColor={settingsMap["valentine_title_bgColor"]}
                  initialFontSize={valTitleSize}
                  renderAs="h2"
                  multiline
                  style={{
                    fontSize: valTitleSize,
                    color: valTitleColor,
                    background:
                      settingsMap["valentine_title_bgColor"] || "transparent",
                    fontWeight: "bold",
                    fontFamily: "var(--font-playfair), serif",
                    lineHeight: 1.2,
                    whiteSpace: "pre-line",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "0.5rem",
                    display: "inline-block",
                  }}
                />
              </div>
              <div>
                <InlineEdit
                  settingKey="valentine_subtitle"
                  initialValue={valSubtitle}
                  allowStyleEdit
                  initialColor={valSubtitleColor}
                  initialBgColor={settingsMap["valentine_subtitle_bgColor"]}
                  initialFontSize={valSubtitleSize}
                  renderAs="p"
                  style={{
                    fontSize: valSubtitleSize,
                    color: valSubtitleColor,
                    background:
                      settingsMap["valentine_subtitle_bgColor"] ||
                      "transparent",
                    opacity: 0.9,
                    padding: "0.25rem 0.75rem",
                    borderRadius: "0.5rem",
                    display: "inline-block",
                  }}
                />
              </div>
              <Link
                href="/promotion"
                style={{ textDecoration: "none", marginTop: "0.5rem" }}
              >
                <span
                  role="button"
                  style={{
                    backgroundColor: "#7f1d1d",
                    color: "white",
                    borderRadius: "9999px",
                    padding: "0.75rem 2.5rem",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    position: "relative",
                    zIndex: 40,
                    display: "inline-block",
                    transition: "transform 0.2s, background-color 0.2s",
                    boxShadow: "0 4px 6px rgba(127, 29, 29, 0.3)",
                  }}
                  className="hover:scale-105 hover:bg-[#991b1b]"
                >
                  ช้อปเลย →
                </span>
              </Link>
            </div>
          </InlineEdit>
        </ScrollAnimation>
      </section>

      {/* Seasonal Products Section */}
      {seasonalTrees.length > 0 && (
        <section className="container" style={{ padding: "4rem 1rem 2rem" }}>
          <ScrollAnimation animation="fade-up">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                marginBottom: "3rem",
              }}
            >
              <div>
                <span
                  style={{
                    color: "#ec4899",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Heart size={16} /> Seasonal Specials
                </span>
                <h2
                  style={{
                    fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                    marginTop: "0.5rem",
                    fontWeight: "bold",
                    fontFamily: "var(--font-playfair), serif",
                    color: "#1f2937",
                  }}
                >
                  ต้อนรับเทศกาลol
                </h2>
              </div>
              <Link
                href="/shop"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#ec4899",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                ดูทั้งหมด <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollAnimation>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {seasonalTrees.map(
              (
                tree: {
                  id: string;
                  images: string;
                  name: string;
                  price: number;
                },
                index: number,
              ) => {
                let imageUrl = "/placeholder-tree.svg";
                try {
                  const images = JSON.parse(tree.images);
                  if (images && images.length > 0) imageUrl = images[0];
                } catch { }
                return (
                  <ScrollAnimation
                    key={tree.id}
                    animation="fade-up"
                    delay={index * 100}
                  >
                    <Link
                      href={`/trees/${tree.id}`}
                      className="group"
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        style={{
                          border: "none",
                          boxShadow: "none",
                          backgroundColor: "white",
                          overflow: "hidden",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                        className="hover-card"
                      >
                        <div
                          style={{
                            position: "relative",
                            aspectRatio: "4/5",
                            backgroundColor: "#e5e5e5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt={tree.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />

                          {/* Favorite Button Overlay */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              right: "10px",
                              zIndex: 10,
                            }}
                          >
                            <FavoriteButton treeId={tree.id} size="sm" />
                          </div>
                        </div>

                        <CardContent
                          style={{
                            padding: "0.75rem",
                            textAlign: "left",
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "1rem",
                              fontWeight: "bold",
                              fontFamily: "var(--font-prompt), sans-serif",
                              color: "#115e59",
                              marginBottom: "0.25rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {tree.name}
                          </h3>
                          <p
                            style={{
                              fontSize: "0.9rem",
                              color: "#6b7280",
                              fontWeight: "normal",
                              marginBottom: "0.75rem",
                            }}
                          >
                            ฿ {tree.price.toLocaleString()}
                          </p>

                          <div style={{ marginTop: "auto" }}>
                            <div
                              style={{
                                border: "1px solid #10b981",
                                color: "#10b981",
                                padding: "0.4rem",
                                textAlign: "center",
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                                width: "100%",
                              }}
                            >
                              จองเลย
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollAnimation>
                );
              },
            )}
          </div>
        </section>
      )}

      {/* Promotions Section */}
      <section className="container" style={{ padding: "2rem 1rem 4rem" }}>
        <ScrollAnimation animation="fade-up">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              marginBottom: "3rem",
            }}
          >
            <Link
              href="/promotion"
              style={{ textDecoration: "none", color: "inherit" }}
              className="hover:opacity-80 transition-opacity"
            >
              <span
                style={{
                  color: "#dc2626",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Percent size={16} /> Hot Deals
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                  marginTop: "0.5rem",
                  fontWeight: "bold",
                  fontFamily: "var(--font-playfair), serif",
                  color: "#1f2937",
                }}
              >
                โปรโมชั่นพิเศษ
              </h2>
            </Link>
            <Link
              href="/promotion"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#dc2626",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              ดูโปรโมชั่นทั้งหมด <ArrowRight size={18} />
            </Link>
          </div>
        </ScrollAnimation>

        {promotionalTrees.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {promotionalTrees.map(
              (
                tree: {
                  id: string;
                  images: string;
                  name: string;
                  price: number;
                  originalPrice: number | null;
                },
                index: number,
              ) => {
                let imageUrl = "/placeholder-tree.svg";
                try {
                  const images = JSON.parse(tree.images);
                  if (images && images.length > 0) imageUrl = images[0];
                } catch { }

                return (
                  <ScrollAnimation
                    key={tree.id}
                    animation="fade-up"
                    delay={index * 100}
                  >
                    <Link
                      href={`/trees/${tree.id}`}
                      className="group"
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        style={{
                          border: "none",
                          boxShadow: "none",
                          backgroundColor: "white",
                          overflow: "hidden",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                        className="hover-card"
                      >
                        <div
                          style={{
                            position: "relative",
                            aspectRatio: "4/5",
                            backgroundColor: "#e5e5e5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt={tree.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />

                          {/* Sale Badge */}
                          {tree.originalPrice &&
                            tree.originalPrice > tree.price && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  right: "10px",
                                  backgroundColor: "#dc2626",
                                  color: "white",
                                  padding: "0.2rem 0.6rem",
                                  borderRadius: "9999px",
                                  fontSize: "0.75rem",
                                  fontWeight: "bold",
                                  zIndex: 5,
                                  boxShadow: "0 2px 8px rgba(220,38,38,0.3)",
                                }}
                              >
                                -
                                {Math.round(
                                  ((tree.originalPrice - tree.price) /
                                    tree.originalPrice) *
                                  100,
                                )}
                                %
                              </div>
                            )}

                          {/* Favorite Button Overlay */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              right: "10px",
                              zIndex: 10,
                            }}
                          >
                            <FavoriteButton treeId={tree.id} size="sm" />
                          </div>
                        </div>

                        <CardContent
                          style={{
                            padding: "0.75rem",
                            textAlign: "left",
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "1rem",
                              fontWeight: "bold",
                              fontFamily: "var(--font-prompt), sans-serif",
                              color: "#115e59",
                              marginBottom: "0.25rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {tree.name}
                          </h3>
                          <p
                            style={{
                              fontSize: "0.9rem",
                              color: "#dc2626",
                              fontWeight: "bold",
                              marginBottom: "0.75rem",
                            }}
                          >
                            ฿ {tree.price.toLocaleString()}
                            {tree.originalPrice &&
                              tree.originalPrice > tree.price && (
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "#9ca3af",
                                    textDecoration: "line-through",
                                    marginLeft: "0.5rem",
                                    fontWeight: "normal",
                                  }}
                                >
                                  ฿{tree.originalPrice.toLocaleString()}
                                </span>
                              )}
                          </p>

                          <div style={{ marginTop: "auto" }}>
                            <div
                              style={{
                                border: "1px solid #10b981",
                                color: "#10b981",
                                padding: "0.4rem",
                                textAlign: "center",
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                                width: "100%",
                              }}
                            >
                              จองเลย
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollAnimation>
                );
              },
            )}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              backgroundColor: "#fef2f2",
              borderRadius: "1rem",
              color: "#dc2626",
            }}
          >
            <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>
              ยังไม่มีสินค้าจัดโปรโมชั่นในขณะนี้
            </p>
            <p
              style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.8 }}
            >
              จัดเตรียมโปรโมชั่นดีๆ ให้คุณเร็วๆ นี้
            </p>
          </div>
        )}
      </section>

      {/* New Arrivals (สินค้ามาใหม่) */}
      <section className="container" style={{ padding: "6rem 1rem" }}>
        <ScrollAnimation animation="fade-up">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              marginBottom: "3rem",
            }}
          >
            <div>
              <span
                style={{
                  color: "#f87171",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                New Arrivals
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 6vw, 3rem)",
                  marginTop: "0.5rem",
                  fontWeight: "bold",
                  fontFamily: "var(--font-playfair), serif",
                  color: "#1f2937",
                }}
              >
                สินค้ามาใหม่
              </h2>
            </div>
            <Link
              href="/shop"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#f87171",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              ดูสินค้าทั้งหมด <ArrowRight size={18} />
            </Link>
          </div>
        </ScrollAnimation>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "1rem",
          }}
        >
          {featuredTrees.map(
            (
              tree: { id: string; images: string; name: string; price: number },
              index: number,
            ) => {
              // Parse images safely
              let imageUrl = "/placeholder-tree.svg";
              try {
                const images = JSON.parse(tree.images);
                if (images && images.length > 0) {
                  imageUrl = images[0];
                }
              } catch {
                // Use placeholder if parsing fails
              }

              return (
                <ScrollAnimation
                  key={tree.id}
                  animation="fade-up"
                  delay={index * 100}
                >
                  <Link
                    href={`/trees/${tree.id}`}
                    className="group"
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      style={{
                        border: "none",
                        boxShadow: "none",
                        backgroundColor: "white",
                        overflow: "hidden",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                      className="hover-card"
                    >
                      <div
                        style={{
                          position: "relative",
                          aspectRatio: "4/5",
                          backgroundColor: "#e5e5e5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={tree.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />

                        {/* Favorite Button Overlay */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            right: "10px",
                            zIndex: 10,
                          }}
                        >
                          <FavoriteButton treeId={tree.id} size="sm" />
                        </div>
                      </div>

                      <CardContent
                        style={{
                          padding: "0.75rem",
                          textAlign: "left",
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            fontFamily: "var(--font-prompt), sans-serif",
                            color: "#115e59",
                            marginBottom: "0.25rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {tree.name}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            color: "#6b7280",
                            fontWeight: "normal",
                            marginBottom: "0.75rem",
                          }}
                        >
                          ฿ {tree.price.toLocaleString()}
                        </p>

                        <div style={{ marginTop: "auto" }}>
                          <div
                            style={{
                              border: "1px solid #10b981",
                              color: "#10b981",
                              padding: "0.4rem",
                              textAlign: "center",
                              fontSize: "0.85rem",
                              fontWeight: "bold",
                              width: "100%",
                            }}
                          >
                            จองเลย
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollAnimation>
              );
            },
          )}
        </div>
      </section>

      {/* Shop Atmosphere Section */}
      <section style={{ backgroundColor: "#f9fafb", padding: "6rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <ScrollAnimation animation="fade-up">
              <span
                style={{
                  color: "#047857",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Shop Atmosphere
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 6vw, 3rem)",
                  marginTop: "0.5rem",
                  fontWeight: "bold",
                  fontFamily: "var(--font-playfair), serif",
                  color: "#1f2937",
                }}
              >
                บรรยากาศร้านของเรา
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  marginTop: "0.5rem",
                  fontSize: "1.125rem",
                }}
              >
                เพลิดเพลินกับการเลือกชมต้นไม้และกระถางหลากหลายสไตล์ในบรรยากาศร่มรื่น
              </p>
            </ScrollAnimation>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gridAutoRows: "250px",
              gap: "1rem",
            }}
          >
            {[
              "104203394_1703567143155216_281949232298706640_n.jpg",
              "104309994_1703567473155183_2631985199741945479_n.jpg",
              "124164147_1839269809584948_6344406617013108098_n.jpg",
              "133283562_1878044269040835_5611542419744234699_n.jpg",
              "134660006_1878044485707480_4778167200489726984_n.jpg",
              "301706018_507878381341722_6701819733337717604_n.jpg",
              "482243530_1214414290688124_541286515667478668_n.jpg",
            ].map((img, index) => (
              <ScrollAnimation
                key={index}
                animation="fade-up"
                delay={index * 100}
                style={{
                  gridColumn: index === 0 || index === 3 ? "span 2" : "span 1",
                  gridRow: index === 1 ? "span 2" : "span 1",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src={`/images/shop/${img}`}
                    alt="บรรยากาศร้านคุณแดง"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                    className="hover:scale-110"
                  />
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (รีวิวจากลูกค้า) */}
      <section style={{ backgroundColor: "#fff", padding: "6rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <ScrollAnimation animation="fade-up">
            <span
              style={{
                color: "#9ca3af",
                fontWeight: "bold",
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Our Testimonials
            </span>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 6vw, 3rem)",
                marginTop: "0.5rem",
                marginBottom: "clamp(2rem, 6vw, 4rem)",
                fontWeight: "bold",
                fontFamily: "var(--font-playfair), serif",
                color: "#1f2937",
              }}
            >
              เสียงตอบรับจาก
              <span style={{ fontStyle: "italic", fontWeight: "400" }}>
                ลูกค้าของเรา
              </span>
            </h2>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {topReviews.length > 0 ? (
              topReviews.map((review, index) => {
                const colors = ["#dcfce7", "#ffedd5", "#e0e7ff", "#fce7f3"];
                const bgColor = colors[index % colors.length];

                return (
                  <ScrollAnimation
                    key={review.id}
                    animation="fade-up"
                    delay={index * 100}
                  >
                    <div
                      style={{
                        textAlign: "left",
                        padding: "2rem",
                        backgroundColor: "#fefcf9",
                        borderRadius: "16px",
                        display: "flex",
                        gap: "1.5rem",
                        alignItems: "flex-start",
                        border: "1px solid #f3f4f6",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          minWidth: "60px",
                          height: "60px",
                          backgroundColor: bgColor,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <User
                          size={30}
                          style={{ color: "#4b5563", opacity: 0.5 }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: "#fbbf24",
                            marginBottom: "0.5rem",
                            letterSpacing: "2px",
                            fontSize: "1.2rem",
                          }}
                        >
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                        <h4
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            paddingBottom: "0.5rem",
                          }}
                        >
                          คุณ{review.user?.firstName}
                        </h4>
                        <p
                          style={{
                            color: "#6b7280",
                            fontStyle: "italic",
                            lineHeight: "1.6",
                          }}
                        >
                          &quot;{review.comment}&quot;
                        </p>
                      </div>
                    </div>
                  </ScrollAnimation>
                );
              })
            ) : (
              // Fallback reviews if database has no valid ones yet
              <>
                <ScrollAnimation animation="fade-up">
                  <div
                    style={{
                      textAlign: "left",
                      padding: "2rem",
                      backgroundColor: "#fefcf9",
                      borderRadius: "16px",
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "flex-start",
                      border: "1px solid #f3f4f6",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "60px",
                        height: "60px",
                        backgroundColor: "#dcfce7",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <User
                        size={30}
                        style={{ color: "#4b5563", opacity: 0.5 }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          color: "#fbbf24",
                          marginBottom: "0.5rem",
                          letterSpacing: "2px",
                          fontSize: "1.2rem",
                        }}
                      >
                        ★★★★★
                      </div>
                      <h4
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          paddingBottom: "0.5rem",
                        }}
                      >
                        รอรีวิวแรกจากคุณ
                      </h4>
                      <p
                        style={{
                          color: "#6b7280",
                          fontStyle: "italic",
                          lineHeight: "1.6",
                        }}
                      >
                        &quot;กำลังเตรียมเสียงตอบรับจากลูกค้าตัวจริง
                        มาแสดงในส่วนนี้&quot;
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Store Location Section */}
      <section style={{ backgroundColor: "#f0fdf4", padding: "5rem 1rem" }}>
        <div className="container">
          <ScrollAnimation animation="fade-up">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span
                style={{
                  color: "#4d7c0f",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Visit Us
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 6vw, 3rem)",
                  marginTop: "0.5rem",
                  fontWeight: "bold",
                  fontFamily: "var(--font-playfair), serif",
                  color: "#1f2937",
                }}
              >
                ที่ตั้งร้านของเรา
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  marginTop: "0.5rem",
                  fontSize: "1.125rem",
                }}
              >
                มาเยี่ยมชมสวนของเราได้ทุกวัน
              </p>
            </div>
          </ScrollAnimation>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 350px), 1fr))",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            <ScrollAnimation animation="slide-in-left">
              <div
                style={{
                  borderRadius: "1rem",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  border: "2px solid #dcfce7",
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d989.7839558138357!2d100.56942377049576!3d7.110254269525753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d2d12b2a7590d%3A0x54372dfd81d5955b!2z4Lij4LmJ4Liy4LiZ4LiV4LmJ4LiZ4LmE4Lih4LmJIOC4quC4p-C4meC4hOC4uOC4k-C5geC4lOC4hw!5e0!3m2!1sth!2sth!4v1771097324381!5m2!1sth!2sth"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Khun Daeng Garden Location  ok"
                />
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="slide-in-right">
              <div style={{ padding: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        backgroundColor: "#dcfce7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        flexShrink: 0,
                      }}
                    >
                      📍
                    </div>
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.125rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        ที่อยู่
                      </h3>
                      <p style={{ color: "#6b7280" }}>
                        383 ถ.กาญจนวินิช ต.พะวง อ.เมือง จ.สงขลา 90100
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        backgroundColor: "#dbeafe",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        flexShrink: 0,
                      }}
                    >
                      📞
                    </div>
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.125rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        โทรศัพท์
                      </h3>
                      <p style={{ color: "#6b7280" }}>061-690-0908</p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        backgroundColor: "#fef9c3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        flexShrink: 0,
                      }}
                    >
                      🕐
                    </div>
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.125rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        เวลาทำการ
                      </h3>
                      <p style={{ color: "#6b7280" }}>
                        จันทร์ - เสาร์: 08:00 - 17:00
                      </p>
                      <p style={{ color: "#6b7280" }}>อาทิตย์: 09:00 - 15:00</p>
                    </div>
                  </div>
                </div>
                <a
                  href="https://maps.app.goo.gl/r5xobpbgAoqpiH4r9"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "2rem",
                    padding: "0.75rem 2rem",
                    backgroundColor: "#059669",
                    color: "white",
                    borderRadius: "0.5rem",
                    fontWeight: "bold",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                >
                  🗺️ นำทาง Google Maps
                </a>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </main>
  );
}
