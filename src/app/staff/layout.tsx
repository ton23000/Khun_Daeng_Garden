"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/Button";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setTimeout(() => setIsSidebarOpen(true), 0);
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setTimeout(() => setIsSidebarOpen(false), 0);
    }
  }, [pathname]);

  // Allow the login page to render without auth
  if (pathname === "/staff/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  // Only staff and admin can access
  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    router.push("/staff/login");
    return null;
  }

  const navStyle = (active: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    color: active ? "#1d4ed8" : "#374151",
    backgroundColor: active ? "#dbeafe" : "transparent",
    fontWeight: active ? 500 : 400,
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
  });

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
                .staff-layout { display: flex; min-height: calc(100vh - 64px); align-items: flex-start; }
                .staff-sidebar { width: 240px; background-color: #f0f9ff; border-right: 1px solid #bfdbfe; display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; position: sticky; top: 64px; height: calc(100vh - 64px); z-index: 40; margin-left: 0; transition: margin-left 0.3s; }
                .staff-sidebar:not(.open) { margin-left: -240px; }
                .staff-main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; width: 100%; }
                .staff-top-bar { display: flex; align-items: center; padding: 1rem 1.5rem; background-color: white; border-bottom: 1px solid #bfdbfe; position: sticky; top: 64px; z-index: 30; }
                .staff-main { padding: 1rem; flex: 1; background-color: white; }
                .staff-backdrop { display: none; }
                @media (max-width: 767px) {
                    .staff-layout { padding-bottom: 5rem; }
                    .staff-sidebar { position: fixed; top: 0; left: 0; bottom: 0; height: 100vh; padding: 1.5rem; z-index: 9999; margin-left: 0 !important; transform: translateX(-100%); transition: transform 0.3s; }
                    .staff-sidebar.open { transform: translateX(0); }
                    .staff-backdrop { display: block; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 9998; opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s; }
                    .staff-backdrop.open { opacity: 1; visibility: visible; }
                    .staff-top-bar { position: relative; top: 0; }
                }
                @media (min-width: 768px) { .staff-main { padding: 2rem; } }
            `,
        }}
      />

      <div className="staff-layout">
        <div
          className={`staff-backdrop ${isSidebarOpen ? "open" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        <aside className={`staff-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "1.5rem 1rem",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#1d4ed8",
                  margin: 0,
                }}
              >
                🧑‍💼 Staff Panel
              </h2>
              {user && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    marginTop: "0.25rem",
                  }}
                >
                  {user.firstName} {user.lastName}
                </p>
              )}
            </div>

            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  paddingLeft: "0.5rem",
                  marginBottom: "0.25rem",
                }}
              >
                จัดการออเดอร์
              </div>
              <Link
                href="/staff/orders"
                style={navStyle(pathname === "/staff/orders")}
              >
                <span style={{ fontSize: "1.1rem" }}>🛒</span> ออเดอร์ทั้งหมด
              </Link>
              <Link
                href="/staff/reviews"
                style={navStyle(pathname === "/staff/reviews")}
              >
                <span style={{ fontSize: "1.1rem" }}>⭐</span> จัดการรีวิว
              </Link>
            </nav>

            <div
              style={{
                marginTop: "auto",
                paddingTop: "1rem",
                borderTop: "1px solid #bfdbfe",
              }}
            >
              <Button
                variant="outline"
                fullWidth
                onClick={logout}
                style={{ borderColor: "#1d4ed8", color: "#1d4ed8" }}
              >
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </aside>

        <div className="staff-main-wrapper">
          <div className="staff-top-bar">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                padding: "0.5rem",
                marginRight: "1rem",
                backgroundColor: "white",
                border: "1px solid #bfdbfe",
                borderRadius: "0.375rem",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="#1d4ed8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#1d4ed8",
                margin: 0,
              }}
            >
              พนักงาน (Staff)
            </h1>
          </div>
          <main className="staff-main">{children}</main>
        </div>
      </div>
    </>
  );
}
