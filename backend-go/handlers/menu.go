package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"meal-kits-go/database"
	"meal-kits-go/models"
)

// GetMenus - GET /menus → ดึงเมนูทั้งหมดที่ isActive = true
func GetMenus(c *gin.Context) {
	var menus []models.Menu

	result := database.DB.Where("is_active = ?", true).Find(&menus)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, menus)
}

// GetMenuByID - GET /menus/:id → ดึงเมนูตาม ID
func GetMenuByID(c *gin.Context) {
	id := c.Param("id")
	var menu models.Menu

	result := database.DB.First(&menu, "id = ?", id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu not found"})
		return
	}

	c.JSON(http.StatusOK, menu)
}

// GetMenuBySlug - GET /menus/slug/:slug → ดึงเมนูตาม slug
func GetMenuBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var menu models.Menu

	result := database.DB.First(&menu, "slug = ?", slug)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu not found"})
		return
	}

	c.JSON(http.StatusOK, menu)
}
