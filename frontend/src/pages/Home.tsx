import { StockHistoricalPrice } from "@/components/app/home/StockHistoricalPrice";
import Stocks from "@/components/app/home/Stocks";
import Navbar from "@/components/app/landing/Navbar";
import { Button } from "@/components/ui/button";
import { TOKENIZED_ASSETS } from "@/mocks";
import { FaEllipsisV } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { useLoans } from "@/hooks/useLoans";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function Home() {
  const { data: loans, isLoading, error } = useLoans();

  if (error || !loans) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-2">
      <Navbar />
      <Stocks />
      <div className="flex flex-col items-center justify-center md:flex-row md:justify-between mt-12 gap-2 md:items-start">
        <div className="w-full md:w-full">
          <StockHistoricalPrice />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-[40%]">
          <div className=" border border-gray-200 rounded-3xl h-[280px] py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-bold">Tokenized Stocks</h1>
                <p className="text-xs text-gray-400">
                  Your web2 Assets on Hedera
                </p>
              </div>
              <FaEllipsisV className="text-xl cursor-pointer" />
            </div>
            <div className="flex flex-col gap-2">
              {TOKENIZED_ASSETS.length > 0 &&
                TOKENIZED_ASSETS.slice(0, 2).map((stock) => (
                  <div className="flex justify-between py-1.5 my-2">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={stock.stock.logo}
                        className="w-8 h-8 rounded-full "
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold">
                          {stock.stock.symbol}
                        </p>
                        <p className="text-xs font-bold text-gray-400">
                          {stock.stock.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-semibold">
                        $
                        {(stock.stock.price * stock.amount).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>
                      <p className="text-xs font-semibold text-gray-400">
                        {stock.amount} {stock.stock.symbol}
                      </p>
                    </div>
                  </div>
                ))}

              {TOKENIZED_ASSETS.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm font-semibold">
                    You don't have any tokenized stocks yet
                  </p>
                </div>
              )}
            </div>
            <Button className="w-full mt-4 rounded-3xl">
              {TOKENIZED_ASSETS.length === 0 ? "Start Tokenizing" : "View All"}
            </Button>
          </div>
          <div className="border border-gray-200 rounded-3xl h-[280px] py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-bold">My Loans</h1>
                <p className="text-xs text-gray-400">
                  Track the status of your loan & collateral
                </p>
              </div>
              <FaChevronRight className="text-xl cursor-pointer" />
            </div>
            <div className="flex flex-col gap-2">
              {loans.length > 0 &&
                loans.slice(0, 2).map((loan) => (
                  <div className="flex justify-between py-1.5 my-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center ">
                        <motion.img
                          // i want a bounceanimation on load
                          initial={{ y: 0 }}
                          animate={{ y: 10 }}
                          transition={{
                            duration: 0.5,
                            repeat: 2,
                            repeatType: "reverse",
                          }}
                          src={loan.collateralTokenImage}
                          className="w-8 h-8 rounded-full "
                        />
                        <motion.img
                          initial={{ y: 10 }}
                          animate={{ y: 0 }}
                          transition={{
                            duration: 0.5,
                            repeat: 2,
                            repeatType: "reverse",
                          }}
                          src={loan.borrowedTokenImage}
                          className="w-9 h-9 rounded-full -ml-4"
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold">
                          {loan.borrowedToken}
                        </p>
                        <p className="text-xs font-bold text-gray-400">
                          {loan.collateralTokenSymbol}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-semibold">
                        $
                        {loan.borrowedAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs font-semibold text-gray-400">
                        Health: 50%
                      </p>
                    </div>
                  </div>
                ))}

              {loans.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm font-semibold">
                    You don't have any loans yet
                  </p>
                </div>
              )}
            </div>
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
