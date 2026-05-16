"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNotification } from "@/lib/NotificationContext";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markAllAsRead } = useNotification();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "alert":
        return "🔔";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "#22c55e";
      case "warning":
        return "#f59e0b";
      case "error":
        return "#ef4444";
      case "alert":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="container" style={{ padding: "2rem 1rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            การแจ้งเตือน
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            {user?.role === "admin"
              ? "การแจ้งเตือนสำหรับแอดมิน"
              : "การแจ้งเตือนของคุณ"}
          </p>
        </div>
        <Link href={user?.role === "admin" ? "/admin/orders" : "/profile"}>
          <Button variant="outline">← กลับ</Button>
        </Link>
      </div>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <CardContent style={{ padding: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {/* Filter Buttons */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setFilter("all")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border:
                    filter === "all"
                      ? "2px solid #166534"
                      : "1px solid #d1d5db",
                  backgroundColor: filter === "all" ? "#dcfce7" : "white",
                  fontWeight: filter === "all" ? 600 : 400,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                ทั้งหมด ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border:
                    filter === "unread"
                      ? "2px solid #166534"
                      : "1px solid #d1d5db",
                  backgroundColor: filter === "unread" ? "#dcfce7" : "white",
                  fontWeight: filter === "unread" ? 600 : 400,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                ยังไม่อ่าน ({notifications.filter((n) => !n.read).length})
              </button>
              <button
                onClick={() => setFilter("read")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border:
                    filter === "read"
                      ? "2px solid #166534"
                      : "1px solid #d1d5db",
                  backgroundColor: filter === "read" ? "#dcfce7" : "white",
                  fontWeight: filter === "read" ? 600 : 400,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                อ่านแล้ว ({notifications.filter((n) => n.read).length})
              </button>
            </div>

            {/* Mark All as Read Button */}
            {notifications.filter((n) => !n.read).length > 0 && (
              <Button
                onClick={markAllAsRead}
                style={{
                  backgroundColor: "#166534",
                  color: "white",
                  fontSize: "0.875rem",
                }}
              >
                ✓ อ่านทั้งหมด
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              style={{
                backgroundColor: notification.read ? "white" : "#f0fdf4",
                border: notification.read
                  ? "1px solid #e5e7eb"
                  : "2px solid #86efac",
              }}
            >
              <CardContent style={{ padding: "1.5rem" }}>
                <div
                  style={{ display: "flex", gap: "1rem", alignItems: "start" }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      fontSize: "1.5rem",
                      minWidth: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: notification.read
                        ? "#f3f4f6"
                        : "#dcfce7",
                      borderRadius: "50%",
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        color: "#1f2937",
                        marginBottom: "0.5rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {notification.message}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#9ca3af",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>
                        📅 {new Date(notification.date).toLocaleString("th-TH")}
                      </span>
                      {!notification.read && (
                        <span
                          style={{
                            backgroundColor: "#22c55e",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                          }}
                        >
                          ใหม่
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.375rem",
                      backgroundColor: `${getNotificationColor(notification.type)}20`,
                      color: getNotificationColor(notification.type),
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {notification.type}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔔</div>
              <p style={{ color: "#6b7280", fontSize: "1rem" }}>
                {filter === "unread"
                  ? "ไม่มีการแจ้งเตือนที่ยังไม่อ่าน"
                  : filter === "read"
                    ? "ไม่มีการแจ้งเตือนที่อ่านแล้ว"
                    : "ไม่มีการแจ้งเตือน"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary */}
      {filteredNotifications.length > 0 && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f9fafb",
            borderRadius: "0.5rem",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            แสดง <strong>{filteredNotifications.length}</strong> รายการ
            {filter !== "all" &&
              ` (กรอง: ${filter === "unread" ? "ยังไม่อ่าน" : "อ่านแล้ว"})`}
          </p>
        </div>
      )}
    </div>
  );
}
