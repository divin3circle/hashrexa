---
id: performance
title: Performance Guide
sidebar_label: Performance
---

# ⚡ Performance & Scalability Guide

Optimize HashRexa for production workloads and high-traffic scenarios.

## 🎯 Performance Overview

| Component | Typical Performance | Optimized Performance |
|-----------|-------------------|---------------------|
| **Go Backend** | 1,000 req/sec | 10,000+ req/sec |
| **Java AI Service** | 100 AI calls/min | 1,000+ AI calls/min |
| **Hedera Operations** | 10 TPS | 10,000 TPS (network limit) |
| **Portfolio Updates** | Real-time | Sub-100ms latency |

## 🚀 Backend Optimization

### Go Service Performance

```go
// High-performance server configuration
func setupServer() *gin.Engine {
    gin.SetMode(gin.ReleaseMode)
    
    r := gin.New()
    
    // Performance middleware
    r.Use(gin.Recovery())
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"*"},
        AllowMethods:     []string{"GET", "POST"},
        AllowHeaders:     []string{"*"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:          12 * time.Hour,
    }))
    
    // Connection pooling
    r.Use(func(c *gin.Context) {
        c.Header("Connection", "keep-alive")
        c.Next()
    })
    
    return r
}
```

### Database Optimization

```go
// BadgerDB optimization
func setupBadgerDB() *badger.DB {
    opts := badger.DefaultOptions("./data")
    
    // Performance tuning
    opts.ValueLogFileSize = 256 << 20  // 256MB
    opts.NumMemtables = 4
    opts.NumLevelZeroTables = 4
    opts.NumLevelZeroTablesStall = 8
    opts.SyncWrites = false  // Async writes for better performance
    opts.NumCompactors = 2
    
    db, err := badger.Open(opts)
    if err != nil {
        log.Fatal(err)
    }
    
    // Background garbage collection
    go func() {
        ticker := time.NewTicker(5 * time.Minute)
        defer ticker.Stop()
        for range ticker.C {
            db.RunValueLogGC(0.7)
        }
    }()
    
    return db
}
```

### Caching Strategy

```go
// Redis caching layer
type CacheService struct {
    redis  *redis.Client
    local  *cache.Cache
}

func (c *CacheService) GetPortfolio(accountId string) (*Portfolio, error) {
    // L1: Local cache (fastest)
    if portfolio := c.local.Get(accountId); portfolio != nil {
        return portfolio.(*Portfolio), nil
    }
    
    // L2: Redis cache (fast)
    if data := c.redis.Get(ctx, "portfolio:"+accountId).Val(); data != "" {
        var portfolio Portfolio
        json.Unmarshal([]byte(data), &portfolio)
        c.local.Set(accountId, &portfolio, 1*time.Minute)
        return &portfolio, nil
    }
    
    // L3: Database (slowest)
    portfolio, err := c.fetchFromDB(accountId)
    if err != nil {
        return nil, err
    }
    
    // Cache the result
    data, _ := json.Marshal(portfolio)
    c.redis.Set(ctx, "portfolio:"+accountId, data, 5*time.Minute)
    c.local.Set(accountId, portfolio, 1*time.Minute)
    
    return portfolio, nil
}
```

## 🤖 AI Service Optimization

### Spring Boot Performance

```yaml
# application-prod.yml
server:
  port: 8082
  compression:
    enabled: true
    mime-types: application/json,text/plain,text/xml
  http2:
    enabled: true

spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 20000
      idle-timeout: 300000
      max-lifetime: 1200000
  
  ai:
    azure:
      openai:
        chat:
          options:
            temperature: 0.1  # Lower for consistency
            max-tokens: 500   # Limit for faster responses
            
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
```

### AI Response Caching

```java
@Service
public class AICacheService {
    
    @Cacheable(value = "ai-responses", key = "#message.hashCode()")
    public String getCachedResponse(String message) {
        return chatClient.prompt()
            .user(message)
            .call()
            .content();
    }
    
    @CacheEvict(value = "ai-responses", allEntries = true)
    @Scheduled(fixedRate = 3600000) // Clear cache every hour
    public void clearCache() {
        log.info("Clearing AI response cache");
    }
}
```

### Streaming Optimization

```java
@GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> streamResponse(@RequestParam String query) {
    return Flux.create(sink -> {
        // Use backpressure handling
        sink.onRequest(n -> {
            // Process only what's requested
            processChunks(query, n, sink);
        });
        
        // Cleanup on cancellation
        sink.onCancel(() -> {
            log.info("Stream cancelled for query: {}", query);
        });
    })
    .subscribeOn(Schedulers.boundedElastic())
    .publishOn(Schedulers.parallel());
}
```

## 🌐 Frontend Optimization

### React Performance

```typescript
// Optimized portfolio component
import { memo, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const PortfolioList = memo(({ assets }: { assets: Asset[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Virtualization for large lists
  const virtualizer = useVirtualizer({
    count: assets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });
  
  // Memoize expensive calculations
  const totalValue = useMemo(() => 
    assets.reduce((sum, asset) => sum + asset.value, 0),
    [assets]
  );
  
  const handleAssetClick = useCallback((assetId: string) => {
    // Handle click without re-renders
  }, []);
  
  return (
    <div ref={parentRef} className="portfolio-list">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <AssetItem
            key={virtualItem.key}
            asset={assets[virtualItem.index]}
            onClick={handleAssetClick}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualItem.size,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
});
```

### API Client Optimization

```typescript
// Optimized API client with request deduplication
class OptimizedApiClient {
  private requestCache = new Map<string, Promise<any>>();
  private abortControllers = new Map<string, AbortController>();

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, options);
    
    // Deduplicate identical requests
    if (this.requestCache.has(cacheKey)) {
      return this.requestCache.get(cacheKey);
    }
    
    // Create abort controller for request cancellation
    const abortController = new AbortController();
    this.abortControllers.set(cacheKey, abortController);
    
    const requestPromise = fetch(endpoint, {
      ...options,
      signal: abortController.signal,
    })
    .then(response => response.json())
    .finally(() => {
      // Cleanup
      this.requestCache.delete(cacheKey);
      this.abortControllers.delete(cacheKey);
    });
    
    this.requestCache.set(cacheKey, requestPromise);
    return requestPromise;
  }
  
  cancelRequest(endpoint: string, options: RequestOptions = {}) {
    const cacheKey = this.getCacheKey(endpoint, options);
    const controller = this.abortControllers.get(cacheKey);
    if (controller) {
      controller.abort();
    }
  }
}
```

## 📊 Monitoring & Metrics

### Performance Monitoring

```go
// Middleware for request timing
func TimingMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        
        c.Next()
        
        duration := time.Since(start)
        
        // Log slow requests
        if duration > 1*time.Second {
            log.Warn("Slow request", 
                "path", c.Request.URL.Path,
                "method", c.Request.Method,
                "duration", duration,
            )
        }
        
        // Send metrics to monitoring service
        metrics.RecordHTTPDuration(
            c.Request.Method,
            c.Request.URL.Path,
            c.Writer.Status(),
            duration.Seconds(),
        )
    }
}
```

### Database Performance Monitoring

```go
// Database query monitoring
type MonitoredDB struct {
    db *badger.DB
}

func (m *MonitoredDB) Get(key []byte) ([]byte, error) {
    start := time.Now()
    defer func() {
        duration := time.Since(start)
        metrics.RecordDBOperation("get", duration.Seconds())
    }()
    
    var value []byte
    err := m.db.View(func(txn *badger.Txn) error {
        item, err := txn.Get(key)
        if err != nil {
            return err
        }
        return item.Value(func(val []byte) error {
            value = append([]byte{}, val...)
            return nil
        })
    })
    
    return value, err
}
```

## 🔧 Production Configuration

### Docker Optimization

```dockerfile
# Multi-stage build for Go backend
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .

# Performance optimizations
ENV GOGC=100
ENV GOMAXPROCS=0

CMD ["./main"]
```

### Kubernetes Deployment

```yaml
# k8s-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hashrexa-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hashrexa-backend
  template:
    metadata:
      labels:
        app: hashrexa-backend
    spec:
      containers:
      - name: backend
        image: hashrexa/backend:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: GOMAXPROCS
          valueFrom:
            resourceFieldRef:
              resource: limits.cpu
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: hashrexa-backend-service
spec:
  selector:
    app: hashrexa-backend
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer
```

## 📈 Load Testing

### Basic Load Test

```bash
# Install wrk for load testing
# Ubuntu/Debian: apt-get install wrk
# macOS: brew install wrk

# Test portfolio endpoint
wrk -t12 -c400 -d30s --script=portfolio-test.lua http://localhost:8080/portfolio/0.0.12345

# Test AI endpoint
wrk -t4 -c100 -d30s --script=ai-test.lua http://localhost:8082/api/chat
```

### Load Test Scripts

```lua
-- portfolio-test.lua
wrk.method = "GET"
wrk.headers["Content-Type"] = "application/json"

local accounts = {"0.0.12345", "0.0.54321", "0.0.98765"}
local counter = 1

function request()
    local account = accounts[counter]
    counter = counter + 1
    if counter > #accounts then
        counter = 1
    end
    return wrk.format("GET", "/portfolio/" .. account)
end
```

## 🎯 Performance Benchmarks

### Target Metrics

| Metric | Target | Monitoring |
|--------|--------|------------|
| **API Response Time** | < 100ms (95th percentile) | Prometheus + Grafana |
| **AI Response Time** | < 2s (average) | Application logs |
| **Database Query Time** | < 10ms (average) | Database metrics |
| **Memory Usage** | < 512MB per service | Container metrics |
| **CPU Usage** | < 50% average | System metrics |
| **Error Rate** | < 0.1% | Error tracking |

### Optimization Checklist

- [ ] **Database**: Connection pooling, query optimization, indexing
- [ ] **Caching**: Multi-layer caching strategy implemented
- [ ] **API**: Request deduplication, response compression
- [ ] **Frontend**: Code splitting, lazy loading, virtualization
- [ ] **Monitoring**: Comprehensive metrics and alerting
- [ ] **Infrastructure**: Auto-scaling, load balancing
- [ ] **CDN**: Static asset distribution
- [ ] **Security**: Rate limiting, DDoS protection

---

**Ready to optimize your deployment?**
- 🚀 [Deployment Guide](deployment) - Production setup
- 📊 [Monitoring Setup](monitoring) - Observability stack
- 🔒 [Security Guide](security) - Performance security
