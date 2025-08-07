import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletTokens } from "@/hooks/usePortfolio";
import { useDepositHash } from "@/hooks/useMartket";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

export function DepositModal({
  isOpen,
  onClose,
  onDeposit,
}: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null
  );
  const { data: walletTokens, isLoading } = useWalletTokens();
  const { depositHash, isPending: isDepositPending } = useDepositHash();

  if (!isOpen) return null;

  const hashToken = walletTokens?.find((token) => token.symbol === "HASH");
  const maxDepositAmount = hashToken?.balance || 0;
  const hashValueUSD = hashToken?.valueUSD || 0;

  const handlePercentageClick = (percentage: number) => {
    const calculatedAmount = (maxDepositAmount * percentage) / 100;
    setAmount(calculatedAmount.toFixed(6));
    setSelectedPercentage(percentage);
  };

  const handleMaxClick = () => {
    setAmount(maxDepositAmount.toFixed(6));
    setSelectedPercentage(100);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setSelectedPercentage(null);
  };

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (depositAmount >= 1 && depositAmount <= maxDepositAmount) {
      // Calculate shares (this would typically come from the contract)
      const shares = depositAmount; // Simplified - in reality this would be calculated based on pool state

      // Call the deposit function
      depositHash({
        amountToDeposit: depositAmount,
        shares: shares,
        callData: "0x", // Empty call data for basic deposit
      });

      onDeposit(depositAmount);
      // Removed onClose() - modal will stay open for user to see transaction status
    }
  };

  const usdValue = parseFloat(amount) * hashValueUSD;
  const isAmountBelowMinimum = parseFloat(amount) > 0 && parseFloat(amount) < 1;
  const isProcessing = isLoading || isDepositPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Deposit</h2>
        </div>

        {/* Currency Selection */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">You will deposit</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <img
                src="/icon-dark.png"
                alt="HASH"
                className="w-6 h-6 rounded-full"
              />
              <span className="font-semibold text-gray-900">HASH</span>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.000000"
              className="w-full text-3xl font-bold text-gray-900 bg-transparent border-none outline-none text-center"
            />
            <div className="absolute right-0 top-0 text-3xl font-bold text-gray-900">
              HASH
            </div>
          </div>

          {/* USD Value */}
          <div className="text-center mt-2">
            <p className="text-sm text-gray-600">
              ${usdValue.toLocaleString()} ↑
            </p>
          </div>
        </div>

        {/* Percentage Buttons */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75].map((percentage) => (
              <button
                key={percentage}
                onClick={() => handlePercentageClick(percentage)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedPercentage === percentage
                    ? "bg-[#ff9494] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {percentage}%
              </button>
            ))}
            <button
              onClick={handleMaxClick}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                selectedPercentage === 100
                  ? "bg-[#ff9494] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              MAX
            </button>
          </div>
        </div>

        {/* Available Balance */}
        <div className="mb-6">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Available Balance</span>
            <span className="text-sm font-semibold text-gray-900">
              {maxDepositAmount.toFixed(6)} HASH
            </span>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mb-6">
          {isAmountBelowMinimum ? (
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-800">
                Minimum deposit amount is 1 HASH.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                Depositing HASH into the pool will earn you interest. You can
                withdraw your funds at any time.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Back
          </Button>
          <Button
            onClick={handleDeposit}
            disabled={
              !amount ||
              parseFloat(amount) < 1 ||
              parseFloat(amount) > maxDepositAmount ||
              isProcessing
            }
            className="flex-1 bg-[#ff9494] hover:bg-[#ff8080] text-white"
          >
            {isProcessing ? "Processing..." : "Deposit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
