import { useQuery } from "@tanstack/react-query";
import { Stock } from "@/types";
import { MOCK_STOCKS } from "@/mocks";

const useStocks = () => {
  const { data, isLoading, error } = useQuery<Stock[]>({
    queryKey: ["stocks"],
    queryFn: getStocks,
  });

  return { data, isLoading, error };
};

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
