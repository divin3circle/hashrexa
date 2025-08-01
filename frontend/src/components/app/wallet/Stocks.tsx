import useStocks from "@/hooks/useStocks";
import { Loader2 } from "lucide-react";

function StocksTable() {
  const { data: stocks, error, isLoading } = useStocks();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  if (!stocks) {
    return <div>No data</div>;
  }
  return (
    <div className="mt-16 mb-10">
      <h1 className="text-2xl font-semibold text-primary my-4">My Stocks</h1>

      <div className="bg-[#fffdf6] rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="py-4 px-6 text-sm text-gray-500 bg-[#ff9494]/5 border-b border-gray-200">
              Stocks Options from Alpaca
            </caption>
            <thead className="bg-[#ff9494]/5 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  #
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Asset
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Value
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 hidden md:block">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={stock.logo}
                          alt={stock.symbol}
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {stock.symbol}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    ≈$
                    {stock.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    $
                    {(stock.price * stock.quantity).toLocaleString("en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 hidden md:block">
                    {stock.quantity.toLocaleString("en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StocksTable;
