package scripts

import (
	"fmt"
	"log"
	"os"

	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
	"github.com/joho/godotenv"
)

func TestDeposit() {
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

	contractFunctionParams := hiero.NewContractFunctionParameters().
	AddInt64(5_000_000)

	fmt.Println("Depositing 5,000,000 HASH")


transaction := hiero.NewContractExecuteTransaction().
SetContractID(newContractID).
SetGas(1_000_000).
SetFunction("depositHASH", contractFunctionParams)

fmt.Println("Executing transaction:")

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

transactionStatus := receipt.Status
fmt.Println(transactionStatus)

fmt.Printf("The transaction consensus status is %v\n", transactionStatus)


}