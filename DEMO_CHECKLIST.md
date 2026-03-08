# 🎭 Demo Checklist สำหรับการสอบโปรเจค

## 📋 รายการที่ต้องทดสอบก่อนสอบ

### ✅ สถานะเว็บไซต์
- [ ] Dev server รันได้ (http://localhost:3000)
- [ ] Production site ใช้ได้ (https://khundaenggarden.vercel.app)
- [ ] Database เชื่อมต่อได้
- [ ] ไม่มี console errors

### 👤 ทดสอบ User Flow
1. **หน้าแรก**
   - [ ] Hero section แสดงผลถูกต้อง
   - [ ] Navigation menu ทำงาน
   - [ ] ไม่มีอีโมจิดอกไม้แล้ว ✅
   - [ ] Product showcase แสดง

2. **สมัครสมาชิก**
   - [ ] ไปที่ `/register`
   - [ ] กรอกข้อมูลสมัคร
   - [ ] รับสมัครสำเร็จ
   - [ ] Login ได้ด้วย account ใหม่

3. **ดูต้นไม้**
   - [ ] ไปที่ `/shop`
   - [ ] แสดงรายการต้นไม้
   - [ ] ค้นหา/กรองได้
   - [ ] คลิกดูรายละเอียด

4. **ตะกร้า**
   - [ ] เพิ่มต้นไม้ในตะกร้า
   - [ ] แก้ไขจำนวนได้
   - [ ] ลบรายการได้
   - [ ] ระบุวันรับสินค้า

5. **การจอง**
   - [ ] ไปที่ `/cart`
   - [ ] เลือกชำระเงิน (มัดจำ/เต็มจำ)
   - [ ] ยืนยันการจอง
   - [ ] ไปหน้า success พร้อม QR code

6. **Profile**
   - [ ] ไปที่ `/profile`
   - [ ] ดูประวัติการจอง
   - [ ] อัปโหลดสลิปได้
   - [ ] รีวิวต้นไม้ได้

### 👨‍💼 ทดสอบ Admin Flow
1. **Admin Login**
   - [ ] Login ด้วย khundaenggarden@gmail.com / admin1234
   - [ ] เข้าถึง admin panel ได้

2. **Dashboard**
   - [ ] ดูรายการออเดอร์
   - [ ] กรอง/ค้นหาได้
   - [ ] เปลี่ยนสถานะออเดอร์
   - [ ] ดูข้อมูลลูกค้า

3. **Notifications**
   - [ ] ดูการแจ้งเตือน
   - [ ] คลิก notification ไปหน้าที่เกี่ยวข้อง
   - [ ] Mark as read ได้

## 🚨 ประเด็นที่อาจถูกถาม

### 1. Performance
- **Response Times**: API responses < 500ms
- **Page Load**: หน้าแรกโหลด < 3s
- **Database Queries**: ใช้ indexes อย่างเหมาะสม
- **Caching**: มี cache headers สำหรับ static assets

### 2. Security
- **Authentication**: JWT + httpOnly cookies
- **Input Validation**: Zod schemas ทุก API
- **SQL Injection**: Prisma ORM ป้องกันอัตโนมัติ
- **XSS Protection**: Sanitize user inputs

### 3. Scalability
- **Database**: รองรับ concurrent connections
- **File Storage**: FTP approach มีข้อจำกัด
- **Rate Limiting**: ยังไม่มี (ควรพิจารณา)
- **Monitoring**: ยังไม่มี logging system

## 🎯 Demo Flow แนะนำ

### Step 1: แนะนำโปรเจค (2-3 นาที)
- เริ่มจากหน้าแรก แสดง UI ที่สวยงาม
- พูดถึง business model ของร้านต้นไม้
- แสดง responsive design บน mobile

### Step 2: แสดง User Features (3-4 นาที)
- สมัครสมาชิกใหม่
- ค้นหาและเลือกต้นไม้
- ใส่ตะกร้าและจอง
- อัปโหลดสลิปการโอน

### Step 3: แสดง Admin Features (2-3 นาที)
- Login admin
- ดูรายการออเดอร์
- จัดการสถานะ
- ระบบ notifications

### Step 4: ทดสอบ Edge Cases (2-3 นาที)
- จองต้นไม้ที่หมด stock
- อัปโหลดไฟล์ที่ไม่ใช่รูป
- ใส่ข้อมูลผิด format
- ทดสอบ concurrent bookings

## 🔧 การเตรียมตัว

### ก่อนสอบ 1 วัน
1. **Check Environment**
   ```bash
   npm run dev  # ตรวจสอบว่ารันได้
   npm run lint  # ตรวจสอบ code quality
   npm run build  # ตรวจสอบ build ได้
   ```

2. **Test All APIs**
   ```bash
   node test-all-apis.js  # ถ้ามี test script
   ```

3. **Check Database**
   - ตรวจสอบว่ามีข้อมูลตัวอย่าง
   - ตรวจสอบ connections
   - ตรวจสอบ data integrity

4. **Prepare Demo Data**
   - มี user accounts สำหรับทดสอบ
   - มีต้นไม้ที่พร้อมจอง
   - มี bookings ที่หลากสถานะ

### วันสอบ
1. **Warm Up** (15 นาทีก่อน)
   - Start dev server
   - เปิด tabs ที่จำเป็น
   - ทดสอบ critical flows ครั้งล่าสุด

2. **Backup** (ก่อนสอบ)
   - ถ้ามีการเปลี่ยนแปลง ให้ commit ก่อน
   - สำรองข้อมูลสำคัญ

## 📱 อุปกรณ์ที่ควรมี
- **Laptop** - สำหรับ demo หลัก
- **Phone** - ทดสอบ responsive
- **Internet** - สำหรับ production demo
- **Backup** - ถ้าเน็ตล่ม มี alternative

## 🚨 แผนสำรอง

### ถ้าเว็บล่ม
1. แสดง screenshots ที่เตรียมไว้
2. พูดถึง architecture และ code
3. แสดง local development ถ้าเป็นไปได้

### ถ้า database ล่ม
1. พูดถึง schema design
2. แสดง Prisma models
3. อธิบาย database relationships

### ถ้า API ล่ม
1. แสดง API documentation
2. พูดถึง error handling
3. อธิบาย security measures

## 💸 ข้อมูลสำคัญที่ควรจำ

### Environment Variables
```
DATABASE_URL=mysql://...
JWT_SECRET=REPLACE_ME_WITH_STRONG_SECRET
ADMIN_EMAILS=khundaenggarden@gmail.com,fhjilyyjg@gmail.com
ADMIN_PASSWORD=admin1234
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Admin Credentials
- **Email**: khundaenggarden@gmail.com
- **Password**: admin1234

### Test User
- **Phone**: 0991234567 (ถ้ามี)
- **Password**: password123

### Key URLs
- **Local**: http://localhost:3000
- **Production**: https://khundaenggarden.vercel.app
- **Admin**: http://localhost:3000/admin
- **Shop**: http://localhost:3000/shop
- **Cart**: http://localhost:3000/cart

## 🎯 จุดขายที่ควรเน้น

1. **Real-world Application** - ไม่ใช่ toy project
2. **Full-stack Skills** - Frontend + Backend + Database
3. **Business Impact** - ช่วยลดงาน manual ของร้าน
4. **Modern Tech Stack** - Next.js 16, TypeScript, Prisma
5. **Problem Solving** - แก้ปัญหาจริงที่เจอ
6. **User Experience** - ใส่ใจ UX/UI จริงๆ

## 📝 สิ่งที่ไม่ควรพูด

1. **"โปรเจคนี้ง่าย"** - แม้จะจริง แต่อย่าพูดตรงๆ
2. **"ทำไปเล่นๆ"** - แม้จะเป็น side project
3. **"ไม่มี bugs"** - ทุกโปรเจคมี bugs
4. **"ใช้เวลาน้อย"** - อาจทำให้ดูไม่น่าท้าทาย
5. **"ไม่ต้องทดสอบ"** - อย่าป้องกันการทดสอบ

## 🚀 การปิดท้าย

1. **Summarize** - สรุปฟีเจอร์ทที่ทำได้
2. **Learning** - บอกว่าเรียนรู้อะไร
3. **Future** - พูดถึงการพัฒนาต่อ
4. **Questions** - เปิดรับคำถาม
5. **Thank You** - ขอบคุณและแสดงความมั่นใจ

**Good luck! 🎉**
