package scripts

// 0.0.6509511
import (
	"fmt"
	"log"
	"os"

	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
	"github.com/joho/godotenv"
)

func Mint() {
	tokenId, err := hiero.TokenIDFromString("0.0.6509511")
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

	transaction, err := hiero.NewTokenMintTransaction().
		SetTokenID(tokenId).
		SetAmount(100000).
		SetMaxTransactionFee(hiero.HbarFrom(20, hiero.HbarUnits.Hbar)).
		FreezeWith(client)

	if err != nil {
		panic(err)
	}

	txResponse, err := transaction.
		Sign(operatorKey).
		Execute(client)

	if err != nil {
		panic(err)
	}

	receipt, err := txResponse.GetReceipt(client)

	if err != nil {
		panic(err)
	}

	status := receipt.Status

	fmt.Printf("The transaction consensus status is %v\n", status)
}

func Transfer() {
	tokenId, err := hiero.TokenIDFromString("0.0.6509511")
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
	accountId0, err := hiero.AccountIDFromString(os.Getenv("MY_ACCOUNT_ID"))
	if err != nil {
		panic(err)
	}
	accountId1, err := hiero.AccountIDFromString("0.0.6492202")
	if err != nil {
		fmt.Println("Error creating transfer transaction")
		panic(err)
	}

	transaction, err := hiero.NewTransferTransaction().
		AddTokenTransfer(tokenId, accountId0, -10_000).
		AddTokenTransfer(tokenId, accountId1, 10_000).
		FreezeWith(client)

	if err != nil {
		fmt.Println("Error freezing transaction", err)
		panic(err)
	}

	txResponse, err := transaction.Sign(operatorKey).Execute(client)

	if err != nil {
		fmt.Println("Error executing transaction", err)
		panic(err)
	}

	receipt, err := txResponse.GetReceipt(client)
	if err != nil {
		fmt.Println("Error getting receipt", err)
		panic(err)
	}

	status := receipt.Status

	fmt.Printf("The transaction consensus status is %v\n", status)
}

func RevokeKyc() {
	tokenId, err := hiero.TokenIDFromString("0.0.6509511")
	if err != nil {
		panic(err)
	}
	accountId, err := hiero.AccountIDFromString("0.0.6492202")
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
	transaction, err := hiero.NewTokenRevokeKycTransaction().
		SetTokenID(tokenId).
		SetAccountID(accountId).
		FreezeWith(client)

	if err != nil {
		panic(err)
	}

	txResponse, err := transaction.Sign(operatorKey).Execute(client)

	if err != nil {
		panic(err)
	}

	receipt, err := txResponse.GetReceipt(client)

	if err != nil {
		panic(err)
	}

	status := receipt.Status

	fmt.Printf("The transaction consensus status is %v\n", status)
}
