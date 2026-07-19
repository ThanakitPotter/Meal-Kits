# 🍳 MK340 Meal Kits Platform

แพลตฟอร์มสั่งซื้อชุดอาหารพร้อมทำ (Meal Kits) ส่งตรงถึงบ้านคุณ ที่ถูกออกแบบมาให้ใช้งานง่าย ดีไซน์พรีเมียม และมีระบบจัดการหลังบ้าน (Admin Dashboard) อย่างครบถ้วน

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

โปรเจกต์นี้ถูกแบ่งออกเป็น 2 ส่วนหลักคือ Frontend และ Backend:

### Frontend (ระบบหน้าเว็บ)
- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **State Management:** React Context API (CartContext)
- **Deployment:** [Vercel](https://vercel.com/)
- **UI/UX:** โทนสี Clean & Premium (สีเหลืองมัสตาร์ด และ สีเทาเข้ม) เน้นการแสดงภาพอาหารให้ดูน่ารับประทาน และรองรับ Mobile Responsive 100%

### Backend (ระบบ API)
- **Framework:** [NestJS 11](https://nestjs.com/)
- **Language:** TypeScript
- **Database:** PostgreSQL โฮสต์บน [Supabase](https://supabase.com/) (รองรับ Connection Pooling สำหรับ IPv4/IPv6)
- **ORM:** TypeORM
- **Security:** ระบบ Authentication ด้วย JWT (JSON Web Token) และ bcrypt สำหรับการเข้ารหัสรหัสผ่าน
- **Deployment:** [Render](https://render.com/)

---

## 💡 ฟีเจอร์ที่พัฒนาแล้ว (Completed Features)

### 🛒 สำหรับลูกค้า (Customer Features)
- **ระบบสมาชิก:** 
  - สมัครสมาชิกใหม่พร้อมแถบวัดระดับความปลอดภัยของรหัสผ่าน (Password Strength)
  - เข้าสู่ระบบ (Login) ด้วยอีเมลและรหัสผ่าน
- **แคตตาล็อกเมนู:** แสดงรายการเมนู Meal Kits หมวดหมู่ต่างๆ พร้อมรูปภาพ วัตถุดิบ และเวลาเตรียมอาหาร
- **ระบบตะกร้าสินค้า (Cart):**
  - เลือกเมนูและระบุจำนวนผู้ทานได้ (1 ท่าน, 2 ท่าน, หรือ 4 ท่านแบบครอบครัว) พร้อมคำนวณราคาที่คุ้มค่ากว่าให้อัตโนมัติ
  - เพิ่ม/ลด จำนวนสินค้าในตะกร้า
  - **เงื่อนไขบังคับเข้าสู่ระบบ:** หากยังไม่ได้เข้าสู่ระบบ เมื่อกดปุ่ม "สั่งซื้อชุดนี้" ระบบจะแสดง Popup แจ้งเตือนให้เข้าสู่ระบบก่อน
- **ระบบชำระเงิน (Checkout):** ยืนยันคำสั่งซื้อพร้อมระบบคำนวณราคาสุทธิ
- **ประวัติการสั่งซื้อ (Order History):** ลูกค้าสามารถตรวจสอบสถานะคำสั่งซื้อของตนเองได้ (รอดำเนินการ, กำลังจัดเตรียม, จัดส่งแล้ว)

### 🛡️ สำหรับผู้ดูแลระบบ (Admin Features)
- **ระบบเข้าสู่ระบบสำหรับ Admin:** แยกระบบล็อกอินเฉพาะสำหรับพนักงาน (Admin Login)
- **แอดมินแดชบอร์ด (Admin Dashboard):** 
  - ดูรายการออเดอร์ทั้งหมดจากลูกค้า
  - สรุปรายได้และสถิติคำสั่งซื้อ
  - กดเปลี่ยนสถานะการจัดส่งได้ทันที (Status Tracking)

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. โคลนโปรเจกต์
```bash
git clone https://github.com/ThanakitPotter/Meal-Kits.git
cd "Meal Kits"
```

### 2. รัน Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
> API จะรันอยู่ที่: `http://localhost:3001` (ต้องตั้งค่า `.env` สำหรับเชื่อมต่อฐานข้อมูล Supabase ก่อน)

### 3. รัน Frontend (Next.js)
ให้เปิดอีก Terminal หนึ่งแล้วรันคำสั่งต่อไปนี้:
```bash
cd frontend
npm install
npm run dev
```
> เว็บไซต์จะรันอยู่ที่: `http://localhost:3000` (ต้องตั้งค่า `.env` สำหรับชี้ไปยัง API)

---

## 👥 ผู้พัฒนา (Developers)

พัฒนาโดยทีมงาน **MK340**
