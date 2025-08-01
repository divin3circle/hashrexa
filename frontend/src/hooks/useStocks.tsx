import { useQuery } from "@tanstack/react-query";
import {
  Position,
  PositionsResponse,
  Stock,
  PortfolioHistoryData,
} from "@/types";

import { BACKEND_URL } from "@/config";

const useStocks = () => {
  const { data, isLoading, error } = useQuery<Stock[]>({
    queryKey: ["stocks"],
    queryFn: async () => await getStocks(),
  });

  return { data, isLoading, error };
};

export const useHistorical = () => {
  const { data, isLoading, error } = useQuery<PortfolioHistoryData[]>({
    queryKey: ["portfolio-history"],
    queryFn: () => getPortfolioHistory(),
  });

  return { data, isLoading, error };
};

async function getPortfolioHistory(): Promise<PortfolioHistoryData[]> {
  const response = await fetch(`${BACKEND_URL}/portfolio-history`);
  const data = await response.json();

  console.log("Portfolio history data:", data);

  // The response is a single object with history property, not an array
  if (!data || !data.history) {
    return [];
  }

  const history = data.history;
  const { equity, profit_loss, profit_loss_pct, timestamp } = history;

  return timestamp.map((ts: number, index: number) => ({
    date: new Date(ts * 1000).toISOString().split("T")[0],
    equity: parseFloat(equity[index] || "0"),
    profitLoss: parseFloat(profit_loss[index] || "0"),
    profitLossPercent: parseFloat(profit_loss_pct[index] || "0"),
  }));
}

async function getStocks() {
  const response = await fetch(`${BACKEND_URL}/positions`);
  const data: PositionsResponse = await response.json();
  const stocks = await Promise.all(
    data.positions.map((stock) => getStock(stock))
  );
  return stocks;
}

async function getStock(position: Position): Promise<Stock> {
  const stockLogo = await getStockLogo(position.symbol);

  return {
    symbol: position.symbol,
    name: position.symbol,
    price: parseFloat(position.current_price),
    change: parseFloat(position.change_today),
    changePercent: parseFloat(position.change_today),
    logo: stockLogo,
    quantity: parseFloat(position.qty),
  };
}

async function getStockLogo(symbol: string): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/stock-logo/${symbol}`);
  const data = await response.json();
  return data.logo;
}

export default useStocks;
