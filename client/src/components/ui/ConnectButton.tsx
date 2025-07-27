import { useAppKit } from "@reown/appkit/react";

export default function ConnectButton() {
  const { open } = useAppKit();
  return (
    <button
      className="bg-[#ff9494] text-white font-bold text-md rounded-full py-2 px-4 lowercase"
      onClick={() => open()}
    >
      connect wallet
    </button>
  );
}
