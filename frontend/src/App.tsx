import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { projectId, metadata, networks } from "./config";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import "./App.css";
import {
  HederaAdapter,
  HederaChainDefinition,
  hederaNamespace,
  HederaProvider,
} from "@hashgraph/hedera-wallet-connect";
import Setup from "./pages/Setup";

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
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<Setup />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
