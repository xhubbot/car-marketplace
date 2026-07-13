---
description: Rules for Page Components (Next.js App Router)
applyTo: src/app/[locale]/**/*.tsx, src/app/[locale]/**/*.ts
---

# Page Rules — Next.js App Router

Pages are the top-level route handlers. They are Server Components by default and must stay thin — delegate data fetching to services and UI to components.

---

## 1. Server Components by Default

Never add `"use client"` to a page file unless absolutely required. Pages should be async Server Components that fetch data on the server.

```typescript
// ✅ Server Component page — SEO-friendly, fast, no bundle size impact
export default async function EscrowPage({ params }: { params: { id: string } }) {
  const service = new EscrowService(prisma);
  const escrow = await service.getEscrowById(params.id);
  return <EscrowDetail escrow={escrow} />;
}

// ❌ Wrong — unnecessary client component at page level
"use client";
export default function EscrowPage() {
  const [escrow, setEscrow] = useState(null);
  useEffect(() => { fetch(...).then(...) }, []);
  // ...
}
```

---

## 2. Pages Are Thin — Delegate Rendering to Components

Pages fetch data and pass it down. They do not contain JSX beyond layout wrappers and the one or two feature components they render.

```typescript
// ✅ Thin page
export default async function DashboardPage() {
  const session = await getSession();
  const stats = await new StatsService(prisma).getDashboardStats(session.wallet);
  return (
    <MainLayout>
      <DashboardView stats={stats} wallet={session.wallet} />
    </MainLayout>
  );
}

// ❌ Fat page — layout, data fetching, and rendering all mixed
export default async function DashboardPage() {
  const data = await prisma.escrow.findMany(...);
  return (
    <div className="flex flex-col ...">
      <nav>...</nav>
      <h1>Dashboard</h1>
      <table>
        {data.map(e => <tr key={e.id}><td>{e.amount}</td>...</tr>)}
      </table>
    </div>
  );
}
```

---

## 3. Always Export generateMetadata

Every locale page must export `generateMetadata` for SEO. Use `getTranslations` (server-side):

```typescript
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "escrow" });
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}
```

See `seo.instructions.md` for full SEO patterns.

---

## 4. Locale Params Are Always Destructured

All pages under `/[locale]/` receive `{ params: { locale } }`. Always destructure explicitly:

```typescript
interface PageProps {
  params: { locale: string; id?: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params: { locale, id }, searchParams }: PageProps) {
  // ...
}
```

---

## 5. Protected Pages Use Auth Check at Top

For pages that require a wallet connection, check authentication server-side or wrap the client content in `useRequireAuth`:

```typescript
// Server-side protection (preferred for admin pages)
export default async function AdminPage() {
  const wallet = await getServerWallet();
  if (!wallet) redirect("/");
  
  const role = await new UserRoleService(prisma).getRoleForWallet(wallet);
  if (role !== "admin") redirect("/en/dashboard");
  // ...
}

// Client-side protection (for pages requiring wallet state)
"use client";
export default function DashboardPage() {
  const { isAuthorized } = useRequireAuth();
  if (!isAuthorized) return null;
  // ...
}
```

---

## 6. Loading and Error States

Always provide `loading.tsx` and `error.tsx` siblings for pages with async data fetching. Use Next.js Suspense boundaries for partial loading.

```
app/[locale]/escrow/
  page.tsx          ← async server component
  loading.tsx       ← Suspense fallback UI
  error.tsx         ← Error boundary UI
  [id]/
    page.tsx
    loading.tsx
```

---

## 7. No Business Logic in Pages

Pages never: compute values, validate inputs, call Prisma directly, or implement conditional logic beyond auth checks. All of that lives in services.

```typescript
// ❌ Business logic in page
export default async function Page({ params }) {
  const escrows = await prisma.escrow.findMany({ where: { status: "PENDING" } });
  const filtered = escrows.filter(e => e.amount > 100);  // ← service logic
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);  // ← service logic
  // ...
}

// ✅ Delegate to service
export default async function Page({ params }) {
  const result = await new EscrowService(prisma).getPendingEscrowsAboveThreshold(100);
  return <EscrowList escrows={result.escrows} total={result.total} />;
}
```