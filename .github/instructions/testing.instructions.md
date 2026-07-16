---
description: Rules for Jest Unit Tests and Integration Tests
applyTo: __tests__/**/*.ts, __tests__/**/*.tsx
---

# Testing Rules — Jest Unit & Integration Tests

All business logic must be unit-tested. Tests must run fast, be deterministic, and require no real database or network.

---

## 1. Test Configuration

- **Runner**: Jest (no `jest.config.ts` exists yet in this project — add one at the repository root when introducing the first test)
- **Environment**: `node` (not `jsdom`) — use `jsdom` only when testing React components/hooks
- **Test location**: `__tests__/**/*.test.ts` (or `.test.tsx` for React) at the repository root
- **Run**: `npm run test` (add the script when Jest is configured) or `npx jest --watch`
- **Alias**: `@/` maps to the repository root via `moduleNameMapper` (mirrors [tsconfig.json](tsconfig.json))

---

## 2. What Must Be Tested

| Layer | Test type | Priority |
|-------|-----------|----------|
| Service classes | Unit | **Required** |
| Repository methods | Unit (with mock db) | Required |
| Utility functions (`lib/`) | Unit | Required |
| API route handlers | Integration (mock NextRequest) | Required |
| Hooks with side effects | Unit (`renderHook`) | Required |
| Pure UI components | Snapshot / render | Optional |

---

## 3. Testing Service Classes

Inject mock Prisma via constructor. Never use the real database.

```typescript
import { ListingService } from "@/services/ListingService";
import type { PrismaClient } from "@/generated/prisma/client";

const mockDb = {
  carListing: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
} as unknown as PrismaClient;

describe("ListingService", () => {
  let service: ListingService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ListingService(mockDb);
  });

  it("returns null when listing not found", async () => {
    (mockDb.carListing.findUnique as jest.Mock).mockResolvedValue(null);
    const result = await service.getListingById(999);
    expect(result).toBeNull();
  });

  it("throws when price is not positive", async () => {
    await expect(
      service.createListing({ makeId: 1, modelId: 1, price: 0, year: 2020 })
    ).rejects.toThrow("Listing price must be positive");
  });
});
```

---

## 4. Mocking Prisma

Two approaches depending on what you need:

**Option A — Constructor injection (preferred — follows DI pattern):**
```typescript
const mockDb = { carListing: { findUnique: jest.fn() } } as unknown as PrismaClient;
const service = new ListingService(mockDb);
```

**Option B — Module mock (for legacy code or API routes):**
```typescript
jest.mock("@/lib/prisma", () => ({
  carListing: { findUnique: jest.fn(), create: jest.fn() },
}));
import prisma from "@/lib/prisma";
```

---

## 5. Mocking fetch

```typescript
const mockFetch = jest.spyOn(global, "fetch");

beforeEach(() => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ id: "1", status: "active" }),
  } as Response);
});

afterEach(() => mockFetch.mockRestore());
```

---

## 7. Testing Hooks with renderHook

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useListingList } from "@/hooks/useListingList";

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

it("fetches listing list", async () => {
  jest.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: async () => [{ id: "1" }],
  } as Response);

  const { result } = renderHook(() => useListingList(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.listings).toHaveLength(1);
});
```

---

## 8. Testing API Routes

Mock `NextRequest` and assert on the response:

```typescript
import { POST } from "@/app/api/cars/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  carListing: { create: jest.fn().mockResolvedValue({ id: "1" }) },
}));

it("creates listing and returns 201", async () => {
  const req = new NextRequest("http://localhost/api/cars", {
    method: "POST",
    body: JSON.stringify({ make: "Toyota", model: "Corolla", year: 2020, price: 15000 }),
  });

  const res = await POST(req);
  expect(res.status).toBe(201);
  const body = await res.json();
  expect(body.success).toBe(true);
});

it("returns 400 when required fields are missing", async () => {
  const req = new NextRequest("http://localhost/api/cars", { method: "POST", body: "{}" });
  const res = await POST(req);
  expect(res.status).toBe(400);
});
```

---

## 9. Test File Structure

```
__tests__/
  services/
    ListingService.test.ts
    TruthScoreService.test.ts
    UserRoleService.test.ts
  hooks/
    useListingList.test.tsx
    useRequireAuth.test.tsx
  api/
    cars.route.test.ts
    admin-listings.route.test.ts
  utils/
    tco.test.ts
    listingStatus.test.ts
```

---

## 10. Test Anti-Patterns to Avoid

```typescript
// ❌ Testing implementation details
expect(mockDb.carListing.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });

// ✅ Test observable behaviour
expect(result).toEqual({ id: 1, price: 15000 });

// ❌ Real network calls
const result = await fetch("https://autod.pro/api/...");

// ✅ Always mock external calls
jest.spyOn(global, "fetch").mockResolvedValueOnce(...);

// ❌ Sharing state between tests
let service: ListingService;  // defined outside describe
// ✅ Always create fresh instances
beforeEach(() => { service = new ListingService(mockDb); });
```