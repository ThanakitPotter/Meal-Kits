# 🍳 MK340 Meal Kits Platform

แพลตฟอร์มสั่งซื้อชุดอาหารพร้อมทำ (Meal Kits) ส่งตรงถึงบ้านคุณ ที่ถูกออกแบบมาให้ใช้งานง่าย ดีไซน์พรีเมียม และมีระบบจัดการหลังบ้าน (Admin Dashboard) อย่างครบถ้วน

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

โปรเจกต์นี้ถูกแบ่งออกเป็น 2 ส่วนหลักคือ Frontend และ Backend:

### Frontend (ระบบหน้าบ้าน)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI/UX:** โทนสี Clean & Premium (สีเหลืองมัสตาร์ด และ สีเทาเข้ม) เน้นการแสดงภาพอาหารให้ดูน่ารับประทาน
- **Fonts:** Noto Sans Thai และ Inter

### Backend (ระบบหลังบ้าน)
- **Framework:** [NestJS 11](https://nestjs.com/)
- **Language:** TypeScript
- **Database:** ปัจจุบันใช้ In-memory Mock Data (พร้อมสำหรับการเชื่อมต่อ MongoDB ในเฟสถัดไป)

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. โคลนโปรเจกต์
```bash
git clone <your-repository-url>
cd "Meal Kits"
```

### 2. รัน Backend (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
> API จะรันอยู่ที่: `http://localhost:3001`

### 3. รัน Frontend (Next.js)
ให้เปิดอีก Terminal หนึ่งแล้วรันคำสั่งต่อไปนี้:
```bash
cd frontend
npm install
npm run dev
```
> เว็บไซต์จะรันอยู่ที่: `http://localhost:3000`

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
Meal Kits/
├── backend/                  # ระบบ API สำหรับจัดการข้อมูล
│   ├── src/
│   │   ├── menus/            # จัดการข้อมูลเมนูอาหาร (ดึงข้อมูล, ค้นหา)
│   │   └── orders/           # จัดการคำสั่งซื้อ (สร้างออเดอร์, อัปเดตสถานะ)
│   └── .env                  # ตั้งค่าพอร์ตและฐานข้อมูล
│
└── frontend/                 # ระบบหน้าเว็บแอปพลิเคชัน
    ├── src/
    │   ├── app/
    │   │   ├── admin/        # แดชบอร์ดสำหรับแอดมินดูคำสั่งซื้อ
    │   │   ├── order/[id]/   # หน้าจอสำหรับกดสั่งซื้อและเลือกจำนวนคน
    │   │   └── page.tsx      # หน้าหลักแสดงรายการเมนู
    │   ├── components/       # UI Components เช่น Navbar
    │   └── types.ts          # TypeScript interfaces (Menu, Order)
    ├── public/images/        # รูปภาพเมนูอาหาร (AI-generated)
    └── .env                  # ตั้งค่า API URL
```

---

## 💡 ฟีเจอร์หลัก (Key Features)

- **หน้าแคตตาล็อกเมนู:** แสดงรายการเมนู Meal Kits พร้อมรูปภาพ วัตถุดิบ และเวลาเตรียมอาหาร
- **ระบบสั่งอาหาร:** เลือกระบุจำนวนผู้ทานได้ (1 ท่าน หรือ 2 ท่าน) โดยระบบจะคำนวณราคาที่คุ้มค่ากว่าให้อัตโนมัติ
- **ระบบแอดมิน (Admin Dashboard):** หน้าจอสำหรับพนักงานในการดูรายการออเดอร์ทั้งหมด สรุปรายได้ และกดเปลี่ยนสถานะการจัดส่ง (รอดำเนินการ -> กำลังจัดเตรียม -> จัดส่งแล้ว)
- **Responsive Design:** รองรับการใช้งานทั้งบนคอมพิวเตอร์และโทรศัพท์มือถือ

---

## 👥 ผู้พัฒนา (Developers)

พัฒนาโดยทีมงาน **MK340**
