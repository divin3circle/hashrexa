---
id: frontend-integration
title: Frontend Integration
sidebar_label: Frontend
---

## Fetch portfolio

```typescript
export async function getPortfolio(accountId: string) {
  const res = await fetch(`http://localhost:8082/api/ai/portfolio/${encodeURIComponent(accountId)}`);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.text();
}
```

## Ask the AI

```typescript
export async function askAI(message: string) {
  const res = await fetch("http://localhost:8082/api/ai/lending", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(`AI call failed: ${res.status}`);
  return res.text();
}
```

## React Query hook

```typescript
import { useQuery } from "@tanstack/react-query";

export function usePortfolio(accountId: string) {
  return useQuery({
    queryKey: ["portfolio", accountId],
    queryFn: () => getPortfolio(accountId),
    enabled: !!accountId,
  });
}
```

## Example UI snippet

```tsx
import React from "react";
import { usePortfolio } from "./usePortfolio";

export function PortfolioView({ accountId }: { accountId: string }) {
  const { data, isLoading, error } = usePortfolio(accountId);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load portfolio</p>;
  return <pre>{data}</pre>;
}
```


