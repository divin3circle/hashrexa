package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/divin3circle/hashrexa/backend/internal/app"
	"github.com/divin3circle/hashrexa/backend/internal/routes"
)

func main() {
	var port int
	flag.IntVar(&port, "port", 8080, "Port to listen on")
	flag.Parse()

	app, err := app.NewApplication()

	if err != nil {
		log.Fatalf("Failed to create application: %v", err)
		panic(err)
	}

	acc, err := app.Alpaca.GetAccount()
	if err != nil {
		log.Fatalf("Failed to get account: %v", err)
		panic(err)
	}

	fmt.Println(acc)
	defer app.DB.Close()

	r := routes.SetUpRoutes(app)
	server := &http.Server{
		Addr: fmt.Sprintf(":%d", port),
		Handler: r,
		IdleTimeout: time.Minute,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 40 * time.Second,
	}

	app.Logger.Printf("Starting server on port %d", port)

	err = server.ListenAndServe()

	if err != nil {
		app.Logger.Fatal(err)
	}
}