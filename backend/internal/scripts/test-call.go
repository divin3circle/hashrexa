package scripts

import (
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"math/big"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
	"github.com/joho/godotenv"
)

var newContractID, _ = hiero.ContractIDFromString("0.0.6532033")
var marketId = "0xc6c8d3eb24d61523202abed6d47eb676e7f2fef743503b857f8559390318bb10"
var userEvmAddress = "0x0eab38daf1be107e0981c55bff252f351bd0ee7f"

func TestCall(){
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	 abiBytes, err := os.ReadFile("abi.json")
	 if err != nil {
		 log.Fatal("Failed to read ABI file:", err)
	 }
 
	 contractABI, err := abi.JSON(strings.NewReader(string(abiBytes)))
	 if err != nil {
		 log.Fatal("Failed to parse ABI:", err)
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

	marketIdBytes, _ := hex.DecodeString(marketId[2:])
	var marketIdBytes32 [32]byte
	copy(marketIdBytes32[:], marketIdBytes)
	contractFunctionParameters := hiero.NewContractFunctionParameters()
	contractFunctionParameters.AddBytes32(marketIdBytes32)
	contractFunctionParameters.AddAddress(userEvmAddress)
	transaction := hiero.NewContractCallQuery().
	SetContractID(newContractID).
	SetGas(600_000).
	SetFunction("position", contractFunctionParameters)


	contractFunctionResult, err := transaction.Execute(client)

	if err != nil {
		panic(err)
	}
	 var result struct {
        SupplyShares  *big.Int
        BorrowShares  *big.Int
        Collateral    *big.Int
    }

	err = contractABI.UnpackIntoInterface(&result, "position", contractFunctionResult.ContractCallResult)
    if err != nil {
        log.Fatal("Failed to decode result:", err)
    }

    supplyTokens := float64(result.SupplyShares.Uint64())
    borrowTokens := float64(result.BorrowShares.Uint64())
    collateralTokens := float64(result.Collateral.Uint64()) / 100

    fmt.Printf("Supply: %.6f tokens\n", supplyTokens)
    fmt.Printf("Borrow: %.6f tokens\n", borrowTokens)
    fmt.Printf("Collateral: %.2f tokens\n", collateralTokens)

}

type UserPosition struct {
	SupplyShares float64 `json:"supplyShares"`
	BorrowShares float64 `json:"borrowShares"`
	Collateral float64 `json:"collateral"`
}

func GetUserPosition(userEvmAddress string) (UserPosition, error){
	err := godotenv.Load(".env")
	if err != nil {
		return UserPosition{}, err
	}
	 abiBytes, err := os.ReadFile("abi.json")
	 if err != nil {
		 return UserPosition{}, err
	 }
 
	 contractABI, err := abi.JSON(strings.NewReader(string(abiBytes)))
	 if err != nil {
		 return UserPosition{}, err
	 }

	operatorIdStr := os.Getenv("MY_ACCOUNT_ID")
	operatorKeyStr := os.Getenv("MY_PRIVATE_KEY")
	if operatorIdStr == "" || operatorKeyStr == "" {
		return UserPosition{}, errors.New("must set operator account id and private key")
	}

	operatorId, _ := hiero.AccountIDFromString(operatorIdStr)
	operatorKey, _ := hiero.PrivateKeyFromStringEd25519(operatorKeyStr)

	client := hiero.ClientForTestnet()
	client.SetOperator(operatorId, operatorKey)

	marketIdBytes, _ := hex.DecodeString(marketId[2:])
	var marketIdBytes32 [32]byte
	copy(marketIdBytes32[:], marketIdBytes)
	contractFunctionParameters := hiero.NewContractFunctionParameters()
	contractFunctionParameters.AddBytes32(marketIdBytes32)
	contractFunctionParameters.AddAddress(userEvmAddress)
	transaction := hiero.NewContractCallQuery().
	SetContractID(newContractID).
	SetGas(600_000).
	SetFunction("position", contractFunctionParameters)


	contractFunctionResult, err := transaction.Execute(client)

	if err != nil {
		return UserPosition{}, err
	}
	 var result struct {
        SupplyShares  *big.Int
        BorrowShares  *big.Int
        Collateral    *big.Int
    }

	err = contractABI.UnpackIntoInterface(&result, "position", contractFunctionResult.ContractCallResult)
    if err != nil {
        return UserPosition{}, err
    }

    supplyTokens := float64(result.SupplyShares.Uint64())
    borrowTokens := float64(result.BorrowShares.Uint64())
    collateralTokens := float64(result.Collateral.Uint64()) / 100

    return UserPosition{
		SupplyShares: supplyTokens,
		BorrowShares: borrowTokens,
		Collateral: collateralTokens,
	}, nil

}
