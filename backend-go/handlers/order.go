package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"meal-kits-go/database"
	"meal-kits-go/models"
)

// CreateOrderRequest คือ struct สำหรับรับข้อมูลจาก Request Body
type CreateOrderRequest struct {
	OrderType         string             `json:"orderType"`
	DeliveryFrequency *string            `json:"deliveryFrequency"`
	Items             []models.OrderItem `json:"items" binding:"required"`
	UserID            *string            `json:"userId"`
	CustomerName      string             `json:"customerName" binding:"required"`
	CustomerPhone     string             `json:"customerPhone" binding:"required"`
	ShippingAddress   string             `json:"shippingAddress" binding:"required"`
	TotalPrice        int                `json:"totalPrice" binding:"required"`
	PaymentMethod     string             `json:"paymentMethod"`
	PaymentSlipUrl    *string            `json:"paymentSlipUrl"`
}

// GetAllOrders - GET /orders → ดึงออเดอร์ทั้งหมด (เรียงล่าสุดก่อน)
func GetAllOrders(c *gin.Context) {
	var orders []models.Order

	result := database.DB.Order("created_at DESC").Find(&orders)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

// GetOrdersByUser - GET /orders/user/:userId → ดึงออเดอร์ของ user คนนึง
func GetOrdersByUser(c *gin.Context) {
	userID := c.Param("userId")
	var orders []models.Order

	result := database.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&orders)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

// GetOrderByID - GET /orders/:id → ดึงออเดอร์ตาม ID
func GetOrderByID(c *gin.Context) {
	id := c.Param("id")
	var order models.Order

	result := database.DB.First(&order, "id = ?", id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, order)
}

// CreateOrder - POST /orders → สร้างออเดอร์ใหม่
func CreateOrder(c *gin.Context) {
	var req CreateOrderRequest

	// รับและ validate ข้อมูลจาก Body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// กำหนดค่า default
	orderType := req.OrderType
	if orderType == "" {
		orderType = "one-time"
	}

	paymentMethod := req.PaymentMethod
	if paymentMethod == "" {
		paymentMethod = "สแกน QR พร้อมเพย์"
	}

	// สร้าง Order object
	order := models.Order{
		OrderType:         orderType,
		DeliveryFrequency: req.DeliveryFrequency,
		Items:             req.Items,
		UserID:            req.UserID,
		CustomerName:      req.CustomerName,
		CustomerPhone:     req.CustomerPhone,
		ShippingAddress:   req.ShippingAddress,
		Status:            "รอดำเนินการ",
		TotalPrice:        req.TotalPrice,
		PaymentMethod:     paymentMethod,
		PaymentSlipUrl:    req.PaymentSlipUrl,
		IsReviewed:        false,
	}

	// บันทึกลง Database
	result := database.DB.Create(&order)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, order)
}

// UpdateOrderStatus - PATCH /orders/:id/status → อัพเดทสถานะออเดอร์
func UpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")

	var body struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Model(&models.Order{}).Where("id = ?", id).Update("status", body.Status)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}
