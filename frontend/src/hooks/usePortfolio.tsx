import { MOCK_PORTFOLIO_BALANCE } from "@/mocks";
import { useQuery } from "@tanstack/react-query";

export function usePortfolioBalance() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio-balance"],
    queryFn: async () => await getPortfolioBalance(),
  });
  const decimalPlaces = data?.toString().split(".")[1]?.length || 0;

  return { data, isLoading, error, decimalPlaces };
}

async function getPortfolioBalance() {
  return MOCK_PORTFOLIO_BALANCE;
}
