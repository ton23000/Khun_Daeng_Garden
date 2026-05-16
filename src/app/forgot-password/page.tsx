"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div
        className="container"
        style={{
          padding: "4rem 1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card style={{ width: "100%", maxWidth: "500px" }}>
          <CardHeader style={{ textAlign: "center" }}>
            <div
              style={{
                margin: "0 auto 1rem",
                width: "80px",
                height: "80px",
                backgroundColor: "#dcfce7",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
              }}
            >
              📧
            </div>
            <CardTitle style={{ marginBottom: "0.5rem" }}>
              ตรวจสอบอีเมลของคุณ
            </CardTitle>
            <CardDescription style={{ fontSize: "1rem" }}>
              เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              style={{
                backgroundColor: "#f0f9ff",
                padding: "1rem",
                borderRadius: "0.5rem",
                marginBottom: "1.5rem",
                border: "1px solid #bae6fd",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#0c4a6e",
                  marginBottom: "0.5rem",
                }}
              >
                <strong>ขั้นตอนต่อไป:</strong>
              </p>
              <ol
                style={{
                  marginLeft: "1.25rem",
                  fontSize: "0.875rem",
                  color: "#334155",
                }}
              >
                <li>
                  เปิดอีเมลของคุณที่ <strong>{email}</strong>
                </li>
                <li>คลิกลิงก์ในอีเมล</li>
                <li>ตั้งรหัสผ่านใหม่</li>
              </ol>
            </div>

            <div
              style={{
                backgroundColor: "#fef3c7",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                marginBottom: "1rem",
                border: "1px solid #fde047",
              }}
            >
              <p style={{ fontSize: "0.8125rem", color: "#713f12" }}>
                💡 ลิงก์จะหมดอายุใน <strong>1 ชั่วโมง</strong>
              </p>
            </div>

            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              ไม่ได้รับอีเมล? ตรวจสอบโฟลเดอร์ Spam หรือ
            </p>

            <Button
              fullWidth
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
            >
              ส่งอีเมลอีกครั้ง
            </Button>

            <div
              style={{
                marginTop: "1rem",
                textAlign: "center",
                fontSize: "0.875rem",
              }}
            >
              <Link href="/login" style={{ color: "var(--primary)" }}>
                ← กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Email input form
  return (
    <div
      className="container"
      style={{
        padding: "4rem 1rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card style={{ width: "100%", maxWidth: "400px" }}>
        <CardHeader>
          <CardTitle>ลืมรหัสผ่าน</CardTitle>
          <CardDescription>
            กรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้คุณ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Input
              label="อีเมล"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#fee2e2",
                  borderRadius: "0.375rem",
                  border: "1px solid #fecaca",
                }}
              >
                <p style={{ color: "#991b1b", fontSize: "0.875rem" }}>
                  ❌ {error}
                </p>
              </div>
            )}

            <Button fullWidth type="submit" disabled={loading}>
              {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
            </Button>
          </form>
          <div
            style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            <Link href="/login" style={{ color: "#6b7280" }}>
              ← กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
