"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AdminNotification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  bookingId: string | null;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: AdminNotification) => !n.read).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (ids: string[]) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: ids }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const getNotificationUrl = (notif: AdminNotification) => {
    // If notification has a bookingId, navigate to the specific booking
    if (notif.bookingId) {
      return `/admin/orders?booking=${notif.bookingId}`;
    }

    // Default navigation based on notification type
    switch (notif.type) {
      case "order":
        return "/admin/orders";
      case "booking":
        return "/admin/orders";
      case "user":
        return "/admin/customers";
      case "review":
        return "/admin/reviews";
      default:
        return "/admin/orders";
    }
  };

  const handleNotificationClick = async (notif: AdminNotification) => {
    // Mark as read if unread
    if (!notif.read) {
      await markAsRead([notif.id]);
    }

    // Navigate to appropriate page
    const url = getNotificationUrl(notif);
    router.push(url);
    setIsOpen(false);
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          background: "white",
          border: "2px solid #e5e7eb",
          borderRadius: "50%",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "1.25rem",
        }}
        title="การแจ้งเตือน"
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#ef4444",
              color: "white",
              borderRadius: "9999px",
              width: "20px",
              height: "20px",
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "52px",
              right: 0,
              width: "360px",
              maxHeight: "480px",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              zIndex: 20,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontWeight: "bold", fontSize: "1rem" }}>
                การแจ้งเตือน
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--primary)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  อ่านทั้งหมด
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#9ca3af",
                  }}
                >
                  ไม่มีการแจ้งเตือน
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    style={{
                      padding: "1rem",
                      borderBottom: "1px solid #f3f4f6",
                      backgroundColor: notif.read ? "white" : "#eff6ff",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = notif.read
                        ? "#f9fafb"
                        : "#dbeafe";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = notif.read
                        ? "white"
                        : "#eff6ff";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.5rem",
                      }}
                    >
                      {!notif.read && (
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#3b82f6",
                            marginTop: "0.5rem",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            marginBottom: "0.25rem",
                            fontWeight: notif.read ? "normal" : "600",
                          }}
                        >
                          {notif.message}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                          {new Date(notif.createdAt).toLocaleString("th-TH")}
                        </p>
                        {notif.bookingId && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--primary)",
                              marginTop: "0.25rem",
                              display: "inline-block",
                            }}
                          >
                            → ดูรายละเอียดออเดอร์
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
