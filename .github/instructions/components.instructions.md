---
description: Rules for UI Components
applyTo: src/components/**/*.tsx, src/app/[locale]/**/_components/**/*.tsx
---

# Component Rules — UI Layer

Components render UI. They consume hooks and context. They contain zero business logic and zero data fetching.

---

## 1. Server Component by Default

Default to Server Components. Only add `"use client"` when you actually need:
- Browser APIs (`window`, `localStorage`, `document`)
- React state (`useState`, `useReducer`)
- React effects (`useEffect`)
- Event handlers (onClick, onChange, etc.)
- Context consumers with client-side state
- Wagmi/wallet hooks

```typescript
// ✅ Server Component — no directive needed, renders on server
export function EscrowCard({ escrow }: { escrow: Escrow }) {
  return <div>{escrow.amount}</div>;
}

// ✅ Client Component — needs event handler
"use client";
export function CancelButton({ escrowId }: { escrowId: string }) {
  const { cancel, isCancelling } = useCancelEscrow(escrowId);
  return <button onClick={cancel} disabled={isCancelling}>Cancel</button>;
}
```

---

## 2. Props Must Be Typed with Interface or Type

Every component has an explicit props interface. No `any`, no untyped props, no spreading unknown objects.

```typescript
// ✅ Explicit typed props
interface EscrowCardProps {
  escrow: Escrow;
  locale: string;
  onCancel?: (id: string) => void;
}

export function EscrowCard({ escrow, locale, onCancel }: EscrowCardProps) { ... }

// ❌ Untyped props
export function EscrowCard(props: any) { ... }
```

---

## 3. No Business Logic in Components

Components do not: calculate fees, validate wallet addresses, query databases, call Prisma, or make fetch requests. All of that lives in hooks or services.

```typescript
// ❌ Business logic in component
export function EscrowCard({ escrow }) {
  const fee = escrow.amount * 0.02;  // ← business logic
  const isExpired = Date.now() / 1000 > escrow.deadline;  // ← business logic
  // ...
}

// ✅ Pass pre-computed values from hook or page
export function EscrowCard({ escrow, fee, isExpired }) { ... }
```

---

## 4. Data Fetching Belongs in Hooks, Not Components

Components never call `fetch` or useQuery directly. They call a hook that handles data fetching.

```typescript
// ❌ Component fetches data
"use client";
export function EscrowList() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch("/api/escrow").then(...).then(setData) }, []);
  // ...
}

// ✅ Component consumes a hook
"use client";
export function EscrowList() {
  const { escrows, isLoading } = useEscrowList();
  if (isLoading) return <Spinner />;
  return <ul>{escrows.map(e => <EscrowItem key={e.id} escrow={e} />)}</ul>;
}
```

---

## 5. Component Size — Single Responsibility

If a component grows beyond ~100 lines or handles more than one visual concern, split it:

```
EscrowDetailPage        ← orchestration only
  EscrowHeader          ← title, status badge, actions
  EscrowParties         ← buyer/seller addresses
  EscrowTimeline        ← milestones/history
  DisputeSection        ← dispute UI (conditionally rendered)
```

---

## 6. Translations in Components

Always use `useTranslations` with a namespace. Never hardcode user-visible strings.

```typescript
"use client";
import { useTranslations } from "next-intl";

export function EscrowStatus({ status }: { status: string }) {
  const t = useTranslations("status.escrow");
  return <span>{t(status)}</span>;
}
```

For Server Components, pass `locale` from `params` and use `getTranslations`:

```typescript
import { getTranslations } from "next-intl/server";

export async function EscrowCard({ escrow, locale }: EscrowCardProps) {
  const t = await getTranslations({ locale, namespace: "escrow" });
  return <div>{t("amount", { value: escrow.amount })}</div>;
}
```

---

## 7. Modals

Use `react-modal`. Always set `Modal.setAppElement()` in the component or in a global setup file:

```typescript
import Modal from "react-modal";
Modal.setAppElement("#__next");

export function DeleteModal({ isOpen, onConfirm, onClose }) {
  // ...
}
```

---

## 8. Loading & Error States

Every component that depends on async data must handle loading and error states explicitly. Never render nothing silently:

```typescript
"use client";
export function EscrowList() {
  const { escrows, isLoading, error } = useEscrowList();

  if (isLoading) return <EscrowListSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!escrows.length) return <EmptyState />;

  return <ul>{escrows.map(e => <EscrowItem key={e.id} escrow={e} />)}</ul>;
}
```

---

## 9. Accessibility

- All interactive elements must have accessible labels (`aria-label` or visible text).
- Images must have `alt` text.
- Buttons must have meaningful text or `aria-label`.
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<article>`).

```typescript
// ✅ Accessible
<button onClick={onCancel} aria-label={t("cancelEscrow")}>
  <XIcon />
</button>

// ❌ Inaccessible
<div onClick={onCancel}><XIcon /></div>
```