package scripts

import (
	"fmt"
	"log"
	"os"

	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
	"github.com/joho/godotenv"
)


func UpdateContract() {
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
	
	fileID, err := hiero.FileIDFromString("0.0.6500519")
	if err != nil {
		fmt.Printf("Error getting file ID: %+v\n", err)
		panic(err)
	}

	transaction := hiero.NewContractUpdateTransaction().
	SetAdminKey(operatorKey.PublicKey()).
	SetBytecodeFileID(fileID)

	modifyMaxTransactionFee := transaction.SetMaxTransactionFee(hiero.HbarFrom(20, hiero.HbarUnits.Hbar))

	freezeTransaction, err := modifyMaxTransactionFee.FreezeWith(client)
	if err != nil {
		fmt.Printf("Error freezing transaction: %+v\n", err)
        panic(err)
	}

	txResponse, err := freezeTransaction.Execute(client)
	if err != nil {	
		fmt.Printf("Error executing transaction: %+v\n", err)
		panic(err)
	}

	receipt, err := txResponse.GetReceipt(client)
	if err != nil {
		fmt.Printf("Error getting receipt: %+v\n", err)
		panic(err)
	}

	transactionStatus := receipt.Status

	fmt.Printf("Transaction receipt: %+v\n", receipt)
	fmt.Printf("Transaction status: %+v\n", transactionStatus)
}