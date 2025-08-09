---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
---

# 🚀 Quick Start Guide

Get HashRexa running in 5 minutes with minimal setup.

## What You'll Build

A complete Hedera blockchain application with:
- ✅ AI-powered chat interface for blockchain operations
- ✅ Portfolio management and tokenization
- ✅ Real-time lending calculations

## Prerequisites

| Tool | Version | Install Command |
|------|---------|----------------|
| Java | 21+ | `sdk install java 21.0.1-tem` |
| Go | 1.21+ | [Download](https://golang.org/dl/) |
| Node.js | 18+ | [Download](https://nodejs.org/) |

## 1. Clone & Setup

```bash
git clone <your-repo-url>
cd hashrexa

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials (see below)
```

## 2. Get Your Hedera Credentials

### Option A: Use Testnet (Recommended for Testing)
1. Go to [Hedera Portal](https://portal.hedera.com/)
2. Create a testnet account
3. Copy your Account ID and Private Key

### Option B: Create Programmatically
```bash
# We'll create an account for you in step 4
```

## 3. Set Environment Variables

Create `.env` file in the root directory:

```bash
# Hedera Configuration
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_OPERATOR_PRIVATE_KEY=your-private-key-here

# AI Configuration (Optional - for AI features)
AZURE_OPENAI_API_KEY=your-key-here
AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com

# Alpaca Configuration (Optional - for portfolio features)
ALPACA_API_KEY=your-alpaca-key
ALPACA_API_SECRET=your-alpaca-secret
```

## 4. Start Services

Open 3 terminals and run:

**Terminal 1 - Go Backend:**
```bash
cd backend
go mod tidy
go run main.go
```

**Terminal 2 - Java AI Service:**
```bash
cd ai
./mvnw spring-boot:run
```

**Terminal 3 - Frontend (Optional):**
```bash
cd frontend
npm install
npm run dev
```

## 5. Test Your Setup

```bash
# Test Hedera connection
curl http://localhost:8082/api/direct/balance/0.0.12345

# Test AI chat
curl -X POST http://localhost:8082/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Create a token called TestCoin"}'
```

## 🎉 Success!

If you see responses from both endpoints, you're ready to:

1. **[Explore the API →](api-reference)** - See all available endpoints
2. **[Architecture Guide →](architecture)** - Understand how it all works
3. **[Build Your App →](frontend-integration)** - Integrate with your frontend

## Need Help?

- **Can't connect to Hedera?** → [Troubleshooting Guide](troubleshooting#hedera-connection-issues)
- **AI not responding?** → [AI Setup Guide](troubleshooting#ai-configuration)
- **Want to customize?** → [Configuration Guide](getting-started#environment-configuration)

---

**Next:** [Full Setup Guide →](getting-started) for detailed configuration options.
