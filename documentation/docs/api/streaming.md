## API Reference — Streaming (SSE)

The codebase includes a streaming-capable service (`LoanAssistanceService.streamLoanQuery`) that returns `Flux<String>`. Expose it via Server-Sent Events (SSE):

```java
// Example SSE endpoint (add to a controller)
// GET /api/ai/lending/stream?userId=...&q=...
@GetMapping(value = "/api/ai/lending/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> lendingStream(@RequestParam String userId, @RequestParam("q") String query) {
    return loanAssistanceService.streamLoanQuery(userId, query);
}
```

### Event format
- Transport: SSE (Content-Type: `text/event-stream`)
- Payload: plain text tokens (accumulate on client)

### Sample client (curl)
```bash
curl -N "http://localhost:8082/api/ai/lending/stream?userId=0.0.12345&q=explain%20ltv"
```

Note: No WebSocket endpoint is implemented by default; SSE is the recommended approach here.


