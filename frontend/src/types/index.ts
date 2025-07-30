export interface LoanStatus {
  collateral_token: string;
  collateral_amount: number;
  borrowed_token: string;
  borrowed_amount: number;
  apy: number;
}

export interface User {
  userAccountId: string;
  topicId: string;
  createdAt: string;
  profilePicture: string;
  loan_status: LoanStatus[];
  updatedAt: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  logo: string;
}

export interface Token {
  symbol: string;
  name: string;
  amount: number;
  valueUSD: number;
  icon: string;
}

export interface TokenizedAssets {
  stock: Stock;
  amount: number;
}

export interface StockHistoricalPrice {
  date: string;
  price: number;
}

export interface FullLoanDetails {
  collateralTokenImage: string;
  collateralTokenSymbol: string;
  borrowedToken: string;
  borrowedTokenImage: string;
  apy: number;
  borrowedAmount: number;
}
