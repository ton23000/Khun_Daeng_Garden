# วิธีการตั้งค่า Resend API Key

## 1. สมัครบัญชี Resend

1. ไปที่ https://resend.com/
2. คลิก "Sign Up" และสมัครด้วยอีเมลหรือ GitHub
3. ยืนยันอีเมลของคุณ

## 2. เพิ่ม Domain หรือใช้ Testing Domain

**Option A: ใช้ Testing Domain (สำหรับ Development)**

- Resend จะให้ testing domain มาให้อัตโนมัติ (`onboarding@resend.dev`)
- สามารถส่งได้เฉพาะไปยังอีเมลที่คุณยืนยันแล้ว

**Option B: เพิ่ม Domain ของคุณเอง (สำหรับ Production)**

1. ไปที่ Domains → Add Domain
2. ใส่ domain ของคุณ (เช่น `khundaeng.com`)
3. เพิ่ม DNS records ตามที่ Resend แนะนำ
4. รอการยืนยัน (ประมาณ 24-48 ชั่วโมง)

## 3. สร้าง API Key

1. ไปที่ API Keys → Create API Key
2. ตั้งชื่อ (เช่น "Khun Daeng Garden - Development")
3. เลือก Permission: "Sending access"
4. คลิก "Create"
5. **คัดลอก API Key ทันที** (จะเห็นแค่ครั้งเดียว!)

## 4. เพิ่ม API Key ลงใน `.env`

เปิดไฟล์ `.env` และแก้ไข:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

## 5. แก้ไข Email Sender ใน `src/lib/email.ts`

หากใช้ domain ของคุณเอง แก้ไข `from` ใน `src/lib/email.ts`:

```typescript
from: 'Khun Daeng Garden <noreply@yourdomain.com>',
```

หากใช้ testing domain:

```typescript
from: 'Khun Daeng Garden <onboarding@resend.dev>',
```

## 6. ทดสอบ

1. เปิดหน้า `/forgot-password`
2. กรอกอีเมลของคุณ (ต้องเป็นอีเมลที่ยืนยันใน Resend แล้วถ้าใช้ testing domain)
3. ตรวจสอบอีเมล
4. คลิกลิงก์และรีเซ็ตรหัสผ่าน

## Pricing

- **Free Tier:** 3,000 emails/month, 100 emails/day
- เพียงพอสำหรับ development และ small production apps

## หมายเหตุ

- API Key เริ่มต้นด้วย `re_`
- อย่าเผยแพร่ API Key ของคุณใน public repositories
- ใช้ `.gitignore` เพื่อไม่ให้ commit `.env` ไฟล์
