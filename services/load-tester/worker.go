package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"time"

	"github.com/redis/go-redis/v9"
)

type TestRequest struct {
	URL         string
	Requests    int
	Concurrency int
}

var ctx = context.Background()

var rdb = redis.NewClient(&redis.Options{
	Addr: "localhost:6379",
})

func main() {

	fmt.Println("Worker started")

	initDB()

	for {

		result, err := rdb.BLPop(ctx, 0*time.Second, "loadtest_jobs").Result()

		if err != nil {
			continue
		}

		var job TestRequest

		json.Unmarshal([]byte(result[1]), &job)

		runLoadTest(job)
	}
}

func runLoadTest(job TestRequest) {

	fmt.Println("Starting load test for:", job.URL)

	jobs := make(chan int, job.Requests)
	results := make(chan time.Duration, job.Requests)

	startTime := time.Now()

	// Start workers
	for w := 0; w < job.Concurrency; w++ {
		go worker(job.URL, jobs, results)
	}

	// Send jobs
	for i := 0; i < job.Requests; i++ {
		jobs <- i
	}

	close(jobs)

	// Collect results
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

	// Calculate requests per second
	rps := float64(len(durations)) / totalTime.Seconds()

	// Sort durations for percentile
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
	saveResults(url, len(durations), avgLatency.Seconds(), p95Latency.Seconds(), rps)
}

func saveResults(url string, totalRequests int, avg float64, p95 float64, rps float64) {

	query := `
	INSERT INTO test_results (url, total_requests, avg_latency, p95_latency, rps)
	VALUES ($1,$2,$3,$4,$5)
	`

	_, err := db.Exec(query, url, totalRequests, avg, p95, rps)

	if err != nil {
		fmt.Println("DB error:", err)
		return
	}

	fmt.Println("Results saved to database")
}
