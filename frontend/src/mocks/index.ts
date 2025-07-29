import { STOCK_LOGOS } from "@/assets";
import { Stock, TokenizedAssets } from "@/types";

export const MOCK_STOCKS: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 150.75,
    change: 1.25,
    changePercent: 0.83,
    logo: STOCK_LOGOS.AAPL,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 1000.0,
    change: -2.5,
    changePercent: -0.25,
    logo: STOCK_LOGOS.TSLA,
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 500.0,
    change: 10.0,
    changePercent: 2.0,
    logo: STOCK_LOGOS.NFLX,
  },
  {
    symbol: "AMZN",
    name: "Amazon Inc.",
    price: 3000.0,
    change: 50.0,
    changePercent: 1.67,
    logo: STOCK_LOGOS.AMZN,
  },
];

const AAPL = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: 150.75,
  change: 1.25,
  changePercent: 0.83,
  logo: STOCK_LOGOS.AAPL,
};

export const TOKENIZED_ASSETS: TokenizedAssets[] = [
  {
    stock: AAPL,
    amount: 10,
    health: 100,
  },
];
