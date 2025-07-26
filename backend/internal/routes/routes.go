package routes

import (
	"github.com/divin3circle/hashrexa/backend/internal/app"
	"github.com/go-chi/chi/v5"
)

func SetUpRoutes(app *app.Application) *chi.Mux {
	r := chi.NewRouter()

	// app routes
	r.Get("/health", app.HealthCheck)

	// user routes
	r.Post("/auth/register/{userAccountId}/{topicId}", app.UserHandler.HandleRegisterUser)

	return r
}