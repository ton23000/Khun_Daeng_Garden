import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function Footer() {
  let email = "kittitusjuprajak@gmail.com";
  let phone = "089-876-2045";
  let facebook = "https://web.facebook.com/kittitusjupraja";
  let facebookName = "สวนคุณแดง";

  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            "contact_email",
            "contact_phone",
            "contact_facebook",
            "contact_facebook_name",
          ],
        },
      },
    });
    const settingsMap = settings.reduce((acc: Record<string, string>, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    if (settingsMap["contact_email"]) email = settingsMap["contact_email"];
    if (settingsMap["contact_phone"]) phone = settingsMap["contact_phone"];
    if (settingsMap["contact_facebook"])
      facebook = settingsMap["contact_facebook"];
    if (settingsMap["contact_facebook_name"])
      facebookName = settingsMap["contact_facebook_name"];
  } catch {
    // Fallback to defaults
  }

  const footerStyle: React.CSSProperties = {
    backgroundColor: "#2d3e2d", // Dark green from image
    color: "#ffffff",
    padding: "3rem 0 1rem",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "1.125rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#ffffff",
  };

  const linkStyle: React.CSSProperties = {
    display: "block",
    color: "#d1d5db",
    textDecoration: "none",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    transition: "color 0.2s",
  };

  const bottomBarStyle: React.CSSProperties = {
    backgroundColor: "#7fb069", // Light green from image
    color: "#2d3e2d",
    padding: "1rem 0",
    marginTop: "2rem",
    fontSize: "0.875rem",
  };

  return (
    <footer style={footerStyle}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Column 1: About */}
          <div>
            <h3
              style={{
                fontSize: "1.75rem",
                fontFamily: "var(--font-playfair), serif",
                fontStyle: "italic",
                marginBottom: "1rem",
                color: "#ffffff",
              }}
            >
              Khun Daeng Garden
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: "1.6",
                color: "#d1d5db",
                marginBottom: "1.5rem",
              }}
            >
              เราจำหน่ายไม้ประดับและไม้ดอกไม้ประดับ
              <br />
              ในเมืองไทยมาอย่างยาวนาน
            </p>
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#d1d5db",
                  marginBottom: "0.5rem",
                }}
              >
                อีเมล:{" "}
                <a
                  href={`mailto:${email}`}
                  style={{ color: "#7fb069", textDecoration: "none" }}
                >
                  {email}
                </a>
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#d1d5db",
                  marginBottom: "0.5rem",
                }}
              >
                โทรศัพท์: <span style={{ color: "#7fb069" }}>{phone}</span>
              </div>
              <div style={{ fontSize: "0.875rem", color: "#d1d5db" }}>
                Facebook:{" "}
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#7fb069", textDecoration: "none" }}
                >
                  {facebookName}
                </a>
              </div>
            </div>
            {/* Payment Options */}
            <div style={{ marginTop: "1.25rem" }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  marginBottom: "0.5rem",
                }}
              >
                ช่องทางการชำระเงินที่รองรับ:
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: "#115e59",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  PromptPay
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: "#0369a1",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  โอนเงินธนาคาร
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={sectionTitleStyle}>เมนูข้อมูล</h4>
            <Link href="/about" style={linkStyle}>
              เกี่ยวกับเรา
            </Link>
            <Link href="/services" style={linkStyle}>
              บริการของเรา
            </Link>
            <Link href="/how-to-order" style={linkStyle}>
              วิธีการสั่งซื้อ
            </Link>
            <Link href="/consultation" style={linkStyle}>
              คำปรึกษาการปลูก
            </Link>
            <Link href="/faq" style={linkStyle}>
              คำถามที่พบบ่อย
            </Link>
          </div>

          {/* Column 3: Shop */}
          <div>
            <h4 style={sectionTitleStyle}>ร้านค้า</h4>
            <Link href="/shop" style={linkStyle}>
              สินค้าทั้งหมด
            </Link>
            <Link href="/promotion" style={linkStyle}>
              โปรโมชั่น
            </Link>
          </div>

          {/* Column 4: Account */}
          <div>
            <h4 style={sectionTitleStyle}>บัญชีของฉัน</h4>
            <Link href="/profile" style={linkStyle}>
              ข้อมูลส่วนตัว
            </Link>
            <Link href="/cart" style={linkStyle}>
              ตะกร้าสินค้า
            </Link>
            <Link href="/profile/bookings" style={linkStyle}>
              ประวัติการจอง
            </Link>
            <Link href="/login" style={linkStyle}>
              เข้าสู่ระบบ
            </Link>
            <Link href="/register" style={linkStyle}>
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={bottomBarStyle}>
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ fontSize: "0.875rem" }}>
            สงวนลิขสิทธิ์ © 2026 สวนคุณแดง สงวนสิทธิ์ทั้งหมด
          </div>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem" }}>
            <Link
              href="/about"
              style={{ color: "#2d3e2d", textDecoration: "none" }}
            >
              เกี่ยวกับเรา
            </Link>
            <Link
              href="/contact"
              style={{ color: "#2d3e2d", textDecoration: "none" }}
            >
              ติดต่อเรา
            </Link>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#4a5a4a" }}>
            Made with 🌿 by Khun Daeng Garden
          </div>
        </div>
      </div>
    </footer>
  );
}
