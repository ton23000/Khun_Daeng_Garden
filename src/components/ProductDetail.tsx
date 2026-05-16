"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";
import ImageGallery from "./ImageGallery";
import StarRating from "./StarRating";
import ReviewList from "./ReviewList";
import FavoriteButton from "./FavoriteButton";
import { formatThaiDate } from "@/lib/dateUtils";

interface Tree {
  id: string;
  sku: string | null;
  name: string;
  description: string;
  price: number;
  category: string;
  status: string;
  images: string[];
  tags: string[];
  growthTime?: string | null;
  rating?: number;
  reviewCount?: number;
  isPromotion?: boolean;
  originalPrice?: number | null;
  promotionName?: string | null;
  promotionEndDate?: string | null;
}

export default function ProductDetail({ tree }: { tree: Tree }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Calculate available stock
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stock = (tree as any).stock || 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reserved = (tree as any).reserved || 0;
  const availableStock = Math.max(0, stock - reserved);
  const isOutOfStock = availableStock === 0;

  const handleAdd = () => {
    // ไม่ต้องเช็คสต๊อก - ให้สั่งซื้อได้แม้หมด (จะกลายเป็น PENDING_APPROVAL)
    addItem(tree, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) {
      val = 1;
    }
    setQuantity(val);
  };

  return (
    <div className="container" style={{ padding: "2rem 1rem" }}>
      <Link
        href="/shop"
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          color: "#6b7280",
        }}
      >
        ← กลับไปหน้าร้านค้า
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Left: Image Gallery */}
        <div>
          <ImageGallery images={tree.images} alt={tree.name} />
        </div>

        {/* Right: Details & Booking */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "0.5rem",
            }}
          >
            <div>
              <h1
                style={{ fontSize: "2rem", flex: 1, marginBottom: "0.25rem" }}
              >
                {tree.name}
              </h1>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                }}
              >
                รหัสสินค้า:{" "}
                <span style={{ fontWeight: 600, color: "#4b5563" }}>
                  {tree.sku || "-"}
                </span>
              </div>
            </div>

            {/* Favorite Button */}
            <div style={{ marginLeft: "1rem" }}>
              <FavoriteButton treeId={tree.id} size="lg" />
            </div>
          </div>

          {/* Price with promotion support */}
          <div style={{ marginBottom: "1rem" }}>
            {tree.isPromotion &&
            tree.originalPrice &&
            tree.originalPrice > tree.price ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: "bold",
                      color: "#dc2626",
                    }}
                  >
                    ฿{tree.price.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontSize: "1.125rem",
                      color: "#9ca3af",
                      textDecoration: "line-through",
                    }}
                  >
                    ฿{tree.originalPrice.toLocaleString()}
                  </span>
                  <span
                    style={{
                      backgroundColor: "#dc2626",
                      color: "white",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    -
                    {Math.round(
                      ((tree.originalPrice - tree.price) / tree.originalPrice) *
                        100,
                    )}
                    %
                  </span>
                </div>
                {tree.promotionName && (
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      marginBottom: "0.25rem",
                    }}
                  >
                    🔥 {tree.promotionName}
                  </span>
                )}
                {tree.promotionEndDate && (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#dc2626",
                      marginTop: "0.25rem",
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
              </>
            ) : (
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "var(--primary)",
                }}
              >
                ฿ {tree.price.toLocaleString()}
              </p>
            )}
          </div>

          {tree.growthTime && (
            <p style={{ marginBottom: "1rem", color: "#4b5563" }}>
              <strong>ระยะเวลาเติบโต:</strong> {tree.growthTime}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "1.5rem",
            }}
          >
            {(() => {
              let tags: string[] = [];
              if (tree.tags) {
                if (Array.isArray(tree.tags)) {
                  tags = tree.tags;
                } else if (typeof tree.tags === "string") {
                  try {
                    tags = JSON.parse(tree.tags);
                  } catch {
                    tags = [];
                  }
                }
              }
              return tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: "#f3f4f6",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                  }}
                >
                  #{tag}
                </span>
              ));
            })()}
          </div>

          <p style={{ marginBottom: "2rem", lineHeight: "1.6" }}>
            {tree.description}
          </p>

          <Card>
            <CardHeader>
              <CardTitle>สั่งจอง</CardTitle>
            </CardHeader>
            <CardContent>
              {tree.status === "AVAILABLE" ? (
                <div>
                  {/* Stock warning for out-of-stock items */}
                  {isOutOfStock && (
                    <div
                      style={{
                        backgroundColor: "#fef3c7",
                        color: "#92400e",
                        padding: "0.75rem",
                        borderRadius: "0.375rem",
                        marginBottom: "1rem",
                        fontSize: "0.875rem",
                        border: "1px solid #fbbf24",
                      }}
                    >
                      ⚠️ <strong>สินค้าหมดสต๊อก</strong> -
                      คุณยังสามารถสั่งจองได้ โดยจะรอการ
                      <strong>อนุมัติจากแอดมิน</strong>เมื่อมีสินค้าเข้า
                    </div>
                  )}

                  <div style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <label style={{ fontSize: "0.875rem" }}>จำนวน</label>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: isOutOfStock ? "#dc2626" : "#6b7280",
                          fontWeight: isOutOfStock ? "bold" : "normal",
                        }}
                      >
                        {isOutOfStock
                          ? "หมดสต๊อก - จองได้"
                          : `มีสินค้า ${availableStock} ต้น`}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          width: "60px",
                          textAlign: "center",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.375rem",
                          padding: "0.25rem",
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button fullWidth onClick={handleAdd} variant="primary">
                    {isAdded
                      ? "✓ เพิ่มเรียบร้อย!"
                      : `เพิ่มลงตะกร้า (${quantity} ต้น)`}
                  </Button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <p style={{ color: "#d97706", fontWeight: "bold" }}>
                    สินค้านี้ถูกจองแล้ว
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    กรุณาเลือกดูรายการอื่น
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: "3rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            รีวิวและคะแนน
          </h2>
          {tree.rating !== undefined &&
            tree.reviewCount !== undefined &&
            tree.reviewCount > 0 && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <StarRating rating={tree.rating} readonly size="md" />
                <span
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {tree.rating.toFixed(1)}
                </span>
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  ({tree.reviewCount} รีวิว)
                </span>
              </div>
            )}
        </div>

        <ReviewList
          treeId={tree.id}
          currentUserId={user?.id}
          treeName={tree.name}
        />
      </div>
    </div>
  );
}
