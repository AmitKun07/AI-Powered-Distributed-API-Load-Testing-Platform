package main

import (
	"context"
	"encoding/json"
	"net/http"

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
	Addr: "localhost:6379",
})

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

	jobData, _ := json.Marshal(req)

	rdb.RPush(ctx, "loadtest_jobs", jobData)

	c.JSON(http.StatusOK, gin.H{
		"message": "Test job queued",
	})
}
