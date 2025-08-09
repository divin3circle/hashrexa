---
id: repositories
title: Code Repositories
sidebar_label: Repositories
---

# Project Structure

HashRexa is organized as a monorepo containing multiple services that work together to provide a complete blockchain and AI-powered application.

## Repository Overview

| Component | Technology | Directory | Purpose |
|-----------|------------|-----------|---------|
| AI Service | Java/Spring Boot | `ai/` | Hedera operations and AI integration |
| Backend | Go | `backend/` | Core business logic and data services |
| Frontend | React/Vite | `frontend/` | User interface and client-side logic |
| Documentation | Docusaurus | `documentation/` | Project documentation (this site) |

## AI Service (`ai/`)

The AI service is built with Java and Spring Boot, providing:

- **AI Integration**: Uses Spring AI with Azure OpenAI to power conversational interfaces
- **Hedera Operations**: Direct interaction with the Hedera blockchain
- **REST API**: Endpoints for AI chat and blockchain operations
- **Streaming Support**: Server-Sent Events for real-time updates

### Key Files

- `src/main/java/com/javaguy/hedera/HederaService.java`: Core Hedera functionality
- `src/main/java/com/javaguy/hedera/UiController.java`: Web interface controller
- `src/main/java/com/javaguy/hedera/LoanAssistanceService.java`: AI-powered lending assistant

## Go Backend (`backend/`)

The Go backend provides core business logic and data services:

- **Portfolio Management**: Track and manage user assets
- **Tokenization**: Create and manage tokens on Hedera
- **Topic Registration**: HCS topic creation and management
- **Market Data**: Integration with Alpaca for market data

### Key Files

- `internal/app/app.go`: Application setup and configuration
- `internal/routes/routes.go`: API route definitions
- `internal/hedera/client.go`: Hedera client implementation

## Frontend (`frontend/`)

The React frontend provides the user interface:

- **WalletConnect Integration**: For secure blockchain interactions
- **Topic Creation**: User interface for HCS topic creation
- **Registration Flows**: User onboarding and account setup
- **API Integration**: Consumes both Go backend and AI service APIs

### Key Files

- `src/components/`: UI components
- `src/services/api.ts`: API client for backend services
- `src/pages/`: Application pages and routes

## Architecture Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│  Go Backend │────▶│ AI Service  │
│  (React/TS) │◀────│     (Go)    │◀────│  (Java/SB)  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────────────────────────────────────────┐
│                 Hedera Network                   │
└─────────────────────────────────────────────────┘
```

## Getting Started with Development

To start working with the codebase:

1. Clone the repository
2. Set up environment variables as described in [Getting Started](getting-started)
3. Start each service according to its README instructions
4. See [Contributing](contributing) for development guidelines

For API details, refer to the [API Reference](api-reference) section.


