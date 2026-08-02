package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// OrderItem คือ struct สำหรับแต่ละรายการในออเดอร์
type OrderItem struct {
	MenuID   string  `json:"menuId"`
	MenuName string  `json:"menuName"`
	Servings int     `json:"servings"`
	Price    float64 `json:"price"`
	Quantity int     `json:"quantity"`
}

// Order คือโมเดลสำหรับตาราง orders ใน PostgreSQL
// ตรงกับ order.entity.ts ของ NestJS
type Order struct {
	ID                string      `gorm:"primaryKey;type:varchar" json:"id"`
	OrderType         string      `gorm:"default:one-time" json:"orderType"`                          // one-time, subscription
	DeliveryFrequency *string     `gorm:"type:varchar" json:"deliveryFrequency,omitempty"`            // เฉพาะ subscription
	Items             []OrderItem `gorm:"type:jsonb;serializer:json;default:'[]'" json:"items"`        // รายการสินค้า
	UserID            *string     `gorm:"type:varchar" json:"userId,omitempty"`                       // ถ้า login
	CustomerName      string      `gorm:"not null" json:"customerName"`
	CustomerPhone     string      `gorm:"not null" json:"customerPhone"`
	ShippingAddress   string      `gorm:"type:text;not null" json:"shippingAddress"`
	Status            string      `gorm:"not null" json:"status"`                                      // รอดำเนินการ, กำลังจัดเตรียม, จัดส่งแล้ว
	TotalPrice        int         `gorm:"not null" json:"totalPrice"`
	PaymentMethod     string      `gorm:"default:'สแกน QR พร้อมเพย์'" json:"paymentMethod"`
	PaymentSlipUrl    *string     `gorm:"type:text" json:"paymentSlipUrl,omitempty"`
	IsReviewed        bool        `gorm:"default:false" json:"isReviewed"`
	CreatedAt         time.Time   `json:"createdAt"`
}

// BeforeCreate - สร้าง UUID อัตโนมัติก่อน Insert
func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.ID == "" {
		o.ID = uuid.New().String()
	}
	return nil
}
