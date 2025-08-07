package api

import (
	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
	"github.com/dgraph-io/badger/v4"
	hiero "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
)


type LoanStatus struct {
	CollateralToken  string  `json:"collateral_token"`
	CollateralAmount float64 `json:"collateral_amount"`
	BorrowedToken    string  `json:"borrowed_token"`
	BorrowedAmount   float64 `json:"borrowed_amount"`
	APY              float64 `json:"apy"`
}

type StockToken struct {
	StockSymbol     string  `json:"stockSymbol"`
	StockPrice      float64 `json:"stockPrice"`
	StockChange     float64 `json:"stockChange"`
	UnrealizedPL    float64 `json:"unrealizedPL"`
	StockLogo       string  `json:"stockLogo"`
	TokenizedAmount float64 `json:"tokenizedAmount"`
}

type PoolPosition struct {
	SuppliedHASH      int64  `json:"suppliedHASH"`
	BorrowedHASH      int64  `json:"borrowedHASH"`
	CollateralDAAPL   int64  `json:"collateralDAAPL"`
	LastInterestBlock uint64 `json:"lastInterestBlock"`
}

type Address struct {
	Position   PoolPosition `json:"position"`
	LoanHealth float64      `json:"loanHealth"`
	FeesEarned int64        `json:"feesEarned"`
}

type UserPersonalInformation struct {
	Username           string `json:"username"`
	Email              string `json:"email"`
	Bio                string `json:"bio"`
	ProfilePicture     string `json:"profilePicture"`
	TopicId            string `json:"topicId"`
	UserAccountId      string `json:"userAccountId"`
	ProfileMessageLength int    `json:"profileMessageLength"`
}

type Pool struct {
	ContractId   string `json:"contractId"`
	Ltv          int64  `json:"ltv"`
	InterestRate int64  `json:"interestRate"`
}

type TopicMessagesMNAPIResponse struct {
	Messages []struct {
		SequenceNumber int64  `json:"sequence_number"`
		Message        string `json:"message"`
	} `json:"messages"`
}

type User struct {
	UserAccountId   string       `json:"userAccountId"`
	TopicId         string       `json:"topicId"`
	CreatedAt       string       `json:"createdAt"`
	PersonalInformation UserPersonalInformation `json:"personalInformation"`
	ProfilePicture  string       `json:"profilePicture"`
	LoanStatus      []LoanStatus `json:"loanStatus"`
	TokenizedAssets []StockToken `json:"tokenizedAssets"`
	UpdatedAt       string       `json:"updatedAt"`
}

type Portfolio struct {
	PortfolioValueUSD float64 `json:"portfolioValueUSD"`
	TokenizedAssets   int     `json:"tokenizedAssets"`
	OptionsAssets     int     `json:"optionsAssets"`
}

type UserHandler struct {
	DB     *badger.DB
	Client *hiero.Client
	Alpaca *alpaca.Client
}

type Market struct {
	PriceAnalysis MarketTopic `json:"priceAnalysis"`
	LastUpdate int `json:"lastUpdate"`
	Fee int `json:"fee"`
	TotalSupplyAssets int `json:"totalSupplyAssets"`
	TotalSupplyShares int `json:"totalSupplyShares"`
	TotalBorrowAssets int `json:"totalBorrowAssets"`
	TotalBorrowShares int `json:"totalBorrowShares"`
}

type MarketMessages struct {
	Collateral float64 `json:"collateral"`
	Hash float64 `json:"hash"`
	Timestamp int64 `json:"timestamp"`
}

type MarketTopic struct {
	Messages []MarketMessages `json:"messages"`
}
