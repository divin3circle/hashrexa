package app

import (
	"fmt"
	"log"
	"net/http"
	"os"

	badger "github.com/dgraph-io/badger/v4"
	"github.com/divin3circle/hashrexa/backend/internal/api"
	"github.com/divin3circle/hashrexa/backend/internal/store"
)

type Application struct {
	Logger *log.Logger
	UserHandler *api.UserHandler
	DB *badger.DB
}

func NewApplication() (*Application, error) {
	db, err := store.Open("/tmp/badgerdb")
	if err != nil {
		return nil, err
	}
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	app := &Application{
		Logger: logger,
		UserHandler: api.NewUserHandler(),
		DB: db,
	}

	return app, nil
}

func (a *Application) HealthCheck(w http.ResponseWriter, r *http.Request){
	fmt.Fprint(w, "Status: Available\n")
}