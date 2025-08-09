import Navbar from "@/components/app/landing/Navbar";
import LiquidationIndicator from "@/components/app/loans/LiquidationIndicator";
import LoansTable from "@/components/app/loans/LoansTable";
import { PriceAnalysis } from "@/components/app/loans/PriceAnalysis";
import { RatesChart } from "@/components/app/loans/RatesChart";
import { BorrowModal } from "@/components/app/loans/BorrowModal";
import { DepositModal } from "@/components/app/loans/DepositModal";
import { FaAngleDoubleUp, FaWallet } from "react-icons/fa";
import { PiHandDepositFill } from "react-icons/pi";
import hash from "../../public/icon-dark.png";
import dAAPL from "../../public/apple.png";
import { getAppleStockPrice, useTokens } from "@/hooks/useTokens";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserPosition, useWithdrawCollateralHash } from "@/hooks/useMartket";
import { useWalletTokens } from "@/hooks/usePortfolio";
import { usePersonalInformation } from "@/hooks/useUserPersonalInformation";

function Loans() {
  const {
    tokenizedAssets,
    isLoading: isLoadingTokenizedAssets,
    error: errorTokenizedAssets,
  } = useTokens();
  const { withdrawCollateralHash, isPending: isWithdrawingCollateral } =
    useWithdrawCollateralHash();
  const { userPosition } = useUserPosition();
  const { data: walletTokens } = useWalletTokens();
  const { data: personalInformation } = usePersonalInformation();

  const [applePrice, setApplePrice] = useState<number>(0);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  useEffect(() => {
    const fetchApplePrice = async () => {
      const price = await getAppleStockPrice();
      console.log("price", price);
      setApplePrice(price);
    };
    fetchApplePrice();
  }, []);

  const handleBorrow = (amount: number) => {
    console.log("Borrowing:", amount, "dAAPL");
    // Here you would implement the actual borrow logic
    // For now, just log the amount
  };

  const handleDeposit = (amount: number) => {
    console.log("Depositing:", amount, "HASH");
    // Here you would implement the actual deposit logic
    // For now, just log the amount
  };

  if (errorTokenizedAssets) {
    return <div>Error: {errorTokenizedAssets?.message}</div>;
  }

  if (!tokenizedAssets) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const maxBorrowAmount = (walletTokens?.[2].balance || 0) * 0.86;
  const loanPercentage =
    (userPosition?.borrowShares || 0) / 10000 / maxBorrowAmount;

  console.log("loanPercentage", loanPercentage);

  return (
    <div className="max-w-6xl mx-auto px-2">
      <Navbar />
      <div className="my-4">
        <h1 className="text-2xl font-semibold text-primary ">
          Welcome back{" "}
          <span className="text-[#ff9494]">
            {personalInformation?.username}
          </span>
        </h1>
        <p className="text-sm text-gray-500">
          Do more with your stock portfolio
        </p>
      </div>
      <div className="flex items-center md:items-start justify-between w-full flex-col md:flex-row gap-4">
        {/* lhs */}
        <div className="flex flex-col gap-4 w-full md:w-[55%]">
          {/* top*/}
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <div className="h-[165px] bg-[#fffdf6] border border-gray-200 p-4 rounded-3xl w-full flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-base font-semibold">Usable Collateral</p>
                  <button
                    onClick={() => setIsBorrowModalOpen(true)}
                    className="text-sm text-primary font-semibold underline hover:text-[#ff9494] transition-colors"
                  >
                    Borrow
                  </button>
                </div>
                {isLoadingTokenizedAssets ? (
                  <div className="w-full h-3/4 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-2">
                    <h1 className="text-4xl font-semibold">
                      {((walletTokens?.[2].balance || 0) * 0.86).toFixed(2)}
                      <span className="text-xl text-gray-500"> dAAPL</span>
                    </h1>
                    <p className="text-sm text-gray-500">
                      $
                      {(
                        (walletTokens?.[2].valueUSD || 0) *
                        (walletTokens?.[2].balance || 0) *
                        0.86
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                )}
              </div>
              <div className="h-[165px] bg-[#fffdf6] border border-gray-200 p-4 rounded-3xl w-full flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col w-2/3">
                    <p className="text-base font-semibold">Borrowed Amount</p>
                    <div className="flex gap-2 flex-col justify-between items-start">
                      <h1
                        className={`text-2xl text-[#ff9494] flex flex-col mt-4`}
                      >
                        {((userPosition?.borrowShares || 0) / 1000000).toFixed(
                          2
                        )}{" "}
                        HASH
                        <span className="text-sm text-gray-500">
                          Approx. $
                          {(
                            (userPosition?.borrowShares || 0) / 1000000
                          ).toFixed(2)}
                        </span>
                      </h1>
                      <button
                        disabled
                        className="bg-primary text-sm text-white px-2 py-1.5 w-2/3 rounded-full mt-2"
                      >
                        Repay
                      </button>
                    </div>
                  </div>
                  <div className="h-[140px] w-1/4 md:w-1/3">
                    <LiquidationIndicator percentage={loanPercentage} />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[340px] bg-[#fffdf6] border border-gray-200 rounded-3xl flex flex-col gap-2 w-full md:w-1/2">
              <div className="flex items-center justify-between p-4">
                <p className="text-base font-semibold">Current Rate</p>
                <FaAngleDoubleUp className={`text-green-500 text-2xl`} />
              </div>
              <div className="flex flex-col gap-2 px-4">
                <p className="text-2xl text-primary font-semibold">7%</p>
              </div>
              <RatesChart />
            </div>
          </div>
          {/* end top*/}

          {/* bottom */}
          <div className="flex flex-col gap-2">
            <LoansTable />
          </div>
          {/* end bottom */}
        </div>
        {/* end lhs */}

        {/* rhs */}
        <div className="flex flex-col gap-4 w-full md:w-[45%] ">
          {/* top */}
          <div className="bg-[#fffdf6] border border-gray-200 rounded-3xl p-4 h-[500px]">
            <div className="flex items-center justify-between my-2">
              <h1 className="text-lg font-semibold">Lending Pool Analytics</h1>
              <div className="flex items-center gap-2 bg-[#f5f5f5] rounded-full px-2 py-1 border border-gray-200">
                <p className="text-sm text-gray-500 flex items-center gap-0.5 font-bold">
                  <img src={hash} alt="hash" className="w-5 h-5 rounded-full" />{" "}
                  HASH
                </p>{" "}
                -{" "}
                <p className="text-sm text-gray-500 flex items-center gap-0.5 font-bold">
                  <img
                    src={dAAPL}
                    alt="dAAPL"
                    className="w-5 h-5 rounded-full"
                  />{" "}
                  dAAPL
                </p>
              </div>
            </div>
            <PriceAnalysis />
          </div>
          {/* end top */}

          {/* bottom */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="bg-[#fffdf6] border border-gray-200 rounded-3xl p-3 h-[240px] w-full">
              <div className="flex items-center gap-2 w-full my-2">
                <div className="bg-[#e5e3e3] rounded-full p-2 border border-gray-200">
                  <FaWallet className="text-primary text-xl" />
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-semibold">Collateral Locked</p>
                  <p className="text-xs text-gray-500">
                    Amount of collateral locked
                  </p>
                </div>
              </div>
              <div className="flex flex-col mt-8 justify-between">
                <p className="text-2xl font-semibold">
                  {userPosition?.collateral} dAAPL
                </p>
                <p className="text-sm text-gray-500">
                  Approx. ${(userPosition?.collateral || 0) * applePrice}
                </p>
              </div>
              <button
                disabled
                className="bg-primary text-sm text-white px-4 py-1.5 w-full rounded-full mt-10 opacity-50 cursor-not-allowed"
              >
                Unlock Collateral
              </button>
            </div>
            <div className="bg-[#fffdf6] border border-gray-200 rounded-3xl p-3 h-[240px] w-full">
              <div className="flex items-center gap-2 w-full my-2">
                <div className="bg-[#e5e3e3] rounded-full p-2 border border-gray-200">
                  <PiHandDepositFill className="text-primary text-xl" />
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-semibold">Deposit HASH</p>
                  <p className="text-xs text-gray-500">
                    Existing deposit in the pool
                  </p>
                </div>
              </div>
              <div className="flex flex-col mt-8 justify-between">
                <p className="text-2xl font-semibold">
                  {((userPosition?.supplyShares || 0) / 1000000).toFixed(2)}{" "}
                  HASH
                </p>
                <p className="text-sm text-gray-500">
                  Approx. ${(userPosition?.supplyShares || 0) * 1}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setIsDepositModalOpen(true)}
                  className="bg-primary text-sm text-white px-4 py-1.5 w-full rounded-full mt-10 border border-primary  cursor-pointer transition-colors"
                >
                  Deposit
                </button>
                <button
                  onClick={() => withdrawCollateralHash()}
                  disabled={isWithdrawingCollateral}
                  className="bg-white text-sm text-primary px-4 py-1.5 w-full rounded-full mt-10 border border-primary cursor-pointer "
                >
                  {isWithdrawingCollateral ? "Withdrawing..." : "Withdraw"}
                </button>
              </div>
            </div>
          </div>
          {/* end bottom */}
        </div>
        {/* end rhs */}
      </div>
      <p className="text-center flex-col text-gray-400 text-xs mt-8 flex md:flex-row items-center justify-center gap-2">
        Market Testnet Contract:{" "}
        <a
          className="text-primary underline"
          href="https://hashscan.io/testnet/contract/0.0.6532033"
          target="_blank"
          rel="noopener noreferrer"
        >
          0.0.6532033
        </a>
      </p>
      <BorrowModal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        onBorrow={handleBorrow}
        maxBorrowAmount={maxBorrowAmount}
        currentPrice={applePrice}
      />
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onDeposit={handleDeposit}
      />
    </div>
  );
}

export default Loans;
