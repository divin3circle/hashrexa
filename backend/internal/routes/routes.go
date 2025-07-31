package routes

import (
	"net/http"

	"github.com/divin3circle/hashrexa/backend/internal/app"
	"github.com/go-chi/chi/v5"
)

func SetUpRoutes(app *app.Application) *chi.Mux {
	r := chi.NewRouter()

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			
			next.ServeHTTP(w, r)
		})
	})

	// app routes
	r.Get("/health", app.HealthCheck)

	// user routes
	r.Post("/auth/register/{userAccountId}/{topicId}", app.UserHandler.HandleRegisterUser)
	r.Get("/topics/exists/{userAccountId}", app.UserHandler.HandleCheckTopicExists)
	r.Get("/positions", app.UserHandler.HandlerGetUserAlpacaPositions)

	return r
}