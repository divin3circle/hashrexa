import { BACKEND_URL } from "@/config";
import { MOCK_TOKENS } from "@/mocks";
import { Portfolio } from "@/types";
import { useAppKitAccount } from "@reown/appkit/react-core";
import { useQuery } from "@tanstack/react-query";

export function usePortfolioBalance() {
  const { address } = useAppKitAccount();
  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio-balance"],
    queryFn: async () => await getPortfolioBalance(address),
  });
  const decimalPlaces =
    data?.portfolioValueUSD?.toString().split(".")[1]?.length || 0;

  return { data, isLoading, error, decimalPlaces };
}

export const useWalletTokens = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["wallet-tokens"],
    queryFn: async () => await getWalletTokens(),
  });
  return { data, isLoading, error };
};

async function getWalletTokens() {
  return MOCK_TOKENS;
}

async function getPortfolioBalance(
  userAccountId: string | undefined
): Promise<Portfolio> {
  if (!userAccountId) {
    console.log("No user account ID");
    return { portfolioValueUSD: 0, tokenizedAssets: 0, optionsAssets: 0 };
  }
  const response = await fetch(`${BACKEND_URL}/portfolio/${userAccountId}`);
  const data = await response.json();
  return data.portfolio as Portfolio;
}
