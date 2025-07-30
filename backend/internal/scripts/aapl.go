package scripts

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
	"github.com/imroc/req/v3"
	"github.com/joho/godotenv"
)

type TokenMNAPIResponse struct {
	Name        string `json:"name"`
	TotalSupply string `json:"total_supply"`
}

func Aapl() {
	createToken()
}

func createToken() {
	fmt.Println("🏁 Apple Inc - dAAPL Fungible Token - start")

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

	client.SetDefaultMaxTransactionFee(hiero.HbarFrom(100, hiero.HbarUnits.Hbar))

	client.SetDefaultMaxQueryPayment(hiero.HbarFrom(50, hiero.HbarUnits.Hbar))

	fmt.Println("🟣 Creating new HTS token")
	tokenCreateTx, _ := hiero.NewTokenCreateTransaction().
		SetTransactionMemo("Apple Inc - dAAPL Fungible Token").
		SetTokenType(hiero.TokenTypeFungibleCommon).
		SetTokenName(`Apple Inc`).
		SetTokenSymbol("dAAPL").
		SetDecimals(2).
		SetInitialSupply(0).
		SetTreasuryAccountID(operatorId).
		SetAdminKey(operatorKey.PublicKey()).
		SetKycKey(operatorKey.PublicKey()).
		SetWipeKey(operatorKey.PublicKey()).
		SetPauseKey(operatorKey.PublicKey()).
		SetFreezeKey(operatorKey.PublicKey()).
		SetSupplyKey(operatorKey.PublicKey()).
		FreezeWith(client)

	tokenCreateTxId := tokenCreateTx.GetTransactionID()
	fmt.Printf("The token create transaction ID: %s\n", tokenCreateTxId.String())

	tokenCreateTxSigned := tokenCreateTx.Sign(operatorKey)

	
	tokenCreateTxSubmitted, _ := tokenCreateTxSigned.Execute(client)

	tokenCreateTxReceipt, _ := tokenCreateTxSubmitted.GetReceipt(client)

	tokenId := tokenCreateTxReceipt.TokenID
	fmt.Printf("Token ID: %s\n", tokenId.String())

	client.Close()

	fmt.Println("🟣 View the token on HashScan")
	tokenHashscanUrl :=
		fmt.Sprintf("https://hashscan.io/testnet/token/%s", tokenId.String())
	fmt.Printf("Token Hashscan URL: %s\n", tokenHashscanUrl)

	time.Sleep(6 * time.Second)

	fmt.Println("🟣 Get token data from the Hedera Mirror Node")
	tokenMirrorNodeApiUrl :=
		fmt.Sprintf("https://testnet.mirrornode.hedera.com/api/v1/tokens/%s", tokenId.String())
	fmt.Printf("The token Hedera Mirror Node API URL: %s\n", tokenMirrorNodeApiUrl)

	httpResp, err := req.R().Get(tokenMirrorNodeApiUrl)
	if err != nil {
		log.Fatalf("Failed to fetch token URL: %v", err)
	}
	var tokenResp TokenMNAPIResponse
	err = json.Unmarshal(httpResp.Bytes(), &tokenResp)
	if err != nil {
		log.Fatalf("Failed to parse JSON of response fetched from token URL: %v", err)
	}
	tokenName := tokenResp.Name
	fmt.Printf("The name of this token: %s\n", tokenName)
	tokenTotalSupply := tokenResp.TotalSupply
	fmt.Printf("The total supply of this token: %s\n", tokenTotalSupply)
	fmt.Println("🎉 Apple Inc - dAAPL Fungible Token - complete")
}

