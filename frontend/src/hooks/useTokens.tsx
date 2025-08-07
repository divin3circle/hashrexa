import { BACKEND_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { Stock, TokenizedAsset, FullTokenizedAssets } from "@/types";
import { useAppKitAccount } from "@reown/appkit/react-core";
import { getStocks } from "./useStocks";

export function useTokens() {
  const { address } = useAppKitAccount();
  const {
    data: tokenizedAssets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tokenizedAssets"],
    queryFn: async () => await getAndProcessTokenizedAssets(address),
    enabled: !!address,
  });
  return { tokenizedAssets, isLoading, error };
}

async function getTokenizedAssets(
  userAccountId: string
): Promise<TokenizedAsset[]> {
  const response = await fetch(
    `${BACKEND_URL}/tokenized-assets/${userAccountId}`
  );
  const data = (await response.json()) as TokenizedAsset[];
  if (data.length === 0) {
    return [];
  }
  return data;
}

async function processTokenizedAssets(
  tokenizedAssets: TokenizedAsset
): Promise<FullTokenizedAssets> {
  const appleStock: Stock = {
    symbol: tokenizedAssets.stockSymbol,
    name: tokenizedAssets.stockSymbol,
    price: await getAppleStockPrice(),
    change: tokenizedAssets.stockChange,
    changePercent: 0.83,
    logo: tokenizedAssets.stockLogo,
    quantity: tokenizedAssets.tokenizedAmount,
  };
  const appleTokenizedAsset = {
    stock: appleStock,
    amount: tokenizedAssets.tokenizedAmount,
  };
  return appleTokenizedAsset;
  // TODO: add other stocks
}

async function getAndProcessTokenizedAssets(
  userAccountId: string | undefined
): Promise<FullTokenizedAssets[]> {
  if (!userAccountId) {
    return [];
  }
  const tokenizedAssets = await getTokenizedAssets(userAccountId);
  if (tokenizedAssets.length === 0) {
    return [];
  }
  const processedTokenizedAssets = await Promise.all(
    tokenizedAssets.map(processTokenizedAssets)
  );
  return processedTokenizedAssets;
}

export async function getAppleStockPrice(): Promise<number> {
  const appleStock = await getStocks();
  return appleStock.find((stock) => stock.symbol === "AAPL")?.price || 0;
}
