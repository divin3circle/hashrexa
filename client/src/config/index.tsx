import type { AppKitNetwork } from "@reown/appkit/networks";
import logo from "../../public/favicon.ico";
import { HederaChainDefinition } from "@hashgraph/hedera-wallet-connect";

// Get projectId from https://cloud.reown.com
export const projectId =
  import.meta.env.VITE_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694";
if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: "Hashrexa",
  description: "Hashrexa",
  url: "http://localhost:5173/", // origin must match your domain & subdomain
  icons: [logo],
};

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [
  HederaChainDefinition.Native.Testnet,
  HederaChainDefinition.EVM.Mainnet,
  HederaChainDefinition.EVM.Testnet,
  HederaChainDefinition.Native.Mainnet,
] as [AppKitNetwork, ...AppKitNetwork[]];
