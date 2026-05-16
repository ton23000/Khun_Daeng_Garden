"use client";

import { useState } from "react";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import Link from "next/link";
import { ChevronDown, HelpCircle, ShieldCheck, Leaf } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        marginBottom: "1rem",
        border: "1px solid #e5e7eb",
        borderRadius: "0.75rem",
        overflow: "hidden",
        backgroundColor: "white",
        transition: "box-shadow 0.2s ease",
        boxShadow: isOpen
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          : "none",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          color: isOpen ? "#166534" : "#1f2937",
          fontWeight: isOpen ? "bold" : "600",
          fontSize: "1.125rem",
          transition: "color 0.2s ease, background-color 0.2s ease",
          backgroundColor: isOpen ? "#f0fdf4" : "transparent",
        }}
      >
        <span style={{ paddingRight: "1rem" }}>{question}</span>
        <ChevronDown
          size={20}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            flexShrink: 0,
            color: isOpen ? "#166534" : "#9ca3af",
          }}
        />
      </button>
      <div
        style={{
          maxHeight: isOpen ? "500px" : "0",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div
          style={{
            padding: "0 1.5rem 1.25rem 1.5rem",
            color: "#4b5563",
            lineHeight: "1.6",
            backgroundColor: "#f0fdf4",
          }}
        >
          <div style={{ paddingTop: "0.5rem", borderTop: "1px solid #dcfce7" }}>
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div
      className="container"
      style={{ padding: "2rem 1rem", maxWidth: "800px", margin: "0 auto" }}
    >
      <ScrollAnimation animation="fade-up">
        <div style={{ marginBottom: "2rem" }}>
          <Link
            href="/services"
            style={{
              color: "#166534",
              textDecoration: "none",
              display: "inline-block",
              transition: "transform 0.2s",
              fontWeight: 500,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "translateX(-5px)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
          >
            ← กลับไปหน้าบริการ
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              backgroundColor: "#dcfce7",
              borderRadius: "50%",
              marginBottom: "1rem",
              color: "#16a34a",
            }}
          >
            <HelpCircle size={32} />
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#111827",
            }}
          >
            คำถามที่พบบ่อย (FAQ)
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "1.125rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            รวบรวมข้อสงสัยเกี่ยวกับการบริการ การสั่งซื้อ
            และการดูแลต้นไม้จากสวนคุณแดง
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="fade-up" delay={100}>
        {/* Category: Warranty & Plants */}
        <div style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <ShieldCheck size={24} color="#16a34a" />
            การรับประกันคุณภาพ
          </h2>
          <FAQItem
            question="ต้นไม้ที่สั่งซื้อจะมีการรับประกันหรือไม่?"
            answer={
              <p>
                เรารับประกันต้นไม้ทุกต้น <strong>7 วัน</strong> หลังจากได้รับ
                หากพบว่าต้นไม้มีปัญหา เหี่ยวเฉา สามารถแจ้งเราพร้อมแนบรูปถ่าย
                เรายินดีดูแลให้ฟรีครับ
              </p>
            }
          />
          <FAQItem
            question="ต้นไม้ที่ได้รับจะไม่ตรงปกใช่ไหม?"
            answer={
              <p>
                สวนคุณแดงรับประกันความพึงพอใจ
                ต้นไม้จะตรงกับรูปหรือใกล้เคียงที่สุด
                หากลูกค้าต้องการดูต้นจริงก่อนรับ สามารถแจ้งแอดมินได้เลยครับ
              </p>
            }
          />
        </div>

        {/* Category: Care */}
        <div style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Leaf size={24} color="#16a34a" />
            การดูแลรักษา
          </h2>
          <FAQItem
            question="ต้นไม้ที่ซื้อไปควรดูแลอย่างไร?"
            answer={
              <p>
                ต้นไม้แต่ละชนิดมีความต้องการแสงแดดและน้ำที่แตกต่างกัน
                ทีมงานพร้อมให้คำปรึกษาหลังการขายฟรี ทักถามมาได้ทั้ง LINE
                และโทรศัพท์ตลอดเวลาครับ
              </p>
            }
          />
          <FAQItem
            question="สามารถมาดูต้นไม้หน้าร้านได้ไหม?"
            answer={
              <p>
                ได้เลยครับ! ยินดีต้อนรับทุกวัน <strong>08:00 – 17:00 น.</strong>{" "}
                ที่ 383 ถ.กาญจนวินิช ต.พะวง อ.เมือง จ.สงขลา
                สั่งออนไลน์แล้วมารับที่สวนก็ได้ครับ
              </p>
            }
          />
        </div>

        {/* Contact Box */}
        <div
          style={{
            marginTop: "4rem",
            padding: "2rem",
            backgroundColor: "#f0fdf4",
            borderRadius: "1rem",
            textAlign: "center",
            border: "1px solid #dcfce7",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              color: "#111827",
              fontSize: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            ยังไม่พบคำตอบที่คุณต้องการ?
          </h3>
          <p
            style={{
              color: "#4b5563",
              marginBottom: "1.5rem",
              fontSize: "1.125rem",
            }}
          >
            ทีมงานสวนคุณแดงพร้อมตอบทุกข้อสงสัยของคุณเสมอ
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "#16a34a",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "9999px",
                textDecoration: "none",
                fontWeight: "bold",
                transition: "background-color 0.2s",
                boxShadow: "0 2px 4px rgba(22, 163, 74, 0.2)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#15803d")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#16a34a")
              }
            >
              ติดต่อเราโดยตรง
            </Link>
            <a
              href="tel:0812345678"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "white",
                color: "#1f2937",
                padding: "0.75rem 1.5rem",
                borderRadius: "9999px",
                textDecoration: "none",
                fontWeight: "600",
                transition: "background-color 0.2s",
                border: "1px solid #d1d5db",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9fafb")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              โทร: 081-234-5678
            </a>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
}
