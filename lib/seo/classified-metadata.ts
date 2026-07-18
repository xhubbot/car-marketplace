/**
 * Classified Detail Page Metadata Generator
 * Generates dynamic SEO metadata for individual classified listings
 * Used by app/[locale]/classified/[id]/page.tsx
 */

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { generateMetaDescription } from "@/lib/seo/metadata";
import { buildClassifiedUrl } from "@/lib/seo/slug";

/**
 * Multilingual text templates
 */
const LOCALIZED_STRINGS = {
  en: {
    notFound: "Classified Not Found | Kaubaplats",
    notFoundDesc: "The listing you are looking for is not available.",
    notFoundLangDesc:
      "The listing you are looking for is not available in this language.",
    contactForPrice: "Contact for price",
    isSelling: "is selling",
    inCategory: "in",
    categoryText: "category",
    classified: "classified",
    forSale: "for sale",
    buyOnline: "buy online",
    defaultSeller: "Seller",
    defaultCategory: "Items",
  },
  et: {
    notFound: "Kuulutus ei leitud | Kaubaplats",
    notFoundDesc: "Otsitud kuulutust pole saadaval.",
    notFoundLangDesc: "Otsitud kuulutust pole selles keeles saadaval.",
    contactForPrice: "Hinnaks võtke ühendust",
    isSelling: "müüb",
    inCategory: "kategoorias",
    categoryText: "kategooria",
    classified: "kuulutus",
    forSale: "müügi",
    buyOnline: "osta internetist",
    defaultSeller: "Müüja",
    defaultCategory: "Tooted",
  },
  ru: {
    notFound: "Объявление не найдено | Kaubaplats",
    notFoundDesc: "Искомое объявление недоступно.",
    notFoundLangDesc: "Искомое объявление недоступно на этом языке.",
    contactForPrice: "Узнать цену",
    isSelling: "продает",
    inCategory: "в",
    categoryText: "категории",
    classified: "объявление",
    forSale: "продажа",
    buyOnline: "купить онлайн",
    defaultSeller: "Продавец",
    defaultCategory: "Товары",
  },
} as const;

/**
 * Get localized string
 */
function getLocalizedString(
  locale: string,
  key: keyof (typeof LOCALIZED_STRINGS)["en"]
): string {
  const strings =
    LOCALIZED_STRINGS[locale as keyof typeof LOCALIZED_STRINGS] ||
    LOCALIZED_STRINGS.en;
  return strings[key];
}

/**
 * Generate metadata for classified listing page
 * Called by Next.js for each dynamic route
 */
export async function generateClassifiedMetadata(
  classifiedId: number,
  locale: string
): Promise<Metadata> {
  try {
    // Fetch classified
    const classified = await prisma.classified.findUnique({
      where: { id: classifiedId },
    });

    if (!classified) {
      return {
        title: getLocalizedString(locale, "notFound"),
        description: getLocalizedString(locale, "notFoundDesc"),
      };
    }

    // Fetch all translations to get language-specific slugs for hreflang
    const allTranslations = await prisma.classifiedTranslation.findMany({
      where: { classifiedId: classifiedId },
    });

    const translation = allTranslations.find((t) => t.language === locale);

    if (!translation) {
      return {
        title: getLocalizedString(locale, "notFound"),
        description: getLocalizedString(locale, "notFoundLangDesc"),
      };
    }

    // Fetch first image
    const image = await prisma.classifiedImage.findFirst({
      where: { classifiedId: classifiedId },
      orderBy: { sort: "asc" },
    });

    // Fetch seller info (simplified - fetch from user table separately)
    const user = await prisma.user.findUnique({
      where: { id: classified.userId },
    });

    // Fetch category translation name
    const categoryTranslation = await prisma.categoryTranslation.findFirst({
      where: {
        categoryId: classified.categoryId,
        language: locale,
      },
    });

    const title = translation.title;
    const description = translation.description;
    const imageUrl = image?.image;
    const sellerName =
      user?.username || getLocalizedString(locale, "defaultSeller");
    const categoryName =
      categoryTranslation?.name ||
      getLocalizedString(locale, "defaultCategory");
    const price = classified.price
      ? `€${parseFloat(classified.price.toString()).toFixed(2)}`
      : getLocalizedString(locale, "contactForPrice");

    // Generate SEO title (keep under 60 chars for Google)
    const seoTitle = `${title} - ${price} | ${sellerName}`;

    // Generate SEO description (keep under 160 chars)
    const truncatedDescription = generateMetaDescription(
      description || "",
      150
    );
    const seoDescription =
      `${sellerName} ${getLocalizedString(locale, "isSelling")} ${title} ${getLocalizedString(locale, "inCategory")} ${categoryName} ${getLocalizedString(locale, "categoryText")}. ${truncatedDescription}`.trim();

    // Build canonical URL with slug for SEO
    const slugForLocale = translation.slug;
    const canonicalUrl = `https://kaubaplats.ee${buildClassifiedUrl(locale, classifiedId, slugForLocale)}`;

    // Build hreflang alternates with language-specific slugs
    const enSlug = allTranslations.find((t) => t.language === "en")?.slug;
    const etSlug = allTranslations.find((t) => t.language === "et")?.slug;
    const ruSlug = allTranslations.find((t) => t.language === "ru")?.slug;
    const base = "https://kaubaplats.ee";
    const alternates = {
      en: `${base}${buildClassifiedUrl("en", classifiedId, enSlug)}`,
      et: `${base}${buildClassifiedUrl("et", classifiedId, etSlug)}`,
      ru: `${base}${buildClassifiedUrl("ru", classifiedId, ruSlug)}`,
      "x-default": `${base}${buildClassifiedUrl("et", classifiedId, etSlug)}`,
    };

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: [
        title,
        categoryName,
        sellerName,
        getLocalizedString(locale, "classified"),
        getLocalizedString(locale, "forSale"),
        getLocalizedString(locale, "buyOnline"),
        locale === "et" ? "osta" : locale === "ru" ? "купить" : "buy",
      ],
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        type: "website",
        url: canonicalUrl,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: `${title} - ${categoryName}`,
              },
            ]
          : [],
        siteName: "Kaubaplats",
        locale: locale === "et" ? "et_EE" : locale === "ru" ? "ru_RU" : "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: imageUrl ? [imageUrl] : [],
      },
      robots: {
        index: classified.status === 1, // Only index active listings
        follow: true,
        googleBot: {
          index: classified.status === 1,
          follow: true,
        },
      },
      alternates: {
        canonical: canonicalUrl,
        languages: alternates,
      },
    };
  } catch (error) {
    console.error("[SEO] Error generating classified metadata:", error);

    // Return fallback metadata on error
    return {
      title: "Classified Listing | Kaubaplats",
      description:
        "Browse our marketplace for amazing deals on thousands of items.",
    };
  }
}

/**
 * Generate keywords from classified data
 */
export function generateClassifiedKeywords(
  title: string,
  description: string,
  categoryName: string,
  brand?: string,
  condition?: string
): string[] {
  const keywords: string[] = [
    title.split(" ").slice(0, 3).join(" "), // First 3 words of title
    categoryName,
    "buy online",
    "classified",
    "for sale",
  ];

  if (brand) {
    keywords.push(brand);
  }

  if (condition) {
    keywords.push(condition);
  }

  // Extract common nouns from description (first 50 words)
  const descriptionWords = description
    .split(" ")
    .slice(0, 50)
    .filter((w) => w.length > 4)
    .slice(0, 3);

  keywords.push(...descriptionWords);

  // Remove duplicates and keep max 10 keywords
  return [...new Set(keywords)].slice(0, 10);
}

/**
 * Check if classified should be indexed (robots)
 */
export function shouldIndexClassified(
  status: number,
  isPremium: boolean
): boolean {
  // Only index active (status = 1), non-premium listings
  // Premium listings get noindex to avoid duplicate content issues
  return status === 1 && !isPremium;
}
