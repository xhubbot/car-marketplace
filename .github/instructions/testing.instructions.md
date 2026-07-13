---
description: Rules for Jest Unit Tests and Integration Tests
applyTo: src/__tests__/**/*.ts, src/__tests__/**/*.tsx
---

# Testing Rules — Jest Unit & Integration Tests

All business logic must be unit-tested. Tests must run fast, be deterministic, and require no real database or network.

---

## 1. Test Configuration

- **Runner**: Jest (`apps/web/jest.config.ts`)
- **Environment**: `node` (not `jsdom`) — use `jsdom` only when testing React components/hooks
- **Test location**: `src/__tests__/**/*.test.ts` (or `.test.tsx` for React)
- **Run**: `npm run test` from `apps/web/`
- **Alias**: `@/` maps to `src/` via `moduleNameMapper`

---

## 2. What Must Be Tested

| Layer | Test type | Priority |
|-------|-----------|----------|
| Service classes | Unit | **Required** |
| Repository methods | Unit (with mock db) | Required |
| Utility functions (`src/utils/`) | Unit | Required |
| API route handlers | Integration (mock NextRequest) | Required |
| Hooks with side effects | Unit (`renderHook`) | Required |
| Pure UI components | Snapshot / render | Optional |

---

## 3. Testing Service Classes

Inject mock Prisma via constructor. Never use the real database.

```typescript
import { EscrowService } from "@/services/EscrowService";
import type { PrismaClient } from "@prisma/client";

const mockDb = {
  escrow: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
} as unknown as PrismaClient;

describe("EscrowService", () => {
  let service: EscrowService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EscrowService(mockDb);
  });

  it("returns null when escrow not found", async () => {
    (mockDb.escrow.findUnique as jest.Mock).mockResolvedValue(null);
    const result = await service.getEscrowById("nonexistent");
    expect(result).toBeNull();
  });

  it("throws when buyer and seller are the same wallet", async () => {
    await expect(
      service.createEscrow({ buyerWallet: "0xabc", sellerWallet: "0xabc", amount: 100 })
    ).rejects.toThrow("Buyer and seller cannot be the same wallet");
  });
});
```

---

## 4. Mocking Prisma

Two approaches depending on what you need:

**Option A — Constructor injection (preferred — follows DI pattern):**
```typescript
const mockDb = { escrow: { findUnique: jest.fn() } } as unknown as PrismaClient;
const service = new EscrowService(mockDb);
```

**Option B — Module mock (for legacy code or API routes):**
```typescript
jest.mock("@/lib/prisma", () => ({
  escrow: { findUnique: jest.fn(), create: jest.fn() },
}));
import prisma from "@/lib/prisma";
```

---

## 5. Mocking Wagmi Hooks

```typescript
jest.mock("wagmi", () => ({
  useAccount: jest.fn(() => ({
    address: "0xabc123",
    isConnected: true,
    isConnecting: false,
    isReconnecting: false,
  })),
  useReadContract: jest.fn(() => ({ data: undefined, isLoading: false })),
  useWriteContract: jest.fn(() => ({ writeContractAsync: jest.fn() })),
}));
```

---

## 6. Mocking fetch

```typescript
const mockFetch = jest.spyOn(global, "fetch");

beforeEach(() => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ id: "1", status: "PENDING" }),
  } as Response);
});

afterEach(() => mockFetch.mockRestore());
```

---

## 7. Testing Hooks with renderHook

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEscrowList } from "@/hooks/useEscrowList";

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

it("fetches escrow list", async () => {
  jest.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: async () => [{ id: "1" }],
  } as Response);

  const { result } = renderHook(() => useEscrowList(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.escrows).toHaveLength(1);
});
```

---

## 8. Testing API Routes

Mock `NextRequest` and assert on the response:

```typescript
import { POST } from "@/app/api/escrow/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  escrow: { create: jest.fn().mockResolvedValue({ id: "1" }) },
}));

it("creates escrow and returns 201", async () => {
  const req = new NextRequest("http://localhost/api/escrow", {
    method: "POST",
    headers: { "x-wallet-address": "0xabc" },
    body: JSON.stringify({ amount: 100, sellerWallet: "0xdef" }),
  });

  const res = await POST(req);
  expect(res.status).toBe(201);
  const body = await res.json();
  expect(body.id).toBe("1");
});

it("returns 401 when wallet header is missing", async () => {
  const req = new NextRequest("http://localhost/api/escrow", { method: "POST" });
  const res = await POST(req);
  expect(res.status).toBe(401);
});
```

---

## 9. Test File Structure

```
src/__tests__/
  services/
    EscrowService.test.ts
    DisputeService.test.ts
    UserRoleService.test.ts
  hooks/
    useRequireAuth.test.tsx
    useDeployEscrow.test.tsx
  api/
    escrow.route.test.ts
    disputes.route.test.ts
  utils/
    escrowStatus.test.ts
    contractErrorHandler.test.ts
```

---

## 10. Test Anti-Patterns to Avoid

```typescript
// ❌ Testing implementation details
expect(mockDb.escrow.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });

// ✅ Test observable behaviour
expect(result).toEqual({ id: "1", amount: 100 });

// ❌ Real network calls
const result = await fetch("https://api.rahakaitse.ee/...");

// ✅ Always mock external calls
jest.spyOn(global, "fetch").mockResolvedValueOnce(...);

// ❌ Sharing state between tests
let service: EscrowService;  // defined outside describe
// ✅ Always create fresh instances
beforeEach(() => { service = new EscrowService(mockDb); });
```