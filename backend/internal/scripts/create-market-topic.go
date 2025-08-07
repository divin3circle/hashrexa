package scripts

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/divin3circle/hashrexa/backend/internal/api"
	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
	"github.com/joho/godotenv"
)

func CreateMarketTopic() {
	fmt.Println("🏁 Creating market topic")

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	operatorIdStr := os.Getenv("MY_ACCOUNT_ID")
	operatorKeyStr := os.Getenv("MY_PRIVATE_KEY")
	if operatorIdStr == "" || operatorKeyStr == "" {
		log.Fatal("Must set MY_ACCOUNT_ID, MY_PRIVATE_KEY")
	}

	operatorId, _ := hiero.AccountIDFromString(operatorIdStr)
	operatorKey, _ := hiero.PrivateKeyFromStringEd25519(operatorKeyStr)
	fmt.Printf("Using account: %s\n", operatorId)
	fmt.Printf("Using operatorKey: %s\n", operatorKeyStr)

	client := hiero.ClientForTestnet()
	client.SetOperator(operatorId, operatorKey)

	err = client.SetDefaultMaxTransactionFee(hiero.HbarFrom(100, hiero.HbarUnits.Hbar))
	if err != nil {
		return
	}

	err = client.SetDefaultMaxQueryPayment(hiero.HbarFrom(50, hiero.HbarUnits.Hbar))
	if err != nil {
		return
	}

	transaction := hiero.NewTopicCreateTransaction().
		SetAdminKey(operatorKey.PublicKey()). 
		SetTopicMemo("Market Topic").
		SetSubmitKey(operatorKey.PublicKey()).
		SetAutoRenewAccountID(operatorId).
		SetAutoRenewPeriod(time.Hour * 24 * 30)

	txResponse, err := transaction.Execute(client)
	if err != nil {
		panic(err)
	}

	transactionReceipt, err := txResponse.GetReceipt(client)

	if err != nil {
	panic(err)
	}

	newTopicID := *transactionReceipt.TopicID

	fmt.Printf("The new topic ID is %v\n", newTopicID)
}

func SubmitGenesisMessage() {
	fmt.Println("🏁 Submitting genesis message")

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	operatorIdStr := os.Getenv("MY_ACCOUNT_ID")
	operatorKeyStr := os.Getenv("MY_PRIVATE_KEY")
	if operatorIdStr == "" || operatorKeyStr == "" {
		log.Fatal("Must set MY_ACCOUNT_ID, MY_PRIVATE_KEY")
	}

	operatorId, _ := hiero.AccountIDFromString(operatorIdStr)
	operatorKey, _ := hiero.PrivateKeyFromStringEd25519(operatorKeyStr)
	fmt.Printf("Using account: %s\n", operatorId)
	fmt.Printf("Using operatorKey: %s\n", operatorKeyStr)

	client := hiero.ClientForTestnet()
	client.SetOperator(operatorId, operatorKey)

	err = client.SetDefaultMaxTransactionFee(hiero.HbarFrom(100, hiero.HbarUnits.Hbar))
	if err != nil {
		return
	}

	err = client.SetDefaultMaxQueryPayment(hiero.HbarFrom(50, hiero.HbarUnits.Hbar))
	if err != nil {
		return
	}

	var marketTopic api.MarketTopic
	marketTopic.Messages = []api.MarketMessages{
		{
			Collateral: 91,
			Hash: 100,
			Timestamp: time.Now().Unix(),
		},
	}

	marketTopicBytes, err := json.Marshal(marketTopic)
	if err != nil {
		panic(err)
	}

	topicIdStr := "0.0.6514924"
	topicId, _ := hiero.TopicIDFromString(topicIdStr)

	transaction := hiero.NewTopicMessageSubmitTransaction().
		SetTopicID(topicId).
		SetMessage(marketTopicBytes)

	txResponse, err := transaction.Execute(client)
	if err != nil {
        panic(err)
}

	transactionReceipt, err := txResponse.GetReceipt(client)
	if err != nil {
        panic(err)
	}	

	transactionStatus := transactionReceipt.Status

	fmt.Printf("The transaction consensus status is %v\n", transactionStatus)
}

