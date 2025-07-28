import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export default function ConnectButton() {
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  console.log(isConnected);

  return (
    <>
      {isConnected ? (
        <button
          className=" text-primary font-bold text-md rounded-full p-0.5 w-fit lowercase border border-gray-200 flex items-center justify-center"
          onClick={() => open()}
        >
          <appkit-button label="disconnect" />
          <div className="w-2 h-2 bg-[#ff9494] animate-pulse rounded-full" />
        </button>
      ) : (
        <button
          className=" text-primary font-bold text-md rounded-full py-2 px-4 lowercase border border-gray-200 w-fit"
          onClick={() => open()}
        >
          connect wallet
        </button>
      )}
    </>
  );
}
