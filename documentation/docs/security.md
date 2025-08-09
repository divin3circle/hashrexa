---
id: security
title: Security Guide
sidebar_label: Security
---

# 🔒 Security Best Practices

Comprehensive security guide for production HashRexa deployments.

## 🎯 Security Overview

| Security Layer | Implementation | Status |
|----------------|----------------|---------|
| **Network** | HTTPS, VPN, Firewall | ✅ Required |
| **Authentication** | API Keys, JWT, OAuth | ✅ Implemented |
| **Authorization** | RBAC, Resource-based | ✅ Configurable |
| **Data Protection** | Encryption at rest/transit | ✅ Built-in |
| **Key Management** | HSM, Vault, Secure storage | ⚠️ Configuration required |
| **Monitoring** | Audit logs, Intrusion detection | ✅ Available |

## 🔐 Private Key Security

### ⚠️ Critical: Never Expose Private Keys

```bash
# ❌ NEVER DO THIS
export HEDERA_OPERATOR_PRIVATE_KEY="302e020100300506032b657004220420..."

# ✅ Use secure methods instead
```

### Secure Key Management

```bash
# Method 1: Environment file (development only)
echo "HEDERA_OPERATOR_PRIVATE_KEY=your-key-here" > .env.local
chmod 600 .env.local

# Method 2: HashiCorp Vault (production)
vault kv put secret/hashrexa \
  hedera_private_key="your-key-here" \
  azure_openai_key="your-ai-key"

# Method 3: AWS Secrets Manager
aws secretsmanager create-secret \
  --name "hashrexa/hedera-keys" \
  --secret-string '{"private_key":"your-key","account_id":"0.0.12345"}'
```

### Key Rotation Strategy

```go
// Automated key rotation service
type KeyRotationService struct {
    vault      *vault.Client
    hedera     *hedera.Client
    schedule   time.Duration
}

func (k *KeyRotationService) RotateKeys() error {
    // 1. Generate new key pair
    newPrivateKey := hedera.PrivateKeyGenerateEd25519()
    newPublicKey := newPrivateKey.PublicKey()
    
    // 2. Update account key on Hedera
    accountUpdateTx := hedera.NewAccountUpdateTransaction().
        SetAccountID(k.operatorAccountID).
        SetKey(newPublicKey)
    
    response, err := accountUpdateTx.Execute(k.hedera)
    if err != nil {
        return fmt.Errorf("failed to update account key: %w", err)
    }
    
    // 3. Store new key in vault
    err = k.vault.Write("secret/hashrexa/keys", map[string]interface{}{
        "private_key": newPrivateKey.String(),
        "rotation_date": time.Now(),
        "previous_tx": response.TransactionID.String(),
    })
    
    return err
}
```

## 🌐 Network Security

### HTTPS Configuration

```yaml
# nginx.conf
server {
    listen 443 ssl http2;
    server_name api.hashrexa.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/hashrexa.crt;
    ssl_certificate_key /etc/ssl/private/hashrexa.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Firewall Rules

```bash
# UFW (Ubuntu Firewall) configuration
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (change port if needed)
sudo ufw allow 22/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Allow application ports (internal network only)
sudo ufw allow from 10.0.0.0/8 to any port 8080
sudo ufw allow from 10.0.0.0/8 to any port 8082

# Enable firewall
sudo ufw enable
```

## 🔑 Authentication & Authorization

### API Key Management

```go
// Secure API key validation
type APIKeyService struct {
    keys    map[string]*APIKey
    redis   *redis.Client
    mutex   sync.RWMutex
}

type APIKey struct {
    ID          string    `json:"id"`
    Name        string    `json:"name"`
    HashedKey   string    `json:"hashed_key"`
    Permissions []string  `json:"permissions"`
    ExpiresAt   time.Time `json:"expires_at"`
    LastUsed    time.Time `json:"last_used"`
    RateLimit   int       `json:"rate_limit"`
}

func (a *APIKeyService) ValidateKey(rawKey string) (*APIKey, error) {
    // Hash the provided key
    hashedKey := a.hashKey(rawKey)
    
    // Check cache first
    if cached := a.redis.Get(ctx, "apikey:"+hashedKey).Val(); cached != "" {
        var key APIKey
        json.Unmarshal([]byte(cached), &key)
        return &key, nil
    }
    
    // Validate against database
    a.mutex.RLock()
    key, exists := a.keys[hashedKey]
    a.mutex.RUnlock()
    
    if !exists {
        return nil, errors.New("invalid API key")
    }
    
    if time.Now().After(key.ExpiresAt) {
        return nil, errors.New("API key expired")
    }
    
    // Update last used
    key.LastUsed = time.Now()
    
    // Cache the result
    data, _ := json.Marshal(key)
    a.redis.Set(ctx, "apikey:"+hashedKey, data, 1*time.Hour)
    
    return key, nil
}
```

### Role-Based Access Control

```go
// RBAC implementation
type Permission string

const (
    PermissionReadPortfolio   Permission = "portfolio:read"
    PermissionWritePortfolio  Permission = "portfolio:write"
    PermissionCreateToken     Permission = "token:create"
    PermissionTransferToken   Permission = "token:transfer"
    PermissionAIChat          Permission = "ai:chat"
    PermissionAdminAccess     Permission = "admin:*"
)

type Role struct {
    Name        string       `json:"name"`
    Permissions []Permission `json:"permissions"`
}

var Roles = map[string]Role{
    "viewer": {
        Name: "Viewer",
        Permissions: []Permission{
            PermissionReadPortfolio,
        },
    },
    "trader": {
        Name: "Trader",
        Permissions: []Permission{
            PermissionReadPortfolio,
            PermissionWritePortfolio,
            PermissionTransferToken,
            PermissionAIChat,
        },
    },
    "admin": {
        Name: "Administrator",
        Permissions: []Permission{
            PermissionAdminAccess, // Grants all permissions
        },
    },
}

func (a *APIKeyService) HasPermission(key *APIKey, required Permission) bool {
    for _, role := range key.Roles {
        if roleConfig, exists := Roles[role]; exists {
            for _, perm := range roleConfig.Permissions {
                if perm == PermissionAdminAccess || perm == required {
                    return true
                }
            }
        }
    }
    return false
}
```

## 🛡️ Input Validation & Sanitization

### Request Validation

```go
// Input validation middleware
func ValidateInput() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Validate content type
        if c.GetHeader("Content-Type") != "application/json" {
            c.JSON(http.StatusBadRequest, gin.H{
                "error": "Content-Type must be application/json",
            })
            c.Abort()
            return
        }
        
        // Validate request size
        if c.Request.ContentLength > 1024*1024 { // 1MB limit
            c.JSON(http.StatusRequestEntityTooLarge, gin.H{
                "error": "Request body too large",
            })
            c.Abort()
            return
        }
        
        c.Next()
    }
}

// Account ID validation
func ValidateAccountID(accountID string) error {
    // Hedera account ID format: 0.0.12345
    pattern := `^0\.0\.\d+$`
    matched, err := regexp.MatchString(pattern, accountID)
    if err != nil {
        return err
    }
    if !matched {
        return errors.New("invalid account ID format")
    }
    return nil
}
```

### SQL Injection Prevention

```go
// Safe database queries
func (s *Service) GetPortfolioSafe(accountID string) (*Portfolio, error) {
    // Validate input first
    if err := ValidateAccountID(accountID); err != nil {
        return nil, err
    }
    
    // Use parameterized queries
    query := `
        SELECT portfolio_data, updated_at 
        FROM portfolios 
        WHERE account_id = $1 AND active = true
    `
    
    var portfolioData string
    var updatedAt time.Time
    
    err := s.db.QueryRow(query, accountID).Scan(&portfolioData, &updatedAt)
    if err != nil {
        return nil, err
    }
    
    var portfolio Portfolio
    err = json.Unmarshal([]byte(portfolioData), &portfolio)
    return &portfolio, err
}
```

## 🔍 Audit Logging

### Comprehensive Audit Trail

```go
// Audit logging service
type AuditLogger struct {
    logger *logrus.Logger
    db     *sql.DB
}

type AuditEvent struct {
    ID          string    `json:"id"`
    Timestamp   time.Time `json:"timestamp"`
    UserID      string    `json:"user_id"`
    Action      string    `json:"action"`
    Resource    string    `json:"resource"`
    IPAddress   string    `json:"ip_address"`
    UserAgent   string    `json:"user_agent"`
    Success     bool      `json:"success"`
    Details     string    `json:"details"`
    Metadata    string    `json:"metadata"`
}

func (a *AuditLogger) LogEvent(c *gin.Context, action, resource string, success bool, details string) {
    event := AuditEvent{
        ID:        uuid.New().String(),
        Timestamp: time.Now().UTC(),
        UserID:    c.GetString("user_id"),
        Action:    action,
        Resource:  resource,
        IPAddress: c.ClientIP(),
        UserAgent: c.GetHeader("User-Agent"),
        Success:   success,
        Details:   details,
        Metadata:  a.extractMetadata(c),
    }
    
    // Log to structured logger
    a.logger.WithFields(logrus.Fields{
        "audit_id":   event.ID,
        "user_id":    event.UserID,
        "action":     event.Action,
        "resource":   event.Resource,
        "success":    event.Success,
        "ip_address": event.IPAddress,
    }).Info("Audit event")
    
    // Store in database for compliance
    go a.storeAuditEvent(event)
}
```

### Security Event Monitoring

```go
// Security event detection
type SecurityMonitor struct {
    redis   *redis.Client
    alerts  chan SecurityAlert
}

type SecurityAlert struct {
    Type        string    `json:"type"`
    Severity    string    `json:"severity"`
    UserID      string    `json:"user_id"`
    IPAddress   string    `json:"ip_address"`
    Description string    `json:"description"`
    Timestamp   time.Time `json:"timestamp"`
}

func (s *SecurityMonitor) CheckSuspiciousActivity(userID, ipAddress string) {
    // Check for rate limit violations
    key := fmt.Sprintf("rate_limit:%s", ipAddress)
    count, _ := s.redis.Incr(ctx, key).Result()
    s.redis.Expire(ctx, key, 1*time.Minute)
    
    if count > 100 { // 100 requests per minute
        s.alerts <- SecurityAlert{
            Type:        "rate_limit_exceeded",
            Severity:    "high",
            UserID:      userID,
            IPAddress:   ipAddress,
            Description: fmt.Sprintf("Rate limit exceeded: %d requests/minute", count),
            Timestamp:   time.Now(),
        }
    }
    
    // Check for unusual access patterns
    locations := s.getRecentLocations(userID)
    if len(locations) > 3 { // Multiple locations in short time
        s.alerts <- SecurityAlert{
            Type:        "unusual_access_pattern",
            Severity:    "medium",
            UserID:      userID,
            IPAddress:   ipAddress,
            Description: "Access from multiple geographic locations",
            Timestamp:   time.Now(),
        }
    }
}
```

## 🔐 Data Encryption

### Encryption at Rest

```go
// Database encryption
type EncryptedStorage struct {
    db  *badger.DB
    key []byte
}

func (e *EncryptedStorage) Set(key string, value interface{}) error {
    // Serialize value
    data, err := json.Marshal(value)
    if err != nil {
        return err
    }
    
    // Encrypt data
    encrypted, err := e.encrypt(data)
    if err != nil {
        return err
    }
    
    // Store in database
    return e.db.Update(func(txn *badger.Txn) error {
        return txn.Set([]byte(key), encrypted)
    })
}

func (e *EncryptedStorage) encrypt(data []byte) ([]byte, error) {
    block, err := aes.NewCipher(e.key)
    if err != nil {
        return nil, err
    }
    
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return nil, err
    }
    
    nonce := make([]byte, gcm.NonceSize())
    if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
        return nil, err
    }
    
    ciphertext := gcm.Seal(nonce, nonce, data, nil)
    return ciphertext, nil
}
```

### Field-Level Encryption

```go
// Sensitive field encryption
type EncryptedField struct {
    Value     string `json:"value"`
    Encrypted bool   `json:"encrypted"`
}

func (e *EncryptedField) Encrypt(key []byte) error {
    if e.Encrypted {
        return nil // Already encrypted
    }
    
    encrypted, err := encryptString(e.Value, key)
    if err != nil {
        return err
    }
    
    e.Value = encrypted
    e.Encrypted = true
    return nil
}

func (e *EncryptedField) Decrypt(key []byte) error {
    if !e.Encrypted {
        return nil // Not encrypted
    }
    
    decrypted, err := decryptString(e.Value, key)
    if err != nil {
        return err
    }
    
    e.Value = decrypted
    e.Encrypted = false
    return nil
}
```

## 🚨 Incident Response

### Security Incident Playbook

```yaml
# security-incident-response.yml
incident_types:
  data_breach:
    severity: critical
    response_time: 15m
    actions:
      - isolate_affected_systems
      - notify_security_team
      - preserve_evidence
      - notify_users_if_required
      
  unauthorized_access:
    severity: high
    response_time: 30m
    actions:
      - revoke_compromised_credentials
      - analyze_access_logs
      - check_data_integrity
      
  ddos_attack:
    severity: medium
    response_time: 15m
    actions:
      - enable_ddos_protection
      - scale_infrastructure
      - monitor_performance

contacts:
  security_team: security@hashrexa.com
  legal_team: legal@hashrexa.com
  pr_team: pr@hashrexa.com
```

### Automated Response

```go
// Automated incident response
type IncidentResponse struct {
    alerts    chan SecurityAlert
    actions   map[string]func(SecurityAlert) error
}

func (i *IncidentResponse) HandleAlert(alert SecurityAlert) error {
    switch alert.Type {
    case "rate_limit_exceeded":
        return i.blockIPAddress(alert.IPAddress, 1*time.Hour)
        
    case "suspicious_login":
        return i.requireMFA(alert.UserID)
        
    case "data_breach_detected":
        return i.emergencyShutdown(alert)
        
    default:
        return i.logAndNotify(alert)
    }
}

func (i *IncidentResponse) blockIPAddress(ip string, duration time.Duration) error {
    // Add to firewall block list
    cmd := exec.Command("iptables", "-A", "INPUT", "-s", ip, "-j", "DROP")
    return cmd.Run()
}
```

## ✅ Security Checklist

### Pre-Production Security Audit

- [ ] **Secrets Management**
  - [ ] No hardcoded secrets in code
  - [ ] Secure key storage (Vault/AWS Secrets)
  - [ ] Key rotation implemented
  
- [ ] **Network Security**
  - [ ] HTTPS enforced everywhere
  - [ ] Firewall rules configured
  - [ ] VPN for internal access
  
- [ ] **Authentication**
  - [ ] Strong API key generation
  - [ ] Multi-factor authentication
  - [ ] Session management
  
- [ ] **Authorization**
  - [ ] Role-based access control
  - [ ] Principle of least privilege
  - [ ] Resource-level permissions
  
- [ ] **Data Protection**
  - [ ] Encryption at rest
  - [ ] Encryption in transit
  - [ ] Secure key management
  
- [ ] **Monitoring**
  - [ ] Comprehensive audit logging
  - [ ] Security event detection
  - [ ] Incident response plan
  
- [ ] **Compliance**
  - [ ] Data retention policies
  - [ ] Privacy controls
  - [ ] Regulatory requirements

---

**Need help with security implementation?**
- 🔒 [Security Hardening Guide](security-hardening)
- 📋 [Compliance Checklist](compliance)
- 🚨 [Incident Response Plan](incident-response)
