package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"

	_ "github.com/lib/pq"
	"github.com/segmentio/kafka-go"
)

type Metric struct {
	URL           string
	TotalRequests int
	AvgLatency    float64
	P95Latency    float64
	RPS           float64
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

	fmt.Println("Metrics processor started")

	initDB()

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"kafka:9092"},
		Topic:   "metrics",
		GroupID: "metrics-processor",
	})

	for {

		msg, err := reader.ReadMessage(ctx)

		if err != nil {
			fmt.Println("Kafka error:", err)
			continue
		}

		var metric Metric

		err = json.Unmarshal(msg.Value, &metric)

		if err != nil {
			fmt.Println("JSON error:", err)
			continue
		}

		saveMetric(metric)
	}
}

func saveMetric(m Metric) {

	query := `
	INSERT INTO test_results (url, total_requests, avg_latency, p95_latency, rps)
	VALUES ($1,$2,$3,$4,$5)
	`

	_, err := db.Exec(query,
		m.URL,
		m.TotalRequests,
		m.AvgLatency,
		m.P95Latency,
		m.RPS,
	)

	if err != nil {
		fmt.Println("DB error:", err)
		return
	}

	fmt.Println("Metrics saved:", m.URL)
}
