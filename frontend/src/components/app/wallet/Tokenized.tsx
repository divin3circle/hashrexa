import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STOCK_LOGOS } from "@/assets";
import { useTokens } from "@/hooks/useTokens";
import { useAppKitAccount } from "@reown/appkit/react-core";
import { Loader2 } from "lucide-react";

function TokenizedTable() {
  const { address } = useAppKitAccount();
  const { tokenizedAssets, isLoading, error } = useTokens(address);
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
    <div className="mt-12 mb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-primary">
          Tokenized Assets
        </h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] md:w-[200px] font-semibold">
              Token
            </TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold ">Market Value</TableHead>
            <TableHead className="text-right font-semibold ">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokenizedAssets.map((token, index) => (
            <TableRow
              className={`my-2 h-20 ${
                index % 2 === 0
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
              key={index}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-1">
                  <div className="relative w-11 h-11 border border-gray-200 rounded-full">
                    <img
                      src={token.stock.logo}
                      alt={token.stock.symbol}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full">
                      <img
                        src={STOCK_LOGOS.HASHGRAPH}
                        alt="hashgraph"
                        className="w-3 h-3 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="">
                    <p className="text-sm font-bold flex flex-col">
                      d{token.stock.symbol}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm font-semibold">{token.stock.name}</p>
              </TableCell>
              <TableCell>${token.stock.price}</TableCell>

              <TableCell className="text-right">
                $
                {(token.amount * token.stock.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TokenizedTable;
