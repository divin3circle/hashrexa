package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"time"

	"github.com/dgraph-io/badger/v4"
	"github.com/go-chi/chi/v5"
	"github.com/hashgraph/hedera-sdk-go"
)

type LoanStatus struct {
	CollateralToken string `json:"collateral_token"`
	CollateralAmount float64 `json:"collateral_amount"`
	BorrowedToken string `json:"borrowed_token"`
	BorrowedAmount float64 `json:"borrowed_amount"`
	APY float64 `json:"apy"`
}

type User struct {
	UserAccountId string `json:"userAccountId"`
	TopicId string `json:"topicId"`
	CreatedAt string `json:"createdAt"`
	ProfilePicture string `json:"profilePicture"`
	LoanStatus []LoanStatus `json:"loan_status"`
	UpdatedAt string `json:"updatedAt"`
}

type UserHandler struct {
	DB *badger.DB
	Client *hedera.Client
}

func NewUserHandler(db *badger.DB, client *hedera.Client) *UserHandler {
	return &UserHandler{DB: db, Client: client}
}

func (u *UserHandler) HandleRegisterUser(w http.ResponseWriter, r *http.Request) {
	// get user account id and topic id from params
	userAccountId := chi.URLParam(r, "userAccountId")
	topicId := chi.URLParam(r, "topicId")

	if userAccountId == "" || topicId == "" {
		http.Error(w, "Missing user account ID or topic ID", http.StatusBadRequest)
		return
	}

	err := u.DB.Update(func(txn *badger.Txn) error {
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
		UpdatedAt: time.Now().Format(time.RFC3339),
	}
	
	topicID, err := hedera.TopicIDFromString(topicId)
	if err != nil {
		http.Error(w, "Failed to convert topic ID to Hedera topic ID", http.StatusInternalServerError)
		return
	}
	marshaledUser, err := json.Marshal(user)
	if err != nil {
		http.Error(w, "Failed to marshal user data", http.StatusInternalServerError)
		return
	}
	
	topicMsgSubmitTx := hedera.NewConsensusMessageSubmitTransaction().
		SetTopicID(topicID).
		SetMessage(marshaledUser)
	
	response, err := topicMsgSubmitTx.Execute(u.Client)
	if err != nil {
		http.Error(w, "Failed to submit message to topic", http.StatusInternalServerError)
		return
	}
	
	_, err = response.GetReceipt(u.Client)
	if err != nil {
		http.Error(w, "Failed to get transaction receipt", http.StatusInternalServerError)
		return
	}
	
	fmt.Printf("Message submitted to topic successfully\n")
	
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