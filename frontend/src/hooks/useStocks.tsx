import { useQuery } from "@tanstack/react-query";
import {
  Position,
  PositionsResponse,
  Stock,
  StockHistoricalPrice,
} from "@/types";
import { MOCK_STOCK_HISTORICAL_PRICE } from "@/mocks";
import { BACKEND_URL } from "@/config";

const useStocks = () => {
  const { data, isLoading, error } = useQuery<Stock[]>({
    queryKey: ["stocks"],
    queryFn: async () => await getStocks(),
  });

  return { data, isLoading, error };
};

export const useStockHistoricalPrice = (symbol: string) => {
  const { data, isLoading, error } = useQuery<StockHistoricalPrice[]>({
    queryKey: ["stock-historical-price", symbol],
    queryFn: () => getStockHistoricalPrice(symbol),
  });

  return { data, isLoading, error };
};

async function getStockHistoricalPrice(symbol: string) {
  console.log(symbol);
  return MOCK_STOCK_HISTORICAL_PRICE;
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
