import Navbar from "@/components/app/landing/Navbar";
import StocksTable from "@/components/app/wallet/Stocks";
import TokensTable from "@/components/app/wallet/Tokens";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortfolioBalance } from "@/hooks/usePortfolio";
import { HiOutlineRefresh } from "react-icons/hi";

function Wallet() {
  const { data, isLoading, error, decimalPlaces } = usePortfolioBalance();
  if (error || !data) {
    return <div>Error: {error?.message}</div>;
  }
  return (
    <div className="max-w-6xl mx-auto px-2">
      <Navbar />
      <div className="flex justify-between items-center mt-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-sm md:text-base font-semibold text-gray-500 ">
            Unified Wallet Balance
          </h1>
          {isLoading ? (
            <Skeleton className="w-20 h-4" />
          ) : (
            <h1 className="text-4xl md:text-6xl my-2">
              $
              {data.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
              <span className="text-2xl md:text-4xl text-gray-500">
                {decimalPlaces > 0 ? "." : ""}
                {decimalPlaces > 0 &&
                  data.toString().split(".")[1].slice(0, decimalPlaces)}
              </span>
              <span className="text-sm ml-1 md:text-base text-[#ff9494] font-bold">
                USD
              </span>
            </h1>
          )}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1 text-green-600 py-1 bg-green-500/10 px-2 rounded-3xl border border-green-600/20">
              <p className="text-sm text-gray-500">4 Minted tokens</p>
            </div>
            <div className="flex flex-col gap-1 rounded-3xl bg-gray-100 px-2 py-1 border border-gray-200">
              <p className="text-sm text-gray-500">6 Stocks Options</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HiOutlineRefresh className="text-2xl text-primary cursor-pointer" />
        </div>
      </div>
      <StocksTable />
      <TokensTable />
    </div>
  );
}

export default Wallet;
