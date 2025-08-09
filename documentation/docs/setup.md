## Setup & Installation

### Clone
```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo/documentation
```

### Install docs site dependencies
```bash
npm install
```

### Configure environment for services (optional reference)

#### Java service (Spring Boot) env vars
- `API_KEY`, `API_ENDPOINT` (Azure OpenAI)
- `HEDERA_NETWORK`, `HEDERA_OPERATOR_ACCOUNT_ID`, `HEDERA_OPERATOR_PRIVATE_KEY`
- `BACKEND_BASE_URL` (default: `http://localhost:8080`)

#### Go backend (`backend/.env`)
```env
MY_ACCOUNT_ID=0.0.xxxxxx
MY_PRIVATE_KEY=302e02...
ALPACA_API_KEY=your_alpaca_key
ALPACA_API_SECRET=your_alpaca_secret
```

### Run the documentation
Start the docs locally (hot-reload):
```bash
npm run start
```

This opens `http://localhost:3000` with all docs pages. Mermaid diagrams render automatically.

### Build and serve (static)
```bash
npm run build
npm run serve
```


