package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgraph-io/badger/v4"
	"github.com/go-chi/chi/v5"
	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
)

type LoanStatus struct {
	CollateralToken string `json:"collateral_token"`
	CollateralAmount float64 `json:"collateral_amount"`
	BorrowedToken string `json:"borrowed_token"`
	BorrowedAmount float64 `json:"borrowed_amount"`
	APY float64 `json:"apy"`
}
type TokenizedAsset struct {
	Symbol string `json:"symbol"`
	ValueUSD float64 `json:"valueUSD"`
}

type User struct {
	UserAccountId string `json:"userAccountId"`
	TopicId string `json:"topicId"`
	CreatedAt string `json:"createdAt"`
	ProfilePicture string `json:"profilePicture"`
	LoanStatus []LoanStatus `json:"loan_status"`
	TokenizedAssets []TokenizedAsset `json:"tokenized_assets"`
	UpdatedAt string `json:"updatedAt"`
}

type UserHandler struct {
	DB *badger.DB
	Client *hiero.Client
}

func NewUserHandler(db *badger.DB, client *hiero.Client) *UserHandler {
	return &UserHandler{DB: db, Client: client}
}

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
		LoanStatus: []LoanStatus{
			{
				CollateralToken: "",
				CollateralAmount: 0,
				BorrowedToken: "",
				BorrowedAmount: 0,
				APY: 0,
			},
		},
		TokenizedAssets: []TokenizedAsset{
			{
				Symbol: "",
				ValueUSD: 0,
			},
		},
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