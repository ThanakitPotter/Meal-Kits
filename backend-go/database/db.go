package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"meal-kits-go/models"
)

var DB *gorm.DB

// Connect เชื่อมต่อ PostgreSQL และ Auto Migrate ตาราง
func Connect() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("❌ DATABASE_URL is not set in .env")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// Auto-migrate: สร้างตารางอัตโนมัติถ้ายังไม่มี
	err = db.AutoMigrate(&models.Menu{}, &models.Order{}, &models.Review{})
	if err != nil {
		log.Fatal("❌ Failed to auto migrate:", err)
	}

	DB = db
	fmt.Println("✅ Connected to PostgreSQL (Supabase) successfully!")
}
