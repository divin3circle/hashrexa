import { CheckCircle, XCircle } from "lucide-react";

const loanHistoryData = [
  {
    id: 1,
    asset: "AAPL",
    date: "15 Jan, 2025",
    interest: "$50.2",
    status: "paid",
    amount: "$2,165",
  },
  {
    id: 2,
    asset: "AAPL",
    date: "05 Jul, 2025",
    interest: "$210.2",
    status: "paid",
    amount: "$20,165",
  },
  {
    id: 3,
    asset: "AAPL",
    date: "13 Apr, 2025",
    interest: "$5.2",
    status: "paid",
    amount: "$165",
  },
];

function LoansTable() {
  return (
    <div className="bg-[#fffdf6] rounded-3xl border border-gray-200 overflow-hidden h-[400px]">
      <div className="p-6 ">
        <h3 className="text-lg font-semibold text-gray-900">Loan History</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Collateral
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 hidden md:block">
                Date
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Interest
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {loanHistoryData.map((loan) => (
              <tr
                key={loan.id}
                className="border-b border-gray-100 hover:bg-[#fffdf6]/50 duration-300 transition-colors cursor-pointer h-[70px]"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        d{loan.asset}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 hidden md:block">
                  {loan.date}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {loan.interest}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    {loan.status === "paid" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">
                          Paid
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600 font-medium">
                          Not Paid
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {loan.amount}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LoansTable;
