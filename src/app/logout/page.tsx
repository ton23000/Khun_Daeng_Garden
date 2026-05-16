"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScrollAnimation } from "@/components/ScrollAnimation";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Call the AuthContext logout function
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
      // Force redirect even if error
      router.push("/");
      router.refresh();
    }
  };

  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = () => {
    router.back();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        padding: "2rem",
      }}
    >
      <ScrollAnimation animation="fade-up">
        <Card
          style={{
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            border: "none",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <CardHeader>
            <div
              style={{
                fontSize: "4rem",
                marginBottom: "1rem",
                filter: "grayscale(0.3)",
              }}
            >
              👋
            </div>
            <CardTitle
              style={{
                fontSize: "2rem",
                fontFamily: "var(--font-playfair), serif",
                color: "#1f2937",
              }}
            >
              ออกจากระบบ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#6b7280",
                marginBottom: "2rem",
                lineHeight: "1.6",
              }}
            >
              {isLoggingOut ? (
                <>กำลังออกจากระบบ...</>
              ) : (
                <>
                  คุณต้องการออกจากระบบใช่หรือไม่?
                  <br />
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "#9ca3af",
                    }}
                  >
                    จะออกจากระบบอัตโนมัติใน {countdown} วินาที
                  </span>
                </>
              )}
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isLoggingOut ? "not-allowed" : "pointer",
                  opacity: isLoggingOut ? 0.6 : 1,
                  transition: "all 0.3s ease",
                }}
              >
                {isLoggingOut ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
              </Button>

              <Button
                onClick={handleCancel}
                disabled={isLoggingOut}
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#1f2937",
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: isLoggingOut ? "not-allowed" : "pointer",
                  opacity: isLoggingOut ? 0.6 : 1,
                  transition: "all 0.3s ease",
                }}
              >
                ยกเลิก
              </Button>
            </div>

            <p
              style={{
                marginTop: "2rem",
                fontSize: "0.875rem",
                color: "#9ca3af",
              }}
            >
              ขอบคุณที่ใช้บริการ สวนคุณแดง 🌿
            </p>
          </CardContent>
        </Card>
      </ScrollAnimation>
    </div>
  );
}
