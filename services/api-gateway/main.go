package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type TestRequest struct {
	URL         string `json:"url"`
	Requests    int    `json:"requests"`
	Concurrency int    `json:"concurrency"`
}

func main() {

	router := gin.Default()

	router.POST("/test", startTest)

	router.Run(":8080")
}

func startTest(c *gin.Context) {

	var req TestRequest

	if err := c.ShouldBindJSON(&req); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Test received",
		"url":     req.URL,
	})
}
