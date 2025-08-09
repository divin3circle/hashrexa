---
id: examples
title: Examples
sidebar_label: Examples
---

# 💡 Real-World Examples

Practical examples to get you building with HashRexa quickly.

## 🚀 Basic Examples

### 1. Create Your First Token

```bash
# Create a simple token
curl -X POST http://localhost:8082/api/direct/token/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyCompanyToken",
    "symbol": "MCT",
    "initialSupply": 1000000,
    "decimals": 2
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Token 'MyCompanyToken' created successfully with id: 0.0.123456",
  "transactionId": "0.0.98765@1700000000.000000000",
  "data": {
    "tokenId": "0.0.123456",
    "treasuryAccountId": "0.0.98765"
  }
}
```

### 2. Check Account Balance

```bash
# Check HBAR and token balances
curl http://localhost:8082/api/direct/balance/0.0.12345
```

**Response:**
```json
{
  "success": true,
  "message": "Account 0.0.12345 has 100.50000000 ℏ",
  "data": {
    "hbarBalance": "100.50000000 ℏ",
    "tokens": [
      {
        "tokenId": "0.0.123456",
        "balance": "1000.00",
        "symbol": "MCT"
      }
    ]
  }
}
```

### 3. AI-Powered Token Transfer

```bash
# Use natural language to transfer tokens
curl -X POST http://localhost:8082/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Transfer 100 MCT tokens to account 0.0.54321"
  }'
```

## 🏢 Business Use Cases

### Portfolio Management System

**Scenario:** Build a portfolio tracker for investment firm clients.

```typescript
// Frontend integration example
import { usePortfolio } from './hooks/usePortfolio';

function PortfolioDashboard({ accountId }: { accountId: string }) {
  const { data: portfolio, isLoading } = usePortfolio(accountId);
  
  if (isLoading) return <div>Loading portfolio...</div>;
  
  return (
    <div className="portfolio-dashboard">
      <h2>Portfolio Overview</h2>
      <div className="metrics">
        <div>Total Value: ${portfolio.totalValue}</div>
        <div>24h Change: {portfolio.dailyChange}%</div>
        <div>Assets: {portfolio.assets.length}</div>
      </div>
      
      <div className="assets-grid">
        {portfolio.assets.map(asset => (
          <AssetCard key={asset.symbol} asset={asset} />
        ))}
      </div>
    </div>
  );
}
```

### Lending Platform Integration

**Scenario:** Calculate borrowing power based on tokenized assets.

```bash
# Get borrowing power calculation
curl -X POST http://localhost:8082/api/ai/lending \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is my borrowing power for account 0.0.12345?"
  }'
```

**AI Response:**
```
Based on your portfolio analysis:

📊 Portfolio Value: $125,450
🏦 Available Collateral: $100,360 (80% LTV)
💰 Maximum Borrowing Power: $75,270

Assets breakdown:
- AAPL (Tokenized): $45,200 (90% LTV)
- TSLA (Tokenized): $32,100 (85% LTV)  
- Cash Equivalent: $23,060 (95% LTV)

Recommended borrowing: $60,000 (conservative 60% utilization)
```

## 🔄 Integration Patterns

### React Hook for Real-time Updates

```typescript
// useRealtimePortfolio.ts
import { useEffect, useState } from 'react';

export function useRealtimePortfolio(accountId: string) {
  const [portfolio, setPortfolio] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Server-Sent Events for real-time updates
    const eventSource = new EventSource(
      `/api/ai/portfolio/stream/${accountId}`
    );

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPortfolio(data);
    };
    eventSource.onerror = () => setIsConnected(false);

    return () => eventSource.close();
  }, [accountId]);

  return { portfolio, isConnected };
}
```

### Go Backend Custom Handler

```go
// internal/handlers/custom_handler.go
package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func (h *Handler) GetCustomMetrics(c *gin.Context) {
    accountId := c.Param("accountId")
    
    // Get portfolio from your service
    portfolio, err := h.portfolioService.GetPortfolio(accountId)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to fetch portfolio",
        })
        return
    }
    
    // Calculate custom metrics
    metrics := calculateRiskMetrics(portfolio)
    
    c.JSON(http.StatusOK, gin.H{
        "accountId": accountId,
        "riskScore": metrics.RiskScore,
        "diversification": metrics.Diversification,
        "volatility": metrics.Volatility,
    })
}
```

## �� Advanced Examples

### Multi-Account Portfolio Aggregation

```bash
# Aggregate multiple accounts into one view
curl -X POST http://localhost:8082/api/ai/lending \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show combined portfolio for accounts 0.0.12345, 0.0.54321, and 0.0.98765"
  }'
```

### Automated Rebalancing

```typescript
// Automated portfolio rebalancing example
class PortfolioRebalancer {
  constructor(private apiClient: ApiClient) {}

  async rebalancePortfolio(accountId: string, targetAllocation: Allocation[]) {
    // 1. Get current portfolio
    const portfolio = await this.apiClient.getPortfolio(accountId);
    
    // 2. Calculate required trades
    const trades = this.calculateRebalancingTrades(portfolio, targetAllocation);
    
    // 3. Execute trades via AI assistant
    for (const trade of trades) {
      const message = `${trade.action} ${trade.amount} ${trade.symbol} ${trade.direction} target allocation`;
      await this.apiClient.aiChat(message);
    }
    
    return { executed: trades.length, portfolio: await this.apiClient.getPortfolio(accountId) };
  }
}
```

### Custom AI Tools

```java
// Add custom AI tool for risk analysis
@Component
public class RiskAnalysisTools {
    
    @Tool(description = "Analyze portfolio risk and provide recommendations")
    public String analyzeRisk(
        @ToolParam(description = "Account ID") String accountId,
        @ToolParam(description = "Risk tolerance (conservative/moderate/aggressive)") String riskTolerance
    ) {
        Portfolio portfolio = portfolioService.getPortfolio(accountId);
        RiskAnalysis analysis = riskAnalyzer.analyze(portfolio, riskTolerance);
        
        return String.format(
            "Risk Analysis for %s:\n" +
            "Overall Risk Score: %s/10\n" +
            "Diversification: %s\n" +
            "Recommendations: %s",
            accountId,
            analysis.getRiskScore(),
            analysis.getDiversificationScore(),
            String.join(", ", analysis.getRecommendations())
        );
    }
}
```

## 🔐 Security Examples

### API Key Management

```typescript
// Secure API client with automatic key rotation
class SecureApiClient {
  private apiKey: string;
  private keyExpiry: Date;

  constructor(private keyManager: KeyManager) {
    this.refreshApiKey();
  }

  async makeRequest(endpoint: string, data: any) {
    if (this.isKeyExpired()) {
      await this.refreshApiKey();
    }

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  private async refreshApiKey() {
    const { key, expiry } = await this.keyManager.getNewKey();
    this.apiKey = key;
    this.keyExpiry = expiry;
  }
}
```

### Environment-Based Configuration

```yaml
# docker-compose.yml for different environments
version: '3.8'
services:
  hashrexa-backend:
    image: hashrexa/backend:latest
    environment:
      - HEDERA_NETWORK=${HEDERA_NETWORK:-testnet}
      - HEDERA_OPERATOR_ID=${HEDERA_OPERATOR_ID}
      - HEDERA_OPERATOR_PRIVATE_KEY=${HEDERA_OPERATOR_PRIVATE_KEY}
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    ports:
      - "8080:8080"
    depends_on:
      - redis
      - postgres

  hashrexa-ai:
    image: hashrexa/ai:latest
    environment:
      - BACKEND_BASE_URL=http://hashrexa-backend:8080
      - AZURE_OPENAI_API_KEY=${AZURE_OPENAI_API_KEY}
      - AZURE_OPENAI_ENDPOINT=${AZURE_OPENAI_ENDPOINT}
    ports:
      - "8082:8082"
    depends_on:
      - hashrexa-backend
```

## 📊 Monitoring & Analytics

### Health Check Implementation

```go
// Health check with detailed status
func (h *Handler) HealthCheck(c *gin.Context) {
    status := gin.H{
        "status": "healthy",
        "timestamp": time.Now().UTC(),
        "services": gin.H{
            "database": h.checkDatabase(),
            "hedera": h.checkHederaConnection(),
            "alpaca": h.checkAlpacaAPI(),
        },
    }
    
    // Determine overall health
    allHealthy := true
    for _, service := range status["services"].(gin.H) {
        if service != "healthy" {
            allHealthy = false
            break
        }
    }
    
    if !allHealthy {
        status["status"] = "degraded"
        c.JSON(http.StatusServiceUnavailable, status)
        return
    }
    
    c.JSON(http.StatusOK, status)
}
```

### Performance Metrics

```typescript
// Frontend performance monitoring
class PerformanceMonitor {
  static trackApiCall(endpoint: string, duration: number) {
    // Send to your analytics service
    analytics.track('api_call', {
      endpoint,
      duration,
      timestamp: Date.now(),
    });
  }

  static trackUserAction(action: string, metadata: any) {
    analytics.track('user_action', {
      action,
      metadata,
      timestamp: Date.now(),
    });
  }
}

// Usage in API client
const response = await fetch(endpoint);
const duration = Date.now() - startTime;
PerformanceMonitor.trackApiCall(endpoint, duration);
```

---

## 🎯 Next Steps

**Ready to build your own examples?**

1. **Start Simple**: Begin with the basic token creation example
2. **Add AI**: Integrate natural language processing for user interactions  
3. **Scale Up**: Implement real-time updates and advanced features
4. **Deploy**: Use our [Deployment Guide](deployment) for production

**Need help with your specific use case?**
- 💬 [Ask in Discussions](https://github.com/your-org/hashrexa/discussions)
- 📖 [Check API Reference](api-reference)
- 🔧 [View Source Code](repositories)
