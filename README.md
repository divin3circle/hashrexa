# 🚀 Hashrexa - Decentralized Stock Tokenization Platform

**Bringing traditional finance to DeFi through seamless stock tokenization on Hedera Hashgraph**

## 🌟 Overview

Hashrexa is a revolutionary DeFi platform that bridges traditional finance with decentralized finance by enabling users to tokenize their stock holdings and use them as collateral for borrowing. Built on Hedera Hashgraph, the platform provides a secure, fast, and cost-effective way to unlock liquidity from stock portfolios without selling underlying assets.

## 🎯 Key Features

### 🔄 **Stock Tokenization**

- Convert real stocks (AAPL, TSLA, etc.) into HTS tokens
- 1:1 backing with actual stock holdings via Alpaca integration
- Instant tokenization with minimal fees

### 💰 **DeFi Lending & Borrowing**

- Use tokenized stocks as collateral
- Borrow against stock holdings without selling
- Morpho-inspired lending protocol implementation
- Real-time health factor monitoring

### 📊 **Portfolio Management**

- Real-time portfolio tracking
- Unified view of traditional and tokenized assets
- Historical performance analytics

### 🤖 **AI-Powered Insights**

**Not Fully implemented**

- Personalized investment recommendations
- Market analysis and risk assessment
- Automated liquidation protection

## 🏗️ Architecture

### DemoContracts & Accounts

[Market Contract](https://hashscan.io/testnet/contract/0.0.6532033)
[Operator Account](https://hashscan.io/testnet/account/0.0.5864497)
[Sample Testnet User](https://hashscan.io/testnet/account/0.0.6456959)
[dAAPL Token](https://hashscan.io/testnet/token/0.0.6509511)
[Testnet Borrow Transaction](https://hashscan.io/testnet/transaction/1754699441.848132323)

### Frontend (React + TypeScript)

- **Framework**: Vite + React 19
- **State Management**: Zustand + TanStack Query
- **UI Components**: Radix UI + Tailwind CSS
- **Wallet Integration**: Reown AppKit + Hedera Wallet Connect

### Backend (Go)

- **Framework**: Chi Router
- **Database**: BadgerDB for local storage
- **External APIs**: Alpaca Markets API for stock data
- **Smart Contract Integration**: Hedera SDK for blockchain interactions

### Smart Contracts (Solidity)

- **Lending Protocol**: Morpho-inspired isolated lending markets
- **HTS Integration**: Native Hedera Token Service integration
- **Oracle Integration**: Supra Oracle for price feeds

## 🔧 Hedera Technologies Used

### 🌐 **Hedera Consensus Service (HCS)**

- **User Data Storage**: Each user gets a dedicated HCS topic for storing profile information, tokenized assets, and loan history
- **Market Data**: Centralized market topic (`0.0.6514924`) for real-time price analysis and lending metrics
- **Audit Trail**: Immutable record of all tokenization and lending activities

### 🪙 **Hedera Token Service (HTS)**

- **Stock Tokenization**: Creation of fungible tokens representing stocks (dAAPL, dTSLA, etc.)
- **Token Management**: Minting, burning, and transfer operations
- **KYC/Compliance**: Automated KYC granting for tokenized assets
- **Supply Control**: Admin-controlled token supply for backing guarantees

### 📄 **Hedera Smart Contract Service (HSCS)**

- **Lending Protocol**: Morpho-style isolated lending markets
- **Position Management**: User collateral and borrowing positions
- **Liquidation Engine**: Automated liquidation for under-collateralized positions
- **Oracle Integration**: Real-time price feeds for accurate valuations

### 🔗 **Hedera SDK Integration**

- **Multi-language Support**:
  - Go SDK for backend operations
  - JavaScript SDK for frontend interactions
- **Transaction Management**: Efficient batching and execution
- **Mirror Node Queries**: Real-time data retrieval

## 🎮 Demo Contracts & Accounts

### 📋 **Smart Contracts**

- **Lending Pool Contract**: `0.0.6532033`
- **Market Topic ID**: `0.0.6514924`

### 🪙 **Tokenized Assets**

- **dAAPL (Apple)**: `0.0.6509511` (2 decimals)
- **HASH Token**: `0.0.6494054` (6 decimals)

### 👤 **Demo Accounts**

- **Operator Account**: `[INSERT_OPERATOR_ACCOUNT]`
- **Test User Account**: `[INSERT_TEST_USER_ACCOUNT]`
- **Contract Owner**: `[INSERT_CONTRACT_OWNER]`

### 🔑 **Demo Credentials**

- **Alpaca API Key**: `[INSERT_DEMO_KEY]`
- **Alpaca Secret**: `[INSERT_DEMO_SECRET]`
- **Reown Project ID**: `[INSERT_PROJECT_ID]`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Go 1.24+
- pnpm package manager
- Hedera Testnet account

### 🖥️ Frontend Setup

```bash
cd frontend
pnpm install
cp .env.example .env
# Add your Reown Project ID to .env
pnpm run dev
```

### ⚙️ Backend Setup

```bash
cd backend
go mod tidy
cp .env.example .env
# Add your Hedera credentials and Alpaca API keys
go run main.go
```

### 📱 Environment Variables

**Frontend (.env)**

```bash
VITE_PROJECT_ID=your_reown_project_id
VITE_BACKEND_URL=http://localhost:8080
```

**Backend (.env)**

```bash
MY_ACCOUNT_ID=your_hedera_account_id
MY_PRIVATE_KEY=your_hedera_private_key
ALPACA_API_KEY=your_alpaca_key
ALPACA_SECRET_KEY=your_alpaca_secret
```

## 🔄 User Flow

1. **🔐 Connect Wallet**: Connect Hedera wallet via Reown AppKit
2. **📋 Profile Setup**: Create user profile stored on HCS topic
3. **📈 Portfolio Sync**: Connect Alpaca account and view stock holdings
4. **🪙 Tokenize Assets**: Convert stocks to HTS tokens (e.g., AAPL → dAAPL)
5. **💰 Supply Collateral**: Deposit tokenized stocks as collateral
6. **💵 Borrow**: Borrow HASH tokens against collateral
7. **📊 Monitor**: Track positions and health factors in real-time
8. **🔄 Manage**: Repay loans, withdraw collateral, or liquidate if needed

## 🧠 Technical Innovation

### **Morpho-Inspired Architecture**

- Isolated lending markets for each token pair
- Efficient share-based accounting system
- Granular risk management per market

### **Hedera-Native Integration**

- Direct HTS token operations without bridges
- HCS for immutable audit trails
- HSCS for transparent smart contract execution

### **Real-World Asset Bridge**

- Alpaca API integration for real stock data
- 1:1 backing guarantee for tokenized assets
- Automated compliance and KYC processes

## 🛡️ Security Features

- **Over-collateralization**: Minimum 120% collateral ratio
- **Liquidation Protection**: Automated liquidation at 110% ratio
- **Oracle Security**: Supra Oracle integration for accurate pricing
- **Audit Trail**: Complete transaction history on HCS
- **Access Control**: Role-based permissions for admin functions

## 🎯 Hackathon Highlights

### **Hedera Technology Showcase**

- ✅ **HCS**: User data and market analytics storage
- ✅ **HTS**: Native stock tokenization
- ✅ **HSCS**: DeFi lending protocol
- ✅ **SDK**: Full-stack Hedera integration

### **Innovation Points**

- 🌟 First stock tokenization platform on Hedera
- 🌟 Real-world asset integration with TradFi
- 🌟 Morpho-style isolated lending markets
- 🌟 AI-powered risk assessment

### **User Experience**

- 🎨 Beautiful, intuitive interface
- ⚡ Lightning-fast transactions
- 💰 Minimal fees compared to Ethereum
- 📱 Mobile-responsive design

## 🔮 Future Roadmap

- [ ] Multi-asset support (bonds, ETFs, crypto)
- [ ] Cross-chain bridge integration
- [ ] Advanced trading features
- [ ] Institutional lending pools
- [ ] Mobile application
- [ ] Regulatory compliance expansion

## 👥 Team

Built with ❤️ by the Hashrexa team for the Hedera Hackathon

## 📄 License

MIT License - see LICENSE file for details

---

**🏆 Built for Hedera Hackathon 2024**

_Democratizing access to liquidity through innovative DeFi solutions on Hedera Hashgraph_
