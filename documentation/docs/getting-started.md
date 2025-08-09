---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with HashRexa

Get the Hedera + AI reference app running locally in minutes.

## Prerequisites and Setup

Before you begin, ensure you have the following installed:

| Requirement | Version |
|-------------|---------|
| Java        | 21+     |
| Maven       | 3.9+    |
| Go          | 1.21+   |
| Node        | 18+     |

## Environment Configuration

### Set Required Environment Variables

```bash
# Core configuration
export BACKEND_BASE_URL=http://localhost:8080
export HEDERA_NETWORK=testnet

# Hedera credentials
export HEDERA_OPERATOR_ID=0.0.xxxxxx
export HEDERA_OPERATOR_PRIVATE_KEY=302e02...replace-with-your-private-key...

# AI configuration
export AZURE_OPENAI_API_KEY=your-azure-key
export AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com
```

### Optional: Configure application.yml

Create or modify `ai/src/main/resources/application.yml`:

```yaml
# Backend connection
backend:
  base-url: ${BACKEND_BASE_URL:http://localhost:8080}

# Hedera configuration
hedera:
  network: ${HEDERA_NETWORK:testnet}
  operator:
    account-id: ${HEDERA_OPERATOR_ID}
    private-key: ${HEDERA_OPERATOR_PRIVATE_KEY}

# AI configuration
spring:
  ai:
    azure:
      openai:
        api-key: ${AZURE_OPENAI_API_KEY}
        endpoint: ${AZURE_OPENAI_ENDPOINT}
        chat:
          options:
            deployment-name: gpt-4
            temperature: 0.7
            max-tokens: 1000

# Server configuration
server:
  port: 8082
```

## Running the Services

Start each service in a separate terminal:

### 1. Go Backend (Port 8080)

```bash
cd backend
go mod download
go run main.go -port 8080
```

### 2. Spring AI Service (Port 8082)

```bash
cd ai
./mvnw spring-boot:run -Dspring-boot.run.arguments="--server.port=8082 --backend.base-url=${BACKEND_BASE_URL}"
```

## Verifying Your Setup

Once both services are running, you can verify your setup with these simple tests:

### Check Hedera Account Balance

```bash
# Query a Hedera account balance
curl -s http://localhost:8082/api/direct/balance/0.0.12345 | jq
```

Expected response format:
```json
{
  "success": true,
  "message": "Account 0.0.12345 has X.XXXXXXXX ℏ",
  "data": {
    "hbarBalance": "X.XXXXXXXX ℏ"
  }
}
```

### Test AI Integration

```bash
# Test the AI-powered lending assistant
curl -s -X POST http://localhost:8082/api/ai/lending \
  -H "Content-Type: application/json" \
  -d '{"message":"Show my portfolio for 0.0.12345"}'
```

## Next Steps

Now that your environment is set up, you can:

1. **Create an HCS Topic** from the AI UI and register the user with the Go backend
2. **Explore your portfolio** and calculate borrowing power
3. **Use the chat interface** for blockchain operations and loan queries
4. **Integrate with frontend** components for a complete application experience

See the [API Reference](api-reference) for more available endpoints.


