---
description: Rules for SEO, Metadata, and Structured Data
applyTo: src/app/**/*.tsx, src/app/**/*.ts
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
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("meta.title"),           // "RahaKaitse — Secure Escrow"
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

For dynamic routes (e.g., `/escrow/[id]`), fetch the entity and include its data in metadata:

```typescript
export async function generateMetadata({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "escrow" });
  const service = new EscrowService(prisma);
  const escrow = await service.getEscrowById(id);

  if (!escrow) {
    return { title: t("notFound") };
  }

  return {
    title: `${t("escrowTitle")} #${escrow.id} — RahaKaitse`,
    description: t("escrowDescription", { amount: escrow.amount }),
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
      "title": "RahaKaitse — Secure Blockchain Escrow",
      "description": "Protect your transactions with smart contract escrow on Base blockchain."
    }
  }
}
```

---

## 4. Root Layout Exports Site-Wide Default Metadata

Set sensible defaults in `apps/web/src/app/layout.tsx` or `apps/web/src/app/[locale]/layout.tsx`:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://rahakaitse.ee"),
  title: {
    default: "RahaKaitse",
    template: "%s — RahaKaitse",
  },
  description: "Blockchain escrow platform on Base network.",
  robots: { index: true, follow: true },
};
```

---

## 5. Canonical URLs and hreflang for Multilingual Pages

For pages available in multiple locales, set canonical and alternate language links:

```typescript
export async function generateMetadata({ params: { locale } }) {
  const canonicalUrl = `https://rahakaitse.ee/${locale}/`;
  return {
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://rahakaitse.ee/en/",
        et: "https://rahakaitse.ee/et/",
        ru: "https://rahakaitse.ee/ru/",
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
export default async function ArticlePage({ params }) {
  const article = await new ArticleService(prisma).getBySlug(params.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: new Date(article.createdAt * 1000).toISOString(),
    author: { "@type": "Organization", name: "RahaKaitse" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleContent article={article} />
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
        alt: "RahaKaitse escrow platform",
      },
    ],
  },
};
```

Place the default OG image at `apps/web/public/og-image.png`.