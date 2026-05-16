"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { useNotification } from "@/lib/NotificationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  Bell,
  User,
  Heart,
  Search,
} from "lucide-react";
import styles from "./navbar.module.css";
import InlineEdit from "./InlineEdit";

export function Navbar({
  topBarText = "ฟรีปุ๋ยหมักเมื่อสั่งซื้อเกิน 1,000 บาท",
  topBarBgColor = "",
}: {
  topBarText?: string;
  topBarBgColor?: string;
}) {
  const { items } = useCart();
  const { user } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotification();

  const router = useRouter();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dropdown States
  const [showServices, setShowServices] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const handleNotificationClick = (note: {
    id: string;
    message: string;
    date: string;
    read: boolean;
  }) => {
    // Mark as read
    markAllAsRead();
    setShowNotifications(false);

    // Extract booking ID from message if present
    const bookingMatch = note.message.match(/#([A-Z0-9]+)/);
    if (bookingMatch) {
      router.push(`/profile/bookings?booking=${bookingMatch[1]}`);
    } else {
      // Default to bookings page
      router.push("/profile/bookings");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <>
      <header className={`${styles.header} glass`}>
        {/* 1. Top Bar */}
        <div className={`${styles.topBar} hidden-mobile`}>
          <div className={`container ${styles.topBarContainer}`}>
            <InlineEdit
              settingKey="top_bar_text"
              initialValue={topBarText}
              initialBgColor={topBarBgColor}
              allowStyleEdit
              renderAs="div"
              className={styles.topBarText}
              style={{
                background: topBarBgColor || "transparent",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
              }}
            />
            <div className={styles.topBarLinks}>
              <span>สายด่วน : +66 81 234 5678</span>
              <Link href="/faq" className={styles.topBarLink}>
                คำถามที่พบบ่อย
              </Link>
              <Link href="/about" className={styles.topBarLink}>
                เกี่ยวกับเรา
              </Link>
              <Link href="/contact" className={styles.topBarLink}>
                ติดต่อเรา
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Middle Bar */}
        <div className={styles.middleBar}>
          <div className={`container ${styles.middleBarContainer}`}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>🌿</span> Khun Daeng Garden
            </Link>

            {/* Search Bar */}
            <form className={styles.searchWrapper} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                <Search size={20} />
              </button>
            </form>

            {/* Actions (User, Heart, Cart) */}
            <div className={styles.actions}>
              {/* User / Login */}
              {user ? (
                <div
                  className={`${styles.dropdownWrapper} hidden-mobile`}
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      textDecoration: "none",
                      color: "#1f2937",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "var(--primary)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <User size={20} />
                    </div>
                    <div className="hidden-mobile">
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        ยินดีต้อนรับ
                      </div>
                      <div style={{ fontWeight: "bold", lineHeight: 1 }}>
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  </div>

                  {showUserMenu && (
                    <div
                      className={`${styles.dropdownMenu} ${styles.dropdownMenuRight}`}
                    >
                      <Link href="/profile" className={styles.dropdownLink}>
                        โปรไฟล์
                      </Link>
                      <Link
                        href="/profile/bookings"
                        className={styles.dropdownLink}
                      >
                        การจองของฉัน
                      </Link>
                      <hr
                        style={{
                          margin: "0.5rem 0",
                          border: "none",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      />
                      <Link
                        href="/logout"
                        className={styles.dropdownLink}
                        style={{ color: "#ef4444", fontWeight: "bold" }}
                      >
                        ออกจากระบบ
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  style={{ color: "#374151" }}
                  className="hidden-mobile"
                >
                  <User size={24} />
                </Link>
              )}

              {/* Notifications */}
              <div className={`${styles.dropdownWrapper} hidden-mobile`}>
                <div
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (unreadCount > 0) markAllAsRead();
                  }}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid white",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>

                {showNotifications && (
                  <div
                    style={{
                      position: "absolute",
                      top: "120%",
                      right: "-50px",
                      width: "320px",
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      zIndex: 100,
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        borderBottom: "1px solid #e5e7eb",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>การแจ้งเตือน</span>
                      {notifications.length > 0 && (
                        <Link
                          href="/notifications"
                          style={{
                            color: "#166534",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                          onClick={() => setShowNotifications(false)}
                        >
                          ดูทั้งหมด →
                        </Link>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div
                        style={{
                          padding: "2rem",
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        ไม่มีการแจ้งเตือน
                      </div>
                    ) : (
                      <div>
                        {notifications.map((note) => (
                          <div
                            key={note.id}
                            onClick={() => handleNotificationClick(note)}
                            style={{
                              padding: "0.75rem 1rem",
                              borderBottom: "1px solid #f3f4f6",
                              backgroundColor: note.read ? "white" : "#f0fdf4",
                              transition: "background-color 0.2s",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = note.read
                                ? "#f9fafb"
                                : "#dcfce7";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = note.read
                                ? "white"
                                : "#f0fdf4";
                            }}
                          >
                            <div
                              style={{
                                fontSize: "0.875rem",
                                marginBottom: "0.25rem",
                                color: "#1f2937",
                                fontWeight: note.read ? "normal" : "600",
                              }}
                            >
                              {note.message}
                            </div>
                            <div
                              style={{ fontSize: "0.75rem", color: "#9ca3af" }}
                            >
                              {new Date(note.date).toLocaleString("th-TH")}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Favorites/Wishlist */}
              <Link
                href="/favorites"
                style={{
                  position: "relative",
                  color: "#374151",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
                title="รายการโปรด"
              >
                <Heart size={24} />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                style={{
                  position: "relative",
                  color: "#374151",
                  display: "flex",
                  alignItems: "center",
                }}
                className="hidden-mobile"
              >
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid white",
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Hamburger Menu Toggle (Mobile Only) */}
              <button
                className="hidden-desktop"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                style={{
                  border: "none",
                  background: "none",
                  padding: "0.5rem",
                  color: "var(--foreground)",
                }}
              >
                {showMobileMenu ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div
          className={`${styles.bottomBar} ${showMobileMenu ? styles.showMobileMenu : ""}`}
        >
          <div className={`container ${styles.bottomBarContainer}`}>
            {/* Main Nav Links */}
            <div className={styles.mainNav}>
              <Link href="/" className={styles.navLink}>
                หน้าหลัก
              </Link>

              {/* Dropdown: Shop */}
              <div
                className={styles.dropdownWrapper}
                onMouseEnter={() => setShowServices(true)}
                onMouseLeave={() => setShowServices(false)}
              >
                <span className={styles.dropdownTitle}>ร้านค้า ▾</span>
                {showServices && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/shop" className={styles.dropdownLink}>
                      สินค้าทั้งหมด
                    </Link>
                    <Link href="/promotion" className={styles.dropdownLink}>
                      โปรโมชั่น
                    </Link>
                  </div>
                )}
              </div>

              {/* Dropdown: About */}
              <div
                className={styles.dropdownWrapper}
                onMouseEnter={() => setShowAbout(true)}
                onMouseLeave={() => setShowAbout(false)}
              >
                <span className={styles.dropdownTitle}>บริการของเรา ▾</span>
                {showAbout && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/about" className={styles.dropdownLink}>
                      เกี่ยวกับเรา
                    </Link>
                    <Link href="/services" className={styles.dropdownLink}>
                      บริการ
                    </Link>
                    <Link href="/faq" className={styles.dropdownLink}>
                      FAQ คำถามที่พบบ่อย
                    </Link>
                    <Link href="/contact" className={styles.dropdownLink}>
                      ติดต่อเรา
                    </Link>
                  </div>
                )}
              </div>

              {user && (
                <Link href="/profile/bookings" className={styles.navLink}>
                  การจองของฉัน
                </Link>
              )}
            </div>

            {/* Social Icons & Admin */}
            <div className={styles.socialAdmin}>
              {user?.role === "admin" && (
                <Link href="/admin" style={{ textDecoration: "none" }}>
                  <span
                    style={{
                      backgroundColor: "#166534",
                      color: "white",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    Admin Panel
                  </span>
                </Link>
              )}
              {user?.role === "staff" && (
                <Link href="/staff/orders" style={{ textDecoration: "none" }}>
                  <span
                    style={{
                      backgroundColor: "#1d4ed8",
                      color: "white",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    Staff Panel
                  </span>
                </Link>
              )}
              <a
                href="https://www.facebook.com/kittitusjupraja?_rdc=1&_rdr#"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}
                title="Facebook"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className={styles.mobileBottomNav}>
        <Link href="/" className={styles.mobileNavLink}>
          <Home size={24} />
          <span>หน้าแรก</span>
        </Link>
        <Link href="/shop" className={styles.mobileNavLink}>
          <Package size={24} />
          <span>สินค้า</span>
        </Link>
        <Link href="/cart" className={styles.mobileNavLink}>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className={styles.mobileNavBadge}>{itemCount}</span>
            )}
          </div>
          <span>รถเข็น</span>
        </Link>
        <Link href="/notifications" className={styles.mobileNavLink}>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className={styles.mobileNavBadge}>{unreadCount}</span>
            )}
          </div>
          <span>แจ้งเตือน</span>
        </Link>
        <Link
          href={user ? "/profile" : "/login"}
          className={styles.mobileNavLink}
        >
          <User size={24} />
          <span>บัญชี</span>
        </Link>
      </div>
    </>
  );
}
