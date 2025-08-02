import { BACKEND_URL } from "@/config";
import { MOCK_TOKENS } from "@/mocks";
import { Portfolio } from "@/types";
import { useAppKitAccount } from "@reown/appkit/react-core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAssociate } from "./useAssociate";

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

export function useTokenizePortfolio() {
  const { address } = useAppKitAccount();
  const { associate, isPending: isAssociatePending } =
    useAssociate("0.0.6476439");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending, error, data } = useMutation({
    mutationFn: async () => {
      await associate();
      await tokenizePortfolio(address);
    },
    onSuccess: () => {
      toast.success("Portfolio tokenized successfully");
      queryClient.invalidateQueries({ queryKey: ["portfolio-balance"] });
      queryClient.invalidateQueries({ queryKey: ["tokenizedAssets"] });
      navigate("/wallet");
    },
    onError: (error) => {
      toast.error("Error tokenizing portfolio");
      console.error("Error tokenizing portfolio:", error);
    },
  });
  return { mutate, isPending, error, data, isAssociatePending };
}

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

async function tokenizePortfolio(userAccountId: string | undefined) {
  if (!userAccountId) {
    console.log("No user account ID");
    return;
  }
  const response = await fetch(
    `${BACKEND_URL}/tokenize-portfolio/${userAccountId}`
  );
  const data = await response.json();
  console.log("Tokenized portfolio:", data);
}
