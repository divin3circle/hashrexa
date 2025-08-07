import { BACKEND_URL } from "@/config";
import { MarketTopic } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getAppleStockPrice } from "./useTokens";

export const usePriceAnalysis = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["priceAnalysis"],
    queryFn: () => getPriceAnalysis(),
  });

  return { data, isLoading, error };
};

async function getPriceAnalysis() {
  const md = await getMarketPriceAnalysis();
  const formattedData = await formatMarketPriceAnalysis(md);
  return formattedData;
}
async function getMarketPriceAnalysis(): Promise<MarketTopic> {
  const response = await fetch(`${BACKEND_URL}/market-price-analysis`);
  const data = await response.json();
  return data.marketTopic as MarketTopic;
}

async function formatMarketPriceAnalysis(marketTopic: MarketTopic) {
  const applePrice = await getAppleStockPrice();
  return marketTopic.messages.map((message) => ({
    hour: new Date(message.timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    collateral: message.collateral * applePrice,
    hash: message.hash * 100,
  }));
}
