package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"meal-kits-go/database"
	"meal-kits-go/models"
)

// GetReviews - GET /reviews → ดึง reviews ล่าสุด 15 รายการ
func GetReviews(c *gin.Context) {
	var reviews []models.Review

	result := database.DB.Order("created_at DESC").Limit(15).Find(&reviews)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, reviews)
}

// CreateReviewRequest struct สำหรับรับข้อมูล review
type CreateReviewRequest struct {
	UserID  *string `json:"userId"`
	OrderID *string `json:"orderId"`
	Rating  int     `json:"rating" binding:"required,min=1,max=5"`
	Review  string  `json:"review" binding:"required"`
}

// CreateReview - POST /reviews → สร้าง review ใหม่
func CreateReview(c *gin.Context) {
	var req CreateReviewRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่ามี order ก่อน
	var order models.Order
	if req.OrderID != nil {
		database.DB.First(&order, "id = ?", *req.OrderID)
	} else if req.UserID != nil {
		database.DB.Where("user_id = ?", *req.UserID).First(&order)
	}

	if order.ID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order not found or user has no orders"})
		return
	}

	// ดึงชื่อเมนูจาก order items
	menuNames := ""
	for i, item := range order.Items {
		if i > 0 {
			menuNames += ", "
		}
		menuNames += item.MenuName
	}

	// สร้าง image default ถ้าไม่มี
	image := fmt.Sprintf("https://i.pravatar.cc/150?u=%s", order.CustomerName)
	userName := order.CustomerName
	role := "ลูกค้า"

	review := models.Review{
		UserID:    req.UserID,
		UserName:  userName,
		Role:      role,
		Image:     image,
		Rating:    req.Rating,
		Review:    req.Review,
		MenuNames: &menuNames,
	}

	result := database.DB.Create(&review)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, review)
}
