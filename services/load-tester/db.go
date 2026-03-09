package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

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

	fmt.Println("Connected to PostgreSQL")
}
