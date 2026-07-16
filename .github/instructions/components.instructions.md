---
description: Rules for UI Components
applyTo: components/**/*.tsx, app/[locale]/**/_components/**/*.tsx
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
- Context consumers with client-side state (e.g. `useCompare`, `useTheme`)

```typescript
// ✅ Server Component — no directive needed, renders on server
export function CarCard({ listing }: { listing: CarListing }) {
  return <div>{listing.price}</div>;
}

// ✅ Client Component — needs event handler
"use client";
export function CompareButton({ listingId }: { listingId: string }) {
  const { toggleCompare, compareDeckIds } = useCompare();
  return <button onClick={() => toggleCompare(listingId)}>Compare</button>;
}
```

---

## 2. Props Must Be Typed with Interface or Type

Every component has an explicit props interface. No `any`, no untyped props, no spreading unknown objects.

```typescript
// ✅ Explicit typed props
interface CarCardProps {
  listing: CarListing;
  locale: string;
  onCompare?: (id: string) => void;
}

export function CarCard({ listing, locale, onCompare }: CarCardProps) { ... }

// ❌ Untyped props
export function CarCard(props: any) { ... }
```

---

## 3. No Business Logic in Components

Components do not: calculate TCO/truth scores, validate listing data, query databases, call Prisma, or make fetch requests. All of that lives in hooks or services.

```typescript
// ❌ Business logic in component
export function CarCard({ listing }) {
  const monthlyTco = calculateTotalMonthlyTCO(...);  // ← business logic
  const isExpired = new Date() > listing.expiresAt;  // ← business logic
  // ...
}

// ✅ Pass pre-computed values from hook or page
export function CarCard({ listing, monthlyTco, isExpired }) { ... }
```

---

## 4. Data Fetching Belongs in Hooks, Not Components

Components never call `fetch` or useQuery directly. They call a hook that handles data fetching.

```typescript
// ❌ Component fetches data
"use client";
export function ListingList() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch("/api/cars").then(...).then(setData) }, []);
  // ...
}

// ✅ Component consumes a hook
"use client";
export function ListingList() {
  const { listings, isLoading } = useListingList();
  if (isLoading) return <Spinner />;
  return <ul>{listings.map(l => <CarCard key={l.id} listing={l} />)}</ul>;
}
```

---

## 5. Component Size — Single Responsibility

If a component grows beyond ~100 lines or handles more than one visual concern, split it:

```
CarDetailsView            ← orchestration only
  CarDetailsPhotoSpecs    ← photo gallery + spec sheet
  CarDetailsOwnershipSidebar ← TCO/truth-score breakdown (ownership view)
  CarDetailsStandardSidebar  ← price/contact seller (standard view)
  CarDetailsControls      ← compare/favorite/share actions
```

---

## 6. Translations in Components

Always use `useTranslations` with a namespace. Never hardcode user-visible strings.

```typescript
"use client";
import { useTranslations } from "next-intl";

export function ListingStatusBadge({ status }: { status: string }) {
  const t = useTranslations("status.listing");
  return <span>{t(status)}</span>;
}
```

For Server Components, pass `locale` from `params` and use `getTranslations`:

```typescript
import { getTranslations } from "next-intl/server";

export async function CarCard({ listing, locale }: CarCardProps) {
  const t = await getTranslations({ locale, namespace: "listing" });
  return <div>{t("price", { value: listing.price })}</div>;
}
```

---

## 7. Modals

Use Radix UI primitives (`radix-ui`, already a project dependency) for modals/dialogs rather than rolling custom overlay logic:

```typescript
"use client";
import { Dialog } from "radix-ui";

export function DeleteListingModal({ open, onOpenChange, onConfirm }: DeleteListingModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* ... */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

---

## 8. Loading & Error States

Every component that depends on async data must handle loading and error states explicitly. Never render nothing silently:

```typescript
"use client";
export function ListingList() {
  const { listings, isLoading, error } = useListingList();

  if (isLoading) return <ListingListSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!listings.length) return <EmptyState />;

  return <ul>{listings.map(l => <CarCard key={l.id} listing={l} />)}</ul>;
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
<button onClick={onCompare} aria-label={t("addToCompare")}>
  <PlusIcon />
</button>

// ❌ Inaccessible
<div onClick={onCompare}><PlusIcon /></div>
```