---
id: streaming
title: Streaming Results
sidebar_label: Streaming
---

# Streaming API Integration

HashRexa uses Server-Sent Events (SSE) to stream real-time results from long-running operations to the browser. This approach is particularly useful for AI-generated content and blockchain operations that may take time to complete.

## Why Use Streaming?

| Feature | Benefit |
|---------|---------|
| Real-time updates | Users see progress immediately |
| Reduced perceived latency | Improves user experience |
| Efficient resource usage | No polling required |
| Simple implementation | Works over standard HTTP |

## Server-Side Implementation

The backend uses Spring WebFlux's `Flux` to create a reactive stream of data:

```java
@GetMapping(value = "/api/ai/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> stream(@RequestParam String message) {
  return Flux.create(sink -> {
    // Send initial message
    sink.next("Starting...");
    
    // Process the request and stream results
    sink.next("Processing: " + message);
    
    // Perform AI or blockchain operations here
    // Each sink.next() call sends data to the client immediately
    
    // Signal completion
    sink.next("Done");
    sink.complete();
  });
}
```

### Key Components:

- `MediaType.TEXT_EVENT_STREAM_VALUE`: Sets the Content-Type to `text/event-stream`
- `Flux<String>`: Creates a reactive stream of string data
- `sink.next()`: Sends a chunk of data to the client
- `sink.complete()`: Signals the end of the stream

## Client-Side Implementation

The frontend uses the standard EventSource API to consume the stream:

```typescript
export function streamAI(message: string, onChunk: (line: string) => void) {
  // Create EventSource connection to the streaming endpoint
  const es = new EventSource(`/api/ai/stream?message=${encodeURIComponent(message)}`);
  
  // Handle incoming messages
  es.onmessage = (ev) => onChunk(ev.data);
  
  // Handle errors and close the connection
  es.onerror = () => es.close();
  
  // Return a cleanup function
  return () => es.close();
}
```

## React Integration Example

```tsx
function AIStreamingComponent() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const startStreaming = () => {
    setIsStreaming(true);
    setMessages([]);
    
    const cleanup = streamAI("Tell me about Hedera tokens", (chunk) => {
      setMessages(prev => [...prev, chunk]);
    });
    
    // Cleanup when done
    return () => cleanup();
  };
  
  return (
    <div>
      <button onClick={startStreaming} disabled={isStreaming}>
        Start Streaming
      </button>
      
      <div className="messages-container">
        {messages.map((msg, i) => (
          <div key={i} className="message">{msg}</div>
        ))}
        {isStreaming && <div className="loading">...</div>}
      </div>
    </div>
  );
}
```

## Best Practices

1. **Error Handling**: Always implement proper error handling on both client and server
2. **Connection Management**: Close connections when they're no longer needed
3. **Backpressure**: Consider implementing backpressure mechanisms for high-volume streams
4. **Timeouts**: Set appropriate timeouts for long-running operations

For more details on the streaming API endpoints, see the [Streaming API Reference](api/streaming).


