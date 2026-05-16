"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        const data = await res.json();
        setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="container"
      style={{ padding: "2rem 1rem", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "0.5rem",
        }}
      >
        📞 ติดต่อเรา
      </h1>
      <p
        style={{
          textAlign: "center",
          color: "#6b7280",
          marginBottom: "2rem",
          fontSize: "1.125rem",
        }}
      >
        มีคำถามหรือต้องการข้อมูลเพิ่มเติม? ติดต่อเราได้เลย
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Left: Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>ส่งข้อความถึงเรา</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  backgroundColor: "#f0fdf4",
                  borderRadius: "0.75rem",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                <h3
                  style={{
                    fontWeight: "bold",
                    color: "#059669",
                    marginBottom: "0.5rem",
                  }}
                >
                  ส่งข้อความเรียบร้อยแล้ว!
                </h3>
                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                  เราจะติดต่อกลับโดยเร็วที่สุด
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  ส่งข้อความอีกครั้ง
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <Input
                  label="ชื่อ"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="ชื่อ-นามสกุล"
                  required
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <Input
                    label="อีเมล"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@email.com"
                    required
                  />
                  <Input
                    label="โทรศัพท์"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="08x-xxx-xxxx"
                  />
                </div>
                <Input
                  label="หัวข้อ"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="เรื่องที่ต้องการสอบถาม"
                  required
                />
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    ข้อความ
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={5}
                    required
                    placeholder="รายละเอียดที่ต้องการสอบถาม..."
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #d1d5db",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

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

                <Button
                  type="submit"
                  fullWidth
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "⏳ กำลังส่ง..." : "📤 ส่งข้อความ"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Right: Contact Info + Map */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลติดต่อ</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#dcfce7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    📍
                  </div>
                  <div>
                    <p style={{ fontWeight: "bold" }}>ที่อยู่</p>
                    <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      383 ถ.กาญจนวินิช ต.พะวง อ.เมือง จ.สงขลา 90100
                    </p>
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#dbeafe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    📞
                  </div>
                  <div>
                    <p style={{ fontWeight: "bold" }}>โทรศัพท์</p>
                    <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      061-690-0908
                    </p>
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#fef9c3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    ✉️
                  </div>
                  <div>
                    <p style={{ fontWeight: "bold" }}>อีเมล</p>
                    <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      khundaenggarden@gmail.com
                    </p>
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#fce7f3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    🕐
                  </div>
                  <div>
                    <p style={{ fontWeight: "bold" }}>เวลาทำการ</p>
                    <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      จันทร์ - เสาร์: 08:00 - 17:00
                      <br />
                      อาทิตย์: 09:00 - 15:00
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Maps */}
          <Card>
            <CardHeader>
              <CardTitle>📍 แผนที่ร้าน</CardTitle>
            </CardHeader>
            <CardContent
              style={{
                padding: 0,
                overflow: "hidden",
                borderRadius: "0 0 0.75rem 0.75rem",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d989.7839558138357!2d100.56942377049576!3d7.110254269525753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d2d12b2a7590d%3A0x54372dfd81d5955b!2z4Lij4LmJ4Liy4LiZ4LiV4LmJ4LiZ4LmE4Lih4LmJIOC4quC4p-C4meC4hOC4uOC4k-C5geC4lOC4hw!5e0!3m2!1sth!2sth!4v1771097324381!5m2!1sth!2sth"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Khun Daeng Garden Map"
              />
              <div style={{ padding: "1rem", backgroundColor: "#f0fdf4" }}>
                <a
                  href="https://maps.app.goo.gl/r5xobpbgAoqpiH4r9"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    color: "#059669",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  🗺️ เปิดใน Google Maps
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
