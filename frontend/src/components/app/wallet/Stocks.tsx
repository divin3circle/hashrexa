import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_STOCKS } from "@/mocks";

function StocksTable() {
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
            <TableHead className="font-semibold ">P/L</TableHead>
            <TableHead className="text-right font-semibold ">
              Quantity
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_STOCKS.map((stock, index) => (
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
                  <p className="text-sm font-semibold flex flex-col">
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
                {(stock.price * 10).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell
                className={` ${
                  stock.changePercent > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stock.changePercent} %
              </TableCell>
              <TableCell className="text-right">10</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default StocksTable;
