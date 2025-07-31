import { BACKEND_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { Stock, TokenizedAsset, FullTokenizedAssets } from "@/types";
import { STOCK_LOGOS } from "@/assets";

export function useTokens(userAccountId: string | undefined) {
  if (!userAccountId) {
    throw new Error("User account ID is required");
  }
  const {
    data: tokenizedAssets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tokenizedAssets"],
    queryFn: () => getAndProcessTokenizedAssets(userAccountId),
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
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 150.75,
    change: 1.25,
    changePercent: 0.83,
    logo: STOCK_LOGOS.AAPL,
  };
  const appleTokenizedAsset = {
    stock: appleStock,
    amount: tokenizedAssets.amount,
  };
  return appleTokenizedAsset;
  // TODO: add other stocks
}

async function getAndProcessTokenizedAssets(
  userAccountId: string
): Promise<FullTokenizedAssets[]> {
  const tokenizedAssets = await getTokenizedAssets(userAccountId);
  if (tokenizedAssets.length === 0) {
    return [];
  }
  const processedTokenizedAssets = await Promise.all(
    tokenizedAssets.map(processTokenizedAssets)
  );

  return processedTokenizedAssets;
}
