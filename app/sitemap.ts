import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export const revalidate = 86400; // Revalidate once per day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kaubaplats.ee";
  const locales = ["en", "et", "ru"];

  // Static pages - high priority
  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    {
      path: "/knowledge-base",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/paid-services",
      priority: 0.7,
      changeFrequency: "weekly" as const,
    },
    { path: "/terms", priority: 0.5, changeFrequency: "yearly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );

  try {
    // Category pages - medium priority, updated daily
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        translations: { select: { language: true, slug: true } },
      },
      where: { parentId: 1 }, // Only main categories (parentId = 1)
    });

    const categoryEntries: MetadataRoute.Sitemap = locales.flatMap((locale: string) =>
      categories.map((cat) => {
        const translation = cat.translations.find((t) => t.language === locale);
        const segment = translation?.slug
          ? `${cat.id}-${translation.slug}`
          : `${cat.id}`;
        return {
          url: `${baseUrl}/${locale}/search/${segment}`,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 0.8,
        };
      })
    );

    // Active classifieds - lower priority, updated when classified changes
    const classifieds = await prisma.classified.findMany({
      where: { status: 1 }, // Active classifieds only
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 50000, // Sitemap XML limit
    });

    const classifiedEntries: MetadataRoute.Sitemap = locales.flatMap((locale: string) =>
      classifieds.map((c: typeof classifieds[number]) => ({
        url: `${baseUrl}/${locale}/classified/${c.id}`,
        lastModified: c.updatedAt ?? new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    );

    return [...staticEntries, ...categoryEntries, ...classifiedEntries];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticEntries;
  }
}
