package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Menu คือโมเดลสำหรับตาราง menus ใน PostgreSQL
// ตรงกับ menu.entity.ts ของ NestJS
type Menu struct {
	ID          string   `gorm:"primaryKey;type:uuid" json:"id"`
	Name        string   `gorm:"not null" json:"name"`
	Slug        string   `gorm:"not null;unique" json:"slug"`
	Description string   `gorm:"type:text;not null" json:"description"`
	Price       int      `gorm:"not null" json:"price"`
	Image       string   `gorm:"not null" json:"image"`
	PrepTime    string   `gorm:"not null" json:"prepTime"`
	Ingredients []string `gorm:"type:jsonb;serializer:json;not null" json:"ingredients"`
	Category    string   `gorm:"not null" json:"category"` // อาหารไทย, ตะวันตก, สุขภาพ
	IsActive    bool     `gorm:"default:true" json:"isActive"`
}

// BeforeCreate - สร้าง UUID อัตโนมัติก่อน Insert
func (m *Menu) BeforeCreate(tx *gorm.DB) error {
	if m.ID == "" {
		m.ID = uuid.New().String()
	}
	return nil
}
