export interface LoanStatus {
  collateral_token: string;
  collateral_amount: number;
  borrowed_token: string;
  borrowed_amount: number;
  apy: number;
}

export interface TokenizedAsset {
  stockChange: number;
  stockLogo: string;
  stockPrice: number;
  stockSymbol: string;
  tokenizedAmount: number;
  unrealizedPL: number;
}

export interface User {
  userAccountId: string;
  topicId: string;
  createdAt: string;
  profilePicture: string;
  loan_status: LoanStatus[];
  personalInformation: UserPersonalInformation;
  tokenized_assets: TokenizedAsset[];
  updatedAt: string;
}

export interface UserPersonalInformation {
  username: string;
  email: string;
  bio: string;
  profilePicture: string;
  topicId: string;
  userAccountId: string;
  profileMessageLength: number;
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
  icon: string;
  token_id: string;
  decimals: number;
}

export interface TokenBalance extends Token {
  balance: number;
  valueUSD: number;
}

export interface FullTokenizedAssets {
  stock: Stock;
  amount: number;
}

export interface StockHistoricalPrice {
  date: string;
  price: number;
}

export interface PortfolioHistory {
  history: {
    base_value: string;
    equity: string[];
    profit_loss: string[];
    profit_loss_pct: string[];
    timeframe: string;
    timestamp: number[];
  };
}

export interface PortfolioHistoryData {
  date: string;
  equity: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface FullLoanDetails {
  collateralTokenImage: string;
  collateralTokenSymbol: string;
  borrowedToken: string;
  borrowedTokenImage: string;
  apy: number;
  borrowedAmount: number;
}

export interface TokenBalance {
  token_id: string;
  balance: number;
}

export interface AccountBalance {
  account: string;
  balance: number;
  tokens: TokenBalance[];
}

export interface BalanceLinks {
  next: string | null;
}

export interface AccountBalancesResponse {
  timestamp: string;
  balances: AccountBalance[];
  links: BalanceLinks;
}

export interface MarketMessage {
  collateral: number;
  hash: number;
  timestamp: number;
}

export interface MarketTopic {
  messages: MarketMessage[];
}

export interface PoolPosition {
  supplyShares: number;
  borrowShares: number;
  collateral: number;
}
