import ConnectButton from "@/components/ui/ConnectButton";
import { FaBars } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const pathname = useLocation();
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center justify-between min-w-[300px] md:min-w-[600px]">
        <h1 className="font-bold font-mono p-1.5 md:p-0 uppercase">
          <span className="text-[#ff9494] text-3xl lowercase">hash</span>rexa.
        </h1>
        <div className="items-center justify-between hidden md:flex gap-4">
          <Link
            to="/home"
            className={`text-base font-semibold lowercase mt-1.5 mx-4 ${
              pathname.pathname === "/home"
                ? "text-[#ff9494] font-bold text-lg"
                : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/wallet"
            className={`text-base font-semibold lowercase mt-1.5 mx-4 ${
              pathname.pathname === "/wallet"
                ? "text-[#ff9494] font-bold text-lg"
                : ""
            }`}
          >
            Wallet
          </Link>
          <Link
            to="/loans"
            className={`text-base font-semibold lowercase mt-1.5 mx-4 ${
              pathname.pathname === "/loan"
                ? "text-[#ff9494] font-bold text-lg"
                : ""
            }`}
          >
            Loans
          </Link>
          <Link
            to="/profile"
            className={`text-base font-semibold cursor-pointer lowercase mt-1.5 mx-4 ${
              pathname.pathname === "/profile"
                ? "text-[#ff9494] font-bold text-lg"
                : ""
            }`}
          >
            Profile
          </Link>
        </div>
      </div>
      <div className="items-center hidden md:flex">
        <ConnectButton />
      </div>
      <div className="items-center flex md:hidden mr-2">
        <FaBars className="text-3xl cursor-pointer" />
      </div>
    </div>
  );
}

export default Navbar;
