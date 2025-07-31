export interface LoanStatus {
  collateral_token: string;
  collateral_amount: number;
  borrowed_token: string;
  borrowed_amount: number;
  apy: number;
}

export interface TokenizedAsset {
  symbol: string;
  amount: number;
}

export interface User {
  userAccountId: string;
  topicId: string;
  createdAt: string;
  profilePicture: string;
  loan_status: LoanStatus[];
  tokenized_assets: TokenizedAsset[];
  updatedAt: string;
}
export interface Position {
  asset_id: string;
  symbol: string;
  exchange: string;
  asset_class: string;
  asset_marginable: boolean;
  qty: string;
  qty_available: string;
  avg_entry_price: string;
  side: "long" | "short";
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  unrealized_intraday_pl: string;
  unrealized_intraday_plpc: string;
  current_price: string;
  lastday_price: string;
  change_today: string;
}

export interface PositionsResponse {
  positions: Position[];
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  logo: string;
  quantity: number;
}

export interface Portfolio {
  portfolioValueUSD: number;
  tokenizedAssets: number;
  optionsAssets: number;
}

export interface Token {
  symbol: string;
  name: string;
  amount: number;
  valueUSD: number;
  icon: string;
}

export interface FullTokenizedAssets {
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
