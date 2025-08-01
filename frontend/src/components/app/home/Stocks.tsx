import useStocks from "@/hooks/useStocks";
import { useStockStore } from "@/store";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";

function Stocks() {
  const { data, isLoading, error } = useStocks();
  const { selectedStock, setSelectedStock } = useStockStore();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div className="mt-10 ">
      <div className="flex flex-col items-center justify-center md:flex-row md:justify-between gap-2">
        {data.map((stock) => (
          <div
            key={stock.symbol}
            className={`flex flex-col gap-4 rounded-3xl p-3 h-[150px] md:w-[300px] w-full cursor-pointer hover:shadow-sm transition-all duration-300 ${
              selectedStock === stock.symbol
                ? "border-1 border-[#ff9494]"
                : "border-1 border-gray-300 "
            }`}
            onClick={() => setSelectedStock(stock.symbol)}
          >
            <div className="flex items-center gap-2 mt-1">
              <img
                src={stock.logo}
                alt={stock.name}
                className="w-9 h-9 rounded-full"
              />
              <div className="flex flex-col">
                <p className="text-xl font-bold">{stock.symbol}</p>
                <p className="text-sm text-gray-400">{stock.name}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className={`text-xl font-bold`}>
                $
                {stock.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p
                className={`text-sm p-0.5 rounded-full border w-fit px-2 text-center flex items-center gap-1 ${
                  stock.change > 0
                    ? "border-green-500 text-green-500"
                    : "border-red-500 text-red-500"
                }`}
              >
                {stock.change > 0 ? (
                  <FaAngleDoubleUp className="w-4 h-4 text-green-500" />
                ) : (
                  <FaAngleDoubleDown className="w-4 h-4 text-red-500" />
                )}
                $
                {(stock.quantity * stock.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stocks;
