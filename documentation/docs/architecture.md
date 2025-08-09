---
id: architecture
title: Architecture
sidebar_label: Architecture
---

## System diagram

```mermaid
flowchart LR
  classDef comp fill:#0ea5e9,stroke:#0369a1,color:#ffffff,rx:6,ry:6;
  classDef svc fill:#10b981,stroke:#065f46,color:#ffffff,rx:6,ry:6;
  classDef data fill:#f59e0b,stroke:#92400e,color:#ffffff,rx:6,ry:6;
  classDef ext fill:#64748b,stroke:#334155,color:#ffffff,rx:6,ry:6;
  classDef ctrl fill:#a78bfa,stroke:#6d28d9,color:#ffffff,rx:6,ry:6;

  subgraph Frontend["Frontend - Vite + React"]
    UI["WalletConnect UI<br/>Topic Manager"]:::comp
  end

  subgraph Java["Java Service - Spring Boot + Spring AI"]
    AICtrl["AI REST Controllers"]:::ctrl
    HederaSvc["HederaService<br/>SDK - Token, Transfer, Balance, Account, Topic"]:::svc
    LoanTools["LoanTools<br/>Go client + PortfolioService"]:::svc
    BlockchainTools["BlockchainTools<br/>Hedera ops via AI tools"]:::svc
  end

  subgraph Go["Go Backend"]
    Routes["REST Routes"]:::ctrl
    UserHandler["UserHandler<br/>Topic, Tokenize, Portfolio, Alpaca"]:::svc
    Badger[(Badger DB)]:::data
    Hiero["Hedera - Hiero SDK"]:::svc
    Alpaca["Alpaca API"]:::ext
  end

  subgraph Hedera["Hedera Network"]
    Network["Mainnet or Testnet"]:::ext
    Mirror["Mirror Node REST API"]:::ext
  end

  %% Flows
  UI -- "REST" --> Routes
  AICtrl -- "REST via base-url" --> Routes
  Routes --> UserHandler
  UserHandler --> Badger
  UserHandler --> Hiero
  UserHandler --> Alpaca
  UserHandler --> Mirror

  AICtrl -- "Tools" --> LoanTools
  LoanTools --> PortfolioService
  BlockchainTools --> HederaSvc
  HederaSvc --> Network
```

## Request sequence — portfolio

```mermaid
sequenceDiagram
  autonumber
  participant FE as Frontend / UI
  participant AI as Spring AI - LoanTools
  participant GO as Go Backend
  participant DB as BadgerDB
  participant H as Hedera

  FE->>AI: GET portfolio for accountId
  AI->>GO: GET /portfolio/{accountId}
  GO->>DB: Lookup mapping accountId -> topicId
  GO-->>AI: JSON { portfolio: ... }
  AI-->>FE: Formatted summary or JSON
```

## Main components

- Hedera SDK and Mirror Node
  - HederaService executes on-chain ops: create token, transfer, balance, account, topic.
  - Go backend writes user state to HCS topics and reads via Mirror Node REST.

- Spring Boot backend services
  - REST controllers for AI interactions and direct testing.
  - Configuration for Hedera network and Go backend base URL.

- Spring AI module
  - Uses Azure OpenAI via Spring AI.
  - Tools:
    - BlockchainTools: exposes Hedera ops to the model.
    - LoanTools: Go backend integration + PortfolioService.

- Go backend (REST)
  - Endpoints for registration, tokenization, portfolio, positions, history.
  - Persists mappings in Badger; mints with Hiero SDK; fetches portfolio from Alpaca.

- Streaming
  - Stream AI or long-running results via SSE or WebSocket if needed (see Streaming).
```