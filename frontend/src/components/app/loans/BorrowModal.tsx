import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBorrow: (amount: number) => void;
  maxBorrowAmount: number;
  currentPrice: number;
}

export function BorrowModal({
  isOpen,
  onClose,
  onBorrow,
  maxBorrowAmount,
  currentPrice,
}: BorrowModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null
  );

  if (!isOpen) return null;

  const handlePercentageClick = (percentage: number) => {
    const calculatedAmount = (maxBorrowAmount * percentage) / 100;
    setAmount(calculatedAmount.toFixed(2));
    setSelectedPercentage(percentage);
  };

  const handleMaxClick = () => {
    setAmount(maxBorrowAmount.toFixed(2));
    setSelectedPercentage(86);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setSelectedPercentage(null);
  };

  const handleBorrow = () => {
    const borrowAmount = parseFloat(amount);
    if (borrowAmount > 0 && borrowAmount <= maxBorrowAmount) {
      onBorrow(borrowAmount);
      onClose();
    }
  };

  const usdValue = parseFloat(amount) * currentPrice;

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
          <h2 className="text-2xl font-bold text-gray-900">Borrow</h2>
        </div>

        {/* Currency Selection */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">You will borrow</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <img
                src="/apple.png"
                alt="dAAPL"
                className="w-6 h-6 rounded-full"
              />
              <span className="font-semibold text-gray-900">dAAPL</span>
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
              placeholder="0.00"
              className="w-full text-3xl font-bold text-gray-900 bg-transparent border-none outline-none text-center"
            />
            <div className="absolute right-0 top-0 text-3xl font-bold text-gray-900">
              dAAPL
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
            {[10, 30, 60].map((percentage) => (
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
                selectedPercentage === 86
                  ? "bg-[#ff9494] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              MAX
            </button>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mb-6">
          <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-800">
              Make sure you have sufficient collateral to cover your loan.
              Defaulting may result in liquidation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Back
          </Button>
          <Button
            onClick={handleBorrow}
            disabled={
              !amount ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > maxBorrowAmount
            }
            className="flex-1 bg-[#ff9494] hover:bg-[#ff8080] text-white"
          >
            Borrow
          </Button>
        </div>
      </div>
    </div>
  );
}
