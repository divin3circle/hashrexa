package app

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
	badger "github.com/dgraph-io/badger/v4"
	"github.com/divin3circle/hashrexa/backend/internal/api"
	"github.com/divin3circle/hashrexa/backend/internal/store"
	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
	"github.com/joho/godotenv"
)

type Application struct {
	Logger *log.Logger
	UserHandler *api.UserHandler
	DB *badger.DB
	Client *hiero.Client
	Alpaca *alpaca.Client
}

func NewApplication() (*Application, error) {
	err := godotenv.Load(".env")
    if err != nil {
        panic(fmt.Errorf("unable to load environment variables from env file error %v", err))
    }
    MY_ACCOUNT_ID := os.Getenv("MY_ACCOUNT_ID")
    MY_PRIVATE_KEY := os.Getenv("MY_PRIVATE_KEY")

    myAccountID, err := hiero.AccountIDFromString(MY_ACCOUNT_ID)
    if err != nil {
        panic(err)
    }

    myPrivateKey, err := hiero.PrivateKeyFromStringEd25519(MY_PRIVATE_KEY)
    if err != nil {
        panic(err)
    }

	client := hiero.ClientForTestnet()

	client.SetOperator(myAccountID, myPrivateKey)



	alpacaClient := alpaca.NewClient(alpaca.ClientOpts{
		APIKey:    os.Getenv("ALPACA_API_KEY"),
		APISecret: os.Getenv("ALPACA_API_SECRET"),
		BaseURL:   "https://paper-api.alpaca.markets",
	})

	db, err := store.Open("/tmp/badgerdb")
	if err != nil {
		return nil, err
	}
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	uh := api.NewUserHandler(db, client, alpacaClient)

	app := &Application{
		Logger: logger,
		UserHandler: uh,
		DB: db,
		Client: client,
		Alpaca: alpacaClient,
	}

	return app, nil
}

func (a *Application) HealthCheck(w http.ResponseWriter, r *http.Request){
	fmt.Fprint(w, "Status: Available\n")
}

