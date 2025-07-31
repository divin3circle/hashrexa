import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <div className="mt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-primary">My Stocks</h1>
      </div>
      <Table>
        <TableCaption>Stocks Options from Alpaca</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] md:w-[200px] font-semibold">
              Asset
            </TableHead>
            <TableHead className="font-semibold">Price</TableHead>
            <TableHead className="font-semibold ">Market Value</TableHead>
            <TableHead className="text-right font-semibold ">
              Quantity
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock, index) => (
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
                  <img
                    src={stock.logo}
                    alt={stock.symbol}
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="text-sm font-bold flex flex-col">
                    {stock.symbol}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                $
                {stock.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                $
                {(stock.price * stock.quantity).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-right">{stock.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default StocksTable;
