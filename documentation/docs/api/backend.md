## API Reference — Go Backend

Base URL: `http://localhost:8080`

CORS allows `http://localhost:5173` by default.

### Health
- GET `/health`

### Register user + topic
- POST `/auth/register/{userAccountId}/{topicId}`

### Check topic exists
- GET `/topics/exists/{userAccountId}`

### Get portfolio
- GET `/portfolio/{userAccountId}`

### Get tokenized assets
- GET `/tokenized-assets/{userAccountId}`

### Tokenize portfolio
- GET `/tokenize-portfolio/{userAccountId}`

### Positions (Alpaca)
- GET `/positions`

### Portfolio history (Alpaca)
- GET `/portfolio-history`

### Stock logo
- GET `/stock-logo/{stockSymbol}`

### Mirror Node usage
- Reads latest user message from HCS topic using Mirror Node REST and base64 decoding.


