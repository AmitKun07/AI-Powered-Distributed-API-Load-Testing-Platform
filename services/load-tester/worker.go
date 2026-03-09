package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"time"

	"github.com/segmentio/kafka-go"
)

type TestRequest struct {
	URL         string
	Requests    int
	Concurrency int
}

type Metric struct {
	URL           string  `json:"url"`
	TotalRequests int     `json:"total_requests"`
	AvgLatency    float64 `json:"avg_latency"`
	P95Latency    float64 `json:"p95_latency"`
	RPS           float64 `json:"rps"`
}

var ctx = context.Background()

// Kafka consumer for load test jobs
var reader = kafka.NewReader(kafka.ReaderConfig{
	Brokers: []string{"kafka:9092"},
	Topic:   "loadtest-jobs",
	GroupID: "workers",
})

// Kafka producer for metrics
var metricsWriter = kafka.NewWriter(kafka.WriterConfig{
	Brokers: []string{"kafka:9092"},
	Topic:   "metrics",
})

func main() {

	fmt.Println("Worker started")

	for {

		msg, err := reader.ReadMessage(ctx)
		if err != nil {
			fmt.Println("Kafka read error:", err)
			continue
		}

		var job TestRequest

		err = json.Unmarshal(msg.Value, &job)
		if err != nil {
			fmt.Println("JSON error:", err)
			continue
		}

		runLoadTest(job)
	}
}

func runLoadTest(job TestRequest) {

	fmt.Println("Starting load test for:", job.URL)

	jobs := make(chan int, job.Requests)
	results := make(chan time.Duration, job.Requests)

	startTime := time.Now()

	// Start goroutines
	for w := 0; w < job.Concurrency; w++ {
		go worker(job.URL, jobs, results)
	}

	for i := 0; i < job.Requests; i++ {
		jobs <- i
	}

	close(jobs)

	var durations []time.Duration

	for i := 0; i < job.Requests; i++ {
		d := <-results
		durations = append(durations, d)
	}

	totalTime := time.Since(startTime)

	calculateMetrics(job.URL, durations, totalTime)
}

func worker(url string, jobs <-chan int, results chan<- time.Duration) {

	for range jobs {

		start := time.Now()

		resp, err := http.Get(url)

		if err != nil {
			results <- 0
			continue
		}

		resp.Body.Close()

		duration := time.Since(start)

		results <- duration
	}
}

func calculateMetrics(url string, durations []time.Duration, totalTime time.Duration) {

	var totalLatency time.Duration
	var successRequests int

	for _, d := range durations {

		if d > 0 {
			totalLatency += d
			successRequests++
		}
	}

	avgLatency := totalLatency / time.Duration(successRequests)

	rps := float64(len(durations)) / totalTime.Seconds()

	sort.Slice(durations, func(i, j int) bool {
		return durations[i] < durations[j]
	})

	p95Index := int(float64(len(durations)) * 0.95)
	p95Latency := durations[p95Index]

	fmt.Println("\n------ Load Test Results ------")
	fmt.Println("Total Requests:", len(durations))
	fmt.Println("Successful Requests:", successRequests)
	fmt.Println("Average Latency:", avgLatency)
	fmt.Println("P95 Latency:", p95Latency)
	fmt.Println("Requests/sec:", rps)
	fmt.Println("--------------------------------\n")

	sendMetrics(url, len(durations), avgLatency.Seconds(), p95Latency.Seconds(), rps)
}

func sendMetrics(url string, totalRequests int, avg float64, p95 float64, rps float64) {

	metric := Metric{
		URL:           url,
		TotalRequests: totalRequests,
		AvgLatency:    avg,
		P95Latency:    p95,
		RPS:           rps,
	}

	data, _ := json.Marshal(metric)

	err := metricsWriter.WriteMessages(ctx, kafka.Message{
		Value: data,
	})

	if err != nil {
		fmt.Println("Kafka metrics send error:", err)
		return
	}

	fmt.Println("Metrics sent to Kafka")
}
