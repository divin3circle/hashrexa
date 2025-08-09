## Usage

### Base URLs
- Java AI service: `http://localhost:8082`
- Go backend: `http://localhost:8080`

### Hedera operations (Java)

Check balance:
```bash
curl -s http://localhost:8082/api/direct/balance/0.0.12345 | jq
```

Create token:
```bash
curl -s -X POST http://localhost:8082/api/direct/token/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyToken",
    "symbol": "MTK",
    "initialSupply": 1000000,
    "decimals": 2
  }' | jq
```

Transfer tokens:
```bash
curl -s -X POST http://localhost:8082/api/direct/token/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": "0.0.123456",
    "toAccountId": "0.0.234567",
    "amount": 1000
  }' | jq
```

Create account:
```bash
curl -s -X POST http://localhost:8082/api/direct/account/create | jq
```

### AI-powered chat (Java)

Blockchain assistant:
```bash
curl -s -X POST http://localhost:8082/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the balance of 0.0.12345?"}' | jq
```

Lending assistant (function-calling):
```bash
curl -s -X POST http://localhost:8082/api/ai/lending \
  -H "Content-Type: application/json" \
  -d '{"message": "Show my portfolio for 0.0.12345 and borrowing power"}' | jq
```

Portfolio wrapper:
```bash
curl -s http://localhost:8082/api/ai/portfolio/0.0.12345 | jq
```

### Go backend (portfolio, tokenization)

Register user/topic:
```bash
curl -s -X POST http://localhost:8080/auth/register/0.0.12345/0.0.67890 | jq
```

Check topic exists:
```bash
curl -s http://localhost:8080/topics/exists/0.0.12345 | jq
```

Get portfolio:
```bash
curl -s http://localhost:8080/portfolio/0.0.12345 | jq
```

Get tokenized assets:
```bash
curl -s http://localhost:8080/tokenized-assets/0.0.12345 | jq
```

Tokenize portfolio:
```bash
curl -s http://localhost:8080/tokenize-portfolio/0.0.12345 | jq
```

Portfolio history:
```bash
curl -s http://localhost:8080/portfolio-history | jq
```

### Streaming (SSE)
If you add the SSE endpoint shown in API/Streaming, you can stream tokens:
```bash
curl -N "http://localhost:8082/api/ai/lending/stream?userId=0.0.12345&q=explain%20ltv"
```


