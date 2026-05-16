"use client";

import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [recentBooking, setRecentBooking] = useState<{
    refCode: string;
    status: string;
    items: Record<string, unknown>[];
    totalPrice: number;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");

      // Load recent booking

      fetchRecentBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchRecentBooking = async () => {
    try {
      const response = await fetch(`/api/bookings?userId=${user?.id}`);
      if (response.ok) {
        const bookings = await response.json();
        if (bookings.length > 0) {
          setRecentBooking(bookings[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  if (!user) {
    return (
      <div
        className="container"
        style={{ padding: "4rem 1rem", textAlign: "center" }}
      >
        <p>กรุณาเข้าสู่ระบบก่อน</p>
        <Link href="/login">
          <Button>เข้าสู่ระบบ</Button>
        </Link>
      </div>
    );
  }

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate phone format
      if (phone && !/^\d{10}$/.test(phone)) {
        setError("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก");
        setLoading(false);
        return;
      }

      // Validate email format
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("รูปแบบอีเมลไม่ถูกต้อง");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "เกิดข้อผิดพลาดในการบันทึก");
        setLoading(false);
        return;
      }

      // Update user in AuthContext
      await refreshUser();

      setSuccess("บันทึกข้อมูลเรียบร้อยแล้ว");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setIsEditing(false);
    setError("");
  };

  return (
    <div
      className="container"
      style={{ padding: "2rem 1rem", maxWidth: "800px" }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>ข้อมูลส่วนตัว</h1>

      <div style={{ display: "grid", gap: "2rem" }}>
        <Card>
          <CardHeader>
            <CardTitle>บัญชีของฉัน</CardTitle>
          </CardHeader>
          <CardContent
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {error}
              </div>
            )}
            {success && (
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#dcfce7",
                  color: "#16a34a",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {success}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ fontWeight: "bold" }}>ชื่อ</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  placeholder="ชื่อ"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label style={{ fontWeight: "bold" }}>นามสกุล</label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  placeholder="นามสกุล"
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label style={{ fontWeight: "bold" }}>อีเมล</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                placeholder="example@email.com"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label style={{ fontWeight: "bold" }}>เบอร์โทรศัพท์</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                placeholder="0812345678"
                maxLength={10}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              {isEditing ? (
                <>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    {loading ? "กำลังบันทึก..." : "บันทึก"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    ยกเลิก
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  fullWidth
                >
                  แก้ไข
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CardTitle>ประวัติการจองล่าสุด</CardTitle>
              <Link href="/profile/bookings">
                <Button variant="ghost">ดูทั้งหมด</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentBooking ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    Order #{recentBooking.refCode}
                  </span>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                      backgroundColor:
                        recentBooking.status === "COMPLETED"
                          ? "#dcfce7"
                          : "#fef3c7",
                      color:
                        recentBooking.status === "COMPLETED"
                          ? "#16a34a"
                          : "#d97706",
                    }}
                  >
                    {recentBooking.status === "PENDING"
                      ? "รอตรวจสอบ"
                      : recentBooking.status === "COMPLETED"
                        ? "เสร็จสิ้น"
                        : recentBooking.status}
                  </span>
                </div>
                <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  {recentBooking.items.length} รายการ - รวม ฿
                  {recentBooking.totalPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p style={{ color: "#6b7280" }}>ยังไม่มีรายการจอง</p>
            )}
          </CardContent>
        </Card>

        {/* Logout Section */}
        <Card>
          <CardContent style={{ padding: "2rem", textAlign: "center" }}>
            <Link href="/logout" style={{ textDecoration: "none" }}>
              <Button
                variant="outline"
                fullWidth
                style={{
                  color: "#d97706",
                  borderColor: "#d97706",
                  fontWeight: "bold",
                }}
              >
                ออกจากระบบ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
