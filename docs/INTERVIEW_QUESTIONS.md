# คำถามที่อาจถูกถามในการสอบโปรเจค + คำตอบ

## 🎯 คำถามทั่วไป

### Q1: บอกเกี่ยวกับโปรเจคนี้สักหน่อย

**A:** โปรเจคนี้คือเว็บไซต์ E-commerce สำหรับร้าน "สวนคุณแดงการ์เด้น" ที่ขายต้นไม้พรีเมียม พัฒนาด้วย Next.js 16.1.6 + TypeScript มีฟีเจอร์ทครบถ้วนทั้งฝั่นผู้ใช้และผู้ดูแลระบบ ใช้ Prisma ORM กับ MySQL database รองรับการจองสินค้า การชำระเงิน และระบบแจ้งเตือน

### Q2: ทำไมถึงเลือกใช้ Next.js?

**A:** เลือก Next.js เพราะ:

- **App Router** - โครงสร้างใหม่ที่ทันสมัย รองรับ Server Components
- **TypeScript Support** - Type safety ตั้งแต่ต้น
- **Full-stack Framework** - มี API routes ในตัว ไม่ต้อง setup backend แยก
- **Performance** - SSR/SSG ช่วยให้โหลดเร็วและ SEO ดี
- **Deployment** - Vercel integration ง่ายต่อการ deploy
- **Ecosystem** - มี library และ tooling ครบถ้วน

### Q3: Database ใช้อะไรบ้าง?

**A:** ใช้ MySQL กับ Prisma ORM:

- **MySQL** - Production database ที่เสถียรและเร็ว
- **Prisma** - Type-safe database access ช่วยลด error และมี migration tools
- **Schema** - มี 3 ตารางหลัก: Users, Trees, Bookings
- **Relations** - จัดการความสัมพันธ์ข้อมูลได้ดี

## 🏗️ เทคนิคคอล

### Q4: ใช้ state management อย่างไร?

**A:** ใช้ React Context API:

- **AuthContext** - จัดการ authentication state
- **CartContext** - จัดการตะกร้าสินค้า
- **NotificationContext** - จัดการการแจ้งเตือน
- **เหตุผล** - โปรเจคไม่ใหญ่มากพอที่จะต้องใช้ Redux หรือ Zustand

### Q5: Authentication ทำอย่างไร?

**A:** ใช้ JWT + Bcrypt.js:

- **Login** - ตรวจสอบ user แล้วสร้าง JWT token
- **Token** - เก็บใน httpOnly cookie หมดอายุ 24 ชั่วโมง
- **Middleware** - ตรวจสอบ token ใน API routes
- **Admin** - แยก credentials จาก environment variables
- **Password** - Hash ด้วย Bcrypt ไม่เก็บ plain text

### Q6: จัดการ file uploads อย่างไร?

**A:** ใช้ FTP approach:

- **Upload API** - `/api/upload` รับไฟล์จาก client
- **FTP Script** - อัปโหลดไป server ผ่าน FTP
- **Image Path** - เก็บ path ใน database เป็น JSON array
- **Validation** - ตรวจสอบ file type และ size
- **Alternative** - พิจารณา Vercel Blob หรือ Cloudinary

## 🔧 ประสิทธิภาพ

### Q7: ทำ SEO อย่างไร?

**A:** ใช้ Next.js SEO features:

- **Meta Tags** - กำหนด title, description แบบ dynamic
- **Open Graph** - สำหรับ social sharing
- **Structured Data** - JSON-LD สำหรับ search engines
- **SSR** - Server-side rendering ช่วย indexing
- **Sitemap** - สร้าง automatic sitemap

### Q8: ทำ caching อย่างไร?

**A:** ใช้หลายระดับ:

- **Browser Cache** - Cache-Control headers สำหรับ static assets
- **API Caching** - s-maxage สำหรับ API responses
- **Database** - Prisma query optimization
- **Images** - Next.js Image component optimization
- **Future** - พิจารณา Redis สำหรับ session/data caching

## 🐛 การจัดการ Error

### Q9: จัดการ errors อย่างไร?

**A:** มีหลายระดับ:

- **Client-side** - Error boundaries และ try-catch
- **Server-side** - API error handling ด้วย proper status codes
- **Database** - Prisma error handling และ constraints
- **Validation** - Zod schema validation
- **Logging** - Console logs สำหรับ debugging

### Q10: ทดสอบอย่างไร?

**A:** หลายวิธี:

- **Unit Tests** - ทดสอบ API endpoints ด้วย Node.js scripts
- **Integration Tests** - ทดสอบ flow การจองสินค้า
- **Security Tests** - SQL injection, XSS, authentication bypass
- **Performance Tests** - Response times และ concurrent requests
- **Manual Testing** - ทดสอบผ่าน browser

## 📱 อื่นๆ

### Q11: ทำ responsive อย่างไร?

**A:** ใช้ CSS techniques:

- **Mobile-first** - เขียน CSS สำหรับ mobile ก่อน
- **Flexbox/Grid** - Layout ที่ flexible
- **Media Queries** - Breakpoints สำหรับ tablet/desktop
- **Viewport Meta** - สำหรับ mobile browsers
- **Testing** - DevTools device simulation

### Q12: จัดการ environment variables อย่างไร?

**A:** ใช้ .env.local:

- **Development** - .env.local (gitignored)
- **Production** - Vercel environment variables
- **Security** - ไม่ commit secrets ไป git
- **Validation** - Default values สำหรับ missing vars
- **Types** - TypeScript types สำหรับ env vars

## 🚀 การ Deploy

### Q13: Deploy อย่างไร?

**A:** ใช้ Vercel:

- **Automatic** - Git push triggers deployment
- **Environment** - Config ผ่าน Vercel dashboard
- **Database** - External MySQL (ไม่ใช้ Vercel Postgres)
- **Files** - FTP scripts สำหรับ image uploads
- **Domain** - Custom domain configuration

### Q14: จะทำอย่างไรถ้าต้อง scaling?

**A:** หลายแนวทาง:

- **Database** - Read replicas, connection pooling
- **CDN** - Image delivery และ static assets
- **Load Balancer** - Vercel handles automatically
- **Caching** - Redis สำหรับ sessions/data
- **Monitoring** - Error tracking และ performance metrics

## 🎯 คำถามยากๆ

### Q15: ถ้าจะให้ปรับปรุงอีก 3 อย่าง จะทำอะไร?

**A:** 1. **Payment Gateway** - เพิ่ม credit card payment 2. **Real-time Notifications** - WebSocket สำหรับ live updates  
 3. **Analytics Dashboard** - ข้อมูลการขายและ user behavior

### Q16: ปัญหาที่ยากที่สุดและแก้ยังไง?

**A:** **Image Upload Issues** - ตอนแรก path ไม่ถูกต้อง

- **Problem** - Images ไม่แสดงเพราะ path ผิด
- **Solution** - สร้าง script แก้ไข paths ทั้งหมด
- **Learning** - Importance of consistent file structure

### Q17: ใช้เวลาไปเท่าไร?

**A:** ประมาณ 2-3 เดือน:

- **Week 1-2** - Setup และ core features
- **Week 3-4** - Admin panel และ advanced features
- **Week 5-6** - Testing, fixes, และ deployment
- **Ongoing** - แก้ไข bugs และ improvements

## 💡 Tips สำหรับการสอบ

1. **Demo ให้เห็นจริง** - แสดง website ทำงานจริง
2. **พูดให้มั่นใจ** - อธิบายด้วยความเชี่ยวชาญ
3. **Focus on impact** - บอกว่าแก้ปัญหาอะไรได้
4. **Show learning** - บอกว่าเรียนรู้อะไรจากโปรเจค
5. **Be honest** - ถ้าไม่รู้ บอกว่าจะศึกษาเพิ่ม
