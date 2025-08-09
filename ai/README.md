# HashRexa AI (Spring) - Go-backed AI Endpoints & Demo UI

This module contains the Spring AI services that consume the existing Go backend for portfolio and tokenization data, expose AI tools, and offer a simple Thymeleaf UI for manual testing.

## Prerequisites
- Java 21
- Maven 3.9+
- Go backend running locally (defaults to `http://localhost:8080`)
- Hedera/Alpaca envs configured for Go backend per its README

## Configuration
Spring app reads the Go base URL from:

```
backend.base-url=http://localhost:8080
```

You can set it via environment or `application.properties`.

## Build & Run

### 1) Start the Go backend (port 8080)
Requirements: Go 1.21+

```
cd backend
go mod download
go run main.go -port 8080
```

Notes:
- The backend loads `.env` for Hedera and Alpaca credentials. Ensure variables like `MY_ACCOUNT_ID`, `MY_PRIVATE_KEY`, `ALPACA_API_KEY`, `ALPACA_API_SECRET` are set (or present in `.env`).
- If you change the port, update the AI module's `backend.base-url` accordingly.

### 2) Start the Java AI app (port 8082)
In a separate terminal:

```
cd ai
./mvnw spring-boot:run -Dspring-boot.run.arguments="--server.port=8082 --backend.base-url=http://localhost:8080"
```

The AI app will be available at `http://localhost:8082`.

## Endpoints (AI module)
- REST (exposed by AI module):
  - `POST http://localhost:8082/api/ai/lending`
    - Body: `{ "message": "Show my portfolio for 0.0.x" }`
    - Calls AI `ChatClient` with tools.
  - `GET http://localhost:8082/api/ai/portfolio/{accountId}`
    - Returns a formatted string summary of the portfolio.
  - `POST http://localhost:8082/api/ai/register`
    - Body: `{ "accountId": "0.0.x", "email": "user@example.com", "topicId": "0.0.y" }`

- Tools available to ChatClient (wired via `LoanTools`):
  - `registerUser(accountId, email, topicId)` → calls Go `POST /auth/register/{userAccountId}/{topicId}`
  - `getUserPortfolio(accountId)` → calls Go `GET /portfolio/{userAccountId}` + `GET /tokenized-assets/{userAccountId}`
  - `calculateBorrowingPower(accountId)` → derived from available collateral
  - `tokenizePortfolio(accountId)` → calls Go `GET /tokenize-portfolio/{userAccountId}`

## Demo UI (Thymeleaf)
A minimal, standalone UI (does not touch existing frontend) is available at `http://localhost:8082/` when the AI module runs.

Pages:
- `/` (index): forms to
  - Register a user (accountId, email, topicId)
  - Fetch portfolio
  - Calculate borrowing power
  - Tokenize portfolio
- `result.html`: displays the textual result from an operation

### How to Test
1) Start Go backend (on port 8080 or configure `backend.base-url` accordingly).
2) Start Spring AI app:
   - `cd ai && ./mvnw spring-boot:run`
3) Open `http://localhost:8082/`:
   - Register: submit accountId, email, topicId
   - Portfolio: enter accountId
   - Borrowing power: enter accountId
   - Tokenize: enter accountId

The UI uses `LoanTools` directly, which uses `RestClient` to call the Go API via `BackendClient`.

## Internals
- `BackendConfig` → provides `RestClient` with base URL
- `BackendClient` → thin wrapper over Go routes
- `PortfolioService` → maps Go responses to `LoanModels.Portfolio`
- `LoanTools` → AI tools used by `ChatClient`
- `LendingChatController` → `/api/ai/*` endpoints to drive AI interactions
- `UiController` → Thymeleaf demo pages under `/`

## Notes
- This module does not modify the existing frontend.
- Type-safety for JSON mapping uses generic `Map`/`List` for flexibility against Go responses.
- If your Go server runs on a different port/host, set `backend.base-url` accordingly.


