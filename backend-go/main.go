package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"meal-kits-go/database"
	"meal-kits-go/handlers"
)

func main() {
	// โหลด .env file
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No .env file found, using system environment variables")
	}

	// เชื่อมต่อ Database (PostgreSQL บน Supabase)
	database.Connect()

	// สร้าง Gin router
	router := gin.Default()

	// =============================
	// CORS - อนุญาต Frontend เรียก API
	// =============================
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// =============================
	// Health Check
	// =============================
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "🍱 Meal Kits Go Backend is running!",
			"version": "1.0.0",
		})
	})

	// =============================
	// Menus Routes
	// =============================
	menus := router.Group("/menus")
	{
		menus.GET("", handlers.GetMenus)            // GET /menus
		menus.GET("/slug/:slug", handlers.GetMenuBySlug) // GET /menus/slug/:slug
		menus.GET("/:id", handlers.GetMenuByID)     // GET /menus/:id
	}

	// =============================
	// Orders Routes
	// =============================
	orders := router.Group("/orders")
	{
		orders.GET("", handlers.GetAllOrders)                     // GET /orders
		orders.GET("/user/:userId", handlers.GetOrdersByUser)     // GET /orders/user/:userId
		orders.GET("/:id", handlers.GetOrderByID)                 // GET /orders/:id
		orders.POST("", handlers.CreateOrder)                     // POST /orders
		orders.PATCH("/:id/status", handlers.UpdateOrderStatus)   // PATCH /orders/:id/status
	}

	// =============================
	// Reviews Routes
	// =============================
	reviews := router.Group("/reviews")
	{
		reviews.GET("", handlers.GetReviews)     // GET /reviews
		reviews.POST("", handlers.CreateReview)  // POST /reviews
	}

	// เริ่ม Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	fmt.Printf("\n🚀 Go Backend running on http://localhost:%s\n", port)
	fmt.Println("📋 Available endpoints:")
	fmt.Println("   GET  /menus")
	fmt.Println("   GET  /menus/:id")
	fmt.Println("   GET  /menus/slug/:slug")
	fmt.Println("   GET  /orders")
	fmt.Println("   POST /orders")
	fmt.Println("   GET  /orders/:id")
	fmt.Println("   GET  /orders/user/:userId")
	fmt.Println("   PATCH /orders/:id/status")
	fmt.Println("   GET  /reviews")
	fmt.Println("   POST /reviews")

	log.Fatal(router.Run(":" + port))
}
