"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatThaiDate } from "@/lib/dateUtils";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  images: string | null;
  hidden: boolean;
  isFeatured: boolean;
  helpful: number;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string };
  tree: { id: string; name: string; images: string };
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "visible" | "hidden" | "featured"
  >("all");

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      router.push("/login");
      return;
    }
    fetchReviews();
  }, [user, isAuthLoading, router]);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHidden = async (reviewId: string, hidden: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !hidden }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, hidden: !hidden } : r)),
        );
      }
    } catch (error) {
      console.error("Failed to toggle review visibility", error);
    }
  };

  const toggleFeatured = async (reviewId: string, isFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, isFeatured: !isFeatured } : r,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to toggle review featured status", error);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบรีวิวนี้? การลบจะไม่สามารถกู้คืนได้"))
      return;
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } catch (error) {
      console.error("Failed to delete review", error);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "visible") return !r.hidden;
    if (filter === "hidden") return r.hidden;
    if (filter === "featured") return r.isFeatured;
    return true;
  });

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (isAuthLoading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>กำลังโหลด...</div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
          จัดการรีวิว (Reviews)
        </h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              alignSelf: "center",
            }}
          >
            ทั้งหมด {reviews.length} รีวิว | โชว์หน้าแรก{" "}
            {reviews.filter((r) => r.isFeatured).length} | ซ่อนอยู่{" "}
            {reviews.filter((r) => r.hidden).length}
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {(["all", "visible", "hidden", "featured"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontWeight: filter === f ? "bold" : "normal",
              backgroundColor: filter === f ? "#059669" : "#f3f4f6",
              color: filter === f ? "white" : "#374151",
              transition: "all 0.2s",
            }}
          >
            {f === "all"
              ? "ทั้งหมด"
              : f === "visible"
                ? "🟢 แสดงอยู่"
                : f === "hidden"
                  ? "🔴 ซ่อนอยู่"
                  : "⭐ โชว์หน้าแรก"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>กำลังโหลด...</div>
      ) : filteredReviews.length === 0 ? (
        <Card>
          <CardContent style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "#6b7280" }}>ไม่พบรีวิว</p>
          </CardContent>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredReviews.map((review) => {
            let treeImage = "/placeholder-tree.jpg";
            try {
              const imgs = JSON.parse(review.tree.images);
              if (imgs.length > 0) treeImage = imgs[0];
            } catch {}

            return (
              <Card
                key={review.id}
                style={{
                  opacity: review.hidden ? 0.6 : 1,
                  borderLeft: `4px solid ${review.hidden ? "#ef4444" : "#22c55e"}`,
                }}
              >
                <CardContent style={{ padding: "1.25rem" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr auto",
                      gap: "1rem",
                      alignItems: "start",
                    }}
                  >
                    {/* Tree image */}
                    <img
                      src={treeImage}
                      alt={review.tree.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "0.5rem",
                      }}
                    />

                    {/* Review content */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          {review.user.firstName} {review.user.lastName}
                        </span>
                        <span style={{ color: "#f59e0b", fontSize: "1rem" }}>
                          {renderStars(review.rating)}
                        </span>
                        {review.hidden && (
                          <span
                            style={{
                              backgroundColor: "#fee2e2",
                              color: "#dc2626",
                              padding: "0.125rem 0.5rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            ซ่อนอยู่
                          </span>
                        )}
                        {review.isFeatured && (
                          <span
                            style={{
                              backgroundColor: "#fef3c7",
                              color: "#d97706",
                              padding: "0.125rem 0.5rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            ⭐ โชว์หน้าแรก
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                          marginBottom: "0.5rem",
                        }}
                      >
                        ต้นไม้: {review.tree.name} |{" "}
                        {formatThaiDate(review.createdAt)}
                      </p>
                      {review.comment && (
                        <p style={{ color: "#374151", marginBottom: "0.5rem" }}>
                          {review.comment}
                        </p>
                      )}
                      {review.images &&
                        (() => {
                          try {
                            const imgs = JSON.parse(review.images);
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "0.5rem",
                                  flexWrap: "wrap",
                                }}
                              >
                                {imgs.map((img: string, i: number) => (
                                  <img
                                    key={i}
                                    src={img}
                                    alt={`Review ${i}`}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "cover",
                                      borderRadius: "0.25rem",
                                    }}
                                  />
                                ))}
                              </div>
                            );
                          } catch {
                            return null;
                          }
                        })()}
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#9ca3af",
                          marginTop: "0.25rem",
                        }}
                      >
                        👍 {review.helpful} คนเห็นว่ามีประโยชน์
                      </p>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toggleFeatured(review.id, review.isFeatured)
                        }
                        style={{
                          borderColor: review.isFeatured
                            ? "#d97706"
                            : "#d1d5db",
                          color: review.isFeatured ? "#d97706" : "#6b7280",
                          fontSize: "0.75rem",
                        }}
                      >
                        {review.isFeatured ? "⭐ เลิกโชว์" : "⭐ โชว์หน้าแรก"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleHidden(review.id, review.hidden)}
                        style={{
                          borderColor: review.hidden ? "#22c55e" : "#f59e0b",
                          color: review.hidden ? "#22c55e" : "#f59e0b",
                          fontSize: "0.75rem",
                        }}
                      >
                        {review.hidden ? "👁 แสดง" : "🙈 ซ่อน"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteReview(review.id)}
                        style={{
                          borderColor: "#ef4444",
                          color: "#ef4444",
                          fontSize: "0.75rem",
                        }}
                      >
                        🗑 ลบ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
