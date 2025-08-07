import { BACKEND_URL } from "@/config";
import { MOCK_TOKENS } from "@/mocks";
import { AccountBalancesResponse, Portfolio, TokenBalance } from "@/types";
import { useAppKitAccount } from "@reown/appkit/react-core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAssociate } from "./useAssociate";

const MIRROR_NODE_URL =
  "https://testnet.mirrornode.hedera.com/api/v1/balances?account.id=";
const URL_SUFFIX = "&limit=2&order=asc";

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

export function useHederaWalletBalanceUSD() {
  const { address } = useAppKitAccount();
  const { data, isLoading, error } = useQuery({
    queryKey: ["hedera-wallet-balance-usd"],
    queryFn: async () => {
      const tokens = await getWalletTokens(address);

      const hederaWalletBalanceUSD = await getHederaWalletBalanceUSD(tokens);

      return hederaWalletBalanceUSD;
    },
  });
  return { data, isLoading, error };
}

export const useWalletTokens = () => {
  const { address } = useAppKitAccount();
  const { data, isLoading, error } = useQuery({
    queryKey: ["wallet-tokens"],
    queryFn: async () => await getWalletTokens(address),
  });
  return { data, isLoading, error };
};

export function useTokenizePortfolio() {
  const { address } = useAppKitAccount();
  const { associate, isPending: isAssociatePending } =
    useAssociate("0.0.6509511");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending, error, data } = useMutation({
    mutationFn: async () => {
      await associate();
    },
    onSuccess: async () => {
      toast.success("Portfolio tokenized successfully");
      queryClient.invalidateQueries({ queryKey: ["portfolio-balance"] });
      queryClient.invalidateQueries({ queryKey: ["tokenizedAssets"] });
      await tokenizePortfolio(address);
      navigate("/wallet");
    },
    onError: (error) => {
      toast.error("Error tokenizing portfolio");
      console.error("Error tokenizing portfolio:", error);
    },
  });
  return { mutate, isPending, error, data, isAssociatePending };
}

async function getWalletTokens(
  userAccountId: string | undefined
): Promise<TokenBalance[]> {
  if (!userAccountId) {
    console.log("No user account ID");
    throw new Error("No user account ID");
  }
  const response = await fetch(
    `${MIRROR_NODE_URL}${userAccountId}${URL_SUFFIX}`
  );
  const data = (await response.json()) as AccountBalancesResponse;
  const hash = MOCK_TOKENS[1];
  const hbar = MOCK_TOKENS[0];
  console.log("Hash balance:", await getTokenBalance(hash.symbol, data));

  const hashBalance = (await getTokenBalance(hash.symbol, data)) / 10 ** 6;
  const hbarBalance = (await getTokenBalance(hbar.symbol, data)) / 10 ** 8;

  const hashValueUSD = await getTokenValueUSD(hash.symbol);
  const hbarValueUSD = await getTokenValueUSD(hbar.symbol);

  const tokens = [
    {
      ...hash,
      balance: hashBalance,
      valueUSD: hashValueUSD,
    },
    {
      ...hbar,
      balance: hbarBalance,
      valueUSD: hbarValueUSD,
    },
  ];

  return tokens;
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

async function getTokenBalance(
  token: string,
  balanceQuery: AccountBalancesResponse
): Promise<number> {
  if (token === "HASH") {
    return (
      balanceQuery.balances[0].tokens.find(
        (token) => token.token_id === "0.0.6494054"
      )?.balance || 0
    );
  } else if (token === "HBAR") {
    return balanceQuery.balances[0].balance;
  }
  return 0;
}

async function getTokenValueUSD(token: string): Promise<number> {
  if (token === "HASH") {
    return 1.0;
  } else if (token === "HBAR") {
    return await getHbarPrice();
  }
  return 0;
}

async function getHbarPrice(): Promise<number> {
  const response = await fetch(
    "https://api.binance.com/api/v3/ticker/price?symbol=HBARUSDT"
  );
  const data = await response.json();
  return data.price;
}

async function getHederaWalletBalanceUSD(
  tokens: TokenBalance[]
): Promise<number> {
  return tokens.reduce((acc, token) => acc + token.balance * token.valueUSD, 0);
}
