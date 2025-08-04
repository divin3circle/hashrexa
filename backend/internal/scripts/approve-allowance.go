package scripts

import (
	"fmt"
	"log"
	"os"

	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
	"github.com/joho/godotenv"
)

var tokenID, _ = hiero.TokenIDFromString("0.0.6494054")

func ApproveAllowance() {
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

	contractID, _ := hiero.ContractIDFromString("0.0.6499383") 
	contractAccountID, _ := hiero.AccountIDFromString(contractID.String())
	
	transaction := hiero.NewAccountAllowanceApproveTransaction().ApproveTokenAllowance(tokenID, operatorId, contractAccountID, 5_000_000)

	txResponse, err := transaction.Execute(client)
	if err != nil {
		fmt.Println("Error executing transaction:", err)
		panic(err)
	}

	receipt, err := txResponse.GetReceipt(client)
	
	if err != nil {
		fmt.Println("Error executing transaction:", err)
		panic(err)
	}

	fmt.Println("Transaction receipt:")
	fmt.Println(receipt)
}