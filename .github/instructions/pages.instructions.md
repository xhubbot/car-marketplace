---
description: Rules for Page Components (Next.js App Router)
applyTo: app/[locale]/**/*.tsx, app/[locale]/**/*.ts
---

# Page Rules — Next.js App Router

Pages are the top-level route handlers. They are Server Components by default and must stay thin — delegate data fetching to services and UI to components.

---

## 1. Server Components by Default

Never add `"use client"` to a page file unless absolutely required. Pages should be async Server Components that fetch data on the server.

```typescript
// ✅ Server Component page — SEO-friendly, fast, no bundle size impact
export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = new ListingService(prisma);
  const listing = await service.getListingById(Number(id));
  return <CarDetailsView listing={listing} />;
}

// ❌ Wrong — unnecessary client component at page level
"use client";
export default function ListingDetailsPage() {
  const [listing, setListing] = useState(null);
  useEffect(() => { fetch(...).then(...) }, []);
  // ...
}
```

---

## 2. Pages Are Thin — Delegate Rendering to Components

Pages fetch data and pass it down. They do not contain JSX beyond layout wrappers and the one or two feature components they render.

```typescript
// ✅ Thin page
export default async function DealerOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession();
  const stats = await new DealerStatsService(prisma).getDashboardStats(session.user.id);
  return <DealerOverviewView stats={stats} locale={locale} />;
}

// ❌ Fat page — layout, data fetching, and rendering all mixed
export default async function DealerOverviewPage() {
  const data = await prisma.carListing.findMany(...);
  return (
    <div className="flex flex-col ...">
      <nav>...</nav>
      <h1>Dashboard</h1>
      <table>
        {data.map(l => <tr key={l.id}><td>{l.price}</td>...</tr>)}
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
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "browse" });
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
  params: Promise<{ locale: string; id?: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, id } = await params;
  // ...
}
```

---

## 5. Protected Pages Use Auth Check at Top

For pages that require a signed-in seller/dealer/admin, check the NextAuth session server-side:

```typescript
// Server-side protection (preferred for admin/dealer pages)
export default async function AdminPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const role = await new UserRoleService(prisma).getRoleForUser(session.user.id);
  if (role !== "admin") redirect("/en/browse");
  // ...
}

// Client-side protection (for pages requiring client-side session state)
"use client";
export default function DealerDashboardPage() {
  const { isAuthorized } = useRequireAuth();
  if (!isAuthorized) return null;
  // ...
}
```

---

## 6. Loading and Error States

Always provide `loading.tsx` and `error.tsx` siblings for pages with async data fetching. Use Next.js Suspense boundaries for partial loading.

```
app/[locale]/browse/
  page.tsx          ← async server component
  loading.tsx       ← Suspense fallback UI
  error.tsx         ← Error boundary UI
details/[id]/
  page.tsx
  loading.tsx
```

---

## 7. No Business Logic in Pages

Pages never: compute values, validate inputs, call Prisma directly, or implement conditional logic beyond auth checks. All of that lives in services.

```typescript
// ❌ Business logic in page
export default async function Page({ params }) {
  const listings = await prisma.carListing.findMany({ where: { status: "active" } });
  const filtered = listings.filter(l => l.price > 5000);  // ← service logic
  const total = filtered.reduce((sum, l) => sum + l.price, 0);  // ← service logic
  // ...
}

// ✅ Delegate to service
export default async function Page({ params }) {
  const result = await new ListingService(prisma).getActiveListingsAboveThreshold(5000);
  return <ListingList listings={result.listings} total={result.total} />;
}
```