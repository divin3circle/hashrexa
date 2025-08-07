import {
  useDisconnect,
  useAppKit,
  useAppKitNetwork,
  useAppKitAccount,
  useAppKitProvider,
  type Provider,
} from "@reown/appkit/react-core";
import { networks } from "../config";

export const ActionButtonList = () => {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { switchNetwork } = useAppKitNetwork();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("eip155");

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  // function to sing a msg
  const handleSignMsg = async () => {
    const message = "Hello Reown AppKit!";
    try {
      const result = (await walletProvider.request({
        method: "personal_sign",
        params: [message, address],
      })) as { signature: string };

      console.log("result", result);
    } catch (error) {
      console.log("error", error);
      throw new Error(error as string);
    }
  };

  return (
    isConnected && (
      <div>
        <button onClick={() => open()}>Open</button>
        <button onClick={handleDisconnect}>Disconnect</button>
        <button onClick={() => switchNetwork(networks[1])}>Switch</button>
        <button onClick={handleSignMsg}>Sign</button>
      </div>
    )
  );
};
