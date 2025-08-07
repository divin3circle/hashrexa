function LiquidationIndicator({ percentage }: { percentage: number }) {
  // get height in terms of % for 170px
  const height = (percentage / 100) * 140;
  const color =
    percentage >= 90
      ? "bg-red-500"
      : percentage >= 50 && percentage < 90
      ? "bg-yellow-500"
      : "bg-green-500";
  const text =
    percentage >= 90
      ? "Liquidation"
      : percentage >= 50 && percentage < 90
      ? "Warning"
      : "Safe";
  return (
    <div className="h-full w-full bg-gray-200 rounded-3xl relative overflow-hidden">
      <div
        className={`h-[170px] rounded-b-3xl rounded-t-sm absolute bottom-0 left-0 right-0 flex items-center justify-center flex-col ${color}`}
        style={{ height: `${height}px` }}
      >
        <p
          className={`text-white text-center text-sm font-semibold  ${
            percentage <= 0 ? "hidden" : ""
          }`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export default LiquidationIndicator;
