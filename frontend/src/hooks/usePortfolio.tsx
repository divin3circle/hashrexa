import { MOCK_PORTFOLIO_BALANCE, MOCK_TOKENS } from "@/mocks";
import { useQuery } from "@tanstack/react-query";

export function usePortfolioBalance() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio-balance"],
    queryFn: async () => await getPortfolioBalance(),
  });
  const decimalPlaces = data?.toString().split(".")[1]?.length || 0;

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

async function getPortfolioBalance() {
  return MOCK_PORTFOLIO_BALANCE;
}
