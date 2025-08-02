import Navbar from "@/components/app/landing/Navbar";
import LiquidationIndicator from "@/components/app/loans/LiquidationIndicator";
import LoansTable from "@/components/app/loans/LoansTable";
import { PriceAnalysis } from "@/components/app/loans/PriceAnalysis";
import { RatesChart } from "@/components/app/loans/RatesChart";
import { FaAngleDoubleUp, FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PiHandDepositFill } from "react-icons/pi";
import hash from "../../public/icon-dark.png";
import dAAPL from "../../public/apple.png";

function Loans() {
  return (
    <div className="max-w-6xl mx-auto px-2">
      <Navbar />
      <div className="my-4">
        <h1 className="text-2xl font-semibold text-primary ">
          Welcome back <span className="text-[#ff9494]">Sylus</span>
        </h1>
        <p className="text-sm text-gray-500">
          Do more with your stock portfolio
        </p>
      </div>
      <div className="flex items-center md:items-start justify-between w-full flex-col md:flex-row gap-4">
        {/* lhs */}
        <div className="flex flex-col gap-4 w-full md:w-[55%]">
          {/* top*/}
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <div className="h-[165px] bg-[#eeeeee] border border-gray-200 p-4 rounded-3xl w-full flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-base font-semibold">
                    Available Collateral
                  </p>
                  <Link
                    to="/home"
                    className="text-sm text-primary font-semibold underline"
                  >
                    Borrow
                  </Link>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <h1 className="text-4xl font-semibold">
                    74.12 <span className="text-xl text-gray-500">dAAPL</span>
                  </h1>
                  <p className="text-sm text-gray-500">$14,090.45 </p>
                </div>
              </div>
              <div className="h-[165px] bg-[#eeeeee] border border-gray-200 p-4 rounded-3xl w-full flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col h-[130px] justify-between w-2/3">
                    <p className="text-base font-semibold">Loan Health</p>
                    <h1 className={`text-3xl text-red-500`}>
                      53<span className="text-2xl text-gray-500">%</span>
                    </h1>
                  </div>
                  <div className="h-[140px] w-1/4 md:w-1/3">
                    <LiquidationIndicator percentage={53} />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[340px] bg-[#eeeeee] border border-gray-200 rounded-3xl flex flex-col gap-2 w-full md:w-1/2">
              <div className="flex items-center justify-between p-4">
                <p className="text-base font-semibold">Current Rate</p>
                <FaAngleDoubleUp className={`text-green-500 text-2xl`} />
              </div>
              <div className="flex flex-col gap-2 px-4">
                <p className="text-2xl text-primary font-semibold">7%</p>
              </div>
              <RatesChart />
            </div>
          </div>
          {/* end top*/}

          {/* bottom */}
          <div className="flex flex-col gap-2">
            <LoansTable />
          </div>
          {/* end bottom */}
        </div>
        {/* end lhs */}

        {/* rhs */}
        <div className="flex flex-col gap-4 w-full md:w-[45%] ">
          {/* top */}
          <div className="bg-[#eeeeee] border border-gray-200 rounded-3xl p-4 h-[500px]">
            <div className="flex items-center justify-between my-2">
              <h1 className="text-lg font-semibold">Lending Pool Analytics</h1>
              <div className="flex items-center gap-2 bg-[#f5f5f5] rounded-full px-2 py-1 border border-gray-200">
                <p className="text-sm text-gray-500 flex items-center gap-0.5 font-bold">
                  <img src={hash} alt="hash" className="w-5 h-5 rounded-full" />{" "}
                  HASH
                </p>{" "}
                -{" "}
                <p className="text-sm text-gray-500 flex items-center gap-0.5 font-bold">
                  <img
                    src={dAAPL}
                    alt="dAAPL"
                    className="w-5 h-5 rounded-full"
                  />{" "}
                  dAAPL
                </p>
              </div>
            </div>
            <PriceAnalysis />
          </div>
          {/* end top */}

          {/* bottom */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="bg-[#eeeeee] border border-gray-200 rounded-3xl p-3 h-[240px] w-full">
              <div className="flex items-center gap-2 w-full my-2">
                <div className="bg-[#e5e3e3] rounded-full p-2 border border-gray-200">
                  <FaWallet className="text-primary text-xl" />
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-semibold">Claimable HASH</p>
                  <p className="text-xs text-gray-500">
                    Interest accrued since last claim
                  </p>
                </div>
              </div>
              <div className="flex flex-col mt-8 justify-between">
                <p className="text-2xl font-semibold">16.75 HASH</p>
                <p className="text-sm text-gray-500">Approx. $16.50</p>
              </div>
              <button className="bg-primary text-sm text-white px-4 py-1.5 w-full rounded-full mt-10">
                Claim
              </button>
            </div>
            <div className="bg-[#eeeeee] border border-gray-200 rounded-3xl p-3 h-[240px] w-full">
              <div className="flex items-center gap-2 w-full my-2">
                <div className="bg-[#e5e3e3] rounded-full p-2 border border-gray-200">
                  <PiHandDepositFill className="text-primary text-xl" />
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-semibold">Deposit HASH</p>
                  <p className="text-xs text-gray-500">
                    Existing deposit in the pool
                  </p>
                </div>
              </div>
              <div className="flex flex-col mt-8 justify-between">
                <p className="text-2xl font-semibold">1,066.75 HASH</p>
                <p className="text-sm text-gray-500">Approx. $1,066.50</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button className="bg-primary text-sm text-white px-4 py-1.5 w-full rounded-full mt-10">
                  Deposit
                </button>
                <button className="bg-white text-sm text-primary px-4 py-1.5 w-full rounded-full mt-10 border border-gray-200">
                  Withdraw
                </button>
              </div>
            </div>
          </div>
          {/* end bottom */}
        </div>
        {/* end rhs */}
      </div>
    </div>
  );
}

export default Loans;
