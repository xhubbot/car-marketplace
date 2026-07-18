import type { Metadata } from "next";

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  robots?: string;
  locale?: string;
  alternates?: Record<string, string>;
}

/**
 * Generate Next.js Metadata object from SEOMetadata
 */
export function generateSEOMetadata(seo: SEOMetadata): Metadata {
  const baseUrl = "https://kaubaplats.ee";

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(", "),
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage
        ? [{ url: seo.ogImage, width: 1200, height: 630 }]
        : [],
      type: "website",
      url: seo.canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    robots: seo.robots || (seo.noindex ? "noindex, nofollow" : "index, follow"),
    alternates: seo.alternates
      ? {
          canonical: seo.canonical || baseUrl,
          languages: seo.alternates,
        }
      : {
          canonical: seo.canonical || baseUrl,
        },
  };
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(locale: string, path: string): string {
  const baseUrl = "https://kaubaplats.ee";
  return `${baseUrl}/${locale}${path}`;
}

/**
 * Generate hreflang alternates for multilingual pages
 */
export function generateAlternateUrls(
  path: string,
  locales: string[] = ["en", "et", "ru"]
): Record<string, string> {
  const baseUrl = "https://kaubaplats.ee";
  return Object.fromEntries(
    locales.map((locale) => [locale, `${baseUrl}/${locale}${path}`])
  );
}

/**
 * Generate meta description (max 160 chars)
 */
export function generateMetaDescription(
  text: string,
  maxLength: number = 160
): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Generate page title with branding
 */
export function generatePageTitle(
  title: string,
  brand: string = "Kaubaplats"
): string {
  return `${title} | ${brand}`;
}

/**
 * Generate keywords array from text
 */
export function generateKeywords(
  ...terms: (string | undefined | null)[]
): string[] {
  return terms
    .filter((term): term is string => Boolean(term))
    .map((term) => term.toLowerCase().trim())
    .filter((term, index, arr) => arr.indexOf(term) === index) // Remove duplicates
    .slice(0, 10); // Limit to 10 keywords
}
