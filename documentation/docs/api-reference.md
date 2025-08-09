# API Reference

This document provides a comprehensive reference for all available API endpoints in the HashRexa platform.

## AI-Powered Endpoints

These endpoints leverage AI capabilities to provide intelligent interactions with the Hedera blockchain.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/lending` | POST | AI-powered lending assistant |
| `/api/ai/portfolio/{accountId}` | GET | Get formatted portfolio summary |
| `/api/ai/register` | POST | Register user with topic ID |

### AI Lending Assistant

```http
POST /api/ai/lending
Content-Type: application/json

{
  "message": "Show my portfolio for 0.0.12345"
}
```

### Portfolio Summary

```http
GET /api/ai/portfolio/0.0.12345
```

Returns a formatted text summary of the user's portfolio.

### User Registration

```http
POST /api/ai/register
Content-Type: application/json

{
  "accountId": "0.0.12345",
  "email": "user@example.com",
  "topicId": "0.0.67890"
}
```

## Direct Hedera Operations

These endpoints provide direct access to Hedera blockchain operations.

### Account Balance

```http
GET /api/direct/balance/0.0.12345
```

**Example curl command:**
```bash
curl -s http://localhost:8082/api/direct/balance/0.0.12345 | jq
```

### Create Token

```http
POST /api/direct/token/create
Content-Type: application/json

{
  "name": "MyToken",
  "symbol": "MTK",
  "initialSupply": 1000000,
  "decimals": 2
}
```

**Example curl command:**
```bash
curl -s -X POST http://localhost:8082/api/direct/token/create \
  -H "Content-Type: application/json" \
  -d '{"name":"MyToken","symbol":"MTK","initialSupply":1000000,"decimals":2}' | jq
```

### Transfer Token

```http
POST /api/direct/token/transfer
Content-Type: application/json

{
  "tokenId": "0.0.555",
  "toAccountId": "0.0.12345",
  "amount": 1000
}
```

**Example curl command:**
```bash
curl -s -X POST http://localhost:8082/api/direct/token/transfer \
  -H "Content-Type: application/json" \
  -d '{"tokenId":"0.0.555","toAccountId":"0.0.12345","amount":1000}' | jq
```

### Create Account

```http
POST /api/direct/account/create
```

**Example curl command:**
```bash
curl -s -X POST http://localhost:8082/api/direct/account/create | jq
```

## Standard Response Format

All API endpoints return responses in a consistent JSON format:

```json
{
  "success": true,
  "message": "Human-readable description of the result",
  "transactionId": "0.0.XXX@1700000000.000000000",
  "data": {
    "hbarBalance": "100.00000000 ℏ",
    "additionalData": "Endpoint-specific data will appear here"
  }
}
```

For more detailed information about specific endpoints, see the [Java API](api/java), [Backend API](api/backend), and [Streaming API](api/streaming) documentation.


