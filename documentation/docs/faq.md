---
id: faq
title: FAQ
sidebar_label: FAQ
---

# Frequently Asked Questions

## 🚀 Getting Started

### Q: Do I need to pay for Hedera testnet?
**A:** No! Hedera testnet is completely free. You get free HBAR for testing. Only mainnet operations cost real money.

### Q: Can I run this without Azure OpenAI?
**A:** Yes! The AI features are optional. You can use the blockchain operations and portfolio management without AI. Simply don't set the Azure OpenAI environment variables.

### Q: What if I don't have Alpaca API keys?
**A:** Portfolio features will work with mock data. For real market data, you'll need free Alpaca API keys from [alpaca.markets](https://alpaca.markets).

### Q: How long does setup take?
**A:** With our Quick Start guide: **5 minutes**. Full setup with all features: **15-20 minutes**.

## 🔧 Technical Questions

### Q: Why both Go and Java backends?
**A:** 
- **Go backend**: High-performance data operations, portfolio management, Alpaca integration
- **Java AI service**: Spring AI integration, complex AI workflows, Hedera SDK operations
- This separation allows optimal performance for each use case

### Q: Can I use this in production?
**A:** Yes! HashRexa is production-ready with:
- Comprehensive error handling
- Security best practices
- Scalable architecture
- Monitoring and logging

### Q: What databases does it support?
**A:** 
- **Default**: BadgerDB (embedded, no setup required)
- **Production**: Easily configurable for PostgreSQL, MySQL, MongoDB
- **Caching**: Redis support available

### Q: How do I scale this?
**A:** See our [Performance Guide](performance) for:
- Horizontal scaling strategies
- Database optimization
- Caching layers
- Load balancing

## 🔐 Security & Compliance

### Q: How are private keys handled?
**A:** 
- Private keys are **never logged** or stored in databases
- Environment variables only
- Hedera SDK handles key security
- See [Security Guide](security) for best practices

### Q: Is this SOC 2 compliant?
**A:** The codebase follows security best practices. For SOC 2 compliance, you'll need to implement additional monitoring and controls in your deployment.

### Q: Can I use hardware wallets?
**A:** Currently supports software keys. Hardware wallet integration is planned for future releases.

## 🌐 Deployment & Operations

### Q: Where can I deploy this?
**A:** Anywhere! We provide configs for:
- **Cloud**: AWS, GCP, Azure
- **Platforms**: Vercel, Netlify, Heroku
- **Containers**: Docker, Kubernetes
- **Traditional**: VPS, bare metal

### Q: How do I monitor the application?
**A:** Built-in support for:
- Health check endpoints
- Structured logging
- Metrics collection
- Error tracking

### Q: What about rate limiting?
**A:** 
- Hedera: Built-in network rate limits
- APIs: Configurable rate limiting middleware
- AI: Azure OpenAI has built-in limits

## 🤖 AI & Blockchain

### Q: What AI models are supported?
**A:** Currently Azure OpenAI (GPT-4, GPT-3.5). Support planned for:
- OpenAI direct API
- Anthropic Claude
- Local models (Ollama)

### Q: Can I customize the AI prompts?
**A:** Yes! All AI prompts are configurable in the codebase. See [AI Tools Guide](ai-tools) for customization.

### Q: How accurate are the AI responses?
**A:** AI responses for blockchain operations are **deterministic** - they call real functions. Financial analysis uses real market data but should not be considered financial advice.

## 🔄 Integration & Customization

### Q: Can I integrate with other blockchains?
**A:** Currently Hedera-only. The architecture is designed to be extensible for other networks in the future.

### Q: How do I add custom endpoints?
**A:** 
- **Go backend**: Add routes in `internal/routes/`
- **Java AI service**: Add controllers in Spring Boot style
- See [Contributing Guide](contributing) for details

### Q: Can I use different frontend frameworks?
**A:** Absolutely! The backends provide standard REST APIs. Use React, Vue, Angular, or any framework you prefer.

## 📊 Data & Analytics

### Q: How is portfolio data updated?
**A:** 
- **Real-time**: WebSocket connections for live prices
- **Batch**: Scheduled updates every 15 minutes
- **On-demand**: Manual refresh via API calls

### Q: Can I export portfolio data?
**A:** Yes! Multiple export formats:
- JSON via API
- CSV download
- PDF reports (coming soon)

### Q: How long is data retained?
**A:** 
- **Portfolio snapshots**: 2 years by default
- **Transaction history**: Permanent (blockchain data)
- **Market data**: 1 year by default

## 🆘 Troubleshooting

### Q: Service won't start - what to check?
**A:** 
1. **Ports**: Ensure 8080, 8082 are available
2. **Environment**: Check all required env vars are set
3. **Dependencies**: Run `go mod tidy` and `./mvnw clean install`
4. **Logs**: Check console output for specific errors

### Q: "Account not found" errors?
**A:** 
- Verify account ID format: `0.0.123456`
- Ensure account exists on the correct network (testnet vs mainnet)
- Check account has sufficient HBAR balance

### Q: AI responses are slow?
**A:** 
- Check Azure OpenAI endpoint latency
- Consider upgrading to GPT-4 Turbo for faster responses
- Use streaming endpoints for real-time updates

## 💡 Best Practices

### Q: How should I structure my project?
**A:** Follow our recommended structure:
```
your-app/
├── backend/          # Go services
├── ai/              # Java AI services  
├── frontend/        # React app
├── docs/           # Your documentation
└── deploy/         # Deployment configs
```

### Q: What's the recommended development workflow?
**A:** 
1. Start with [Quick Start](quick-start) for basic setup
2. Use [Examples](examples) for common patterns
3. Customize using [API Reference](api-reference)
4. Deploy using [Deployment Guide](deployment)

---

**Still have questions?** 
- 📖 Check our [Troubleshooting Guide](troubleshooting)
- 💬 Join our [Community Discussions](https://github.com/your-org/hashrexa/discussions)
- 🐛 [Report an Issue](https://github.com/your-org/hashrexa/issues)
