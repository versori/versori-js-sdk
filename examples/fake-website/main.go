package main

import (
	"fakeclientwebsite/handlers"
	"fmt"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	handlers.NewHandlers()

	mux.HandleFunc("GET /", handlers.Repo.Root)
	mux.HandleFunc("GET /home", handlers.Repo.Home)
	mux.HandleFunc("POST /login", handlers.Repo.Login)
	mux.HandleFunc("POST /signup", handlers.Repo.Signup)

	srv := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	fmt.Println("Starting server on :8080")

	err := srv.ListenAndServe()
	if err != nil {
		panic(err)
	}
}
