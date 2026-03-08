package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
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

	fmt.Println("Running test for:", job.URL)

	var wg sync.WaitGroup

	for i := 0; i < job.Requests; i++ {

		wg.Add(1)

		go func() {

			defer wg.Done()

			start := time.Now()

			resp, err := http.Get(job.URL)

			if err != nil {
				return
			}

			resp.Body.Close()

			duration := time.Since(start)

			fmt.Println("Response time:", duration)
		}()
	}

	wg.Wait()

	fmt.Println("Test completed")
}
