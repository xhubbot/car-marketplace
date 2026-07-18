import prisma from "@/lib/prisma";
import type { MetadataRoute } from "next";

export const revalidate = 86400; // Revalidate once per day

const BASE_URL = "https://autod.pro";
const LOCALES = ["en", "et", "ru"];

// Public, working pages only — excludes /details/[id] (still on mock data,
// not the real CarListing table), /sell (now just a redirect to /create),
// and /admin, /dealer/admin (private dashboards that shouldn't be indexed).
const STATIC_PAGES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/browse", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/create", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/dealer/search", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/dealer/register", priority: 0.5, changeFrequency: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_PAGES.map((page) => ({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );

  try {
    // Active dealer profile pages, updated whenever the dealer record changes
    const dealers = await prisma.dealer.findMany({
      where: { status: "active" },
      select: { slug: true, updatedAt: true },
    });

    const dealerEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
      dealers.map((dealer) => ({
        url: `${BASE_URL}/${locale}/dealer/${dealer.slug}`,
        lastModified: dealer.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    );

    return [...staticEntries, ...dealerEntries];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticEntries;
  }
}
