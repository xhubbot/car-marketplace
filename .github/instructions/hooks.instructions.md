---
description: Rules for React Custom Hooks (Logic Layer)
applyTo: hooks/**/*.ts, features/**/hooks/*.ts
---

# Hook Rules — Logic Orchestration Layer

Hooks are the bridge between UI components and services/data. They own React state and side effects. They must **not** contain business logic — delegate that to service classes.

---

## 1. Single Responsibility

Every hook does exactly one thing. Split by concern, not by feature:

```typescript
// ✅ Focused hooks
useListingData(id)        // fetches a listing from the API
useListingActions(id)     // mutation operations on a listing (publish, archive)
useListingValidation()    // form validation logic

// ❌ God hook — too many concerns
useListing(id)  // fetches + mutates + validates + formats
```

---

## 2. Encapsulation — Treat as Private Logic Controllers

- Internal state (`useState`, `useReducer`) is **never exposed** directly.
- Only return what the component strictly needs — the public API.
- Name returned functions as actions, not setters: `submitListing`, not `setListing`.

```typescript
// ✅ Clean encapsulated public API
return { listing, isLoading, error, submitListing, publishListing };

// ❌ Leaking internal state
return { listing, setListing, loading, setLoading, ... };
```

---

## 3. Always Define a Return Type Interface

Every hook must have an explicit return type interface defined above it:

```typescript
interface UseListingResult {
  listing: CarListing | null;
  isLoading: boolean;
  error: string | null;
  submitListing: (dto: CreateListingDto) => Promise<void>;
}

export function useListing(id: string): UseListingResult {
  // ...
}
```

---

## 4. Interface Segregation — Max 5 Return Values

If a hook returns more than 5 values, split it into sub-hooks. Use `useReducer` for complex local state.

```typescript
// ❌ Too large — split this
return { data, isLoading, error, page, totalPages, setPage, search, setSearch, sort, setSort };

// ✅ Split into two hooks
const { data, isLoading, error } = useListingList(filters);
const { page, totalPages, setPage, search, setSearch, sort, setSort } = useListPagination();
```

---

## 5. Delegate Business Logic to Services

Hooks call services — they do not implement business rules. No calculation, validation, or transformation logic inside hooks.

```typescript
// ✅ Hook delegates to service
export function useCreateListing() {
  const mutate = useMutation({
    mutationFn: (dto: CreateListingDto) => ListingApiService.create(dto),
  });
  return { createListing: mutate.mutate, isCreating: mutate.isPending };
}

// ❌ Hook implements business logic
export function useCreateListing() {
  const create = async (dto) => {
    if (!dto.price || dto.price <= 0) throw new Error("...");
    const monthlyTco = calculateTotalMonthlyTCO(...);  // ← business logic here, wrong
    await fetch("/api/cars", { ... });
  };
}
```

---

## 6. Stable References — useCallback & useMemo

Always wrap returned functions in `useCallback` and derived data in `useMemo` to prevent unnecessary re-renders:

```typescript
const submitListing = useCallback(async (dto: CreateListingDto) => {
  await mutate(dto);
}, [mutate]);

const sortedListings = useMemo(
  () => listings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  [listings]
);
```

---

## 7. Side Effects — One Concern Per useEffect

Each `useEffect` handles exactly one side effect. Always return a cleanup function for subscriptions or timers.

```typescript
// ✅ Single concern, with cleanup
useEffect(() => {
  const handle = window.setInterval(refetch, 30_000);
  return () => window.clearInterval(handle);
}, [refetch]);

// ❌ Multiple concerns in one effect
useEffect(() => {
  fetchData();
  setupWebSocket();
  startPolling();
}, []);
```

---

## 8. Testing Hooks

Test hooks with `renderHook` from `@testing-library/react`. Mock all external dependencies (fetch, prisma) — never make real network calls in tests.

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useListing } from "@/hooks/useListing";

jest.spyOn(global, "fetch").mockResolvedValue({
  ok: true,
  json: async () => ({ id: "1", price: 15000 }),
} as Response);

it("returns listing data", async () => {
  const { result } = renderHook(() => useListing("1"));
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.listing?.price).toBe(15000);
});
```

---

## 9. Naming Convention

| Pattern | Example |
|---------|---------|
| Data fetching | `useListingList`, `useCarDetails` |
| Mutations | `useCreateListing`, `usePublishListing` |
| UI/form state | `useListingForm`, `usePagination` |
| Auth/guards | `useRequireAuth`, `useRequireDealer` |
| Domain calculations | `useTruthScore`, `useMonthlyTco` |