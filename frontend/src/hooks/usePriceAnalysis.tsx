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
  return marketTopic.messages.map((message) => {
    let date: Date;

    const timestamp = message.timestamp as number | string;

    if (typeof timestamp === "string") {
      if (timestamp.includes("T") || timestamp.includes("-")) {
        date = new Date(timestamp);
      } else {
        const timestampMs = parseFloat(timestamp) * 1000;
        date = new Date(timestampMs);
      }
    } else {
      const timestampMs = timestamp > 1e10 ? timestamp : timestamp * 1000;
      date = new Date(timestampMs);
    }

    return {
      hour: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      collateral: message.collateral * applePrice,
      hash: message.hash * 100,
    };
  });
}
