"use client";
import { useEffect, useState } from "react";

interface SlipViewerProps {
  isOpen: boolean;
  onClose: () => void;
  /** ทุก URL สลีปของ booking นั้น */
  slipUrls: string[];
  /** index ของรูปที่คลิก */
  startIndex?: number;
  /** ถ้ามี → แสดงปุ่มลบ */
  onDelete?: (index: number) => void;
}

export default function SlipViewer({
  isOpen,
  onClose,
  slipUrls,
  startIndex = 0,
  onDelete,
}: SlipViewerProps) {
  const [current, setCurrent] = useState(startIndex);

  // ซิงค์ index เมื่อเปิดใหม่
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => setCurrent(startIndex), 0);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, startIndex]);

  // กด Esc ปิด / arrow ซ้าย-ขวา
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(0, c - 1));
      if (e.key === "ArrowRight")
        setCurrent((c) => Math.min(slipUrls.length - 1, c + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, slipUrls.length]);

  if (!isOpen || slipUrls.length === 0) return null;

  const url = slipUrls[current];
  const total = slipUrls.length;
  const TOPBAR_H = 56;
  const BOTTOMBAR_H = total > 1 ? 72 : 0;

  const handleDelete = () => {
    if (!onDelete) return;
    if (!confirm(`ลบสลีปรูปที่ ${current + 1} ออก?`)) return;
    onDelete(current);
    if (current >= total - 1) {
      if (total - 1 === 0) {
        onClose();
      } else {
        setCurrent(total - 2);
      }
    }
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.92)",
          zIndex: 99999,
        }}
      />

      {/* ── Top bar ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: TOPBAR_H,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 1.25rem",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)",
          zIndex: 100001,
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          สลีป {current + 1} / {total}
        </span>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {onDelete && (
            <button
              onClick={handleDelete}
              style={{
                padding: "0.4rem 0.9rem",
                borderRadius: "0.5rem",
                border: "none",
                backgroundColor: "#ef4444",
                color: "white",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              🗑️ ลบรูปนี้
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              fontSize: "1.1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── รูปหลัก ── */}
      <div
        style={{
          position: "fixed",
          top: TOPBAR_H,
          left: 0,
          right: 0,
          bottom: BOTTOMBAR_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem 4rem",
          boxSizing: "border-box",
          zIndex: 100000,
        }}
      >
        {/* ลูกศรซ้าย */}
        {total > 1 && (
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              backgroundColor:
                current === 0
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.3)",
              color: "white",
              fontSize: "1.5rem",
              cursor: current === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              zIndex: 2,
            }}
          >
            ‹
          </button>
        )}

        <img
          key={url}
          src={url}
          alt={`สลีป ${current + 1}`}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            borderRadius: "0.5rem",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            animation: "slipFadeIn 0.2s ease",
            display: "block",
            userSelect: "none",
          }}
        />

        {/* ลูกศรขวา */}
        {total > 1 && (
          <button
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
            disabled={current === total - 1}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              backgroundColor:
                current === total - 1
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.3)",
              color: "white",
              fontSize: "1.5rem",
              cursor: current === total - 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              zIndex: 2,
            }}
          >
            ›
          </button>
        )}
      </div>

      {/* ── Thumbnail bar ── */}
      {total > 1 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: BOTTOMBAR_H,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0 0.75rem",
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            zIndex: 100001,
          }}
        >
          {slipUrls.map((u, i) => (
            <img
              key={i}
              src={u}
              alt={`thumb ${i + 1}`}
              onClick={() => setCurrent(i)}
              style={{
                width: 52,
                height: 52,
                objectFit: "cover",
                borderRadius: "0.375rem",
                cursor: "pointer",
                border:
                  i === current ? "2.5px solid white" : "2px solid transparent",
                opacity: i === current ? 1 : 0.55,
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      )}

      <style>{`
                @keyframes slipFadeIn {
                    from { opacity: 0; transform: scale(0.96); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
    </>
  );
}
