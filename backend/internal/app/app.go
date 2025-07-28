package app

import (
	"fmt"
	"log"
	"net/http"
	"os"

	badger "github.com/dgraph-io/badger/v4"
	"github.com/divin3circle/hashrexa/backend/internal/api"
	"github.com/divin3circle/hashrexa/backend/internal/store"
	"github.com/hashgraph/hedera-sdk-go"
	"github.com/joho/godotenv"
)

type Application struct {
	Logger *log.Logger
	UserHandler *api.UserHandler
	DB *badger.DB
	Client *hedera.Client
}

func NewApplication() (*Application, error) {
	err := godotenv.Load(".env")
    if err != nil {
        panic(fmt.Errorf("Unable to load environment variables from demo.env file. Error:\n%v\n", err))
    }
    MY_ACCOUNT_ID := os.Getenv("MY_ACCOUNT_ID")
    MY_PRIVATE_KEY := os.Getenv("MY_PRIVATE_KEY")

    myAccountID, err := hedera.AccountIDFromString(MY_ACCOUNT_ID)
    if err != nil {
        panic(err)
    }

    myPrivateKey, err := hedera.Ed25519PrivateKeyFromString(MY_PRIVATE_KEY)
    if err != nil {
        panic(err)
    }

	client := hedera.ClientForTestnet()

	client.SetOperator(myAccountID, myPrivateKey)

	db, err := store.Open("/tmp/badgerdb")
	if err != nil {
		return nil, err
	}
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	app := &Application{
		Logger: logger,
		UserHandler: api.NewUserHandler(),
		DB: db,
		Client: client,
	}

	return app, nil
}

func (a *Application) HealthCheck(w http.ResponseWriter, r *http.Request){
	fmt.Fprint(w, "Status: Available\n")
}