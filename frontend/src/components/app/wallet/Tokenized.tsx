import { STOCK_LOGOS } from "@/assets";
import { useTokens } from "@/hooks/useTokens";
import { Loader2 } from "lucide-react";

function TokenizedTable() {
  const { tokenizedAssets, isLoading, error } = useTokens();
  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  if (!tokenizedAssets) {
    return (
      <div className="flex justify-center items-center h-full">
        No tokenized assets found
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }
  return (
    <div className="mt-16 mb-10">
      <h1 className="text-2xl font-semibold text-primary my-4">
        Tokenized Assets
      </h1>

      <div className="bg-[#fffdf6] rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#ff9494]/5 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  #
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Token name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  <div className="flex items-center gap-1">Value</div>
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 hidden md:block">
                  <div className="flex items-center gap-1">Balance</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tokenizedAssets.map((token, index) => (
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
                          src={token.stock.logo}
                          alt={token.stock.symbol}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                          <img
                            src={STOCK_LOGOS.HASHGRAPH}
                            alt="hashgraph"
                            className="w-full h-full rounded-full"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          d{token.stock.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          d{token.stock.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    ≈$
                    {token.stock.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    $
                    {(token.amount * token.stock.price).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      }
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 mt-3 hidden md:flex">
                    {token.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </td>
                </tr>
              ))}
              {tokenizedAssets.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-500 text-sm py-8"
                  >
                    No tokenized assets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TokenizedTable;
