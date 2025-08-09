---
id: ai-tools
title: AI Tools and Usage
sidebar_label: AI Tools
---

The AI layer uses tools so the model invokes real blockchain and backend operations.

## Tools overview

- `checkBalance(accountId)`
- `createToken(name, symbol, initialSupply, decimals?)`
- `transferTokens(tokenId, toAccountId, amount)`
- `createAccount()`
- `getUserPortfolio(accountId)`
- `calculateBorrowingPower(accountId)`
- `tokenizePortfolio(accountId)`

## Tool method signatures (Java)

```java
@Tool(description = "Check HBAR and token balance for any account")
public String checkBalance(@ToolParam(description = "Account ID") String accountId) { /* ... */ }

@Tool(description = "Create a new token on Hedera")
public String createToken(
    @ToolParam(description = "Name") String name,
    @ToolParam(description = "Symbol") String symbol,
    @ToolParam(description = "Initial supply") int initialSupply,
    @ToolParam(description = "Decimals", required = false) Integer decimals
) { /* ... */ }
```

## ChatClient wiring

```java
String content = ChatClient.builder(chatModel)
    .defaultSystem("""
      Use functions for blockchain ops only.
      Call: checkBalance, createToken, transferTokens, createAccount.
      If out of scope, reply: I cannot perform that.
    """)
    .build()
    .prompt()
    .user(message)
    .tools(blockchainTools)
    .call()
    .content();
```

## Example prompts

```text
- Check balance of 0.0.12345
- Create token DemoToken with symbol DMO and supply 100000
- Transfer 250 DMO to 0.0.54321
- Show my portfolio for 0.0.12345
- What is my borrowing power?
```


