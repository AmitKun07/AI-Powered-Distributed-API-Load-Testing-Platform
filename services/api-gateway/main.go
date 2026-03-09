package main

import (
	"context"
	"database/sql"
	"encoding/json"

	// "net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/segmentio/kafka-go"
)

var writer = kafka.NewWriter(kafka.WriterConfig{
	Brokers: []string{"kafka:9092"},
	Topic:   "loadtest-jobs",
})

type TestRequest struct {
	URL         string `json:"url"`
	Requests    int    `json:"requests"`
	Concurrency int    `json:"concurrency"`
}

var ctx = context.Background()

var db *sql.DB

func initDB() {

	connStr := "host=postgres port=5432 user=admin password=admin dbname=loadtest sslmode=disable"

	var err error

	db, err = sql.Open("postgres", connStr)

	if err != nil {
		panic(err)
	}

	err = db.Ping()

	if err != nil {
		panic(err)
	}
}

func main() {

	router := gin.Default()

	initDB()

	router.POST("/test", startTest)
	router.GET("/results", getResults)
	router.Run(":8080")
}

func startTest(c *gin.Context) {

	var req TestRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	data, _ := json.Marshal(req)

	err := writer.WriteMessages(context.Background(),
		kafka.Message{
			Value: data,
		},
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to queue job"})
		return
	}

	c.JSON(200, gin.H{
		"message": "Job added to queue",
	})
}

func getResults(c *gin.Context) {

	rows, err := db.Query(`
	SELECT id, url, total_requests, avg_latency, p95_latency, rps
	FROM test_results
	ORDER BY id DESC
	`)

	if err != nil {
		c.JSON(500, gin.H{"error": "database error"})
		return
	}

	defer rows.Close()

	var results []map[string]interface{}

	for rows.Next() {

		var id int
		var url string
		var totalRequests int
		var avgLatency float64
		var p95Latency float64
		var rps float64

		rows.Scan(&id, &url, &totalRequests, &avgLatency, &p95Latency, &rps)

		result := map[string]interface{}{
			"id":             id,
			"url":            url,
			"total_requests": totalRequests,
			"avg_latency":    avgLatency,
			"p95_latency":    p95Latency,
			"rps":            rps,
		}

		results = append(results, result)
	}

	c.JSON(200, results)
}
