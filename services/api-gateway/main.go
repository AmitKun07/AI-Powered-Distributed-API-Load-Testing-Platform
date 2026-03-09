package main

import (
	"context"
	"encoding/json"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type TestRequest struct {
	URL         string `json:"url"`
	Requests    int    `json:"requests"`
	Concurrency int    `json:"concurrency"`
}

var ctx = context.Background()

var rdb = redis.NewClient(&redis.Options{
	Addr: "redis:6379",
})

func main() {

	router := gin.Default()

	router.POST("/test", startTest)

	router.Run(":8080")
}

func startTest(c *gin.Context) {

	var req TestRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	data, _ := json.Marshal(req)

	rdb.RPush(ctx, "loadtest_jobs", data)

	c.JSON(200, gin.H{
		"message": "Job added to queue",
	})
}
