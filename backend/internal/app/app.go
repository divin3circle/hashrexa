package app

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/divin3circle/hashrexa/backend/internal/api"
)

type Application struct {
	Logger *log.Logger
	UserHandler *api.UserHandler
}

func NewApplication() (*Application, error) {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	app := &Application{
		Logger: logger,
		UserHandler: api.NewUserHandler(),
	}

	return app, nil
}

func (a *Application) HealthCheck(w http.ResponseWriter, r *http.Request){
	fmt.Fprint(w, "Status: Available\n")
}