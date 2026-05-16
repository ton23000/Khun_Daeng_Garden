"use client";

import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { Button } from "./ui/Button";
import ReviewModal from "./ReviewModal";
import { formatThaiDate } from "@/lib/dateUtils";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  images: string | null;
  helpful: number;
  isHelpful?: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  bookingId?: string; // Add bookingId if it exists in response, otherwise it's optional
}

interface ReviewListProps {
  treeId: string;
  currentUserId?: string;
  treeName?: string; // Optional for the modal
}

export default function ReviewList({
  treeId,
  currentUserId,
  treeName = "ต้นไม้",
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "helpful">(
    "newest",
  );
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?treeId=${treeId}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (!currentUserId) {
      alert("กรุณาเข้าสู่ระบบเพื่อโหวตรีวิว");
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
      });
      if (res.ok) {
        // Refresh reviews
        fetchReviews();
      } else {
        const data = await res.json();
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error marking helpful:", error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("ต้องการลบรีวิวนี้หรือไม่?")) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": currentUserId || "",
          "x-user-role": "user",
        },
      });

      if (res.ok) {
        alert("ลบรีวิวสำเร็จ");
        fetchReviews();
      } else {
        const data = await res.json();
        alert(data.error || "ไม่สามารถลบรีวิวได้");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "highest") {
      return b.rating - a.rating;
    } else {
      return b.helpful - a.helpful;
    }
  });

  const itemsPerPage = 2;
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
  const currentReviews = sortedReviews.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  if (isLoading) {
    return <p>กำลังโหลดรีวิว...</p>;
  }

  if (reviews.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
        <p>ยังไม่มีรีวิว</p>
        <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
          เป็นคนแรกที่รีวิวสินค้านี้!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Sort Options */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          เรียงตาม:
        </span>
        <button
          onClick={() => {
            setSortBy("newest");
            setCurrentPage(0);
          }}
          style={{
            fontSize: "0.875rem",
            fontWeight: sortBy === "newest" ? 600 : 400,
            color: sortBy === "newest" ? "var(--primary)" : "#6b7280",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: sortBy === "newest" ? "underline" : "none",
          }}
        >
          ล่าสุด
        </button>
        <span style={{ color: "#d1d5db" }}>|</span>
        <button
          onClick={() => {
            setSortBy("highest");
            setCurrentPage(0);
          }}
          style={{
            fontSize: "0.875rem",
            fontWeight: sortBy === "highest" ? 600 : 400,
            color: sortBy === "highest" ? "var(--primary)" : "#6b7280",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: sortBy === "highest" ? "underline" : "none",
          }}
        >
          คะแนนสูงสุด
        </button>
        <span style={{ color: "#d1d5db" }}>|</span>
        <button
          onClick={() => {
            setSortBy("helpful");
            setCurrentPage(0);
          }}
          style={{
            fontSize: "0.875rem",
            fontWeight: sortBy === "helpful" ? 600 : 400,
            color: sortBy === "helpful" ? "var(--primary)" : "#6b7280",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: sortBy === "helpful" ? "underline" : "none",
          }}
        >
          มีประโยชน์สูงสุด
        </button>
      </div>

      {/* Reviews Carousel */}
      <div style={{ position: "relative", padding: "0 10px" }}>
        {totalPages > 1 && (
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: currentPage === 0 ? "not-allowed" : "pointer",
              opacity: currentPage === 0 ? 0 : 1, // Hide when disabled instead of dimming
              zIndex: 10,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 0) {
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform =
                  "translateY(-50%) scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 0) {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#111827"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {totalPages > 1 && (
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={currentPage >= totalPages - 1}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
              opacity: currentPage >= totalPages - 1 ? 0 : 1, // Hide when disabled
              zIndex: 10,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (currentPage < totalPages - 1) {
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform =
                  "translateY(-50%) scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage < totalPages - 1) {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="#111827"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
            padding: "10px 40px", // Add padding so shadow of cards doesn't clip, and make room for arrows
          }}
        >
          {currentReviews.map((review) => {
            const reviewImages: string[] = (() => {
              if (!review.images) return [];
              try {
                return JSON.parse(review.images);
              } catch {
                return [];
              }
            })();

            return (
              <div
                key={review.id}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "1.5rem",
                  borderRadius: "1rem", // Match more rounded style
                  border: "1px solid #f3f4f6", // Lighter border
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", // Subtle shadow
                  display: "flex",
                  flexDirection: "column",
                  height: "100%", // Ensure equal height for both columns
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600 }}>
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {formatThaiDate(review.createdAt, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {currentUserId === review.user.id && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingReview(review)}
                      >
                        แก้ไข
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                      >
                        ลบ
                      </Button>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <StarRating rating={review.rating} readonly size="sm" />

                {/* Comment */}
                {review.comment && (
                  <p
                    style={{
                      marginTop: "0.75rem",
                      lineHeight: "1.6",
                      color: "#374151",
                    }}
                  >
                    {review.comment}
                  </p>
                )}

                {/* Images */}
                {reviewImages.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.75rem",
                      overflowX: "auto",
                    }}
                  >
                    {reviewImages.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Review image ${idx + 1}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(img, "_blank")}
                      />
                    ))}
                  </div>
                )}

                {/* Helpful Button (Pushed to bottom) */}
                <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                  <button
                    onClick={() => handleHelpful(review.id)}
                    style={{
                      fontSize: "0.875rem",
                      color: review.isHelpful ? "white" : "#6b7280",
                      backgroundColor: review.isHelpful
                        ? "var(--primary)"
                        : "transparent",
                      border: review.isHelpful
                        ? "1px solid var(--primary)"
                        : "1px solid #d1d5db",
                      borderRadius: "9999px",
                      padding: "0.35rem 1rem", // Slightly larger padding
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                    className={review.isHelpful ? "" : "hover:bg-gray-100"}
                  >
                    <span>👍</span> มีประโยชน์ ({review.helpful})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Indicators (Optional, good for UX) */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1.5rem",
          }}
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor:
                  i === currentPage ? "var(--primary)" : "#d1d5db",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      )}

      {editingReview && currentUserId && (
        <ReviewModal
          treeId={treeId}
          treeName={treeName}
          userId={currentUserId}
          reviewId={editingReview.id}
          initialRating={editingReview.rating}
          initialComment={editingReview.comment}
          onClose={() => setEditingReview(null)}
          onSuccess={() => {
            fetchReviews();
            setEditingReview(null);
          }}
        />
      )}
    </div>
  );
}
