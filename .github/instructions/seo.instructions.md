---
description: Rules for SEO, Metadata, and Structured Data
applyTo: app/**/*.tsx, app/**/*.ts
---

# SEO Rules — Metadata, Structured Data, i18n

All public-facing pages must export metadata. SEO is server-side only — never set meta tags via `useEffect` or `document`.

---

## 1. Always Export generateMetadata on Public Pages

Every page under `/[locale]/` that is publicly accessible must export `generateMetadata`. Use `getTranslations` for locale-aware titles and descriptions.

```typescript
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("meta.title"),           // "autod.pro — Ownership-First Car Classifieds"
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      locale,
      type: "website",
    },
  };
}
```

---

## 2. Dynamic Pages Include Entity Data in Metadata

For dynamic routes (e.g., `/details/[id]`), fetch the entity and include its data in metadata:

```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "listing" });
  const service = new ListingService(prisma);
  const listing = await service.getListingById(Number(id));

  if (!listing) {
    return { title: t("notFound") };
  }

  return {
    title: `${listing.year} ${listing.make} ${listing.model} — autod.pro`,
    description: t("listingDescription", { price: listing.price }),
  };
}
```

---

## 3. Translation Keys for SEO Must Be in All 3 Locale Files

Every key used in `generateMetadata` must exist in `en.json`, `et.json`, and `ru.json`. Missing keys cause silent fallbacks or crashes.

Namespace pattern for SEO keys:
```json
{
  "home": {
    "meta": {
      "title": "autod.pro — Ownership-First Car Classifieds",
      "description": "See the true cost of ownership before you buy — truth scores, TCO breakdowns, and lifestyle-matched listings."
    }
  }
}
```

---

## 4. Root Layout Exports Site-Wide Default Metadata

Set sensible defaults in [app/[locale]/layout.tsx](app/%5Blocale%5D/layout.tsx):

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://autod.pro"),
  title: {
    default: "autod.pro",
    template: "%s — autod.pro",
  },
  description: "Ownership-first car classifieds — the true financial reality of car ownership.",
  robots: { index: true, follow: true },
};
```

---

## 5. Canonical URLs and hreflang for Multilingual Pages

For pages available in multiple locales, set canonical and alternate language links:

```typescript
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const canonicalUrl = `https://autod.pro/${locale}/`;
  return {
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://autod.pro/en/",
        et: "https://autod.pro/et/",
        ru: "https://autod.pro/ru/",
      },
    },
  };
}
```

---

## 6. Structured Data (JSON-LD) for Content Pages

For articles, knowledge-base entries, and FAQ pages, include JSON-LD structured data via a server-rendered `<script>` tag:

```tsx
// In a Server Component
export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await new ListingService(prisma).getListingById(Number(id));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${listing.year} ${listing.make} ${listing.model}`,
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "EUR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CarDetailsView listing={listing} />
    </>
  );
}
```

---

## 7. No Meta Tags in Client Components

Never set SEO-relevant tags through client-side means. They are invisible to crawlers and break SSR.

```typescript
// ❌ Never do this
"use client";
useEffect(() => {
  document.title = "My Page";
}, []);

// ✅ Always use generateMetadata (server-side)
export async function generateMetadata() {
  return { title: "My Page" };
}
```

---

## 8. Open Graph Images

Set OG images using the `opengraph-image` convention or via metadata:

```typescript
return {
  openGraph: {
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "autod.pro — ownership-first car classifieds",
      },
    ],
  },
};
```

Place the default OG image at [public/og-image.png](public/og-image.png).