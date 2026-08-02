# 🍱 Meal Kits — Go Backend

Backend เขียนด้วย **Golang** เชื่อมต่อ **PostgreSQL (Supabase)** ด้วย **GORM**

## 🔧 Tech Stack

| เครื่องมือ | วัตถุประสงค์ |
|---|---|
| **Go 1.22** | ภาษาหลัก |
| **Gin** | HTTP Framework (เหมือน Express.js) |
| **GORM** | ORM (เหมือน TypeORM ของ NestJS) |
| **PostgreSQL** | ฐานข้อมูล (Supabase) |
| **godotenv** | โหลด .env file |

## 📁 โครงสร้างไฟล์

```
backend-go/
├── main.go              # Entry point + Router
├── go.mod               # Dependencies
├── .env                 # Environment variables
├── database/
│   └── db.go            # เชื่อม PostgreSQL
├── models/
│   ├── menu.go          # Menu struct
│   ├── order.go         # Order struct
│   └── review.go        # Review struct
└── handlers/
    ├── menu.go          # /menus endpoints
    ├── order.go         # /orders endpoints
    └── review.go        # /reviews endpoints
```

## 🚀 วิธีรัน

### 1. ติดตั้ง Go
ดาวน์โหลดที่ https://go.dev/dl/

### 2. ติดตั้ง Dependencies
```bash
cd backend-go
go mod tidy
```

### 3. รัน Server
```bash
go run main.go
```

Server จะรันที่ `http://localhost:3001`

## 📋 API Endpoints

| Method | Path | คำอธิบาย |
|---|---|---|
| GET | `/` | Health check |
| GET | `/menus` | ดึงเมนูทั้งหมด |
| GET | `/menus/:id` | ดึงเมนูตาม ID |
| GET | `/menus/slug/:slug` | ดึงเมนูตาม slug |
| GET | `/orders` | ดึงออเดอร์ทั้งหมด |
| POST | `/orders` | สร้างออเดอร์ใหม่ |
| GET | `/orders/:id` | ดึงออเดอร์ตาม ID |
| GET | `/orders/user/:userId` | ดึงออเดอร์ตาม User |
| PATCH | `/orders/:id/status` | อัพเดทสถานะ |
| GET | `/reviews` | ดึง reviews ล่าสุด |
| POST | `/reviews` | สร้าง review ใหม่ |

## 🔄 เปรียบเทียบกับ NestJS Backend

| NestJS (เดิม) | Go (ใหม่) |
|---|---|
| `@Entity()` class | `struct` + GORM tags |
| `TypeORM Repository` | `gorm.DB` |
| `@Injectable()` Service | `handlers` package |
| `@Controller()` | `gin.RouterGroup` |
| `class-validator` | `binding:""` tags |
