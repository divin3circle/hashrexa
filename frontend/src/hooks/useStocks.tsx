import { useQuery } from "@tanstack/react-query";
import { Stock, StockHistoricalPrice } from "@/types";
import { MOCK_STOCK_HISTORICAL_PRICE, MOCK_STOCKS } from "@/mocks";

const useStocks = () => {
  const { data, isLoading, error } = useQuery<Stock[]>({
    queryKey: ["stocks"],
    queryFn: getStocks,
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
  const stocks = await Promise.all(
    MOCK_STOCKS.map((stock) => getStock(stock.symbol))
  );
  return stocks;
}

async function getStock(symbol: string): Promise<Stock> {
  const stock = MOCK_STOCKS.find((stock) => stock.symbol === symbol);

  if (!stock) {
    throw new Error(`Stock with symbol ${symbol} not found`);
  }

  return stock;
}

export default useStocks;
