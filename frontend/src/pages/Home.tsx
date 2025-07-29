import { StockHistoricalPrice } from "@/components/app/home/StockHistoricalPrice";
import Stocks from "@/components/app/home/Stocks";
import Navbar from "@/components/app/landing/Navbar";
import { TOKENIZED_ASSETS } from "@/mocks";
import { FaEllipsisV } from "react-icons/fa";

function Home() {
  return (
    <div className="max-w-6xl mx-auto px-2">
      <Navbar />
      <Stocks />
      <div className="flex flex-col items-center justify-center md:flex-row md:justify-between mt-12 gap-2 md:items-start">
        <div className="w-full md:w-full">
          <StockHistoricalPrice />
        </div>
        <div className="w-full md:w-[40%] border border-gray-200 rounded-3xl h-[565px] py-3 px-4">
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
            {
              TOKENIZED_ASSETS.map((stock) => (
                <div className="flex justify-between py-1.5 my-2">
                  <div className="flex items-center gap-1.5">
                    <img src={stock.stock.logo} className="w-8 h-8 rounded-full " />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{stock.stock.symbol}</p>
                      <p className="text-xs font-semibold text-gray-400">{stock.stock.name}</p>
                      </div>
                      </div>

                  </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
