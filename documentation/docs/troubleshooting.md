## Troubleshooting & FAQs

### Java AI service: model errors or startup failures
- Verify `API_KEY` and `API_ENDPOINT` are set and correct.
- Ensure your Azure OpenAI deployment name matches configuration.

### Hedera transaction/auth failures
- Confirm `HEDERA_OPERATOR_ACCOUNT_ID` and `HEDERA_OPERATOR_PRIVATE_KEY` are valid for the selected `hedera.network`.
- Check gRPC/network connectivity.

### Go backend register/tokenize failures
- Ensure `MY_ACCOUNT_ID`, `MY_PRIVATE_KEY`, `ALPACA_API_KEY`, `ALPACA_API_SECRET` are present in `backend/.env`.
- Badger DB path (`/tmp/badgerdb`) must be writable.
- If Mirror Node returns no messages, verify the topic ID and that a message was submitted to HCS.

### CORS errors
- Default origin is `http://localhost:5173`. Update in `internal/routes/routes.go` if using a different frontend origin.

### AI tool calls not triggered
- Requests should clearly imply the needed function (e.g., "create token", "transfer", "portfolio for 0.0.x").
- Controllers must call `.tools(blockchainTools)` or `.tools(loanTools)` (already implemented).

### Enable live streaming
- Implement the SSE endpoint from `API/Streaming` using `LoanAssistanceService.streamLoanQuery`.


