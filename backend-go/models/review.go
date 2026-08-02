package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Review คือโมเดลสำหรับตาราง reviews ใน PostgreSQL
type Review struct {
	ID        string    `gorm:"primaryKey;type:uuid" json:"id"`
	UserID    *string   `gorm:"type:varchar" json:"userId,omitempty"`
	UserName  string    `gorm:"not null" json:"userName"`
	Role      string    `gorm:"not null" json:"role"`
	Image     string    `gorm:"not null" json:"image"`
	Rating    int       `gorm:"not null" json:"rating"`
	Review    string    `gorm:"type:text;not null" json:"review"`
	MenuNames *string   `gorm:"type:text" json:"menuNames,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
}

func (r *Review) BeforeCreate(tx *gorm.DB) error {
	if r.ID == "" {
		r.ID = uuid.New().String()
	}
	return nil
}
