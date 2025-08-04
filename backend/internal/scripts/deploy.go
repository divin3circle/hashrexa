package scripts

import (
	"fmt"
	"log"
	"os"

	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
	"github.com/joho/godotenv"
)

func DeployPool() {
	byteCode, err := os.ReadFile("LendingPool.bin")
	if err != nil {
		panic(err)
	}
	err = godotenv.Load(".env")
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
	contractCreate := hiero.NewContractCreateFlow().
	SetGas(1_000_000).
	SetBytecode(byteCode)
	txResponse, err := contractCreate.Execute(client)
	if err != nil {
		panic(err)
	}
	receipt, err := txResponse.GetReceipt(client)
	if err != nil {
		panic(err)
}

	newContractId := *receipt.ContractID

	fmt.Printf("The new topic ID is %v\n", newContractId)
}