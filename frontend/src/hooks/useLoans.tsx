import { MOCK_LOAN_STATUS, MOCK_STOCKS } from "@/mocks";
import { FullLoanDetails, LoanStatus } from "@/types";
import { useQuery } from "@tanstack/react-query";
import logo from "../../public/apple.png";
import hash from "../../public/icon-dark.png";

export function useLoans() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["allLoans"],
    queryFn: async () => getAllUserLoans(),
  });
  return { data, isLoading, error };
}

async function getAllUserLoans(): Promise<FullLoanDetails[]> {
  const userLoans = MOCK_LOAN_STATUS;
  return await Promise.all(userLoans.map((loan) => getLoanDetails(loan)));
}

async function getLoanDetails(loan: LoanStatus): Promise<FullLoanDetails> {
  let collateralTokenImage = MOCK_STOCKS.find(
    (stock) => stock.symbol === loan.collateral_token
  )?.logo;
  if (!collateralTokenImage) {
    collateralTokenImage = logo;
  }
  const fullLoanDetails: FullLoanDetails = {
    collateralTokenImage,
    collateralTokenSymbol: loan.collateral_token,
    borrowedAmount: loan.borrowed_amount,
    borrowedTokenImage: hash,
    apy: loan.apy,
    borrowedToken: "HASH",
  };
  return fullLoanDetails;
}
