## API Reference — Java (Spring Boot)

Base URL: `http://localhost:8082`

### AI Chat — Blockchain
- POST `/api/chat`
- Request:
```json
{ "message": "What's the balance of account 0.0.12345?" }
```
- Response:
```json
{ "response": "Balance (HBAR) for 0.0.12345: ...", "success": true }
```

### AI Chat — Loan
- POST `/api/chat/loan/{userId}`
- Request:
```json
{ "message": "How much can I borrow with my portfolio?" }
```
- Response (excerpt):
```json
{ "message": "Borrowing Power...", "intent": "RATE_INQUIRY" }
```

### AI Lending Assistant
- POST `/api/ai/lending`
- Request:
```json
{ "message": "Show my portfolio for 0.0.12345" }
```
- Response:
```json
{ "response": "Portfolio for 0.0.12345...", "success": true, "type": "lending" }
```

### Portfolio wrapper
- GET `/api/ai/portfolio/{accountId}`
- Response:
```json
{ "data": "Portfolio for 0.0.12345...", "success": true }
```

### Registration wrapper
- POST `/api/ai/register`
- Request:
```json
{ "accountId": "0.0.12345", "email": "user@example.com", "topicId": "0.0.67890" }
```
- Response:
```json
{ "data": "✅ Registration successful", "success": true }
```

### Direct Hedera Operations

Check HBAR balance:
- GET `/api/direct/balance/{accountId}`

Create token:
- POST `/api/direct/token/create`
```json
{ "name": "MyToken", "symbol": "MTK", "initialSupply": 1000000, "decimals": 2 }
```

Transfer tokens:
- POST `/api/direct/token/transfer`
```json
{ "tokenId": "0.0.123456", "toAccountId": "0.0.234567", "amount": 1000 }
```

Create account:
- POST `/api/direct/account/create`

Health check:
- GET `/api/direct/health`


