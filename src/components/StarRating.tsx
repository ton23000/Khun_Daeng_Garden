"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: "16px",
    md: "24px",
    lg: "32px",
  };

  const starSize = sizes[size];

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= displayRating;
        return (
          <button
            type="button"
            key={value}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            style={{
              background: "none",
              border: "none",
              cursor: readonly ? "default" : "pointer",
              padding: 0,
              transition: "transform 0.2s",
            }}
            className={!readonly ? "hover:scale-110" : ""}
          >
            <svg
              width={starSize}
              height={starSize}
              viewBox="0 0 24 24"
              fill={isFilled ? "#fbbf24" : "none"}
              stroke="#fbbf24"
              strokeWidth="2"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
      {!readonly && (
        <span
          style={{
            marginLeft: "0.5rem",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          {displayRating > 0 ? `${displayRating} ดาว` : "เลือกคะแนน"}
        </span>
      )}
    </div>
  );
}
