package api

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
	"github.com/dgraph-io/badger/v4"
	"github.com/go-chi/chi/v5"
	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
	"github.com/imroc/req/v3"
)

type LoanStatus struct {
	CollateralToken string `json:"collateral_token"`
	CollateralAmount float64 `json:"collateral_amount"`
	BorrowedToken string `json:"borrowed_token"`
	BorrowedAmount float64 `json:"borrowed_amount"`
	APY float64 `json:"apy"`
}

type StockToken struct {
	StockSymbol string `json:"stockSymbol"`
	StockPrice float64 `json:"stockPrice"`
	StockChange float64 `json:"stockChange"`
	UnrealizedPL float64 `json:"unrealizedPL"`
	StockLogo string `json:"stockLogo"`
	TokenizedAmount float64 `json:"tokenizedAmount"`
}

type TopicMessagesMNAPIResponse struct {
	Messages []struct {
		SequenceNumber int64  `json:"sequence_number"`
		Message        string `json:"message"`
	} `json:"messages"`
}

type User struct {
	UserAccountId string `json:"userAccountId"`
	TopicId string `json:"topicId"`
	CreatedAt string `json:"createdAt"`
	ProfilePicture string `json:"profilePicture"`
	LoanStatus []LoanStatus `json:"loanStatus"`
	TokenizedAssets []StockToken `json:"tokenizedAssets"`
	UpdatedAt string `json:"updatedAt"`
}

type Portfolio struct {
	PortfolioValueUSD float64 `json:"portfolioValueUSD"`
	TokenizedAssets int `json:"tokenizedAssets"`
	OptionsAssets int `json:"optionsAssets"`
}

type UserHandler struct {
	DB *badger.DB
	Client *hiero.Client
		Alpaca *alpaca.Client
	}

func NewUserHandler(db *badger.DB, client *hiero.Client, alpacaClient *alpaca.Client) *UserHandler {
	return &UserHandler{DB: db, Client: client, Alpaca: alpacaClient}
}

const (
	ALLOWED_TOKENIZED_ASSETS = "AAPL"
	ALLOWED_TOKENIZED_ASSET_ID = "0.0.6476439"
)

func (u *UserHandler) HandleRegisterUser(w http.ResponseWriter, r *http.Request) {
	MY_PRIVATE_KEY := os.Getenv("MY_PRIVATE_KEY")
	privateKey, err := hiero.PrivateKeyFromStringEd25519(MY_PRIVATE_KEY)
	if err != nil {
		http.Error(w, "Failed to parse private key", http.StatusInternalServerError)
		return
	}
	// get user account id and topic id from params
	userAccountId := chi.URLParam(r, "userAccountId")
	topicId := chi.URLParam(r, "topicId")

	if userAccountId == "" || topicId == "" {
		http.Error(w, "Missing user account ID or topic ID", http.StatusBadRequest)
		return
	}

	err = u.DB.Update(func(txn *badger.Txn) error {
		e := badger.NewEntry([]byte(userAccountId), []byte(topicId))
		return txn.SetEntry(e)
	})
	if err != nil {
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}

	user := User{
		UserAccountId: userAccountId,
		TopicId: topicId,
		CreatedAt: time.Now().Format(time.RFC3339),
		ProfilePicture: "",
		LoanStatus: []LoanStatus{},
		TokenizedAssets: []StockToken{},
		UpdatedAt: time.Now().Format(time.RFC3339),
	}
	
	topicID, err := hiero.TopicIDFromString(topicId)
	if err != nil {
		http.Error(w, "Failed to convert topic ID to Hedera topic ID", http.StatusInternalServerError)
		return
	}
	marshaledUser, err := json.Marshal(user)
	if err != nil {
		http.Error(w, "Failed to marshal user data", http.StatusInternalServerError)
		return
	}
	
	topicMsgSubmitTx, _ := hiero.NewTopicMessageSubmitTransaction().
		SetTransactionMemo("User registered").
		SetTopicID(topicID).
		SetMessage(marshaledUser). 
		FreezeWith(u.Client)

	topicMsgSubmitTxId := topicMsgSubmitTx.GetTransactionID()
	fmt.Printf("The topic message submit transaction ID: %s\n", topicMsgSubmitTxId.String())
	topicMsgSubmitTxSigned := topicMsgSubmitTx.Sign(privateKey)
	topicMsgSubmitTxSubmitted, _ := topicMsgSubmitTxSigned.Execute(u.Client)
	topicMsgSubmitTxReceipt, _ := topicMsgSubmitTxSubmitted.GetReceipt(u.Client)

	topicMsgSeqNum := topicMsgSubmitTxReceipt.TopicSequenceNumber
	fmt.Printf("Topic Message Sequence Number: %v\n", topicMsgSeqNum)

	u.Client.Close()
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"success": true, "message": "User registered successfully", "userAccountId": "%s", "topicId": "%s"}`, userAccountId, topicId)
}

func (u *UserHandler) HandleCheckTopicExists(w http.ResponseWriter, r *http.Request) {
	userAccountId := chi.URLParam(r, "userAccountId")

	if userAccountId == "" {
		http.Error(w, "Missing user account ID", http.StatusBadRequest)
		return
	}

	var topicId []byte
	err := u.DB.View(func(txn *badger.Txn) error {
		item, err := txn.Get([]byte(userAccountId))
		if err != nil {
			return err
		}

		topicId, err = item.ValueCopy(nil)
		return err
	})

	if err != nil {
		if err == badger.ErrKeyNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to fetch topic ID", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"exists": true, "topicId": "%s"}`, string(topicId))
}

func (u *UserHandler) HandleTokenizePortfolio(w http.ResponseWriter, r *http.Request) {
	userAccountId := chi.URLParam(r, "userAccountId")

	if userAccountId == "" {
		http.Error(w, "Missing user account ID", http.StatusBadRequest)
		return
	}
	positions, err := u.Alpaca.GetPositions()
	if err != nil {
		http.Error(w, "Failed to get positions", http.StatusInternalServerError)
		return
	}
	fmt.Println("Positions found✅")
	// find allowed tokenized assets in positions
	allowedTokenizedAssets := []string{}
	for _, position := range positions {
		if position.Symbol == ALLOWED_TOKENIZED_ASSETS {
			allowedTokenizedAssets = append(allowedTokenizedAssets, position.Symbol)
		}
	}

	if len(allowedTokenizedAssets) == 0 {
		http.Error(w, "You have no allowed tokenized assets in your portfolio", http.StatusBadRequest)
		return
	}
	fmt.Println("Allowed tokenized assets found✅")

	amountToMint := positions[0].QtyAvailable.InexactFloat64() * 0.75

	// mint and record tokenized assets
	for _, asset := range allowedTokenizedAssets {
		success, err := u.mintAndRecordTokenizedAsset(userAccountId, asset, amountToMint)
		if err != nil {
			http.Error(w, "Failed to mint and record tokenized asset", http.StatusInternalServerError)
			return
		}
		if !success {
			http.Error(w, "Failed to mint and record tokenized asset", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"success": true, "message": "Tokenized assets minted successfully"}`)
}

func (u *UserHandler) HandleGetUserTokenizedAssets(w http.ResponseWriter, r *http.Request) {
	userAccountId := chi.URLParam(r, "userAccountId")
	if userAccountId == "" {
		http.Error(w, "Missing user account ID", http.StatusBadRequest)
		return
	}
	var topicId []byte
	err := u.DB.View(func(txn *badger.Txn) error {
		item, err := txn.Get([]byte(userAccountId))
		if err != nil {
			return err
		}

		topicId, err = item.ValueCopy(nil)
		return err
	})
	if err != nil {
		http.Error(w, "Failed to get topic ID", http.StatusInternalServerError)
		return
	}
	tokenizedAssets, err := u.getUserTokenizedAssets( string(topicId))
	if err != nil {
		http.Error(w, "Failed to get user tokenized assets", http.StatusInternalServerError)
		return
	}
	fmt.Println("Tokenized assets: ", tokenizedAssets)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(tokenizedAssets)
	if err != nil {
		http.Error(w, "Failed to encode tokenized assets", http.StatusInternalServerError)
		return
	}
}

func (u *UserHandler) HandleGetUserPortfolio(w http.ResponseWriter, r *http.Request) {
	userAccountId := chi.URLParam(r, "userAccountId")
	if userAccountId == "" {
		http.Error(w, "Missing user account ID", http.StatusBadRequest)
		return
	}
	var topicId []byte
	err := u.DB.View(func(txn *badger.Txn) error {
		item, err := txn.Get([]byte(userAccountId))
		if err != nil {
			return err
		}

		topicId, err = item.ValueCopy(nil)
		return err
	})
	if err != nil {
		http.Error(w, "Failed to get topic ID", http.StatusInternalServerError)
		return
	}
	portfolio, err := u.getUserPortfolio(string(topicId))
	if err != nil {
		http.Error(w, "Failed to get user portfolio", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(map[string]Portfolio{
		"portfolio": portfolio,
	})
	if err != nil {
		http.Error(w, "Failed to encode portfolio", http.StatusInternalServerError)
		return
	}
}

func (u *UserHandler) HandleGetUserPositions(w http.ResponseWriter, r *http.Request) {
	positions, err := u.Alpaca.GetPositions()
	if err != nil {
		http.Error(w, "Failed to get positions", http.StatusInternalServerError)
		return
	}
	fmt.Println("Positions: ", positions)
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(map[string][]alpaca.Position{
		"positions": positions,
	})
	if err != nil {
		http.Error(w, "Failed to encode positions", http.StatusInternalServerError)
		return
	}
}

func (u *UserHandler) HandleGetStockLogo(w http.ResponseWriter, r *http.Request) {
	stockSymbol := chi.URLParam(r, "stockSymbol")
	if stockSymbol == "" {
		http.Error(w, "Missing stock symbol", http.StatusBadRequest)
		return
	}
	logo, err := getStockLogo(stockSymbol)
	if err != nil {
		http.Error(w, "Failed to get stock logo", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(map[string]string{
		"logo": logo,
	})
	if err != nil {
		http.Error(w, "Failed to encode logo", http.StatusInternalServerError)
		return
	}
}

func (u *UserHandler) HandlePortfolioHistory(w http.ResponseWriter, r *http.Request) {
	req := alpaca.GetPortfolioHistoryRequest{
		Period: "30D",
		TimeFrame: alpaca.TimeFrame("1H"),
		DateEnd: time.Now(),
		ExtendedHours: false,
	}
	history, err := u.Alpaca.GetPortfolioHistory(req)
	if err != nil {
		fmt.Println("Error getting portfolio history: ", err)
		http.Error(w, "Failed to get portfolio history", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"history": history,
	})
	if err != nil {
		http.Error(w, "Failed to encode portfolio history", http.StatusInternalServerError)
		return
	}
}


func (u *UserHandler) getLatestMessageFromTopic(topicId string) (string, error) {
	topicID, err := hiero.TopicIDFromString(topicId)
	if err != nil {
		return "", err
	}
	
	query := hiero.NewTopicInfoQuery().
		SetTopicID(topicID)

	info, err := query.Execute(u.Client)
	if err != nil {
		return "", err
	}
	sequenceNumber := info.SequenceNumber
	fmt.Println("Sequence number: ", sequenceNumber)

	url := fmt.Sprintf("https://testnet.mirrornode.hedera.com/api/v1/topics/%s/messages?encoding=base64&limit=5&order=asc&sequencenumber=%d", topicId, sequenceNumber)
	fmt.Println("URL: ", url)
	var response struct {
		Messages []struct {
			Message string `json:"message"`
		} `json:"messages"`
	}

	httpResp, err := req.R().Get(url)
	if err != nil {
		return "", err
	}
	err = json.Unmarshal(httpResp.Bytes(), &response)
	if err != nil {
    return "", err
	}
	if len(response.Messages) == 0 {
    return "", errors.New("no messages found")
	}
	messageContent := response.Messages[0].Message

	decodedMsg, err := base64.StdEncoding.DecodeString(messageContent)
	if err != nil {
		return "", err
	}
	fmt.Println("Decoded message: ", string(decodedMsg))

	return string(decodedMsg), nil
}

func getStockLogo(stockSymbol string) (string, error) {
	fmt.Println("Getting stock logo for: ", stockSymbol)
	return "https://substackcdn.com/image/fetch/$s_!G1lk!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8ed3d547-94ff-48e1-9f20-8c14a7030a02_2000x2000.jpeg", nil
}

func (u *UserHandler) getUserTokenizedAssets(topicId string) ([]StockToken, error) {
	userData, err := u.getLatestMessageFromTopic(string(topicId))
	fmt.Println("User data: ", userData)
	if err != nil {
		fmt.Println("Error getting user data from topic: ", err)
		return nil, err
	}

	var user User
	err = json.Unmarshal([]byte(userData), &user) 
	if err != nil {
		fmt.Println("Error unmarshalling user data: ", err)
		return nil, err
	}
	tokenizedAssets := user.TokenizedAssets
	return tokenizedAssets, nil
}



func (u *UserHandler) mintAndRecordTokenizedAsset(userAccountId string, tokenizedAsset string, amountToMint float64) (bool, error) {
	mintSuccess, err := u.mint(amountToMint)
	if err != nil {
		log.Fatalf("Failed to mint tokenized asset: %v", err)
		return mintSuccess, err
	}
	fmt.Println("Minted tokenized asset✅")
	recordSuccess, err := u.recordTokenizedAsset(userAccountId, tokenizedAsset, amountToMint)
	if err != nil {
		log.Fatalf("Failed to record tokenized asset: %v", err)
		return recordSuccess, err
	}
	fmt.Println("Recorded tokenized asset✅")
	if mintSuccess && recordSuccess {
		fmt.Println("Successfully minted✅")
	}
	fmt.Printf("Mint Status: %v\n", mintSuccess)
	fmt.Printf("Record Status: %v\n", recordSuccess)

	return mintSuccess && recordSuccess, nil
}

func (u *UserHandler) mint(amountToMint float64) (bool, error) {
	tokenId, err := hiero.TokenIDFromString(ALLOWED_TOKENIZED_ASSET_ID)
	if err != nil {
		log.Fatalf("Failed to convert token ID to Hedera token ID: %v", err)
		return false, err
	}
	supplyKey, err := hiero.PrivateKeyFromStringEd25519(os.Getenv("MY_PRIVATE_KEY"))
	if err != nil {
		log.Fatalf("Failed to convert token ID to Hedera token ID: %v", err)
		return false, err
	}
	transaction, err := hiero.NewTokenMintTransaction().
		SetTokenID(tokenId).
		SetAmount(uint64(amountToMint)).
		SetMaxTransactionFee(hiero.HbarFrom(20, hiero.HbarUnits.Hbar)).
		FreezeWith(u.Client)

		if err != nil {
			return false, err
	}

	txResponse, err := transaction.
			Sign(supplyKey).
			Execute(u.Client)
	
	if err != nil {
		return false, err
	}
	
	receipt, err := txResponse.GetReceipt(u.Client)
	
	if err != nil {
		return false, err
	}
	
	status := receipt.Status
	
	fmt.Printf("The transaction consensus status is %v\n", status)

	return true, nil
}

func (u *UserHandler) recordTokenizedAsset(userAccountId string, asset string, amountMinted float64) (bool, error) {
	privateKey, err := hiero.PrivateKeyFromStringEd25519(os.Getenv("MY_PRIVATE_KEY"))
	if err != nil {
		return false, err
	}
	// get user data from their associated topic and unmarshal it to User struct
	if userAccountId == "" {
		return false, errors.New("missing user account ID")
	}
	var topicId []byte
	err = u.DB.View(func(txn *badger.Txn) error {
		item, err := txn.Get([]byte(userAccountId))
		if err != nil {
			return err
		}

		topicId, err = item.ValueCopy(nil)
		return err
	})
	if err != nil {
		return false, err
	}

	topicID, err := hiero.TopicIDFromString(string(topicId))
	if err != nil {
		return false, err
	}
	userData, err := u.getLatestMessageFromTopic(string(topicId))
	if err != nil {
		return false, err
	}
	var user User
	err = json.Unmarshal([]byte(userData), &user)
	if err != nil {
		return false, err
	}

	// obtain the user's tokenized assets field and find the tokenized being minted
	// if it doesn't exist create a new entry and populate the tokenized asset with the symbol and amount minted
	// if it does exist, add the amount minted to the existing entry
	position, err := u.Alpaca.GetPosition(asset)
	if err != nil {
		return false, err
	}
	logo, err := getStockLogo(asset)
	if err != nil {
		return false, err
	}
	tokenizedAssets := user.TokenizedAssets
	if len(tokenizedAssets) == 0 {
		tokenizedAssets = append(tokenizedAssets, StockToken{
			StockSymbol: asset,
			StockPrice: position.CurrentPrice.InexactFloat64(),
			StockChange: position.ChangeToday.InexactFloat64(),
			UnrealizedPL: position.UnrealizedPL.InexactFloat64(),
			StockLogo: logo,
			TokenizedAmount: amountMinted,
		})
		// update the user's tokenized assets field with the new tokenized asset
		user.TokenizedAssets = tokenizedAssets
	} else {
	for _, tokenizedAsset := range tokenizedAssets {
		if tokenizedAsset.StockSymbol == asset {
			tokenizedAsset.TokenizedAmount += amountMinted
			// update the user's tokenized assets field with the new tokenized asset
			user.TokenizedAssets = tokenizedAssets
			break
		}
	}
}

	// marshal the user struct back to json and submit it to the topic
	marshaledUser, err := json.Marshal(user)
	if err != nil {
		return false, err
	}

	topicMsgSubmitTx, _ := hiero.NewTopicMessageSubmitTransaction().
		SetTransactionMemo("Tokenized asset minted").
		SetTopicID(topicID).
		SetMessage(marshaledUser). 
		FreezeWith(u.Client)

	topicMsgSubmitTxId := topicMsgSubmitTx.GetTransactionID()
	fmt.Printf("The topic message submit transaction ID: %s\n", topicMsgSubmitTxId.String())
	topicMsgSubmitTxSigned := topicMsgSubmitTx.Sign(privateKey)
	topicMsgSubmitTxSubmitted, _ := topicMsgSubmitTxSigned.Execute(u.Client)
	topicMsgSubmitTxReceipt, _ := topicMsgSubmitTxSubmitted.GetReceipt(u.Client)
	fmt.Printf("The topic message submit transaction receipt: %v\n", topicMsgSubmitTxReceipt)

	return true, nil
	
}

func (u *UserHandler) getUserPortfolio(topicId string) (Portfolio, error) {
	positions, err := u.Alpaca.GetPositions()
	if err != nil {
		return Portfolio{}, err
	}
	account, err := u.Alpaca.GetAccount()
	if err != nil {
		return Portfolio{}, err
	}
	portfolioValueUSD := account.PortfolioValue.InexactFloat64()
	tokenizedAssets, err := u.getUserTokenizedAssets(topicId)
	if err != nil {
		return Portfolio{}, err
	}
	return Portfolio{
		PortfolioValueUSD: portfolioValueUSD,
		OptionsAssets: len(positions),
		TokenizedAssets: len(tokenizedAssets), 
	}, nil
}