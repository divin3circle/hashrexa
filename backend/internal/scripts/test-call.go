package scripts

import (
	"fmt"
	"log"
	"os"

	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
	"github.com/holiman/uint256"
	"github.com/joho/godotenv"
)

var newContractID, _ = hiero.ContractIDFromString("0.0.6499159")

func TestCall(){
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
transaction := hiero.NewContractCallQuery().
SetContractID(newContractID).
SetGas(600_000).
SetFunction("interestRate", nil)


txResponse, err := transaction.Execute(client)
if err != nil {
panic(err)
}

result := txResponse.ContractCallResult
if len(result) == 32 {
	var value uint256.Int
	value.SetBytes(result)
	fmt.Println("Interest Rate: \n", value.String())
}

}