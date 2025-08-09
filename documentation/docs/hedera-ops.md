---
id: hedera-ops
title: Hedera Operations
sidebar_label: Hedera Ops
---

## Configure client

```java
@Bean
public Client client() {
  Client c = "testnet".equals(System.getenv().getOrDefault("HEDERA_NETWORK","testnet"))
      ? Client.forTestnet() : Client.forMainnet();
  c.setOperator(
      AccountId.fromString(System.getenv("HEDERA_OPERATOR_ID")),
      PrivateKey.fromString(System.getenv("HEDERA_OPERATOR_PRIVATE_KEY"))
  );
  return c;
}
```

## Create a token

```java
public OperationResult createToken(TokenCreateRequest req) {
  TokenCreateTransaction tx = new TokenCreateTransaction()
      .setTokenName(req.name())
      .setTokenSymbol(req.symbol())
      .setInitialSupply(req.initialSupply())
      .setDecimals(req.decimals() != null ? req.decimals() : 2)
      .setTreasuryAccountId(client.getOperatorAccountId())
      .setAdminKey(client.getOperatorPublicKey())
      .setSupplyKey(client.getOperatorPublicKey())
      .setFreezeDefault(false);
  TransactionResponse resp = tx.execute(client);
  TransactionReceipt r = resp.getReceipt(client);
  return OperationResult.success(
      "Token created with id: " + r.tokenId,
      resp.transactionId.toString()
  );
}
```

## Transfer tokens

```java
public OperationResult transferTokens(TransferRequest req) {
  TokenId tid = TokenId.fromString(req.tokenId());
  AccountId to = AccountId.fromString(req.toAccountId());
  AccountId from = client.getOperatorAccountId();

  TransferTransaction tx = new TransferTransaction()
      .addTokenTransfer(tid, from, -req.amount())
      .addTokenTransfer(tid, to, req.amount());

  TransactionResponse resp = tx.execute(client);
  return OperationResult.success(
      "Transfer complete to " + req.toAccountId(),
      resp.transactionId.toString()
  );
}
```

## Check balance

```java
public OperationResult getAccountBalance(BalanceQuery q) {
  AccountId id = AccountId.fromString(q.accountId());
  AccountBalance bal = new AccountBalanceQuery().setAccountId(id).execute(client);
  return OperationResult.success(
      "Account " + q.accountId() + " has " + bal.hbars + " HBAR",
      new BalanceInfo(bal.hbars.toString())
  );
}
```

## Create an account

```java
public OperationResult createAccount() {
  PrivateKey priv = PrivateKey.generateED25519();
  PublicKey pub = priv.getPublicKey();
  AccountCreateTransaction tx = new AccountCreateTransaction()
      .setKey(pub)
      .setInitialBalance(Hbar.fromTinybars(1000));
  TransactionResponse resp = tx.execute(client);
  TransactionReceipt r = resp.getReceipt(client);
  return OperationResult.success(
      "Account created: " + r.accountId,
      new AccountInfo(r.accountId.toString(), pub.toString(), priv.toString())
  );
}
```

> Always store new private keys securely and never commit them.


