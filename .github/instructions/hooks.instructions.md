---
description: Rules for React Custom Hooks (Logic Layer)
applyTo: src/hooks/**/*.ts, src/features/**/hooks/*.ts
---

# Hook Rules — Logic Orchestration Layer

Hooks are the bridge between UI components and services/data. They own React state and side effects. They must **not** contain business logic — delegate that to service classes.

---

## 1. Single Responsibility

Every hook does exactly one thing. Split by concern, not by feature:

```typescript
// ✅ Focused hooks
useEscrowData(id)       // fetches escrow from API
useEscrowActions(id)    // mutation operations on an escrow
useEscrowValidation()   // form validation logic

// ❌ God hook — too many concerns
useEscrow(id)  // fetches + mutates + validates + formats
```

---

## 2. Encapsulation — Treat as Private Logic Controllers

- Internal state (`useState`, `useReducer`) is **never exposed** directly.
- Only return what the component strictly needs — the public API.
- Name returned functions as actions, not setters: `submitEscrow`, not `setEscrow`.

```typescript
// ✅ Clean encapsulated public API
return { escrow, isLoading, error, submitEscrow, cancelEscrow };

// ❌ Leaking internal state
return { escrow, setEscrow, loading, setLoading, ... };
```

---

## 3. Always Define a Return Type Interface

Every hook must have an explicit return type interface defined above it:

```typescript
interface UseEscrowResult {
  escrow: Escrow | null;
  isLoading: boolean;
  error: string | null;
  submitEscrow: (dto: CreateEscrowDto) => Promise<void>;
}

export function useEscrow(id: string): UseEscrowResult {
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
const { data, isLoading, error } = useEscrowList(filters);
const { page, totalPages, setPage, search, setSearch, sort, setSort } = useListPagination();
```

---

## 5. Delegate Business Logic to Services

Hooks call services — they do not implement business rules. No calculation, validation, or transformation logic inside hooks.

```typescript
// ✅ Hook delegates to service
export function useCreateEscrow() {
  const mutate = useMutation({
    mutationFn: (dto: CreateEscrowDto) => EscrowApiService.create(dto),
  });
  return { createEscrow: mutate.mutate, isCreating: mutate.isPending };
}

// ❌ Hook implements business logic
export function useCreateEscrow() {
  const create = async (dto) => {
    if (!dto.amount || dto.amount <= 0) throw new Error("...");
    const fee = dto.amount * 0.02;  // ← business logic here, wrong
    await fetch("/api/escrow", { ... });
  };
}
```

---

## 6. Stable References — useCallback & useMemo

Always wrap returned functions in `useCallback` and derived data in `useMemo` to prevent unnecessary re-renders:

```typescript
const submitEscrow = useCallback(async (dto: CreateEscrowDto) => {
  await mutate(dto);
}, [mutate]);

const sortedEscrows = useMemo(
  () => escrows.sort((a, b) => b.createdAt - a.createdAt),
  [escrows]
);
```

---

## 7. Side Effects — One Concern Per useEffect

Each `useEffect` handles exactly one side effect. Always return a cleanup function for subscriptions or timers.

```typescript
// ✅ Single concern, with cleanup
useEffect(() => {
  const sub = contractEvents.subscribe(onEvent);
  return () => sub.unsubscribe();
}, [contractEvents]);

// ❌ Multiple concerns in one effect
useEffect(() => {
  fetchData();
  setupWebSocket();
  startPolling();
}, []);
```

---

## 8. Wagmi Auth Hook Pattern (Project-Specific)

Never redirect based on `isConnected` alone — Wagmi rehydrates from localStorage causing a false `false`:

```typescript
const { isConnected, isConnecting, isReconnecting } = useAccount();

useEffect(() => {
  if (!isConnecting && !isReconnecting && !isConnected) {
    router.push("/");
  }
}, [isConnected, isConnecting, isReconnecting]);
```

---

## 9. Testing Hooks

Test hooks with `renderHook` from `@testing-library/react`. Mock all external dependencies (fetch, wagmi, prisma) — never make real network calls in tests.

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useEscrow } from "@/hooks/useEscrow";

jest.spyOn(global, "fetch").mockResolvedValue({
  ok: true,
  json: async () => ({ id: "1", amount: 100 }),
} as Response);

it("returns escrow data", async () => {
  const { result } = renderHook(() => useEscrow("1"));
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.escrow?.amount).toBe(100);
});
```

---

## 10. Naming Convention

| Pattern | Example |
|---------|---------|
| Data fetching | `useEscrowList`, `useUserRole` |
| Mutations | `useCreateEscrow`, `useResolveDispute` |
| UI/form state | `useEscrowForm`, `usePagination` |
| Auth/guards | `useRequireAuth`, `useRequireAdmin` |
| Blockchain | `useDeployEscrow`, `useTokenBalance` |