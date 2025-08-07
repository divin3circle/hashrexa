import { createAppKit, useAppKitAccount } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { projectId, metadata, networks } from "./config";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import "./App.css";
import { Toaster } from "react-hot-toast";
import {
  HederaAdapter,
  HederaChainDefinition,
  hederaNamespace,
  HederaProvider,
} from "@hashgraph/hedera-wallet-connect";
import Setup from "./pages/Setup";
import Home from "./pages/Home";
import Loans from "./pages/Loans";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import ConnectButton from "./components/ui/ConnectButton";
import ProfileSetup from "./pages/ProfileSetup";

const queryClient = new QueryClient();

// const hederaEVMAdapter = new HederaAdapter({
//   projectId,
//   networks: [
//     HederaChainDefinition.EVM.Mainnet,
//     HederaChainDefinition.EVM.Testnet,
//   ],
//   namespace: "eip155",
// });

const hederaNativeAdapter = new HederaAdapter({
  projectId,
  networks: [
    // HederaChainDefinition.Native.Mainnet,
    HederaChainDefinition.Native.Testnet,
  ],
  namespace: hederaNamespace,
});

const universalProvider = await HederaProvider.init({
  projectId: projectId,
  metadata,
});

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: "light" as const,
  themeVariables: {
    "--w3m-accent": "#ff9494",
  },
};

// Create modal
createAppKit({
  adapters: [hederaNativeAdapter],
  universalProvider,
  ...generalConfig,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: [],
    email: false,
  },
});

export function App() {
  const { isConnected } = useAppKitAccount();
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="flex flex-col mb-4">
          <h1 className="text-2xl font-bold text-center">
            Connect your wallet
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Seems like you are not plugged in. Please connect your wallet to
            continue.
          </p>
        </div>
        <ConnectButton />
      </div>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
