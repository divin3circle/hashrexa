import { useWalletTokens } from "@/hooks/usePortfolio";
import { STOCK_LOGOS } from "@/assets";
import { ChevronDown, Search } from "lucide-react";

function TokensTable() {
  const { data, isLoading, error } = useWalletTokens();
  if (error || !data) {
    return <div>Error: {error?.message}</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mt-16 mb-10">
      <h1 className="text-2xl font-semibold text-primary my-4">My Tokens</h1>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#fffdf6] border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
            <img
              src={STOCK_LOGOS.HASHGRAPH}
              alt="Hedera"
              className="w-5 h-5 rounded-full"
            />
            <span className="text-sm font-medium">Hedera</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter tokens"
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff9494] focus:border-transparent"
          />
        </div>
      </div>

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
              {data.map((token, index) => (
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
                          src={token.icon}
                          alt={token.symbol}
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
                          {token.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {token.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    ≈$
                    {token.valueUSD.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    $
                    {(token?.balance * token.valueUSD).toLocaleString("en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 hidden md:block">
                    {(token?.balance || 0).toLocaleString("en-US", {
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

export default TokensTable;
